<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Movie extends Model
{
    use HasFactory;

    protected $fillable = [
        'title', 'genre', 'year', 'rating', 'duration', 'category',
        'image_url', 'description', 'video_url', 'is_featured',
    ];

    protected $casts = [
        'year' => 'integer',
        'rating' => 'decimal:1',
        'is_featured' => 'boolean',
    ];

    public function reviews()
    {
        return $this->hasMany(Review::class)->latest();
    }

    public function toFrontendArray(): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'genre' => $this->genre,
            'year' => $this->year,
            'rating' => (string) $this->rating,
            'duration' => $this->duration,
            'category' => $this->category,
            'image' => $this->image_url,
            'description' => $this->description,
            'video_url' => $this->video_url,
            'is_featured' => $this->is_featured,
        ];
    }
}
