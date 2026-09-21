<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CartItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'         => $this->id,
            'product'    => [
                'id'   => $this->product->id,
                'name' => $this->product->name,
                'slug' => $this->product->slug,
            ],
            'variant'    => $this->variant ? [
                'id'   => $this->variant->id,
                'name' => $this->variant->name,
            ] : null,
            'unit_price' => $this->unitPrice(),
            'quantity'   => $this->quantity,
            'line_total' => $this->lineTotal(),
        ];
    }
}
