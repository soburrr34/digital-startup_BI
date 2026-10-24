<?php

namespace Database\Seeders;

use App\Models\Movie;
use Illuminate\Database\Seeder;

class MovieSeeder extends Seeder
{
    public function run(): void
    {
        $movies = [
            ['title'=>'The Last Horizon','genre'=>'Sci-Fi','year'=>2025,'rating'=>8.8,'duration'=>'2j 08m','category'=>'Trending','image_url'=>'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=900&q=85','video_url'=>'/videos/sample.mp4','description'=>'Di ambang kehancuran bumi, sekelompok penjelajah menemukan sinyal misterius yang mungkin menjadi harapan terakhir umat manusia.','is_featured'=>true],
            ['title'=>'Midnight Run','genre'=>'Action','year'=>2024,'rating'=>8.2,'duration'=>'1j 54m','category'=>'Trending','image_url'=>'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=700&q=85','video_url'=>'https://raw.githubusercontent.com/intel-iot-devkit/sample-videos/master/person-bicycle-car-detection.mp4','description'=>'Satu malam, satu kota, dan sebuah rahasia yang mengubah segalanya.','is_featured'=>false],
            ['title'=>'Silent Echoes','genre'=>'Thriller','year'=>2025,'rating'=>8.5,'duration'=>'1j 48m','category'=>'Popular','image_url'=>'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=700&q=85','video_url'=>'https://raw.githubusercontent.com/intel-iot-devkit/sample-videos/master/face-demographics-walking.mp4','description'=>'Seorang jurnalis menyelidiki suara-suara aneh yang terdengar dari sebuah desa terpencil.','is_featured'=>false],
            ['title'=>'Neon District','genre'=>'Crime','year'=>2023,'rating'=>7.9,'duration'=>'2j 01m','category'=>'Popular','image_url'=>'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=700&q=85','video_url'=>'/videos/sample.mp4','description'=>'Di kota yang tak pernah tidur, seorang detektif mengejar jaringan kriminal yang tak terlihat.','is_featured'=>false],
            ['title'=>'Wild Bloom','genre'=>'Drama','year'=>2024,'rating'=>8.1,'duration'=>'1j 42m','category'=>'New','image_url'=>'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=700&q=85','video_url'=>'/videos/sample.mp4','description'=>'Kepulangan ke kampung halaman membuka kembali kenangan dan kesempatan kedua.','is_featured'=>false],
            ['title'=>'Deep Blue','genre'=>'Adventure','year'=>2025,'rating'=>8.6,'duration'=>'1j 59m','category'=>'New','image_url'=>'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=700&q=85','video_url'=>'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4','description'=>'Ekspedisi laut dalam menemukan sesuatu yang seharusnya tidak pernah dibangunkan.','is_featured'=>false],
            ['title'=>'After the Storm','genre'=>'Drama','year'=>2022,'rating'=>7.8,'duration'=>'1j 51m','category'=>'Popular','image_url'=>'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=700&q=85','video_url'=>'/videos/sample.mp4','description'=>'Kisah tentang keluarga, kehilangan, dan keberanian untuk memulai lagi.','is_featured'=>false],
            ['title'=>'Red Signal','genre'=>'Action','year'=>2025,'rating'=>8.3,'duration'=>'2j 04m','category'=>'Trending','image_url'=>'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=700&q=85','video_url'=>'https://raw.githubusercontent.com/intel-iot-devkit/sample-videos/master/person-bicycle-car-detection.mp4','description'=>'Seorang mantan agen harus berpacu dengan waktu untuk mencegah ancaman besar.','is_featured'=>false],
        ];

        foreach ($movies as $movie) {
            Movie::updateOrCreate(['title' => $movie['title']], $movie);
        }
    }
}
