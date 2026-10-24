<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('movies', function (Blueprint $table) {
            $table->id();
            $table->string('title', 180);
            $table->string('genre', 80)->index();
            $table->unsignedSmallInteger('year');
            $table->decimal('rating', 3, 1)->default(0);
            $table->string('duration', 40)->nullable();
            $table->string('category', 30)->default('Popular');
            $table->string('image_url', 2048)->nullable();
            $table->text('description')->nullable();
            $table->string('video_url', 2048)->nullable();
            $table->boolean('is_featured')->default(false)->index();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('movies');
    }
};
