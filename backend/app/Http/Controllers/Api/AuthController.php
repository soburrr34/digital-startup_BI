<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request): JsonResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email', 'max:150'],
            'password' => ['required', 'string', 'min:6'],
        ]);

        $user = User::where('email', strtolower($credentials['email']))->first();
        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Email atau password salah.'],
            ]);
        }

        $user->tokens()->delete();
        $token = $user->createToken('nonton-santuyy')->plainTextToken;

        return response()->json(['token' => $token, 'user' => $this->userData($user)]);
    }

    public function register(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'email' => ['required', 'email', 'max:150', 'unique:users,email'],
            'password' => ['required', 'string', 'min:6', 'confirmed'],
        ]);

        $user = User::create([
            'name' => $data['name'],
            'email' => strtolower($data['email']),
            'password' => $data['password'],
            'role' => 'user',
        ]);

        $token = $user->createToken('nonton-santuyy')->plainTextToken;
        return response()->json(['token' => $token, 'user' => $this->userData($user)], 201);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json(['user' => $this->userData($request->user())]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()?->delete();
        return response()->json(['message' => 'Berhasil keluar.']);
    }

    private function userData(User $user): array
    {
        return ['id' => $user->id, 'name' => $user->name, 'email' => $user->email, 'role' => $user->role];
    }
}
