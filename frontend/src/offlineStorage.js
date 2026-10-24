// IndexedDB storage manager for offline video playback
const DB_NAME = 'NontonSantuyy_OfflineDB';
const DB_VERSION = 1;
const STORE_NAME = 'offline_videos';

function openDB() {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new Error('Browser ini tidak mendukung IndexedDB untuk penyimpanan offline.'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'movieId' });
        store.createIndex('downloadedAt', 'downloadedAt', { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveOfflineVideo(movie, blob) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);

    const record = {
      movieId: String(movie.id),
      title: movie.title,
      genre: movie.genre || 'Film',
      year: movie.year || 2025,
      duration: movie.duration || '—',
      image: movie.image || '',
      description: movie.description || '',
      rating: movie.rating || '8.0',
      blob: blob,
      mimeType: blob.type || 'video/mp4',
      sizeBytes: blob.size,
      sizeFormatted: formatBytes(blob.size),
      downloadedAt: new Date().toISOString(),
    };

    const req = store.put(record);
    req.onsuccess = () => resolve(record);
    req.onerror = () => reject(req.error);
  });
}

export async function getOfflineVideos() {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('Gagal membaca video offline:', err);
    return [];
  }
}

export async function getOfflineVideo(movieId) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(String(movieId));
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('Gagal mencari video offline:', err);
    return null;
  }
}

export async function deleteOfflineVideo(movieId) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.delete(String(movieId));
    req.onsuccess = () => resolve(true);
    req.onerror = () => reject(req.error);
  });
}

export function formatBytes(bytes) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}
