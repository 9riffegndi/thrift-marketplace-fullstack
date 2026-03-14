<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $notifications = Notification::query()
            ->where('user_id', $request->user()->id)
            ->latest('created_at')
            ->paginate(20);

        return response()->json(['success' => true, 'message' => 'Notifikasi berhasil diambil.', 'data' => $notifications]);
    }

    public function read(Request $request, int $id): JsonResponse
    {
        Notification::query()
            ->where('id', $id)
            ->where('user_id', $request->user()->id)
            ->update(['is_read' => true]);

        return response()->json(['success' => true, 'message' => 'Notifikasi ditandai dibaca.', 'data' => null]);
    }

    public function readAll(Request $request): JsonResponse
    {
        Notification::query()->where('user_id', $request->user()->id)->update(['is_read' => true]);

        return response()->json(['success' => true, 'message' => 'Semua notifikasi ditandai dibaca.', 'data' => null]);
    }

    public function unreadCount(Request $request): JsonResponse
    {
        $count = Notification::query()
            ->where('user_id', $request->user()->id)
            ->where('is_read', false)
            ->count();

        return response()->json(['success' => true, 'message' => 'Jumlah unread berhasil diambil.', 'data' => ['unread_count' => $count]]);
    }
}
