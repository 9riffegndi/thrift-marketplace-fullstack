<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Swap extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'requester_product_id',
        'target_product_id',
        'status',
        'buyer_resi',
        'seller_resi',
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function requesterProduct(): BelongsTo
    {
        return $this->belongsTo(Product::class, 'requester_product_id');
    }

    public function targetProduct(): BelongsTo
    {
        return $this->belongsTo(Product::class, 'target_product_id');
    }
}
