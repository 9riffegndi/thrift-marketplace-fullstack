<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'product_id' => ['required', 'exists:products,id'],
        ]);

        $product = Product::query()->findOrFail($validated['product_id']);

        if ($product->status !== 'active') {
            return $this->error('Produk tidak tersedia untuk keranjang.', 422);
        }

        Cart::query()->firstOrCreate([
            'user_id' => $request->user()->id,
            'product_id' => $product->id,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Produk ditambahkan ke keranjang.',
            'data' => null,
        ], 201);
    }

    public function index(Request $request): JsonResponse
    {
        $items = Cart::query()
            ->with(['product.photos', 'product.store'])
            ->where('user_id', $request->user()->id)
            ->latest('created_at')
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Keranjang berhasil diambil.',
            'data' => $items,
        ]);
    }

    public function destroy(Request $request, int $productId): JsonResponse
    {
        Cart::query()
            ->where('user_id', $request->user()->id)
            ->where('product_id', $productId)
            ->delete();

        return response()->json([
            'success' => true,
            'message' => 'Produk dihapus dari keranjang.',
            'data' => null,
        ]);
    }

    private function error(string $message, int $status): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => $message,
            'data' => null,
        ], $status);
    }
}
