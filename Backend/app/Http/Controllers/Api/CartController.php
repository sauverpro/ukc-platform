<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\AddToCartRequest;
use App\Http\Requests\UpdateCartItemRequest;
use App\Http\Resources\CartResource;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\ProductVariant;
use App\Services\CartResolver;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function __construct(private CartResolver $resolver) {}

    private function cartFor(Request $request): Cart
    {
        return $this->resolver->resolve(
            auth('sanctum')->user(),
            $request->header('X-Cart-Token'),
        );
    }

    public function show(Request $request)
    {
        $cart = $this->cartFor($request)->load('items.product', 'items.variant');

        return new CartResource($cart);
    }

    public function store(AddToCartRequest $request)
    {
        $cart = $this->cartFor($request);
        $data = $request->validated();

        if (! empty($data['product_variant_id'])) {
            $belongs = ProductVariant::where('id', $data['product_variant_id'])
                ->where('product_id', $data['product_id'])
                ->exists();

            abort_unless($belongs, 422, 'Variant does not belong to this product.');
        }

        $item = $cart->items()->firstOrNew([
            'product_id' => $data['product_id'],
            'product_variant_id' => $data['product_variant_id'] ?? null,
        ]);

        $item->quantity = ($item->exists ? $item->quantity : 0) + $data['quantity'];
        $item->save();

        return new CartResource($cart->fresh()->load('items.product', 'items.variant'));
    }

    public function update(UpdateCartItemRequest $request, CartItem $item)
    {
        $this->authorizeItem($request, $item);

        $item->update(['quantity' => $request->validated()['quantity']]);

        return new CartResource($item->cart->fresh()->load('items.product', 'items.variant'));
    }

    public function destroy(Request $request, CartItem $item)
    {
        $this->authorizeItem($request, $item);

        $cart = $item->cart;
        $item->delete();

        return new CartResource($cart->fresh()->load('items.product', 'items.variant'));
    }

    public function clear(Request $request)
    {
        $cart = $this->cartFor($request);
        $cart->items()->delete();

        return new CartResource($cart->fresh()->load('items.product', 'items.variant'));
    }

    private function authorizeItem(Request $request, CartItem $item): void
    {
        $cart = $this->cartFor($request);
        abort_unless($item->cart_id === $cart->id, 403);
    }
}
