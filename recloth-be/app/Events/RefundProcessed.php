<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class RefundProcessed implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(public array $order, public int $buyerId) {}

    public function broadcastOn(): array
    {
        return [new PrivateChannel('user.' . $this->buyerId)];
    }

    public function broadcastAs(): string
    {
        return 'refund.processed';
    }

    public function broadcastWith(): array
    {
        return ['order' => $this->order];
    }
}
