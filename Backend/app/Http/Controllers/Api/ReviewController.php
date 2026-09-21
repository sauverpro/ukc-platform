<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreReviewRequest;
use App\Http\Resources\ReviewResource;
use App\Models\Product;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function index(Product $product)
    {
        return ReviewResource::collection(
            $product->reviews()->with('user')->latest()->paginate(10)
        );
    }

    public function store(StoreReviewRequest $request, Product $product)
    {
        $review = $product->reviews()->updateOrCreate(
            ['user_id' => $request->user()->id],
            $request->validated()
        );

        $review->load('user');

        return new ReviewResource($review);
    }

    public function destroy(Request $request, Product $product, int $review)
    {
        $model = $product->reviews()
            ->where('id', $review)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $model->delete();

        return response()->json(['message' => 'Review deleted.']);
    }
}
