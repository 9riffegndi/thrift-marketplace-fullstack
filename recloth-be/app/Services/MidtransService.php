<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class MidtransService
{
    public function createTransaction(array $payload): array
    {
        $serverKey = (string) config('services.midtrans.server_key');
        $url = (string) config('services.midtrans.snap_url');

        $response = Http::withBasicAuth($serverKey, '')
            ->acceptJson()
            ->post($url, $payload);

        return $response->json() ?? [];
    }

    public function verifySignature(array $payload): bool
    {
        $orderId = (string) ($payload['order_id'] ?? '');
        $statusCode = (string) ($payload['status_code'] ?? '');
        $grossAmount = (string) ($payload['gross_amount'] ?? '');
        $signatureKey = (string) ($payload['signature_key'] ?? '');
        $serverKey = (string) config('services.midtrans.server_key');

        $raw = $orderId.$statusCode.$grossAmount.$serverKey;

        return hash('sha512', $raw) === $signatureKey;
    }
}
