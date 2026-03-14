<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class OrderCompleted implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(public array $order, public int $sellerId) {}

    public function broadcastOn(): array
    {
        return [new PrivateChannel('user.' . $this->sellerId)];
    }

    public function broadcastAs(): string
    {
        return 'order.completed';
    }

    public function broadcastWith(): array
    {
        return ['order' => $this->order];
    }
}
