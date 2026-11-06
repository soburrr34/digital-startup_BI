import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Search, Play, Plus, Check, Menu, X, Clapperboard, ChevronRight,
  Film, Flame, Sparkles, Clock3, Info, Star, Send, Download,
  Trash2, HardDrive, Wifi, WifiOff, LogOut, CheckCircle, ChevronDown, Globe, Eye, EyeOff,
  LockKeyhole, UserPlus, LayoutDashboard, Users
} from 'lucide-react';
import './styles.css';
import {
  saveOfflineVideo,
  getOfflineVideos,
  getOfflineVideo,
  deleteOfflineVideo,
  formatBytes
} from './offlineStorage.js';

// SVG Logo Google resmi
function GoogleIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
      <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.99 0 12s.45 3.83 1.25 5.42l4.03-3.15z"/>
      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
    </svg>
  );
}

const fallbackMovies = [
  { id: 1, title: 'The Last Horizon', genre: 'Sci-Fi', year: 2025, rating: '8.8', duration: '2j 08m', category: 'Trending', image: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=900&q=85', videoUrl: '/videos/sample.mp4', description: 'Di ambang kehancuran bumi, sekelompok penjelajah menemukan sinyal misterius yang mungkin menjadi harapan terakhir umat manusia.' },
  { id: 2, title: 'Midnight Run', genre: 'Action', year: 2024, rating: '8.2', duration: '1j 54m', category: 'Trending', image: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=700&q=85', videoUrl: 'https://raw.githubusercontent.com/intel-iot-devkit/sample-videos/master/person-bicycle-car-detection.mp4', description: 'Satu malam, satu kota, dan sebuah rahasia yang mengubah segalanya.' },
  { id: 3, title: 'Silent Echoes', genre: 'Thriller', year: 2025, rating: '8.5', duration: '1j 48m', category: 'Popular', image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=700&q=85', videoUrl: 'https://raw.githubusercontent.com/intel-iot-devkit/sample-videos/master/face-demographics-walking.mp4', description: 'Seorang jurnalis menyelidiki suara-suara aneh yang terdengar dari sebuah desa terpencil.' },
  { id: 4, title: 'Neon District', genre: 'Crime', year: 2023, rating: '7.9', duration: '2j 01m', category: 'Popular', image: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=700&q=85', videoUrl: '/videos/sample.mp4', description: 'Di kota yang tak pernah tidur, seorang detektif mengejar jaringan kriminal yang tak terlihat.' },
  { id: 5, title: 'Wild Bloom', genre: 'Drama', year: 2024, rating: '8.1', duration: '1j 42m', category: 'New', image: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=700&q=85', videoUrl: '/videos/sample.mp4', description: 'Kepulangan ke kampung halaman membuka kembali kenangan dan kesempatan kedua.' },
  { id: 6, title: 'Deep Blue', genre: 'Adventure', year: 2025, rating: '8.6', duration: '1j 59m', category: 'New', image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=700&q=85', videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', description: 'Ekspedisi laut dalam menemukan sesuatu yang seharusnya tidak pernah dibangunkan.' },
  { id: 7, title: 'After the Storm', genre: 'Drama', year: 2022, rating: '7.8', duration: '1j 51m', category: 'Popular', image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=700&q=85', videoUrl: '/videos/sample.mp4', description: 'Kisah tentang keluarga, kehilangan, dan keberanian untuk memulai lagi.' },
  { id: 8, title: 'Red Signal', genre: 'Action', year: 2025, rating: '8.3', duration: '2j 04m', category: 'Trending', image: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=700&q=85', videoUrl: 'https://raw.githubusercontent.com/intel-iot-devkit/sample-videos/master/person-bicycle-car-detection.mp4', description: 'Seorang mantan agen harus berpacu dengan waktu untuk mencegah ancaman besar.' },
];

const genres = ['Semua', 'Action', 'Adventure', 'Crime', 'Drama', 'Sci-Fi', 'Thriller', 'Romance', 'Comedy', 'Horror'];
const reviewsStorageKey = 'dulsfilm-reviews';
const userStorageKey = 'nonton_santuyy_user';
const authTokenKey = 'nonton_santuyy_token';

const posterWallImages = [
  'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1518173946687-a4c8a383392e?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=400&q=80',
];

function readSavedReviews() {
  try {
    const saved = window.localStorage.getItem(reviewsStorageKey);
    return saved ? JSON.parse(saved) : {};
  } catch (error) {
    console.error('Gagal membaca rating dan komentar tersimpan:', error);
    return {};
  }
}

function readSavedUser() {
  try {
    const saved = window.localStorage.getItem(userStorageKey);
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.error('Gagal membaca user tersimpan:', error);
    return null;
  }
}

function getYoutubeId(url) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname === 'youtu.be') return parsed.pathname.slice(1);
    if (parsed.hostname.endsWith('youtube.com')) {
      if (parsed.pathname === '/watch') return parsed.searchParams.get('v');
      const match = parsed.pathname.match(/^\/(?:embed|shorts)\/([^/]+)/);
      return match?.[1] || null;
    }
  } catch {
    return null;
  }
  return null;
}

function EmailAuthModal({ isOpen, onClose, onLoginSuccess, initialEmail = '' }) {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (isOpen) { setEmail(initialEmail); setError(''); } }, [isOpen, initialEmail]);
  if (!isOpen) return null;

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    if (mode === 'register' && password !== confirmation) return setError('Konfirmasi password tidak sama.');
    setBusy(true);
    const apiBase = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api').replace(/\/$/, '');
    try {
      const response = await fetch(`${apiBase}/auth/${mode}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(mode === 'login' ? { email, password } : { name, email, password, password_confirmation: confirmation }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.message || Object.values(payload.errors || {}).flat()[0] || 'Autentikasi gagal.');
      onLoginSuccess(payload);
    } catch (err) {
      setError(err.message || 'Tidak dapat terhubung ke server.');
    } finally { setBusy(false); }
  };

  return <div className="modal-backdrop" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
    <div className="email-auth-modal" role="dialog" aria-modal="true" aria-label="Login Nonton Santuyy">
      <button className="modal-close" onClick={onClose} aria-label="Tutup"><X size={18} /></button>
      <div className="email-auth-icon"><LockKeyhole size={24} /></div>
      <h3>{mode === 'login' ? 'Masuk ke Nonton Santuyy' : 'Buat akun baru'}</h3>
      <p className="email-auth-subtitle">Gunakan email dan password. Sistem otomatis mengarahkan sesuai hak akses akun.</p>
      <form onSubmit={submit} className="email-auth-form">
        {mode === 'register' && <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama lengkap" required />}
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password (min. 6 karakter)" minLength={6} required />
        {mode === 'register' && <input type="password" value={confirmation} onChange={(e) => setConfirmation(e.target.value)} placeholder="Ulangi password" minLength={6} required />}
        {error && <div className="auth-error">{error}</div>}
        <button className="btn-primary auth-submit" disabled={busy}>{busy ? 'Memproses...' : mode === 'login' ? 'Masuk' : 'Daftar'}</button>
      </form>
      <button className="auth-switch" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}>
        {mode === 'login' ? 'Belum punya akun? Daftar sekarang' : 'Sudah punya akun? Masuk'}
      </button>
    </div>
  </div>;
}

function AdminDashboard({ user, movies, onMoviesChange, onLogout, onBack }) {
  const [form, setForm] = useState({ title: '', genre: 'Drama', year: new Date().getFullYear(), rating: 0, duration: '', category: 'New', image_url: '', video_url: '/videos/sample.mp4', description: '' });
  const [message, setMessage] = useState('');
  const apiBase = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api').replace(/\/$/, '');
  const headers = { 'Content-Type': 'application/json', Accept: 'application/json', Authorization: `Bearer ${window.localStorage.getItem(authTokenKey)}` };
  const saveMovie = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`${apiBase}/admin/movies`, { method: 'POST', headers, body: JSON.stringify(form) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Gagal menyimpan film.');
      onMoviesChange((current) => [data, ...current]);
      setForm({ ...form, title: '', description: '' }); setMessage('Film berhasil ditambahkan.');
    } catch (err) { setMessage(err.message); }
  };
  const deleteMovie = async (movie) => {
    if (!window.confirm(`Hapus film ${movie.title}?`)) return;
    const response = await fetch(`${apiBase}/admin/movies/${movie.id}`, { method: 'DELETE', headers });
    if (response.ok) { onMoviesChange((current) => current.filter((item) => item.id !== movie.id)); setMessage('Film dihapus.'); }
  };
  return <div className="admin-page">
    <header className="admin-topbar"><div className="admin-brand"><img src="/images/ns-logo.png" alt="NS" /> <span>ADMIN CONSOLE</span></div><div className="admin-user">{user.name} · {user.email}<button onClick={onLogout}><LogOut size={15} /> Keluar</button></div></header>
    <main className="admin-content"><div className="admin-heading"><div><p className="section-overline">NONTON SANTUYY</p><h1><LayoutDashboard size={28} /> Dashboard Admin</h1><p>Kelola katalog film dari satu tempat.</p></div><button className="btn-secondary" onClick={onBack}>Kembali ke katalog</button></div>
      <div className="admin-stats"><div><Film size={20} /><strong>{movies.length}</strong><span>Total Film</span></div><div><Users size={20} /><strong>—</strong><span>Pengguna</span></div><div><LockKeyhole size={20} /><strong>Aktif</strong><span>Akses Admin</span></div></div>
      <section className="admin-panel"><h2>Tambah Film</h2><form className="admin-movie-form" onSubmit={saveMovie}><input placeholder="Judul film" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /><input placeholder="Genre" value={form.genre} onChange={(e) => setForm({ ...form, genre: e.target.value })} required /><input type="number" placeholder="Tahun" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} required /><input placeholder="Durasi (contoh: 2j 08m)" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} /><input placeholder="URL poster" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} /><textarea placeholder="Sinopsis" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /><button className="btn-primary" type="submit">Tambah ke Katalog</button></form>{message && <p className="admin-message">{message}</p>}</section>
      <section className="admin-panel"><h2>Daftar Katalog</h2><div className="admin-movie-list">{movies.map((movie) => <div className="admin-movie-row" key={movie.id}><div><strong>{movie.title}</strong><span>{movie.year} · {movie.genre} · Rating {movie.rating}</span></div><button className="admin-delete" onClick={() => deleteMovie(movie)}><Trash2 size={15} /> Hapus</button></div>)}</div></section>
    </main>
  </div>;
}

function MovieVideo({ url, blobUrl, title, background = false }) {
  if (blobUrl) {
    return (
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        {!background && (
          <span className="offline-player-badge">
            <CheckCircle size={13} /> MODE OFFLINE (MEMORI LOKAL)
          </span>
        )}
        <video
          className={background ? 'hero-video' : 'modal-video'}
          src={blobUrl}
          autoPlay
          muted={background}
          loop={background}
          controls={!background}
          playsInline
          aria-label={title}
        />
      </div>
    );
  }

  const effectiveUrl = url || '/videos/sample.mp4';
  const youtubeId = getYoutubeId(effectiveUrl);

  if (youtubeId) {
    const params = new URLSearchParams({
      autoplay: '1',
      controls: background ? '0' : '1',
      mute: background ? '1' : '0',
      loop: '1',
      playlist: youtubeId,
      playsinline: '1',
    });
    return (
      <iframe
        className={background ? 'hero-video' : 'modal-video'}
        src={`https://www.youtube.com/embed/${youtubeId}?${params}`}
        title={title}
        allow="autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
      />
    );
  }

  return (
    <video
      className={background ? 'hero-video' : 'modal-video'}
      src={effectiveUrl}
      autoPlay
      muted={background}
      loop={background}
      controls={!background}
      playsInline
      aria-label={title}
    />
  );
}

// Dialog Modal Pilihan Akun Google
function GoogleAuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');
  const [googleClientId, setGoogleClientId] = useState(
    () => window.localStorage.getItem('google_client_id') || import.meta.env.VITE_GOOGLE_CLIENT_ID || ''
  );
  const [showConfig, setShowConfig] = useState(false);

  const demoAccounts = [
    {
      name: 'Budi Santoso',
      email: 'budi.santoso@gmail.com',
      picture: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
    },
    {
      name: 'Siti Rahmawati',
      email: 'siti.rahmawati@gmail.com',
      picture: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
    },
    {
      name: 'Duls Cinema Club',
      email: 'duls.reviewer@gmail.com',
      picture: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80',
    },
  ];

  useEffect(() => {
    if (!isOpen) return;

    if (window.google?.accounts?.id && googleClientId) {
      try {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: (response) => {
            try {
              const base64Url = response.credential.split('.')[1];
              const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
              const jsonPayload = decodeURIComponent(
                atob(base64)
                  .split('')
                  .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                  .join('')
              );
              const data = JSON.parse(jsonPayload);
              onLoginSuccess({
                id: data.sub || Date.now().toString(),
                name: data.name || 'Pengguna Google',
                email: data.email || 'user@gmail.com',
                picture: data.picture || '',
                isGoogle: true,
              });
              onClose();
            } catch (err) {
              console.error('Gagal decode Google JWT:', err);
            }
          },
        });

        const btnContainer = document.getElementById('gsi-official-button');
        if (btnContainer) {
          window.google.accounts.id.renderButton(btnContainer, {
            theme: 'filled_black',
            size: 'large',
            shape: 'rectangular',
            text: 'signin_with',
            locale: 'id',
          });
        }
      } catch (err) {
        console.warn('Google Identity initialization failed or skipped:', err);
      }
    }
  }, [isOpen, googleClientId]);

  if (!isOpen) return null;

  const handleSelectDemo = (acc) => {
    onLoginSuccess({
      id: `google-${Date.now()}`,
      name: acc.name,
      email: acc.email,
      picture: acc.picture,
      isGoogle: true,
    });
    onClose();
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customName.trim()) return;
    const email = customEmail.trim() || `${customName.toLowerCase().replace(/\s+/g, '')}@gmail.com`;
    onLoginSuccess({
      id: `google-${Date.now()}`,
      name: customName.trim(),
      email: email,
      picture: '',
      isGoogle: true,
    });
    onClose();
  };

  const handleSaveClientId = (e) => {
    e.preventDefault();
    window.localStorage.setItem('google_client_id', googleClientId.trim());
    setShowConfig(false);
  };

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="google-auth-modal" role="dialog" aria-modal="true" aria-label="Login dengan Google">
        <button className="modal-close" onClick={onClose} aria-label="Tutup"><X size={18} /></button>

        <div className="google-auth-header">
          <GoogleIcon size={36} />
          <h3>Login dengan Google</h3>
          <p>Pilih akun Google Anda untuk memberi rating &amp; komentar film di Nonton Santuyy.</p>
        </div>

        {/* Wadah tombol Google resmi jika client id terkonfigurasi */}
        <div id="gsi-official-button" style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}></div>

        <div className="google-account-list">
          {demoAccounts.map((acc) => (
            <button key={acc.email} className="google-account-item" onClick={() => handleSelectDemo(acc)}>
              <img src={acc.picture} alt={acc.name} />
              <div className="google-account-info">
                <strong>{acc.name}</strong>
                <span>{acc.email}</span>
              </div>
            </button>
          ))}
        </div>

        <form className="google-custom-login" onSubmit={handleCustomSubmit}>
          <p>Atau gunakan akun Google kustom Anda:</p>
          <div className="google-input-row">
            <input
              type="text"
              placeholder="Nama lengkap Anda (cth: Dul Film)"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Alamat email Google (opsional)"
              value={customEmail}
              onChange={(e) => setCustomEmail(e.target.value)}
            />
            <button type="submit" className="google-login-btn" style={{ justifyContent: 'center', marginTop: 4 }}>
              <GoogleIcon size={16} /> Masuk dengan Akun Ini
            </button>
          </div>
        </form>

        <div style={{ marginTop: 14, textAlign: 'center' }}>
          <button
            type="button"
            className="text-link"
            style={{ fontSize: 11, margin: '0 auto' }}
            onClick={() => setShowConfig((v) => !v)}
          >
            ⚙️ {showConfig ? 'Sembunyikan Pengaturan Google OAuth' : 'Pengaturan Google Client ID Asli'}
          </button>
        </div>

        {showConfig && (
          <form onSubmit={handleSaveClientId} style={{ marginTop: 10, background: '#111', padding: 10, borderRadius: 6 }}>
            <label style={{ fontSize: 11, color: '#888', display: 'block', marginBottom: 4 }}>
              Google Cloud OAuth Client ID:
            </label>
            <input
              type="text"
              style={{ width: '100%', padding: '6px 8px', fontSize: 11, background: '#1e1e22', border: '1px solid #333', color: '#fff', borderRadius: 4 }}
              value={googleClientId}
              onChange={(e) => setGoogleClientId(e.target.value)}
              placeholder="xxxx-xxxx.apps.googleusercontent.com"
            />
            <button type="submit" className="btn-secondary" style={{ marginTop: 6, minHeight: 28, fontSize: 11, width: '100%' }}>
              Simpan Client ID
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function App() {
  const [movies, setMovies] = useState(fallbackMovies);
  const [apiStatus, setApiStatus] = useState('loading');
  const [query, setQuery] = useState('');
  const [genre, setGenre] = useState('Semua');
  const [activeTab, setActiveTab] = useState('Beranda');
  const [selected, setSelected] = useState(null);
  const [selectedBlobUrl, setSelectedBlobUrl] = useState(null);
  const [watchlist, setWatchlist] = useState([]);
  const [reviews, setReviews] = useState(readSavedReviews);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [mobileMenu, setMobileMenu] = useState(false);
  const [notice, setNotice] = useState('');
  const [heroEmail, setHeroEmail] = useState('');
  const [heroPassword, setHeroPassword] = useState('');
  const [heroName, setHeroName] = useState('');
  const [heroPasswordConfirmation, setHeroPasswordConfirmation] = useState('');
  const [showHeroPassword, setShowHeroPassword] = useState(false);
  const [showHeroPasswordConfirmation, setShowHeroPasswordConfirmation] = useState(false);
  const [mainAuthMode, setMainAuthMode] = useState('login');
  const [heroAuthError, setHeroAuthError] = useState('');
  const [heroAuthBusy, setHeroAuthBusy] = useState(false);

  // Fitur Login Google
  const [user, setUser] = useState(readSavedUser);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isEmailAuthOpen, setIsEmailAuthOpen] = useState(false);
  const [authEmail, setAuthEmail] = useState('');
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  // Fitur Offline & Unduhan
  const [offlineVideos, setOfflineVideos] = useState([]);
  const [downloadProgress, setDownloadProgress] = useState({}); // { [movieId]: { percent, status } }
  const [isOnline, setIsOnline] = useState(() => (typeof navigator !== 'undefined' ? navigator.onLine : true));
  const [isScrolled, setIsScrolled] = useState(false);

  // Halaman aktif: 'landing' (Halaman Login / Depan) atau 'browse' (Halaman Nonton / Film)
  const [currentView, setCurrentView] = useState(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#browse' || hash === '#film' || hash === '#catalog') return 'browse';
      if (hash === '#admin') return 'admin';
      if (hash === '#login' || hash === '#landing') return 'landing';
      const savedUser = readSavedUser();
      return savedUser ? (savedUser.role === 'admin' ? 'admin' : 'browse') : 'landing';
    }
    return 'landing';
  });

  const navigateTo = (view) => {
    setCurrentView(view);
    if (typeof window !== 'undefined') {
      window.location.hash = view === 'browse' ? '#browse' : view === 'admin' ? '#admin' : '#login';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#browse' || hash === '#film' || hash === '#catalog') {
        setCurrentView('browse');
      } else if (hash === '#admin') {
        setCurrentView('admin');
      } else if (hash === '#login' || hash === '#landing') {
        setCurrentView('landing');
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Simpan user ke localStorage jika berubah
  const handleLoginSuccess = (userData) => {
    const loggedInUser = userData.user || userData;
    setUser(loggedInUser);
    try {
      window.localStorage.setItem(userStorageKey, JSON.stringify(loggedInUser));
      if (userData.token) window.localStorage.setItem(authTokenKey, userData.token);
    } catch (e) {
      console.warn('Gagal simpan user ke local storage:', e);
    }
    setIsAuthModalOpen(false);
    navigateTo(loggedInUser.role === 'admin' ? 'admin' : 'browse');
    setNotice(`Selamat datang, ${loggedInUser.name}!`);
    window.setTimeout(() => setNotice(''), 3000);
  };

  const handleMainLogin = async (event) => {
    event.preventDefault();
    setHeroAuthError('');
    setHeroAuthBusy(true);
    const apiBase = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api').replace(/\/$/, '');
    try {
      if (mainAuthMode === 'register' && heroPassword !== heroPasswordConfirmation) {
        throw new Error('Konfirmasi password tidak sama.');
      }
      const response = await fetch(`${apiBase}/auth/${mainAuthMode === 'register' ? 'register' : 'login'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(mainAuthMode === 'register'
          ? { name: heroName, email: heroEmail, password: heroPassword, password_confirmation: heroPasswordConfirmation }
          : { email: heroEmail, password: heroPassword }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.message || Object.values(payload.errors || {}).flat()[0] || 'Email atau password salah.');
      handleLoginSuccess(payload);
      setHeroPassword('');
    } catch (error) {
      setHeroAuthError(error.message || 'Login gagal. Pastikan server aktif.');
    } finally {
      setHeroAuthBusy(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    try {
      window.localStorage.removeItem(userStorageKey);
      window.localStorage.removeItem(authTokenKey);
    } catch (e) {
      console.warn('Gagal hapus user:', e);
    }
    setIsProfileMenuOpen(false);
    navigateTo('landing');
    setNotice('Kamu telah keluar dari akun.');
    window.setTimeout(() => setNotice(''), 2500);
  };

  // Muat daftar film yang telah diunduh offline pada startup
  useEffect(() => {
    getOfflineVideos().then((list) => {
      setOfflineVideos(list);
    });

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Simpan ulasan ke localStorage
  useEffect(() => {
    try {
      window.localStorage.setItem(reviewsStorageKey, JSON.stringify(reviews));
    } catch (error) {
      console.error('Gagal menyimpan rating dan komentar:', error);
    }
  }, [reviews]);

  // Fetch movies dari API backend Laravel (jika tersedia)
  useEffect(() => {
    const apiBase = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api').replace(/\/$/, '');
    const controller = new AbortController();

    fetch(`${apiBase}/movies`, { signal: controller.signal, headers: { Accept: 'application/json' } })
      .then((response) => {
        if (!response.ok) throw new Error(`API error ${response.status}`);
        return response.json();
      })
      .then((payload) => {
        const rows = Array.isArray(payload) ? payload : (payload.data || []);
        if (rows.length) {
          setMovies(
            rows.map((movie) => ({
              id: movie.id,
              title: movie.title,
              genre: movie.genre || 'Drama',
              year: Number(movie.year || new Date().getFullYear()),
              rating: String(movie.rating ?? '0.0'),
              duration: movie.duration || '—',
              category: movie.category || 'Popular',
              image: movie.image || movie.image_url || '',
              description: movie.description || 'Belum ada sinopsis.',
              videoUrl: movie.video_url || movie.videoUrl || '/videos/sample.mp4',
            }))
          );
          setApiStatus('connected');
        } else {
          setMovies(fallbackMovies);
          setApiStatus('connected');
        }
      })
      .catch((error) => {
        if (error.name !== 'AbortError') {
          setApiStatus('fallback');
          setMovies(fallbackMovies);
        }
      });

    return () => controller.abort();
  }, []);

  // Filter film berdasarkan genre & pencarian
  const filtered = useMemo(() => {
    return movies.filter(
      (m) =>
        (genre === 'Semua' || m.genre === genre) &&
        `${m.title} ${m.genre} ${m.year}`.toLowerCase().includes(query.toLowerCase())
    );
  }, [movies, genre, query]);

  const toggleWatchlist = (movie) => {
    setWatchlist((prev) =>
      prev.includes(movie.id) ? prev.filter((id) => id !== movie.id) : [...prev, movie.id]
    );
    setNotice(watchlist.includes(movie.id) ? 'Dihapus dari daftar saya' : 'Ditambahkan ke daftar saya');
    window.setTimeout(() => setNotice(''), 2200);
  };

  const featuredMovie = movies.find((movie) => movie.category === 'Trending') || movies[0];

  // Fungsi Download Video Offline
  const handleDownloadMovie = async (movie) => {
    const movieId = String(movie.id);

    // Cek apakah sudah terunduh
    const isDownloaded = offlineVideos.some((item) => String(item.movieId) === movieId);
    if (isDownloaded) {
      setNotice(`Film "${movie.title}" sudah tersimpan di unduhan offline.`);
      window.setTimeout(() => setNotice(''), 2500);
      return;
    }

    const videoSrc = movie.videoUrl || '/videos/sample.mp4';

    try {
      setDownloadProgress((prev) => ({
        ...prev,
        [movieId]: { percent: 15, status: 'Menghubungkan ke server video...' },
      }));

      // Fetch video stream/blob
      const response = await fetch(videoSrc);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      setDownloadProgress((prev) => ({
        ...prev,
        [movieId]: { percent: 50, status: 'Mengunduh file video...' },
      }));

      const blob = await response.blob();

      setDownloadProgress((prev) => ({
        ...prev,
        [movieId]: { percent: 85, status: 'Menyimpan ke memori offline...' },
      }));

      // Simpan ke IndexedDB
      const savedRecord = await saveOfflineVideo(movie, blob);

      // Juga trigger browser file download agar tersimpan di folder Unduhan komputer/HP
      try {
        const fileUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = fileUrl;
        const cleanTitle = movie.title.replace(/[^a-zA-Z0-9_\-]/g, '_');
        link.download = `${cleanTitle}.mp4`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (dlErr) {
        console.warn('Browser direct download skipped:', dlErr);
      }

      setDownloadProgress((prev) => ({
        ...prev,
        [movieId]: { percent: 100, status: 'Selesai!' },
      }));

      // Perbarui state offline videos
      setOfflineVideos((prev) => [savedRecord, ...prev.filter((i) => i.movieId !== movieId)]);

      setNotice(`✓ "${movie.title}" berhasil diunduh! Sekarang bisa ditonton secara offline.`);
      window.setTimeout(() => {
        setDownloadProgress((prev) => {
          const next = { ...prev };
          delete next[movieId];
          return next;
        });
        setNotice('');
      }, 3500);
    } catch (err) {
      console.error('Gagal mengunduh video:', err);
      setDownloadProgress((prev) => ({
        ...prev,
        [movieId]: { percent: 0, status: 'Gagal mengunduh. Coba lagi nanti.' },
      }));
      setNotice(`Gagal mengunduh video "${movie.title}".`);
      window.setTimeout(() => {
        setDownloadProgress((prev) => {
          const next = { ...prev };
          delete next[movieId];
          return next;
        });
        setNotice('');
      }, 3500);
    }
  };

  const handleDeleteDownloaded = async (movieId, title) => {
    try {
      await deleteOfflineVideo(movieId);
      setOfflineVideos((prev) => prev.filter((i) => String(i.movieId) !== String(movieId)));
      if (selected && String(selected.id) === String(movieId)) {
        setSelectedBlobUrl(null);
      }
      setNotice(`Unduhan film "${title}" berhasil dihapus.`);
      window.setTimeout(() => setNotice(''), 2500);
    } catch (err) {
      console.error('Gagal menghapus unduhan:', err);
    }
  };

  // Buka detail film (jika tersimpan offline, load blobUrl-nya)
  const openMovie = async (movie) => {
    if (!movie) return;
    setReviewRating(0);
    setReviewComment('');
    setSelected(movie);

    // Cek apakah ada blob offline di IndexedDB
    const offlineRec = await getOfflineVideo(movie.id);
    if (offlineRec?.blob) {
      setSelectedBlobUrl(URL.createObjectURL(offlineRec.blob));
    } else {
      setSelectedBlobUrl(null);
    }
  };

  // Kirim ulasan (hanya jika sudah login Google)
  const submitReview = (event) => {
    event.preventDefault();
    if (!selected) return;

    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    if (reviewRating < 1 || reviewRating > 5) return;

    const entry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      rating: reviewRating,
      comment: reviewComment.trim(),
      author: user.name || 'Pengguna Google',
      email: user.email || '',
      avatar: user.picture || '',
      isGoogleUser: true,
      createdAt: new Date().toISOString(),
    };

    const movieIdKey = String(selected.id);
    setReviews((current) => ({
      ...current,
      [movieIdKey]: [entry, ...(current[movieIdKey] || [])],
    }));

    // Coba kirim ke API Laravel jika tersambung
    const apiBase = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api').replace(/\/$/, '');
    fetch(`${apiBase}/movies/${selected.id}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        author: entry.author,
        email: entry.email,
        avatar: entry.avatar,
        rating: entry.rating,
        comment: entry.comment,
      }),
    }).catch(() => {
      // Disimpan lokal di browser dengan aman
    });

    setReviewRating(0);
    setReviewComment('');
    setNotice('Terima kasih! Rating dan ulasan Google kamu berhasil dipublikasikan.');
    window.setTimeout(() => setNotice(''), 3000);
  };

  const deleteReview = (movieId, reviewId) => {
    const key = String(movieId);
    setReviews((current) => ({
      ...current,
      [key]: (current[key] || []).filter((r) => r.id !== reviewId),
    }));
    setNotice('Ulasan telah dihapus.');
    window.setTimeout(() => setNotice(''), 2000);
  };

  const selectedReviews = selected ? reviews[String(selected.id)] || [] : [];
  const reviewAverage = selectedReviews.length
    ? (selectedReviews.reduce((sum, review) => sum + review.rating, 0) / selectedReviews.length).toFixed(1)
    : null;

  const scrollToCatalog = () => document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });

  // Total ukuran memori offline
  const totalOfflineBytes = offlineVideos.reduce((acc, curr) => acc + (curr.sizeBytes || 0), 0);

  if (currentView === 'admin' && user?.role === 'admin') {
    return <AdminDashboard user={user} movies={movies} onMoviesChange={setMovies} onLogout={handleLogout} onBack={() => navigateTo('browse')} />;
  }

  return (
    <div className="app-shell">
      {/* Banner Deteksi Offline */}
      {!isOnline && (
        <div className="offline-banner">
          <WifiOff size={16} />
          <span>Anda sedang dalam Mode Offline. Video yang telah diunduh tetap dapat ditonton di tab Unduhan.</span>
          <button onClick={() => { setActiveTab('Unduhan'); scrollToCatalog(); }}>
            Buka Unduhan ({offlineVideos.length})
          </button>
        </div>
      )}

      {/* Tampilan Terpisah 1: Halaman Landing / Login Standalone */}
      {currentView === 'landing' ? (
        <div className="landing-page-view">
          {/* Topbar Landing */}
          <header className="topbar topbar-landing">
            <a
              className="netflix-brand-title"
              href="#login"
              aria-label="Nonton Santuyy"
              onClick={(e) => { e.preventDefault(); navigateTo('landing'); }}
            >
              NONTONSANTUY
            </a>

            <div className="top-actions">
              {user?.role === 'admin' && (
                <button className="admin-entry-btn" onClick={() => navigateTo('admin')}>
                  <LayoutDashboard size={14} /> Dashboard Admin
                </button>
              )}
              <div className="netflix-lang-picker" title="Pilih Bahasa">
                <Globe size={15} />
                <span>Indonesia</span>
                <ChevronDown size={13} />
              </div>

              <button
                className="netflix-top-masuk-btn"
                onClick={() => { setMainAuthMode('login'); document.getElementById('main-login-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' }); }}
                aria-label="Masuk ke Akun"
              >
                Masuk
              </button>
              <button
                className="admin-login-btn"
                onClick={() => { setMainAuthMode('register'); setHeroName(''); setHeroEmail(''); setHeroPassword(''); setHeroPasswordConfirmation(''); document.getElementById('main-login-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' }); }}
                aria-label="Daftar Akun"
              >
                Daftar Akun
              </button>
            </div>
          </header>

          {/* Hero Section Landing ala Netflix dengan Logo NS di Tengah */}
          <main className={`netflix-hero-section landing-hero-standalone main-auth-${mainAuthMode}`}>
            {/* Tilted Collage Poster Wall Background */}
            <div className="netflix-poster-wall" aria-hidden="true">
              {posterWallImages.map((src, idx) => (
                <div
                  key={idx}
                  className="netflix-poster-item"
                  style={{ backgroundImage: `url("${src}")` }}
                />
              ))}
            </div>

            {/* Vignette Overlay Latar Biru NS */}
            <div className="netflix-hero-overlay" />

            {/* Center Card: Logo NS Simpel & Elegan */}
            <div className="netflix-center-card">
              <div className="ns-hero-logo-wrap">
                <img src="/images/ns-logo.png" alt="NS Logo" className="ns-hero-logo" />
                <div className="ns-logo-aura" />
              </div>

              <p className="netflix-subhead-2">
                Masukkan email dan password untuk masuk sebagai user atau admin.
              </p>

              <div className="netflix-cta-container">
                <form
                  className={`netflix-form ${mainAuthMode === 'register' ? 'register-mode' : ''}`}
                  id="main-login-form"
                  onSubmit={handleMainLogin}
                >
                  {mainAuthMode === 'register' && <input type="text" placeholder="Nama lengkap" value={heroName} onChange={(e) => setHeroName(e.target.value)} required />}
                  <input
                    type="email"
                    placeholder="Alamat email"
                    value={heroEmail}
                    onChange={(e) => setHeroEmail(e.target.value)}
                    aria-label="Alamat email"
                    required
                  />
                  <div className="password-input-wrap">
                    <input
                      type={showHeroPassword ? 'text' : 'password'}
                      placeholder="Password"
                      value={heroPassword}
                      onChange={(e) => setHeroPassword(e.target.value)}
                      aria-label="Password"
                      minLength={6}
                      required
                    />
                    <button type="button" className="password-visibility-btn" onClick={() => setShowHeroPassword((value) => !value)} aria-label={showHeroPassword ? 'Sembunyikan password' : 'Tampilkan password'}>
                      {showHeroPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {mainAuthMode === 'register' && <div className="password-input-wrap"><input type={showHeroPasswordConfirmation ? 'text' : 'password'} placeholder="Ulangi password" value={heroPasswordConfirmation} onChange={(e) => setHeroPasswordConfirmation(e.target.value)} minLength={6} required /><button type="button" className="password-visibility-btn" onClick={() => setShowHeroPasswordConfirmation((value) => !value)} aria-label={showHeroPasswordConfirmation ? 'Sembunyikan konfirmasi password' : 'Tampilkan konfirmasi password'}>{showHeroPasswordConfirmation ? <EyeOff size={18} /> : <Eye size={18} />}</button></div>}
                  <button type="submit" className="netflix-submit-btn">
                    <span>{heroAuthBusy ? 'Memproses...' : mainAuthMode === 'register' ? 'Daftar' : 'Masuk'}</span>
                    <ChevronRight size={26} />
                  </button>
                </form>

                {heroAuthError && <p className="main-login-error">{heroAuthError}</p>}

                <div className="netflix-center-extra">
                  <button
                    type="button"
                    className="netflix-google-quick"
                    onClick={() => setIsAuthModalOpen(true)}
                  >
                    <GoogleIcon size={16} />
                    <span>Login dengan Akun Google</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Garis Busur Lengkung Bawah ala Netflix */}
            <div className="netflix-arc-curve" />
          </main>

          {/* Footer Khusus Halaman Depan / Landing */}
          <footer className="landing-footer">
            <div className="landing-footer-inner">
              <p className="landing-footer-help">Ada pertanyaan? Hubungi kami melalui layanan komunitas Nonton Santuyy.</p>
              <div className="landing-footer-grid">
                <a href="#" onClick={(e) => { e.preventDefault(); setNotice('Pusat Bantuan: Hubungi support@nontonsantuy.id'); window.setTimeout(() => setNotice(''), 3000); }}>Pusat Bantuan</a>
                <a href="#" onClick={(e) => { e.preventDefault(); setIsAuthModalOpen(true); }}>Masuk dengan Google</a>
                <a href="#" onClick={(e) => { e.preventDefault(); setNotice('Nonton Santuyy adalah layanan hiburan gratis tanpa biaya berlangganan.'); window.setTimeout(() => setNotice(''), 3000); }}>Ketentuan Penggunaan</a>
                <a href="#" onClick={(e) => { e.preventDefault(); setNotice('Privasi Anda aman bersama Nonton Santuyy.'); window.setTimeout(() => setNotice(''), 3000); }}>Kebijakan Privasi</a>
              </div>
              <p className="landing-footer-copy">© 2026 Nonton Santuyy. Hak Cipta Dilindungi. 100% Gratis Tanpa Biaya Berlangganan.</p>
            </div>
          </footer>
        </div>
      ) : (
        /* Tampilan Terpisah 2: Halaman Nonton / Film (Streaming App) */
        <div className="movie-page-view">
          {/* Topbar Navigasi Halaman Film */}
          <header className="topbar topbar-browse">
            <button
              className="brand"
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              onClick={() => { setActiveTab('Beranda'); setGenre('Semua'); setQuery(''); }}
              aria-label="Nonton Santuyy beranda"
            >
              <span className="brand-mark-ns" style={{ width: 34, height: 34 }}>
                <img src="/images/ns-logo.png" alt="NS Logo" className="ns-logo-icon" />
              </span>
              <span className="netflix-brand-title" style={{ fontSize: 26 }}>NONTONSANTUY</span>
            </button>

            <nav className={`nav-links ${mobileMenu ? 'nav-open' : ''}`}>
              {['Beranda', 'Film', 'Genre', 'Daftar Saya', 'Unduhan'].map((item) => (
                <button
                  key={item}
                  className={activeTab === item ? 'nav-item active' : 'nav-item'}
                  onClick={() => {
                    setActiveTab(item);
                    setMobileMenu(false);
                    if (item === 'Daftar Saya' || item === 'Unduhan') setQuery('');
                    if (item === 'Genre') {
                      document.getElementById('genre-picker')?.scrollIntoView({ behavior: 'smooth' });
                    } else {
                      scrollToCatalog();
                    }
                  }}
                >
                  {item}
                  {item === 'Unduhan' && offlineVideos.length > 0 && (
                    <span className="nav-badge">{offlineVideos.length}</span>
                  )}
                  {item === 'Daftar Saya' && watchlist.length > 0 && (
                    <span className="nav-badge nav-badge-red">{watchlist.length}</span>
                  )}
                </button>
              ))}
            </nav>

            <div className="top-actions">
              <label className="search-box">
                <Search size={17} />
                <input
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setActiveTab('Film'); }}
                  placeholder="Cari film..."
                  aria-label="Cari film"
                />
                <kbd>⌕</kbd>
              </label>

              {user ? (
                <div className="profile-btn-wrap">
                  <button
                    className="user-profile-btn"
                    onClick={() => setIsProfileMenuOpen((v) => !v)}
                    aria-label="Menu Profil Google"
                  >
                    {user.picture ? (
                      <img src={user.picture} alt={user.name} className="user-avatar-img" />
                    ) : (
                      <div className="user-avatar-fallback">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="user-name-short">{user.name.split(' ')[0]}</span>
                    <ChevronDown size={14} />
                  </button>

                  {isProfileMenuOpen && (
                    <div className="profile-dropdown">
                      <div className="profile-dropdown-user">
                        {user.picture ? (
                          <img src={user.picture} alt={user.name} className="user-avatar-img" style={{ width: 38, height: 38 }} />
                        ) : (
                          <div className="user-avatar-fallback" style={{ width: 38, height: 38, fontSize: 15 }}>
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <h4>{user.name}</h4>
                          <p>{user.email}</p>
                          <span className="google-badge"><GoogleIcon size={12} /> Akun Google Terverifikasi</span>
                        </div>
                      </div>

                      <div className="profile-menu-links">
                        {user.role === 'admin' && <button className="profile-menu-item" onClick={() => { navigateTo('admin'); setIsProfileMenuOpen(false); }}><LayoutDashboard size={15} color="#dfb76c" /> Dashboard Admin</button>}
                        <button
                          className="profile-menu-item"
                          onClick={() => { setActiveTab('Unduhan'); setIsProfileMenuOpen(false); scrollToCatalog(); }}
                        >
                          <Download size={15} color="#22c55e" /> Film Offline ({offlineVideos.length})
                        </button>
                        <button
                          className="profile-menu-item"
                          onClick={() => { setActiveTab('Daftar Saya'); setIsProfileMenuOpen(false); scrollToCatalog(); }}
                        >
                          <Plus size={15} color="#c59d62" /> Daftar Saya ({watchlist.length})
                        </button>
                        <button
                          className="profile-menu-item"
                          onClick={() => { navigateTo('landing'); setIsProfileMenuOpen(false); }}
                        >
                          <Globe size={15} color="#dfb76c" /> Halaman Depan / Login
                        </button>
                      </div>

                      <button className="profile-logout-btn" onClick={handleLogout}>
                        <LogOut size={14} /> Keluar Akun Google
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button
                    className="netflix-top-masuk-btn"
                    style={{ padding: '6px 14px', fontSize: 12.5 }}
                    onClick={() => { setAuthEmail(''); setIsEmailAuthOpen(true); }}
                    aria-label="Masuk"
                  >
                    Masuk
                  </button>
                  <button
                    className="nav-return-login-btn"
                    onClick={() => navigateTo('landing')}
                    title="Kembali ke Halaman Login"
                  >
                    Halaman Login
                  </button>
                </div>
              )}

              <button
                className="mobile-menu"
                onClick={() => setMobileMenu((v) => !v)}
                aria-label="Buka menu navigasi"
              >
                {mobileMenu ? <X /> : <Menu />}
              </button>
            </div>
          </header>

          <main id="top">
            {/* Spotlight Hero Film Pilihan Populer */}
            {activeTab !== 'Unduhan' && !query && (
              <section className="hero">
                <div
                  className="hero-image"
                  style={{ backgroundImage: `url("${featuredMovie.image}")` }}
                  aria-hidden="true"
                />
                <div className="hero-shade" aria-hidden="true" />

                <div className="hero-content">
                  <div className="eyebrow">
                    <span className="live-dot" />
                    <span>FILM PILIHAN HARI INI</span>
                    <span className="eyebrow-line" />
                  </div>

                  <h1>{featuredMovie.title}</h1>

                  <div className="hero-meta">
                    <span className="rating">★ {featuredMovie.rating}</span>
                    <span className="maturity">13+</span>
                    <span className="quality">ULTRA HD 4K</span>
                    <span>{featuredMovie.year}</span>
                    <span>{featuredMovie.duration}</span>
                    <span className="genre-chip" style={{ padding: '2px 8px', fontSize: 10 }}>{featuredMovie.genre}</span>
                  </div>

                  <p className="hero-description">{featuredMovie.description}</p>

                  <div className="hero-buttons">
                    <button className="btn-primary" onClick={() => openMovie(featuredMovie)}>
                      <Play size={18} fill="currentColor" /> Putar Film
                    </button>
                    <button
                      className="btn-secondary"
                      onClick={() => toggleWatchlist(featuredMovie)}
                    >
                      {watchlist.includes(featuredMovie.id) ? (
                        <><Check size={16} /> Dalam Daftar</>
                      ) : (
                        <><Plus size={16} /> Daftar Saya</>
                      )}
                    </button>
                    <button
                      className={`download-action-btn ${offlineVideos.some((i) => String(i.movieId) === String(featuredMovie.id)) ? 'downloaded' : ''}`}
                      onClick={() => handleDownloadMovie(featuredMovie)}
                    >
                      <Download size={16} /> {offlineVideos.some((i) => String(i.movieId) === String(featuredMovie.id)) ? 'Tersimpan Offline' : 'Unduh Offline'}
                    </button>
                  </div>
                </div>
              </section>
            )}

        {/* Tab Khusus: Unduhan Offline */}
        {activeTab === 'Unduhan' && (
          <section className="downloads-section" id="catalog">
            <div className="section-heading">
              <div>
                <div className="section-overline"><Download size={14} color="#22c55e" /> PERPUSTAKAAN OFFLINE</div>
                <h2>Film Unduhan Saya<span className="heading-period">.</span></h2>
                <p className="section-subtitle">Tonton video favoritmu kapan saja tanpa perlu kuota atau koneksi internet.</p>
              </div>
            </div>

            <div className="storage-overview-card">
              <div className="storage-overview-left">
                <div className="storage-icon-circle"><HardDrive size={22} /></div>
                <div>
                  <h4>Status Penyimpanan Offline</h4>
                  <p>
                    {offlineVideos.length} film tersimpan di browser · Total ukuran:{' '}
                    <strong>{formatBytes(totalOfflineBytes)}</strong>
                  </p>
                </div>
              </div>
              <div className="storage-overview-right">
                <span className="google-badge" style={{ color: '#22c55e', borderColor: '#22c55e' }}>
                  <WifiOff size={13} /> Siap Tonton Tanpa Kuota
                </span>
              </div>
            </div>

            {offlineVideos.length > 0 ? (
              <div className="movie-grid">
                {offlineVideos.map((rec, i) => {
                  const movieObj = movies.find((m) => String(m.id) === String(rec.movieId)) || {
                    id: rec.movieId,
                    title: rec.title,
                    genre: rec.genre,
                    year: rec.year,
                    rating: rec.rating,
                    duration: rec.duration,
                    image: rec.image,
                    description: rec.description,
                  };
                  return (
                    <article key={rec.movieId} className="movie-card" style={{ '--card-index': i }}>
                      <button className="poster-button" onClick={() => openMovie(movieObj)} aria-label={`Tonton ${rec.title}`}>
                        <div
                          className="poster"
                          style={{
                            backgroundImage: `linear-gradient(0deg,rgba(0,0,0,.85) 0%,rgba(0,0,0,0) 55%),url(${rec.image || 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=700&q=85'})`,
                          }}
                        >
                          <span className="poster-offline-tag"><Check size={11} strokeWidth={3} /> OFFLINE</span>
                          <span className="poster-play"><Play size={20} fill="currentColor" /></span>
                          <span className="poster-title">{rec.title}</span>
                        </div>
                      </button>

                      <div className="movie-card-info">
                        <div>
                          <h3>{rec.title}</h3>
                          <p>{rec.year} <span>•</span> {rec.genre} <span>•</span> {rec.sizeFormatted}</p>
                        </div>
                        <button
                          className="card-download-btn downloaded"
                          onClick={() => handleDeleteDownloaded(rec.movieId, rec.title)}
                          title="Hapus file unduhan offline"
                          aria-label="Hapus unduhan"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div className="card-bottom">
                        <span className="card-rating">★ {rec.rating}</span>
                        <span><Clock3 size={12} /> {rec.duration}</span>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="empty-state">
                <Download size={36} color="#8d8d94" />
                <h3>Belum ada film yang diunduh</h3>
                <p>Jelajahi katalog dan tekan tombol "Download Offline" pada film untuk menonton tanpa internet.</p>
                <button className="btn-secondary" onClick={() => { setActiveTab('Film'); scrollToCatalog(); }}>
                  Jelajahi Katalog Film
                </button>
              </div>
            )}
          </section>
        )}

        {/* Katalog Section (Beranda, Film, Genre, Daftar Saya) */}
        {activeTab !== 'Unduhan' && (
          <section className="catalog-section" id="catalog">
            <div className="section-heading">
              <div>
                <div className="section-overline"><Flame size={14} /> KOLEKSI PILIHAN</div>
                <h2>
                  {query
                    ? 'Hasil Pencarian'
                    : activeTab === 'Daftar Saya'
                    ? 'Daftar Saya'
                    : 'Temukan Film'}
                  <span className="heading-period">.</span>
                </h2>
                <p className="section-subtitle">Cerita hebat dimulai dari pilihan yang tepat.</p>
                <p className="api-status">
                  {apiStatus === 'connected'
                    ? 'Data dari backend API Laravel'
                    : apiStatus === 'loading'
                    ? 'Menghubungkan ke server…'
                    : 'Mode demo lokal · fitur download & ulasan tetap aktif'}
                </p>
              </div>
              <button className="text-link" onClick={() => { setGenre('Semua'); setQuery(''); setActiveTab('Film'); }}>
                Lihat semua <ChevronRight size={16} />
              </button>
            </div>

            <div className="genre-row" id="genre-picker">
              {genres.map((g) => (
                <button
                  key={g}
                  className={`genre-chip ${genre === g ? 'selected' : ''}`}
                  onClick={() => setGenre(g)}
                >
                  {g}
                </button>
              ))}
            </div>

            <div className="movie-grid">
              {(activeTab === 'Daftar Saya' ? filtered.filter((m) => watchlist.includes(m.id)) : filtered).map(
                (movie, i) => {
                  const isDownloaded = offlineVideos.some((item) => String(item.movieId) === String(movie.id));
                  const progress = downloadProgress[String(movie.id)];

                  return (
                    <MovieCard
                      key={movie.id}
                      movie={movie}
                      index={i}
                      isSaved={watchlist.includes(movie.id)}
                      isDownloaded={isDownloaded}
                      downloadProgress={progress}
                      onOpen={openMovie}
                      onSave={toggleWatchlist}
                      onDownload={handleDownloadMovie}
                    />
                  );
                }
              )}
            </div>

            {((activeTab === 'Daftar Saya' && !filtered.some((m) => watchlist.includes(m.id))) ||
              (activeTab !== 'Daftar Saya' && filtered.length === 0)) && (
              <div className="empty-state">
                <Film size={32} />
                <h3>Belum ada film ditemukan</h3>
                <p>Coba kata kunci atau genre yang berbeda.</p>
                <button className="btn-secondary" onClick={() => { setQuery(''); setGenre('Semua'); setActiveTab('Film'); }}>
                  Reset filter
                </button>
              </div>
            )}

            <div className="load-more-wrap">
              <button className="load-more" onClick={() => { setQuery(''); setGenre('Semua'); setActiveTab('Film'); }}>
                JELAJAHI SEMUA FILM <ChevronRight size={15} />
              </button>
            </div>
          </section>
        )}

        {/* Membership Banner */}
        <section className="membership-banner">
          <div className="banner-icon"><Sparkles size={23} /></div>
          <div>
            <p className="section-overline">NONTON SANTUYY UNTUK SEMUA</p>
            <h2>Download film favoritmu,<br /><span>tonton di mana saja secara offline.</span></h2>
            <p className="banner-copy">Masuk dengan akun Google untuk memberi ulasan bintang dan simpan film ke perangkatmu.</p>
          </div>
          {!user ? (
            <button className="google-login-btn" onClick={() => { setAuthEmail(''); setIsEmailAuthOpen(true); }}>
              <LockKeyhole size={18} /> Masuk dengan Email
            </button>
          ) : (
            <button className="btn-primary" onClick={() => { setActiveTab('Unduhan'); scrollToCatalog(); }}>
              Buka Film Unduhan ({offlineVideos.length}) <ChevronRight size={17} />
            </button>
          )}
          <div className="banner-glow" />
        </section>
      </main>

      {/* Footer Halaman Film */}
      <footer className="footer">
        <a className="brand footer-brand" href="#top">
          <span className="brand-mark-ns">
            <img src="/images/ns-logo.png" alt="NS Logo" className="ns-logo-icon" />
          </span>
          <span>NONTON <span className="brand-gold">SANTUYY</span></span>
        </a>
        <p>Platform hiburan sinematik dengan fitur download offline dan login Google.</p>
        <div className="footer-bottom">
          <span>© 2026 Nonton Santuyy. Didukung fitur streaming offline &amp; Google OAuth.</span>
          <span className="footer-links">
            <a href="#catalog" onClick={() => setActiveTab('Film')}>Katalog</a>
            <a href="#genre-picker" onClick={() => setActiveTab('Genre')}>Genre</a>
            <a href="#login" onClick={(e) => { e.preventDefault(); navigateTo('landing'); }}>Halaman Login</a>
            <a href="#top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Kembali ke atas ↑</a>
          </span>
        </div>
      </footer>
    </div>
  )}

      {/* Modal Detail Film & Video Player */}
      {selected && (
        <div
          className="modal-backdrop"
          role="presentation"
          onMouseDown={(e) => { if (e.target === e.currentTarget) setSelected(null); }}
        >
          <section className="movie-modal" role="dialog" aria-modal="true" aria-label={`Detail ${selected.title}`}>
            <button className="modal-close" onClick={() => setSelected(null)} aria-label="Tutup"><X /></button>

            {/* Area Video Player */}
            <div className="modal-art">
              <MovieVideo
                url={selected.videoUrl}
                blobUrl={selectedBlobUrl}
                title={selected.title}
              />
            </div>

            <div className="modal-info">
              <p className="section-overline">NONTON SANTUYY • {selected.genre.toUpperCase()}</p>
              <h2>{selected.title}</h2>
              <div className="hero-meta">
                <span className="rating">★ {selected.rating}</span>
                <span>{selected.year}</span>
                <span>{selected.duration}</span>
                <span className="maturity">16+</span>
                {selectedBlobUrl && (
                  <span className="google-badge" style={{ color: '#22c55e', borderColor: '#22c55e' }}>
                    <CheckCircle size={12} /> Tersedia Offline
                  </span>
                )}
              </div>
              <p>{selected.description}</p>

              {/* Action Buttons: Download & Daftar Saya */}
              <div className="hero-buttons">
                <button
                  className={`download-action-btn ${offlineVideos.some((i) => String(i.movieId) === String(selected.id)) ? 'downloaded' : ''}`}
                  onClick={() => handleDownloadMovie(selected)}
                >
                  <Download size={16} />
                  {offlineVideos.some((i) => String(i.movieId) === String(selected.id))
                    ? 'Tersimpan Offline (Unduh Ulang)'
                    : 'Download Video (Nonton Offline)'}
                </button>

                <button className="btn-secondary" onClick={() => toggleWatchlist(selected)}>
                  {watchlist.includes(selected.id) ? <Check size={17} /> : <Plus size={17} />}
                  {watchlist.includes(selected.id) ? 'Tersimpan' : 'Daftar Saya'}
                </button>
              </div>

              {/* Progress Bar Download Jika Sedang Berjalan */}
              {downloadProgress[String(selected.id)] && (
                <div className="download-progress-wrap">
                  <div className="download-progress-text">
                    <span>{downloadProgress[String(selected.id)].status}</span>
                    <span>{downloadProgress[String(selected.id)].percent}%</span>
                  </div>
                  <div className="download-progress-bar-bg">
                    <div
                      className="download-progress-bar-fill"
                      style={{ width: `${downloadProgress[String(selected.id)].percent}%` }}
                    />
                  </div>
                </div>
              )}

              <p className="modal-note">
                <Info size={14} /> Video dapat diputar langsung secara streaming, atau diunduh untuk dinikmati kapan saja tanpa internet.
              </p>

              {/* === Section Ulasan & Rating Penonton dengan Login Google === */}
              <section className="review-section">
                <div className="review-heading">
                  <div>
                    <p className="section-overline"><Star size={13} fill="currentColor" /> ULASAN &amp; KOMENTAR PENONTON</p>
                    <h3>Rating &amp; Komentar Film</h3>
                  </div>
                  <span>
                    {reviewAverage ? `★ ${reviewAverage}/5 · ` : ''}
                    {selectedReviews.length} ulasan
                  </span>
                </div>

                {/* Form Ulasan: Jika Login vs Belum Login Google */}
                {!user ? (
                  <div className="google-login-prompt">
                    <GoogleIcon size={32} />
                    <h4>Login dengan Google untuk Memberi Rating &amp; Komentar</h4>
                    <p>
                      Hanya penonton yang masuk dengan akun Google yang dapat memberikan penilaian bintang dan membagikan ulasan pada film ini.
                    </p>
                    <button className="google-login-btn" onClick={() => setIsAuthModalOpen(true)}>
                      <GoogleIcon size={18} /> Masuk dengan Google
                    </button>
                  </div>
                ) : (
                  <form className="review-form" onSubmit={submitReview}>
                    <div className="review-user-active">
                      <div className="review-user-badge">
                        {user.picture ? (
                          <img src={user.picture} alt={user.name} className="user-avatar-img" />
                        ) : (
                          <div className="user-avatar-fallback">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <strong>{user.name}</strong>
                          <span> · {user.email}</span>
                        </div>
                      </div>
                      <span className="google-badge"><GoogleIcon size={11} /> Google</span>
                    </div>

                    <fieldset className="rating-picker">
                      <legend>Beri nilai bintang untuk film ini:</legend>
                      <div className="star-btn-group">
                        {[1, 2, 3, 4, 5].map((value) => (
                          <button
                            key={value}
                            type="button"
                            className={`star-button ${reviewRating >= value ? 'star-selected' : ''}`}
                            onClick={() => setReviewRating(value)}
                            aria-label={`${value} dari 5 bintang`}
                            aria-pressed={reviewRating === value}
                          >
                            <Star size={24} fill="currentColor" />
                          </button>
                        ))}
                        {reviewRating > 0 && (
                          <span className="star-hint">
                            {['', 'Kurang', 'Cukup', 'Bagus', 'Sangat Bagus', 'Luar Biasa!'][reviewRating]}
                          </span>
                        )}
                      </div>
                    </fieldset>

                    <label className="comment-label" htmlFor="review-comment">
                      Komentar atau ulasan film:
                    </label>
                    <textarea
                      id="review-comment"
                      value={reviewComment}
                      onChange={(event) => setReviewComment(event.target.value)}
                      maxLength={500}
                      placeholder="Bagikan pendapatmu setelah menonton film ini..."
                      rows={3}
                    />

                    <button className="btn-primary review-submit" type="submit" disabled={!reviewRating}>
                      <Send size={15} /> Kirim Ulasan
                    </button>
                  </form>
                )}

                {/* Daftar Komentar & Rating Yang Sudah Ada */}
                <div className="review-list">
                  {selectedReviews.map((review) => {
                    const isOwnReview = user && review.email && review.email === user.email;

                    return (
                      <article className="review-item" key={review.id}>
                        <div className="review-item-header">
                          <div className="review-author-wrap">
                            {review.avatar ? (
                              <img src={review.avatar} alt={review.author} className="review-author-avatar" />
                            ) : (
                              <div className="review-author-fallback">
                                {review.author ? review.author.charAt(0).toUpperCase() : 'P'}
                              </div>
                            )}
                            <div>
                              <strong>{review.author}</strong>
                              {review.isGoogleUser && (
                                <span className="google-badge" style={{ marginLeft: 6, fontSize: 9, padding: '1px 5px' }}>
                                  Google
                                </span>
                              )}
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span className="review-stars">
                              {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                            </span>
                            {isOwnReview && (
                              <button
                                className="review-delete-btn"
                                onClick={() => deleteReview(selected.id, review.id)}
                                title="Hapus ulasan saya"
                                aria-label="Hapus ulasan"
                              >
                                <Trash2 size={13} />
                              </button>
                            )}
                          </div>
                        </div>

                        {review.comment && <p>{review.comment}</p>}
                        <time dateTime={review.createdAt}>
                          {new Date(review.createdAt).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </time>
                      </article>
                    );
                  })}

                  {selectedReviews.length === 0 && (
                    <p className="no-reviews">Belum ada ulasan untuk film ini. Jadilah yang pertama memberikan rating!</p>
                  )}
                </div>
              </section>
            </div>
          </section>
        </div>
      )}

      {/* Modal Dialog Login Akun Google */}
      <GoogleAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <EmailAuthModal
        isOpen={isEmailAuthOpen}
        initialEmail={authEmail}
        onClose={() => setIsEmailAuthOpen(false)}
        onLoginSuccess={(payload) => { setIsEmailAuthOpen(false); handleLoginSuccess(payload); }}
      />

      {/* Toast Notifikasi */}
      {notice && (
        <div className="toast">
          <Check size={16} />
          {notice}
        </div>
      )}
    </div>
  );
}

// Komponen Kartu Film dengan Tombol Simpan & Download
function MovieCard({ movie, index, isSaved, isDownloaded, downloadProgress, onOpen, onSave, onDownload }) {
  return (
    <article className="movie-card" style={{ '--card-index': index }}>
      <button className="poster-button" onClick={() => onOpen(movie)} aria-label={`Lihat detail ${movie.title}`}>
        <div
          className="poster"
          style={{
            backgroundImage: `linear-gradient(0deg,rgba(0,0,0,.85) 0%,rgba(0,0,0,0) 55%),url(${movie.image})`,
          }}
        >
          <span className="poster-tag">
            {movie.category === 'Trending' ? 'TRENDING' : movie.category === 'New' ? 'BARU' : 'PILIHAN'}
          </span>
          {isDownloaded && (
            <span className="poster-offline-tag">
              <Check size={11} strokeWidth={3} /> OFFLINE
            </span>
          )}
          <span className="poster-play"><Play size={20} fill="currentColor" /></span>
          <span className="poster-title">{movie.title}</span>
        </div>
      </button>

      {downloadProgress && (
        <div style={{ marginTop: 6 }}>
          <div className="download-progress-bar-bg" style={{ height: 4 }}>
            <div
              className="download-progress-bar-fill"
              style={{ width: `${downloadProgress.percent}%` }}
            />
          </div>
        </div>
      )}

      <div className="movie-card-info">
        <div>
          <h3>{movie.title}</h3>
          <p>{movie.year} <span>•</span> {movie.genre}</p>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button
            className={`card-download-btn ${isDownloaded ? 'downloaded' : ''}`}
            onClick={() => onDownload(movie)}
            title={isDownloaded ? 'Sudah diunduh offline' : 'Download video offline'}
            aria-label={isDownloaded ? 'Sudah diunduh' : 'Download offline'}
          >
            {isDownloaded ? <Check size={15} /> : <Download size={15} />}
          </button>
          <button
            className={`save-button ${isSaved ? 'saved' : ''}`}
            onClick={() => onSave(movie)}
            aria-label={isSaved ? 'Hapus dari daftar saya' : 'Tambah ke daftar saya'}
            title={isSaved ? 'Hapus dari daftar saya' : 'Tambah ke daftar saya'}
          >
            {isSaved ? <Check size={17} /> : <Plus size={17} />}
          </button>
        </div>
      </div>

      <div className="card-bottom">
        <span className="card-rating">★ {movie.rating}</span>
        <span><Clock3 size={12} /> {movie.duration}</span>
      </div>
    </article>
  );
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
