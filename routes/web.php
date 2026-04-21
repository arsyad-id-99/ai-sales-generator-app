<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\SalesPageController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Rute Generate Sales Page
    Route::get('/generate', [SalesPageController::class, 'create'])->name('generate.create');
    Route::post('/generate', [SalesPageController::class, 'store'])->name('generate.store');

    // Rute History & Delete
    Route::get('/history', [SalesPageController::class, 'index'])->name('generate.history');
    Route::get('/history/{id}', [SalesPageController::class, 'show'])->name('generate.show');
    Route::delete('/history/{id}', [SalesPageController::class, 'destroy'])->name('generate.destroy');
});

require __DIR__.'/auth.php';
