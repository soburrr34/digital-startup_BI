<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        $this->call(MovieSeeder::class);

        User::updateOrCreate(['email' => 'test@example.com'], [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password',
            'role' => 'user',
        ]);

        User::updateOrCreate(['email' => 'admin@nontonsantuy.id'], [
            'name' => 'Administrator',
            'email' => 'admin@nontonsantuy.id',
            'password' => 'admin12345',
            'role' => 'admin',
        ]);
    }
}
