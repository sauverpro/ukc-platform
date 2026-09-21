<?php

namespace App\Models;

use App\Enums\ProductType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Product extends Model
{
    protected $fillable = [
        'category_id', 'name', 'slug', 'description',
        'type', 'base_price', 'stock', 'reserved', 'featured_image', 'is_active',
    ];

    protected function casts(): array
    {
        return [
            'type' => ProductType::class,
            'base_price' => 'integer',
            'stock' => 'integer',
            'reserved' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    protected static function booted(): void
    {
        static::saving(function (Product $product) {
            if (empty($product->slug)) {
                $product->slug = Str::slug($product->name);
            }
        });
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function variants(): HasMany
    {
        return $this->hasMany(ProductVariant::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    // Average rating, computed (nullable when no reviews)
    public function averageRating(): ?float
    {
        $avg = $this->reviews()->avg('rating');

        return $avg ? round((float) $avg, 2) : null;
    }

    // Lowest/highest variant price for variable products
    public function priceRange(): array
    {
        if ($this->type === ProductType::Variable && $this->variants->isNotEmpty()) {
            return [
                'min' => (int) $this->variants->min('price'),
                'max' => (int) $this->variants->max('price'),
            ];
        }

        return ['min' => $this->base_price, 'max' => $this->base_price];
    }
}
