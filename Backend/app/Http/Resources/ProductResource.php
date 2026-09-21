<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $range = $this->priceRange();

        // For simple products, availability is on the product itself.
        // For variable products it lives on the variants, so we sum them.
        $available = $this->type->value === 'variable'
            ? (int) $this->variants->sum(fn ($v) => max(0, $v->stock - $v->reserved))
            : max(0, $this->stock - $this->reserved);

        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'type' => $this->type->value,
            'base_price' => $this->base_price,
            'price_range' => $range,
            'stock' => $this->stock,
            'available' => $available,
            'featured_image' => $this->featured_image,
            'is_active' => $this->is_active,
            'average_rating' => $this->averageRating(),
            'category' => new CategoryResource($this->whenLoaded('category')),
            'variants' => ProductVariantResource::collection($this->whenLoaded('variants')),
            'reviews' => ReviewResource::collection($this->whenLoaded('reviews')),
        ];
    }
}
