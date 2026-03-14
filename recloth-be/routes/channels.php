<?php

use Illuminate\Support\Facades\Broadcast;
use App\Models\Conversation;
use App\Models\Store;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('conversation.{id}', function ($user, $id) {
    $conversation = Conversation::query()->find($id);
    if (! $conversation) {
        return false;
    }

    if ((int) $conversation->buyer_id === (int) $user->id) {
        return true;
    }

    $store = Store::query()->find($conversation->store_id);

    return (int) ($store?->user_id ?? 0) === (int) $user->id;
});

Broadcast::channel('user.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});
