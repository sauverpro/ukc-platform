<?php

use App\Http\Controllers\Api\Admin\CategoryController as AdminCategoryController;
use App\Http\Controllers\Api\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Api\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\Api\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Api\Admin\ProductVariantController as AdminVariantController;
use App\Http\Controllers\Api\Admin\ReviewController as AdminReviewController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\ReviewController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public routes
|--------------------------------------------------------------------------
*/
Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);

Route::get('categories', [CategoryController::class, 'index']);
Route::get('categories/{category:slug}', [CategoryController::class, 'show']);

Route::get('products', [ProductController::class, 'index']);
Route::get('products/{product:slug}', [ProductController::class, 'show']);
Route::get('products/{product:slug}/reviews', [ReviewController::class, 'index']);

// Cart
Route::get('cart', [CartController::class, 'show']);
Route::post('cart/items', [CartController::class, 'store']);
Route::patch('cart/items/{item}', [CartController::class, 'update']);
Route::delete('cart/items/{item}', [CartController::class, 'destroy']);
Route::delete('cart', [CartController::class, 'clear']);

// Payment callback + webhook are hit by the browser / gateway, not the SPA
Route::get('payments/callback', [PaymentController::class, 'callback']);
Route::post('payments/webhook', [PaymentController::class, 'webhook']);
Route::post('payments/simulate/{reference}', [PaymentController::class, 'simulate']);

/*
|--------------------------------------------------------------------------
| Authenticated customer routes (Sanctum bearer token)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {
    Route::post('logout', [AuthController::class, 'logout']);
    Route::get('me', [AuthController::class, 'me']);

    // Reviews
    Route::post('products/{product:slug}/reviews', [ReviewController::class, 'store']);
    Route::delete('products/{product:slug}/reviews/{review}', [ReviewController::class, 'destroy']);

    // Orders + checkout
    Route::get('orders', [OrderController::class, 'index']);
    Route::get('orders/{order:reference}', [OrderController::class, 'show']);
    Route::post('checkout', [OrderController::class, 'checkout']);
});

/*
|--------------------------------------------------------------------------
| Admin routes (Sanctum bearer token + admin middleware)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    // Dashboard
    Route::get('dashboard', [AdminDashboardController::class, 'index']);

    // Products
    Route::get('products', [AdminProductController::class, 'index']);
    Route::post('products', [AdminProductController::class, 'store']);
    Route::get('products/{product:slug}', [AdminProductController::class, 'show']);
    // POST (not PUT) for updates so multipart image uploads work; add ?_method=PATCH if preferred
    Route::post('products/{product:slug}/update', [AdminProductController::class, 'update']);
    Route::delete('products/{product:slug}', [AdminProductController::class, 'destroy']);

    // Variants (nested under product)
    Route::get('products/{product:slug}/variants', [AdminVariantController::class, 'index']);
    Route::post('products/{product:slug}/variants', [AdminVariantController::class, 'store']);
    Route::patch('products/{product:slug}/variants/{variant}', [AdminVariantController::class, 'update']);
    Route::delete('products/{product:slug}/variants/{variant}', [AdminVariantController::class, 'destroy']);

    // Categories
    Route::get('categories', [AdminCategoryController::class, 'index']);
    Route::post('categories', [AdminCategoryController::class, 'store']);
    Route::get('categories/{category:slug}', [AdminCategoryController::class, 'show']);
    Route::patch('categories/{category:slug}', [AdminCategoryController::class, 'update']);
    Route::delete('categories/{category:slug}', [AdminCategoryController::class, 'destroy']);

    // Orders
    Route::get('orders', [AdminOrderController::class, 'index']);
    Route::get('orders/{order:reference}', [AdminOrderController::class, 'show']);
    Route::patch('orders/{order:reference}/status', [AdminOrderController::class, 'updateStatus']);

    // Review moderation
    Route::get('reviews', [AdminReviewController::class, 'index']);
    Route::delete('reviews/{review}', [AdminReviewController::class, 'destroy']);
});
