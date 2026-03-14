<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WalletController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $wallet = $request->user()->wallet;

        return response()->json([
            'success' => true,
            'message' => 'Saldo wallet berhasil diambil.',
            'data' => [
                'balance' => (float) ($wallet?->balance ?? 0),
                'held_balance' => (float) ($wallet?->held_balance ?? 0),
            ],
        ]);
    }

    public function transactions(Request $request): JsonResponse
    {
        $wallet = $request->user()->wallet;

        $transactions = $wallet
            ? $wallet->transactions()->latest('created_at')->paginate(20)
            : collect();

        return response()->json([
            'success' => true,
            'message' => 'Transaksi wallet berhasil diambil.',
            'data' => $transactions,
        ]);
    }

    public function topup(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'amount' => ['required', 'numeric', 'min:10000'],
        ]);

        $wallet = $request->user()->wallet()->firstOrCreate(
            ['user_id' => $request->user()->id],
            ['balance' => 0, 'held_balance' => 0]
        );

        \Illuminate\Support\Facades\DB::transaction(function () use ($wallet, $validated) {
            $wallet->increment('balance', (float) $validated['amount']);

            $wallet->transactions()->create([
                'type' => 'credit',
                'amount' => $validated['amount'],
                'description' => 'Top Up Saldo',
            ]);
        });

        return response()->json([
            'success' => true,
            'message' => 'Top up berhasil.',
            'data' => $wallet->fresh(),
        ]);
    }
}
