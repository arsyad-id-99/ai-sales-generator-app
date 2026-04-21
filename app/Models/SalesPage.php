<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SalesPage extends Model
{
    // Mengizinkan semua kolom diisi secara massal
    protected $guarded = [];

    // Memberi tahu Laravel bahwa kolom ini berisi format JSON
    protected $casts = [
        'input_data' => 'array',
        'generated_content' => 'array',
    ];
}