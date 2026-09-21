<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreProductRequest;
use App\Http\Requests\Admin\UpdateProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::query()->with(['category', 'variants']);

        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        if ($request->filled('status')) {
            $query->where('is_active', $request->boolean('status'));
        }

        return ProductResource::collection($query->latest()->paginate($request->integer('per_page', 20)));
    }

    public function store(StoreProductRequest $request)
    {
        $data = $request->safe()->except('image');

        if ($request->hasFile('image')) {
            $data['featured_image'] = Storage::disk('public')->url(
                $request->file('image')->store('products', 'public')
            );
        }

        $product = Product::create($data);

        return (new ProductResource($product->load(['category', 'variants'])))
            ->response()->setStatusCode(201);
    }

    public function show(Product $product)
    {
        return new ProductResource($product->load(['category', 'variants', 'reviews.user']));
    }

    public function update(UpdateProductRequest $request, Product $product)
    {
        $data = $request->safe()->except('image');

        if ($request->hasFile('image')) {
            // remove old file if it was stored locally
            if ($product->featured_image && str_contains($product->featured_image, '/storage/products/')) {
                $old = str_replace(Storage::disk('public')->url(''), '', $product->featured_image);
                Storage::disk('public')->delete($old);
            }
            $data['featured_image'] = Storage::disk('public')->url(
                $request->file('image')->store('products', 'public')
            );
        }

        $product->update($data);

        return new ProductResource($product->fresh()->load(['category', 'variants']));
    }

    public function destroy(Product $product)
    {
        $product->delete();

        return response()->json(['message' => 'Product deleted.']);
    }
}
