<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CredentialsController;
use Illuminate\Support\Facades\Route;

$registerRoutes = function () {
    Route::post('/register', [AuthController::class, 'register'])->middleware('throttle:10,1');
    Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:10,1');
    Route::post('/reset-password', [AuthController::class, 'resetPassword'])->middleware('throttle:10,1');

    Route::get('/credentials', [CredentialsController::class, 'index']);
    Route::post('/credentials', [CredentialsController::class, 'addCredentials']);
    Route::put('/credentials', [CredentialsController::class, 'updateCredentials']);
    Route::delete('/credentials', [CredentialsController::class, 'deleteCredentials']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);
    });
};

$registerRoutes();
Route::prefix('api')->group($registerRoutes);
