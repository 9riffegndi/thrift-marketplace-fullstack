<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class SuperAdminSeeder extends Seeder
{
    public function run(): void
    {
        Role::findOrCreate('super_admin', 'web');
        Role::findOrCreate('user', 'web');

        $email = env('SUPER_ADMIN_EMAIL', 'admin@recloth.id');
        $password = env('SUPER_ADMIN_PASSWORD', 'password');

        $user = User::query()->updateOrCreate(
            ['email' => $email],
            [
                'name' => env('SUPER_ADMIN_NAME', 'Super Admin'),
                'phone' => env('SUPER_ADMIN_PHONE', '081234567890'),
                'password' => Hash::make($password),
                'role' => 'super_admin',
                'status' => 'active',
            ]
        );

        $user->syncRoles(['super_admin']);
    }
}
