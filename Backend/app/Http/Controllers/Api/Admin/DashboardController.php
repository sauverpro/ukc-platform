<?php

namespace App\Http\Controllers\Api\Admin;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Models\Payment;
use App\Models\Product;
use App\Models\User;

class DashboardController extends Controller
{
    public function index()
    {
        $revenue = Payment::where('status', PaymentStatus::Successful)->sum('amount');

        return response()->json([
            'counts' => [
                'products'         => Product::count(),
                'active_products'  => Product::where('is_active', true)->count(),
                'orders'           => Order::count(),
                'pending_orders'   => Order::where('status', OrderStatus::Pending)->count(),
                'paid_orders'      => Order::where('status', OrderStatus::Paid)->count(),
                'customers'        => User::where('is_admin', false)->count(),
            ],
            'revenue' => [
                'currency' => 'RWF',
                'total'    => (int) $revenue,
            ],
            'recent_orders' => OrderResource::collection(
                Order::with('items', 'payment')->latest()->limit(5)->get()
            ),
            'low_stock' => Product::where('type', 'simple')
                ->where('stock', '<', 10)
                ->select('id', 'name', 'stock')
                ->get(),
        ]);
    }
}
