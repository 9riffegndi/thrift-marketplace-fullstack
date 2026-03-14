<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class RajaOngkirService
{
    private string $baseUrl;
    private string $shippingKey;   // untuk shipping cost
    private string $deliveryKey;   // untuk tracking

    public function __construct()
    {
        $this->baseUrl     = rtrim((string) config('services.rajaongkir.base_url', 'https://api.komerce.id'), '/');
        $this->shippingKey = (string) config('services.rajaongkir.key', '');
        $this->deliveryKey = (string) config('services.rajaongkir.shipping_key', $this->shippingKey);
    }

    public function resolveCityId(string $name): string
    {
        $name = strtolower($name);
        $mapping = [
            'jakarta'    => '151',
            'bandung'    => '23',
            'surabaya'   => '444',
            'yogyakarta' => '501',
            'medan'      => '278',
            'semarang'   => '399',
            'makassar'   => '255',
            'bali'       => '114',
            'denpasar'   => '114',
            'bogor'      => '78',
            'bekasi'     => '55',
            'tangerang'  => '455',
            'depok'      => '115',
        ];

        foreach ($mapping as $key => $id) {
            if (str_contains($name, $key)) {
                return $id;
            }
        }

        return $name; // Fallback to original
    }

    /**
     * Hitung ongkir — Komerce API (/api/cost)
     */
    public function getCost(string $origin, string $destination, int $weight, string $courier): array
    {
        $originId = $this->resolveCityId($origin);
        $destinationId = $this->resolveCityId($destination);

        try {
            if (empty($this->shippingKey) && config('app.env') !== 'production') {
                return $this->getMockCosts($courier);
            }

            $response = Http::withHeaders([
                'key'          => $this->shippingKey,
                'Content-Type' => 'application/x-www-form-urlencoded',
            ])
                ->asForm()
                ->post($this->baseUrl . '/api/cost', [
                    'origin'      => $originId,
                    'destination' => $destinationId,
                    'weight'      => $weight,
                    'courier'     => strtolower($courier),
                ]);

            if ($response->failed() && config('app.env') !== 'production') {
                return $this->getMockCosts($courier);
            }

            $json = $response->json();
            return data_get($json, 'rajaongkir.results', $json ?? []);
        } catch (\Throwable $e) {
            Log::error('RajaOngkir getCost error: ' . $e->getMessage());
            return config('app.env') !== 'production' ? $this->getMockCosts($courier) : [];
        }
    }

    private function getMockCosts(string $courier): array
    {
        return [
            [
                'code' => strtolower($courier),
                'name' => strtoupper($courier),
                'costs' => [
                    [
                        'service' => 'REG',
                        'description' => 'Layanan Reguler',
                        'cost' => [
                            ['value' => 12000, 'etd' => '2-3', 'note' => '']
                        ]
                    ],
                    [
                        'service' => 'OKE',
                        'description' => 'Layanan Ekonomis',
                        'cost' => [
                            ['value' => 8000, 'etd' => '4-5', 'note' => '']
                        ]
                    ]
                ]
            ]
        ];
    }

    /**
     * Tracking waybill — Komerce Shipping Delivery API
     */
    public function getTracking(string $waybill, string $courier): array
    {
        try {
            $response = Http::withHeaders([
                'key'          => $this->deliveryKey,
                'Content-Type' => 'application/x-www-form-urlencoded',
            ])
                ->asForm()
                ->post($this->baseUrl . '/api/tracking', [
                    'waybill' => $waybill,
                    'courier' => strtolower($courier),
                ]);

            return $response->json() ?? [];
        } catch (\Throwable $e) {
            Log::error('RajaOngkir getTracking error: ' . $e->getMessage());
            return [];
        }
    }

    /**
     * Validasi resi (cek apakah ada data tracking)
     * Bisa di-skip (return true) jika tidak mau validasi ketat
     */
    public function validateWaybill(string $waybill, string $courier): bool
    {
        // Untuk dev/staging: skip validasi resi (tidak semua resi bisa dicek)
        if (config('app.env') !== 'production') {
            return true;
        }

        $result = $this->getTracking($waybill, $courier);
        return !empty(data_get($result, 'rajaongkir.result.summary.waybill_number'))
            || !empty(data_get($result, 'data.waybill_number'));
    }

    /**
     * List kota/kabupaten — untuk autocomplete di checkout
     */
    public function getCities(?string $provinceId = null): array
    {
        try {
            $params = $provinceId ? ['province' => $provinceId] : [];
            $response = Http::withHeaders(['key' => $this->shippingKey])
                ->get($this->baseUrl . '/api/city', $params);
            return data_get($response->json(), 'rajaongkir.results', []);
        } catch (\Throwable $e) {
            return [];
        }
    }

    /**
     * List provinsi
     */
    public function getProvinces(): array
    {
        try {
            $response = Http::withHeaders(['key' => $this->shippingKey])
                ->get($this->baseUrl . '/api/province');
            return data_get($response->json(), 'rajaongkir.results', []);
        } catch (\Throwable $e) {
            return [];
        }
    }
}
