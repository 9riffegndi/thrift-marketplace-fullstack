<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'buyer_id',
        'store_id',
        'product_id',
        'type',
        'status',
        'subtotal',
        'ongkir',
        'diskon',
        'komisi',
        'total',
        'courier_code',
        'courier_service',
        'resi',
        'escrow_status',
    ];

    protected function casts(): array
    {
        return [
            'subtotal' => 'decimal:2',
            'ongkir' => 'decimal:2',
            'diskon' => 'decimal:2',
            'komisi' => 'decimal:2',
            'total' => 'decimal:2',
        ];
    }

    public function buyer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'buyer_id');
    }

    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function payment(): HasOne
    {
        return $this->hasOne(Payment::class);
    }

    public function swap(): HasOne
    {
        return $this->hasOne(Swap::class);
    }

    public function walletTransactions(): HasMany
    {
        return $this->hasMany(WalletTransaction::class);
    }

    public function review(): HasOne
    {
        return $this->hasOne(Review::class);
    }
}
