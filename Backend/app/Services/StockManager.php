<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class StockManager
{
    /**
     * Reserve stock for every line in a cart. Locks each row so two
     * simultaneous checkouts can't both grab the last unit.
     * Throws if anything is short — caller should roll the transaction back.
     */
    public function reserveForCart($cart): void
    {
        foreach ($cart->items as $item) {
            if ($item->product_variant_id) {
                $variant = ProductVariant::whereKey($item->product_variant_id)->lockForUpdate()->first();
                $this->assertAvailable($variant->name, $variant->stock, $variant->reserved, $item->quantity);
                $variant->increment('reserved', $item->quantity);
            } else {
                $product = Product::whereKey($item->product_id)->lockForUpdate()->first();

                // Variable products hold stock on their variants, not the parent
                if ($product->type->value === 'simple') {
                    $this->assertAvailable($product->name, $product->stock, $product->reserved, $item->quantity);
                    $product->increment('reserved', $item->quantity);
                }
            }
        }
    }

    /**
     * Payment succeeded: convert the reservation into a real deduction.
     */
    public function commit(Order $order): void
    {
        DB::transaction(function () use ($order) {
            foreach ($order->items as $item) {
                if ($item->product_variant_id) {
                    $variant = ProductVariant::whereKey($item->product_variant_id)->lockForUpdate()->first();
                    if ($variant) {
                        $variant->decrement('reserved', min($item->quantity, $variant->reserved));
                        $variant->decrement('stock', min($item->quantity, $variant->stock));
                    }
                } elseif ($item->product_id) {
                    $product = Product::whereKey($item->product_id)->lockForUpdate()->first();
                    if ($product && $product->type->value === 'simple') {
                        $product->decrement('reserved', min($item->quantity, $product->reserved));
                        $product->decrement('stock', min($item->quantity, $product->stock));
                    }
                }
            }
        });
    }

    /**
     * Payment failed or order cancelled: give the held stock back.
     */
    public function release(Order $order): void
    {
        DB::transaction(function () use ($order) {
            foreach ($order->items as $item) {
                if ($item->product_variant_id) {
                    $variant = ProductVariant::whereKey($item->product_variant_id)->lockForUpdate()->first();
                    $variant?->decrement('reserved', min($item->quantity, $variant->reserved));
                } elseif ($item->product_id) {
                    $product = Product::whereKey($item->product_id)->lockForUpdate()->first();
                    if ($product && $product->type->value === 'simple') {
                        $product->decrement('reserved', min($item->quantity, $product->reserved));
                    }
                }
            }
        });
    }

    private function assertAvailable(string $name, int $stock, int $reserved, int $want): void
    {
        $available = $stock - $reserved;
        if ($want > $available) {
            throw new RuntimeException("Not enough stock for {$name}. Available: {$available}, requested: {$want}.");
        }
    }
}
