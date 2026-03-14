<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Promo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PromoController extends Controller
{
    public function check(Request $request)
    {
        $request->validate([
            'code'     => 'required|string',
            'subtotal' => 'required|numeric|min:0',
        ]);

        $promo = Promo::where('code', strtoupper($request->code))
            ->where('status', 'active')
            ->where('start_at', '<=', now())
            ->where('end_at', '>=', now())
            ->first();

        if (!$promo) {
            return response()->json(['success' => false, 'message' => 'Kode promo tidak valid atau sudah kadaluarsa', 'data' => null], 422);
        }

        if ($promo->used_count >= $promo->quota) {
            return response()->json(['success' => false, 'message' => 'Kuota promo sudah habis', 'data' => null], 422);
        }

        if ($request->subtotal < $promo->min_purchase) {
            return response()->json([
                'success' => false,
                'message' => 'Minimum pembelian Rp ' . number_format($promo->min_purchase, 0, ',', '.'),
                'data'    => null,
            ], 422);
        }

        if ($promo->type === 'percent') {
            $discount = ($request->subtotal * $promo->value / 100);
            if ($promo->max_discount) $discount = min($discount, $promo->max_discount);
        } else {
            $discount = $promo->value;
        }

        $discount = min($discount, $request->subtotal);

        return response()->json([
            'success' => true,
            'message' => 'Promo valid',
            'data'    => [
                'promo'    => $promo,
                'discount' => round($discount),
                'total'    => $request->subtotal - round($discount),
            ],
        ]);
    }
}
