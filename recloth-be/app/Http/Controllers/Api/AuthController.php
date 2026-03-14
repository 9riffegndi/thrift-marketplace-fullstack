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
}
