<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Store;
use App\Models\StoreFollow;
use Illuminate\Support\Facades\Auth;

class FollowController extends Controller
{
    public function index()
    {
        $following = Store::whereHas('followers', function ($q) {
            $q->where('user_id', Auth::id());
        })->paginate(15);

        return response()->json(['success' => true, 'message' => 'OK', 'data' => $following]);
    }

    public function store(string $slug)
    {
        $store = Store::where('slug', $slug)->firstOrFail();

        if ($store->user_id === Auth::id()) {
            return response()->json(['success' => false, 'message' => 'Tidak bisa follow toko sendiri', 'data' => null], 422);
        }

        StoreFollow::firstOrCreate(['user_id' => Auth::id(), 'store_id' => $store->id]);

        return response()->json(['success' => true, 'message' => 'Mengikuti toko ' . $store->name, 'data' => ['following' => true]]);
    }

    public function destroy(string $slug)
    {
        $store = Store::where('slug', $slug)->firstOrFail();
        StoreFollow::where('user_id', Auth::id())->where('store_id', $store->id)->delete();

        return response()->json(['success' => true, 'message' => 'Berhenti mengikuti toko ' . $store->name, 'data' => ['following' => false]]);
    }

    public function check(string $slug)
    {
        $store = Store::where('slug', $slug)->first();
        $following = $store
            ? StoreFollow::where('user_id', Auth::id())->where('store_id', $store->id)->exists()
            : false;

        return response()->json(['success' => true, 'message' => 'OK', 'data' => ['following' => $following]]);
    }

    public function followers()
    {
        $store = Auth::user()->store;
        if (! $store) {
            return response()->json(['success' => true, 'message' => 'User tidak memiliki toko', 'data' => []]);
        }

        $followers = \App\Models\User::whereHas('followedStores', function ($q) use ($store) {
            $q->where('store_id', $store->id);
        })->paginate(15);

        return response()->json(['success' => true, 'message' => 'OK', 'data' => $followers]);
    }
}
