<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\ReviewResource;
use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function index(Request $request)
    {
        $query = Review::query()->with('user', 'product');

        if ($request->filled('product_id')) {
            $query->where('product_id', $request->product_id);
        }

        return ReviewResource::collection($query->latest()->paginate($request->integer('per_page', 20)));
    }

    public function destroy(Review $review)
    {
        $review->delete();

        return response()->json(['message' => 'Review removed.']);
    }
}
