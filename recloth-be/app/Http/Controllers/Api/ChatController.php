<?php

namespace App\Http\Controllers\Api;

use App\Events\MessageSent;
use App\Http\Controllers\Controller;
use App\Models\Conversation;
use App\Models\Store;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $conversations = Conversation::query()
            ->where('buyer_id', $user->id)
            ->orWhereIn('store_id', $user->store ? [$user->store->id] : [])
            ->with(['buyer:id,name', 'store:id,name', 'messages' => fn ($q) => $q->latest('created_at')->limit(1)])
            ->orderByDesc('last_message_at')
            ->get();

        return response()->json(['success' => true, 'message' => 'Conversation berhasil diambil.', 'data' => $conversations]);
    }

    public function messages(Request $request, int $id): JsonResponse
    {
        $conversation = Conversation::query()->find($id);
        if (! $conversation) {
            return $this->error('Conversation tidak ditemukan.', 404);
        }

        if (! $this->canAccessConversation($request, $conversation)) {
            return $this->error('Akses ditolak.', 403);
        }

        $messages = $conversation->messages()->latest('created_at')->paginate(20);

        return response()->json(['success' => true, 'message' => 'Pesan berhasil diambil.', 'data' => $messages]);
    }

    public function getOrCreate(Request $request): JsonResponse
    {
        $validated = $request->validate(['store_id' => ['required', 'exists:stores,id']]);

        $conversation = Conversation::query()->firstOrCreate(
            ['buyer_id' => $request->user()->id, 'store_id' => $validated['store_id']],
            ['created_at' => now()]
        );

        return response()->json(['success' => true, 'message' => 'Conversation siap digunakan.', 'data' => $conversation]);
    }

    public function send(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate(['message' => ['required', 'string']]);
        $conversation = Conversation::query()->find($id);

        if (! $conversation || ! $this->canAccessConversation($request, $conversation)) {
            return $this->error('Conversation tidak ditemukan atau akses ditolak.', 404);
        }

        $message = $conversation->messages()->create([
            'sender_id' => $request->user()->id,
            'message' => $validated['message'],
            'is_read' => false,
            'created_at' => now(),
        ]);

        $conversation->update(['last_message_at' => now()]);
        broadcast(new MessageSent($message))->toOthers();

        return response()->json(['success' => true, 'message' => 'Pesan berhasil dikirim.', 'data' => $message], 201);
    }

    private function canAccessConversation(Request $request, Conversation $conversation): bool
    {
        $isBuyer = $conversation->buyer_id === $request->user()->id;
        $store = Store::query()->find($conversation->store_id);

        return $isBuyer || $store?->user_id === $request->user()->id;
    }

    private function error(string $message, int $status): JsonResponse
    {
        return response()->json(['success' => false, 'message' => $message, 'data' => null], $status);
    }
}
