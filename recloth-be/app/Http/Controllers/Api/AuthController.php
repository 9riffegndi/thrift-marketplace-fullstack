<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Wallet;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class AuthController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        $payload = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8'],
            'phone' => ['required', 'string', 'max:30'],
        ]);

        $user = DB::transaction(function () use ($payload) {
            Role::findOrCreate('user', 'web');

            $newUser = User::query()->create([
                'name' => $payload['name'],
                'email' => $payload['email'],
                'password' => $payload['password'],
                'phone' => $payload['phone'],
                'role' => 'user',
                'status' => 'active',
            ]);

            $newUser->assignRole('user');

            Wallet::query()->create([
                'user_id' => $newUser->id,
                'balance' => 0,
                'held_balance' => 0,
            ]);

            return $newUser;
        });

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Register berhasil.',
            'data' => [
                'token' => $token,
                'user' => $user->only(['id', 'name', 'email', 'phone', 'role', 'status']),
            ],
        ], 201);
    }

    public function login(Request $request): JsonResponse
    {
        $payload = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $user = User::query()->with('store')->where('email', $payload['email'])->first();

        if (! $user || ! Hash::check($payload['password'], $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Email atau password tidak valid.',
                'data' => null,
            ], 422);
        }

        if ($user->status === 'suspended') {
            return response()->json([
                'success' => false,
                'message' => 'Akun sedang disuspend.',
                'data' => null,
            ], 403);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Login berhasil.',
            'data' => [
                'token' => $token,
                'user' => array_merge($user->toArray(), [
                    'following_count' => $user->followedStores()->count(),
                    'followers_count' => $user->store ? $user->store->followers()->count() : 0,
                ]),
                'store' => $user->store,
            ],
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()?->currentAccessToken()?->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logout berhasil.',
            'data' => null,
        ]);
    }

    public function me(Request $request): JsonResponse
    {
        $user = $request->user()->load('store');

        return response()->json([
            'success' => true,
            'message' => 'Data profil berhasil diambil.',
            'data' => [
                'user' => array_merge($user->toArray(), [
                    'following_count' => $user->followedStores()->count(),
                    'followers_count' => $user->store ? $user->store->followers()->count() : 0,
                ]),
                'store' => $user->store,
            ],
        ]);
    }

    public function forgotPassword(Request $request): JsonResponse
    {
        $request->validate(['email' => 'required|email']);
        
        $user = User::where('email', $request->email)->first();
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Email tidak terdaftar.',
            ], 404);
        }

        $token = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $request->email],
            ['token' => Hash::make($token), 'created_at' => now()]
        );

        // NOTE: In a production app, you would send an email with the token here.
        // For this demo, we'll return it so the user can actually use it easily.
        return response()->json([
            'success' => true,
            'message' => 'Token reset password telah dikirim ke email Anda.',
            'data' => ['token' => $token] // Return token for dev convenience
        ]);
    }

    public function resetPassword(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email',
            'token' => 'required',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $reset = DB::table('password_reset_tokens')->where('email', $request->email)->first();

        if (!$reset || !Hash::check($request->token, $reset->token)) {
            return response()->json([
                'success' => false,
                'message' => 'Token tidak valid atau email salah.',
            ], 422);
        }

        // Token expiry (e.g., 60 minutes)
        if (now()->diffInMinutes($reset->created_at) > 60) {
            return response()->json([
                'success' => false,
                'message' => 'Token telah kedaluwarsa.',
            ], 422);
        }

        $user = User::where('email', $request->email)->first();
        $user->update(['password' => $payload['password'] ?? $request->password]);

        DB::table('password_reset_tokens')->where('email', $request->email)->delete();

        return response()->json([
            'success' => true,
            'message' => 'Password berhasil diubah. Silakan login kembali.',
        ]);
    }
}
