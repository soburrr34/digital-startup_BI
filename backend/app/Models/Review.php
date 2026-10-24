<?php

namespace App\Models;

class Review extends Model
{
    protected $fillable = [
        'movie_id',
        'author',
        'email',
        'avatar',
        'rating',
        'comment',
    ];

    protected $casts = [
        'rating' => 'integer',
    ];

    public function movie()
    {
        return $this->belongsTo(Movie::class);
    }

    public function toFrontendArray(): array
    {
        return [
            'id' => (string) $this->id,
            'movieId' => (string) $this->movie_id,
            'author' => $this->author,
            'email' => $this->email,
            'avatar' => $this->avatar,
            'rating' => $this->rating,
            'comment' => $this->comment,
            'createdAt' => $this->created_at?->toISOString() ?? now()->toISOString(),
        ];
    }
}
