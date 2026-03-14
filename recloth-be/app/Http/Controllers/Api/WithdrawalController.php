<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Withdrawal;
use App\Support\SystemConfigValue;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class WithdrawalController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'amount' => ['required', 'numeric', 'min:1'],
            'bank_name' => ['required', 'string', 'max:100'],
            'account_number' => ['required', 'string', 'max:50'],
            'account_name' => ['required', 'string', 'max:100'],
        ]);

        $minAmount = SystemConfigValue::float('min_withdrawal_amount', 50000);
        if ((float) $validated['amount'] < $minAmount) {
            return $this->error('Nominal withdraw di bawah minimum.', 422);
        }

        $wallet = $request->user()->wallet;
        if (! $wallet || (float) $wallet->balance < (float) $validated['amount']) {
            return $this->error('Saldo tidak mencukupi.', 422);
        }

        $withdrawal = DB::transaction(function () use ($request, $validated, $wallet) {
            $wallet->refresh();
            $wallet->balance -= (float) $validated['amount'];
            $wallet->save();

            return Withdrawal::query()->create([
                'user_id' => $request->user()->id,
                'amount' => $validated['amount'],
                'bank_name' => $validated['bank_name'],
                'account_number' => $validated['account_number'],
                'account_name' => $validated['account_name'],
                'status' => 'pending',
            ]);
        });

        return response()->json(['success' => true, 'message' => 'Request withdrawal berhasil dibuat.', 'data' => $withdrawal], 201);
    }

    public function index(Request $request): JsonResponse
    {
        $rows = Withdrawal::query()
            ->when(! $request->user()->hasRole('super_admin'), fn ($q) => $q->where('user_id', $request->user()->id))
            ->with('user:id,name,email')
            ->latest()
            ->paginate(20);

        return response()->json(['success' => true, 'message' => 'Riwayat withdrawal berhasil diambil.', 'data' => $rows]);
    }

    public function approve(Request $request, int $id): JsonResponse
    {
        if (! $request->user()->hasRole('super_admin')) {
            return $this->error('Akses ditolak.', 403);
        }

        $withdrawal = Withdrawal::query()->findOrFail($id);
        if ($withdrawal->status !== 'pending') {
            return $this->error('Withdrawal sudah diproses.', 422);
        }

        $withdrawal->update([
            'status' => 'done',
            'processed_at' => now(),
        ]);

        return response()->json(['success' => true, 'message' => 'Withdrawal disetujui.', 'data' => $withdrawal]);
    }

    public function reject(Request $request, int $id): JsonResponse
    {
        if (! $request->user()->hasRole('super_admin')) {
            return $this->error('Akses ditolak.', 403);
        }

        $withdrawal = Withdrawal::query()->with('user.wallet')->findOrFail($id);
        if ($withdrawal->status !== 'pending') {
            return $this->error('Withdrawal sudah diproses.', 422);
        }

        DB::transaction(function () use ($withdrawal) {
            $withdrawal->update(['status' => 'failed']);
            
            $wallet = $withdrawal->user->wallet;
            if ($wallet) {
                $wallet->increment('balance', (float) $withdrawal->amount);
                $wallet->transactions()->create([
                    'type' => 'credit',
                    'amount' => $withdrawal->amount,
                    'description' => 'Refund penarikan ditolak',
                ]);
            }
        });

        return response()->json(['success' => true, 'message' => 'Withdrawal ditolak dan saldo dikembalikan.', 'data' => $withdrawal]);
    }

    private function error(string $message, int $status): JsonResponse
    {
        return response()->json(['success' => false, 'message' => $message, 'data' => null], $status);
    }
}
