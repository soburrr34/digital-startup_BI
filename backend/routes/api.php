<?php

use App\Http\Controllers\Api\MovieController;
use App\Http\Controllers\Api\AuthController;
use Illuminate\Support\Facades\Route;

// Public read-only endpoints used by the DulsFilm React frontend.
Route::get('/movies', [MovieController::class, 'index']);
Route::get('/movies/{movie}', [MovieController::class, 'show']);
Route::get('/movies/{movie}/reviews', [MovieController::class, 'reviews']);
Route::post('/movies/{movie}/reviews', [MovieController::class, 'storeReview']);
Route::delete('/reviews/{review}', [MovieController::class, 'destroyReview']);
Route::get('/genres', [MovieController::class, 'genres']);

// Protect content management endpoints with Laravel Sanctum (admin login/token required).
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    Route::post('/movies', [MovieController::class, 'store']);
    Route::put('/movies/{movie}', [MovieController::class, 'update']);
    Route::patch('/movies/{movie}', [MovieController::class, 'update']);
    Route::delete('/movies/{movie}', [MovieController::class, 'destroy']);
});
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/register', [AuthController::class, 'register']);
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);
});

