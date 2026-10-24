<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Movie;
use App\Models\Review;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class MovieController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Movie::query();

        if ($request->filled('search')) {
            $search = $request->string('search')->toString();
            $query->where(function ($builder) use ($search) {
                $builder->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($request->filled('genre') && $request->genre !== 'Semua') {
            $query->where('genre', $request->genre);
        }

        if ($request->boolean('featured')) {
            $query->where('is_featured', true);
        }

        $movies = $query->orderByDesc('is_featured')->orderByDesc('created_at')->get();

        return response()->json($movies->map(fn (Movie $movie) => $movie->toFrontendArray())->values());
    }

    public function show(Movie $movie): JsonResponse
    {
        return response()->json($movie->toFrontendArray());
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate($this->rules());
        $movie = Movie::create($validated);

        return response()->json($movie->toFrontendArray(), 201);
    }

    public function update(Request $request, Movie $movie): JsonResponse
    {
        $validated = $request->validate($this->rules($movie));
        $movie->update($validated);

        return response()->json($movie->fresh()->toFrontendArray());
    }

    public function destroy(Movie $movie): JsonResponse
    {
        $movie->delete();
        return response()->json(['message' => 'Film berhasil dihapus.']);
    }

    public function genres(): JsonResponse
    {
        return response()->json(Movie::query()->select('genre')->distinct()->orderBy('genre')->pluck('genre'));
    }

    public function reviews(Movie $movie): JsonResponse
    {
        $reviews = $movie->reviews()->get();
        return response()->json($reviews->map(fn (Review $r) => $r->toFrontendArray())->values());
    }

    public function storeReview(Request $request, Movie $movie): JsonResponse
    {
        $validated = $request->validate([
            'author' => ['required', 'string', 'max:100'],
            'email' => ['nullable', 'email', 'max:150'],
            'avatar' => ['nullable', 'string', 'max:2048'],
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'comment' => ['nullable', 'string', 'max:1000'],
        ]);

        $review = $movie->reviews()->create($validated);

        // Optionally recalculate movie rating
        $avg = $movie->reviews()->avg('rating');
        if ($avg) {
            $movie->update(['rating' => round($avg, 1)]);
        }

        return response()->json($review->toFrontendArray(), 201);
    }

    public function destroyReview(Review $review): JsonResponse
    {
        $movie = $review->movie;
        $review->delete();

        if ($movie) {
            $avg = $movie->reviews()->avg('rating');
            $movie->update(['rating' => $avg ? round($avg, 1) : 0]);
        }

        return response()->json(['message' => 'Ulasan berhasil dihapus.']);
    }

    private function rules(?Movie $movie = null): array
    {
        return [
            'title' => ['required', 'string', 'max:180'],
            'genre' => ['required', 'string', 'max:80'],
            'year' => ['required', 'integer', 'min:1888', 'max:2100'],
            'rating' => ['nullable', 'numeric', 'min:0', 'max:10'],
            'duration' => ['nullable', 'string', 'max:40'],
            'category' => ['nullable', Rule::in(['Trending', 'Popular', 'New'])],
            'image_url' => ['nullable', 'url', 'max:2048'],
            'description' => ['nullable', 'string', 'max:5000'],
            'video_url' => ['nullable', 'url', 'max:2048'],
            'is_featured' => ['sometimes', 'boolean'],
        ];
    }
}
