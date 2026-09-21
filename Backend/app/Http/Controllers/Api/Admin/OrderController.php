<?php

namespace App\Http\Controllers\Api\Admin;

use App\Enums\OrderStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateOrderStatusRequest;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Services\StockManager;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    /** Allowed status transitions (simple state machine). */
    private const TRANSITIONS = [
        'pending' => ['paid', 'cancelled'],
        'paid' => ['processing', 'cancelled'],
        'processing' => ['completed', 'cancelled'],
        'completed' => [],
        'cancelled' => [],
    ];

    public function __construct(private StockManager $stock) {}

    public function index(Request $request)
    {
        $query = Order::query()->with('items', 'payment', 'user');

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('reference', 'like', '%'.$request->search.'%')
                    ->orWhere('customer_name', 'like', '%'.$request->search.'%')
                    ->orWhere('customer_phone', 'like', '%'.$request->search.'%');
            });
        }

        return OrderResource::collection($query->latest()->paginate($request->integer('per_page', 20)));
    }

    public function show(Order $order)
    {
        return new OrderResource($order->load('items', 'payment', 'user'));
    }

    public function updateStatus(UpdateOrderStatusRequest $request, Order $order)
    {
        $current = $order->status->value;
        $target = $request->status;

        if ($current === $target) {
            return new OrderResource($order->load('items', 'payment'));
        }

        if (! in_array($target, self::TRANSITIONS[$current], true)) {
            abort(422, "Cannot change order from {$current} to {$target}.");
        }

        if ($target === 'cancelled') {
            $this->stock->release($order);
        }

        $order->update(['status' => OrderStatus::from($target)]);

        return new OrderResource($order->fresh()->load('items', 'payment'));
    }
}
