<?php

namespace App\Http\Controllers\Api;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\CheckoutRequest;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Services\CartResolver;
use App\Services\Payments\PaymentGateway;
use App\Services\StockManager;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    public function __construct(
        private PaymentGateway $gateway,
        private StockManager $stock,
        private CartResolver $carts,
    ) {}

    public function index(Request $request)
    {
        return OrderResource::collection(
            $request->user()->orders()->with('items', 'payment')->latest()->paginate(10)
        );
    }

    public function show(Request $request, Order $order)
    {
        abort_unless($order->user_id === $request->user()->id, 403);

        return new OrderResource($order->load('items', 'payment'));
    }

    /**
     * Checkout: turn the user's cart into an order + payment, then hand back
     * the gateway checkout URL. Wrapped in a transaction so a failure leaves
     * no half-written order.
     */
    public function checkout(CheckoutRequest $request): JsonResponse
    {
        $user = $request->user();
        $cart = $this->carts->resolve($user, $request->header('X-Cart-Token'))
            ->load('items.product', 'items.variant');

        abort_if($cart->items->isEmpty(), 422, 'Cart is empty.');

        $result = DB::transaction(function () use ($cart, $user, $request) {
            $total = $cart->total();

            $this->stock->reserveForCart($cart);

            $order = Order::create([
                'reference' => 'UKC-'.strtoupper(Str::random(10)),
                'user_id' => $user->id,
                'status' => OrderStatus::Pending,
                'total' => $total,
                'currency' => 'RWF',
                'customer_name' => $request->customer_name,
                'customer_phone' => $request->customer_phone,
                'customer_email' => $request->customer_email,
                'delivery_address' => $request->delivery_address,
            ]);

            foreach ($cart->items as $item) {
                $unit = $item->unitPrice();
                $order->items()->create([
                    'product_id' => $item->product_id,
                    'product_variant_id' => $item->product_variant_id,
                    'product_name' => $item->product->name,
                    'variant_name' => $item->variant?->name,
                    'unit_price' => $unit,
                    'quantity' => $item->quantity,
                    'line_total' => $unit * $item->quantity,
                ]);
            }

            $payment = $order->payment()->create([
                'gateway' => config('payment.default'),
                'tx_ref' => $order->reference.'-'.Str::random(6),
                'status' => PaymentStatus::Pending,
                'amount' => $total,
                'currency' => 'RWF',
            ]);

            // Empty the cart now that the order is captured
            $cart->items()->delete();

            return ['order' => $order, 'payment' => $payment];
        });

        $init = $this->gateway->initiate($result['payment']);

        return response()->json([
            'order' => new OrderResource($result['order']->load('items', 'payment')),
            'checkout_url' => $init['checkout_url'],
        ], 201);
    }
}
