<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Review;
use App\Models\ReviewReply;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReviewController extends Controller
{
    public function __construct(private NotificationService $notificationService) {}

    public function storeReviews(string $slug)
    {
        $reviews = Review::with(['buyer:id,name,avatar'])
            ->whereHas('store', fn($q) => $q->where('slug', $slug))
            ->where('status', 'published')
            ->latest()
            ->paginate(10);

        return response()->json(['success' => true, 'message' => 'OK', 'data' => $reviews]);
    }

    public function store(Request $request, int $orderId)
    {
        $validated = $request->validate([
            'rating'  => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:500',
        ]);

        $order = Order::with('store')
            ->where('id', $orderId)
            ->where('buyer_id', Auth::id())
            ->where('status', 'selesai')
            ->firstOrFail();

        $exists = Review::where('order_id', $orderId)->where('buyer_id', Auth::id())->exists();
        if ($exists) {
            return response()->json(['success' => false, 'message' => 'Sudah memberikan ulasan', 'data' => null], 422);
        }

        $review = Review::create([
            'order_id'   => $order->id,
            'buyer_id'   => Auth::id(),
            'store_id'   => $order->store_id,
            'product_id' => $order->product_id,
            'rating'     => $validated['rating'],
            'comment'    => $validated['comment'] ?? null,
            'status'     => 'published',
        ]);

        // Update rating toko
        $avgRating = Review::where('store_id', $order->store_id)
            ->where('status', 'published')
            ->avg('rating');
        $order->store->update(['rating' => round($avgRating, 2)]);

        $this->notificationService->send(
            $order->store->user_id,
            'review_new',
            'Ulasan Baru',
            'Pembeli memberikan rating ' . $validated['rating'] . ' untuk pesanan Anda.',
            ['order_id' => $order->id, 'review_id' => $review->id]
        );

        return response()->json(['success' => true, 'message' => 'Ulasan berhasil dikirim', 'data' => $review], 201);
    }

    public function reply(Request $request, int $reviewId)
    {
        $validated = $request->validate(['comment' => 'required|string|max:500']);

        $review = Review::with('store')->findOrFail($reviewId);

        if ($review->store->user_id !== Auth::id()) {
            return response()->json(['success' => false, 'message' => 'Forbidden', 'data' => null], 403);
        }

        $existing = ReviewReply::where('review_id', $reviewId)->first();
        if ($existing) {
            $existing->update(['comment' => $validated['comment']]);
            return response()->json(['success' => true, 'message' => 'Balasan diperbarui', 'data' => $existing]);
        }

        $reply = ReviewReply::create([
            'review_id' => $reviewId,
            'store_id'  => $review->store_id,
            'comment'   => $validated['comment'],
        ]);

        return response()->json(['success' => true, 'message' => 'Balasan dikirim', 'data' => $reply], 201);
    }
}
