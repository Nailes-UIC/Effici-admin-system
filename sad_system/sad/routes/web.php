<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController; // ⬅️ Add this line

// Redirect root to login page
Route::get('/', function () {
    return redirect()->route('login');
});

// Show login page using Inertia
Route::get('/login', function () {
    return Inertia::render('Auth/Login'); // match actual filename & folder structure
})->name('login');

// Handle login submission
Route::post('/login', [LoginController::class, 'store']);

// Logout
Route::post('/logout', [LoginController::class, 'destroy'])->name('logout');


// ✅ Registration routes
Route::get('/register', function () {
    return Inertia::render('Auth/Register'); // lowercase to match /pages/auth/register.tsx
})->name('register');

Route::post('/register', [RegisterController::class, 'store']);



// Protected routes (must be authenticated)
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard'); // match actual component
    })->name('dashboard');
});

// Database connection test
Route::get('/db-check', function () {
    try {
        DB::connection()->getPdo();
        return '✅ Database is connected: ' . DB::connection()->getDatabaseName();
    } catch (\Exception $e) {
        return '❌ Database connection failed: ' . $e->getMessage();
    }
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
