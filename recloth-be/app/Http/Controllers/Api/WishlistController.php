<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Wishlist;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class WishlistController extends Controller
{
    public function index()
    {
        $wishlists = Wishlist::with(['product.store:id,name,slug,city', 'product.photos' => fn($q) => $q->where('is_primary', true)])
            ->where('user_id', Auth::id())
            ->latest()
            ->paginate(20);

        return response()->json(['success' => true, 'message' => 'OK', 'data' => $wishlists]);
    }

    public function store(int $productId)
    {
        $product = Product::where('id', $productId)->where('status', 'active')->firstOrFail();

        $wishlist = Wishlist::firstOrCreate([
            'user_id'    => Auth::id(),
            'product_id' => $product->id,
        ]);

        return response()->json(['success' => true, 'message' => 'Produk disimpan ke wishlist', 'data' => $wishlist], 201);
    }

    public function destroy(int $productId)
    {
        Wishlist::where('user_id', Auth::id())->where('product_id', $productId)->delete();

        return response()->json(['success' => true, 'message' => 'Dihapus dari wishlist', 'data' => null]);
    }

    public function check(int $productId)
    {
        $exists = Wishlist::where('user_id', Auth::id())->where('product_id', $productId)->exists();
        return response()->json(['success' => true, 'message' => 'OK', 'data' => ['in_wishlist' => $exists]]);
    }
}
