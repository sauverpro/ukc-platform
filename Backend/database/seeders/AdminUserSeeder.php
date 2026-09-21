<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => env('ADMIN_EMAIL', 'admin@ukc.rw')],
            [
                'name'     => 'UKC Admin',
                'phone'    => env('ADMIN_PHONE', '+250791921186'),
                'password' => env('ADMIN_PASSWORD', 'password'), // hashed via cast; change after first login
                'is_admin' => true,
            ]
        );
    }
}
