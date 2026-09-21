<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::query()
            ->where('is_active', true)
            ->with(['category', 'variants']);

        if ($request->filled('category')) {
            $query->whereHas('category', fn ($q) => $q->where('slug', $request->category));
        }

        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        // Sorting mirrors the WooCommerce options: latest, price asc/desc
        match ($request->get('sort')) {
            'price_asc'  => $query->orderBy('base_price'),
            'price_desc' => $query->orderByDesc('base_price'),
            'latest'     => $query->latest(),
            default      => $query->orderBy('name'),
        };

        return ProductResource::collection(
            $query->paginate($request->integer('per_page', 12))
        );
    }

    public function show(Product $product)
    {
        $product->load(['category', 'variants', 'reviews.user']);

        return new ProductResource($product);
    }
}
