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
    Route::get('/history/{id}/edit', [SalesPageController::class, 'edit'])->name('generate.edit');
    Route::patch('/history/{id}', [SalesPageController::class, 'update'])->name('generate.update');
    Route::get('/history/{id}/export', [SalesPageController::class, 'export'])->name('generate.export');
});

require __DIR__.'/auth.php';
