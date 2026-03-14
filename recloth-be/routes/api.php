<?php

use App\Http\Controllers\Api\AddressController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ChatController;
use App\Http\Controllers\Api\DiscoveryController;
use App\Http\Controllers\Api\FollowController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\ProductSearchController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\PromoController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\ShippingController;
use App\Http\Controllers\Api\StoreController;
use App\Http\Controllers\Api\SwapController;
use App\Http\Controllers\Api\WalletController;
use App\Http\Controllers\Api\WebhookController;
use App\Http\Controllers\Api\WishlistController;
use App\Http\Controllers\Api\WithdrawalController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Broadcast;

// ─── PUBLIC ROUTES ────────────────────────────────────────────────────────────

Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login',    [AuthController::class, 'login']);
});

Route::get('products',          [ProductSearchController::class, 'index']);
Route::get('products/{slug}',   [ProductSearchController::class, 'show']);
Route::get('categories',        [CategoryController::class, 'index']);
Route::get('banners',           [DiscoveryController::class, 'banners']);
Route::get('configs',           [DiscoveryController::class, 'configs']);
Route::get('stores/{slug}',     [StoreController::class, 'show']);
Route::get('stores/{slug}/reviews', [ReviewController::class, 'storeReviews']);
Route::post('webhooks/midtrans', [WebhookController::class, 'midtrans']);

// ─── AUTHENTICATED ROUTES ─────────────────────────────────────────────────────

Route::middleware('auth:sanctum')->group(function () {
    Broadcast::routes();

    // Auth
    Route::post('auth/logout', [AuthController::class, 'logout']);
    Route::get('auth/me',      [AuthController::class, 'me']);

    // Profile
    Route::get('profile',             [ProfileController::class, 'show']);
    Route::post('profile',            [ProfileController::class, 'update']);
    Route::put('profile/password',    [ProfileController::class, 'changePassword']);

    // Products (owner actions)
    Route::post('products',                  [ProductController::class, 'store']);
    Route::put('products/{id}',              [ProductController::class, 'update']);
    Route::delete('products/{id}',           [ProductController::class, 'destroy']);
    Route::patch('products/{id}/toggle',     [ProductController::class, 'toggle']);

    // Stores (seller)
    Route::post('stores',              [StoreController::class, 'store']);
    Route::put('stores',               [StoreController::class, 'update']);
    Route::get('stores/my/stats',      [StoreController::class, 'stats']);
    Route::get('stores/my/dashboard',  [StoreController::class, 'dashboard']);
    Route::get('stores/my/products',   [StoreController::class, 'myProducts']);

    // Follow
    Route::get('stores/following',        [FollowController::class, 'index']);
    Route::post('stores/{slug}/follow',   [FollowController::class, 'store']);
    Route::delete('stores/{slug}/follow', [FollowController::class, 'destroy']);
    Route::get('stores/{slug}/follow',    [FollowController::class, 'check']);
    Route::get('stores/followers',        [FollowController::class, 'followers']);

    // Cart
    Route::get('cart',                   [CartController::class, 'index']);
    Route::post('cart',                  [CartController::class, 'store']);
    Route::delete('cart/{product_id}',   [CartController::class, 'destroy']);

    // Addresses
    Route::get('addresses',                    [AddressController::class, 'index']);
    Route::post('addresses',                   [AddressController::class, 'store']);
    Route::put('addresses/{id}',               [AddressController::class, 'update']);
    Route::delete('addresses/{id}',            [AddressController::class, 'destroy']);
    Route::patch('addresses/{id}/primary',     [AddressController::class, 'setPrimary']);

    // Shipping
    Route::post('shipping/cost', [ShippingController::class, 'cost']);

    // Promos
    Route::post('promos/check', [PromoController::class, 'check']);

    // Orders (buyer + seller)
    Route::get('orders',                  [OrderController::class, 'buyerOrders']);
    Route::get('orders/seller',           [OrderController::class, 'sellerOrders']);
    Route::get('orders/{id}',             [OrderController::class, 'show']);
    Route::post('orders/checkout',        [OrderController::class, 'checkout']);
    Route::post('orders/{id}/resi',       [OrderController::class, 'inputResi']);
    Route::get('orders/{id}/tracking',    [OrderController::class, 'tracking']);
    Route::post('orders/{id}/confirm',    [OrderController::class, 'confirm']);

    // Reviews
    Route::post('orders/{id}/reviews',   [ReviewController::class, 'store']);
    Route::post('reviews/{id}/reply',    [ReviewController::class, 'reply']);

    // Wishlist
    Route::get('wishlist',                      [WishlistController::class, 'index']);
    Route::post('wishlist/{product_id}',        [WishlistController::class, 'store']);
    Route::delete('wishlist/{product_id}',      [WishlistController::class, 'destroy']);
    Route::get('wishlist/{product_id}/check',   [WishlistController::class, 'check']);

    // Chat
    Route::get('conversations',                      [ChatController::class, 'index']);
    Route::post('conversations',                     [ChatController::class, 'getOrCreate']);
    Route::get('conversations/{id}/messages',        [ChatController::class, 'messages']);
    Route::post('conversations/{id}/messages',       [ChatController::class, 'send']);

    // Notifications
    Route::get('notifications',                 [NotificationController::class, 'index']);
    Route::get('notifications/unread-count',    [NotificationController::class, 'unreadCount']);
    Route::patch('notifications/{id}/read',     [NotificationController::class, 'read']);
    Route::patch('notifications/read-all',      [NotificationController::class, 'readAll']);

    // Wallet
    Route::get('wallet',              [WalletController::class, 'index']);
    Route::get('wallet/transactions', [WalletController::class, 'transactions']);
    Route::post('wallet/topup',       [WalletController::class, 'topup']);

    // Withdrawals
    Route::get('withdrawals',              [WithdrawalController::class, 'index']);
    Route::post('withdrawals',             [WithdrawalController::class, 'store']);
    Route::post('withdrawals/{id}/approve', [WithdrawalController::class, 'approve']);
    Route::post('withdrawals/{id}/reject',  [WithdrawalController::class, 'reject']);

    // Swap
    Route::get('swaps',                  [SwapController::class, 'index']);
    Route::post('swaps',                 [SwapController::class, 'store']);
    Route::patch('swaps/{id}/respond',   [SwapController::class, 'respond']);
    Route::post('swaps/{id}/resi',       [SwapController::class, 'inputResi']);
    Route::post('swaps/{id}/confirm',    [SwapController::class, 'confirm']);

    // Reports
    Route::post('reports', [ReportController::class, 'store']);
});
