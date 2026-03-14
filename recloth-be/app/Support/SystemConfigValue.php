<?php

namespace App\Support;

use App\Models\SystemConfig;

class SystemConfigValue
{
    public static function get(string $key, mixed $default = null): mixed
    {
        $value = SystemConfig::query()->where('key', $key)->value('value');

        return $value ?? $default;
    }

    public static function int(string $key, int $default = 0): int
    {
        return (int) static::get($key, $default);
    }

    public static function float(string $key, float $default = 0): float
    {
        return (float) static::get($key, $default);
    }
}
