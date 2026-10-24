# Nonton Santuyy

This workspace includes a React/Vite frontend in `frontend/` and a Laravel API application in `dulsfilm-backend/`. The API integration source files are also provided in `backend/`.

## Requirements

- Node.js and npm
- PHP 8.3+ and Composer
- MySQL

## Run the application

Create a MySQL database named `dulsfilm`. If `dulsfilm-backend/.env` does not exist yet, create it from the example:

```powershell
cd dulsfilm-backend
Copy-Item .env.example .env
```

Set the database settings and `APP_URL` in `dulsfilm-backend/.env`:

```env
APP_URL=http://127.0.0.1:8000
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=dulsfilm
DB_USERNAME=root
DB_PASSWORD=
```

In one terminal, migrate and seed the API database, then start Laravel:

```powershell
cd dulsfilm-backend
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

In a second terminal, configure and start the frontend:

```powershell
cd frontend
Copy-Item .env.example .env
npm install
npm run dev
```

Open the Vite URL printed in the terminal (usually `http://localhost:5173`). If the API is unavailable, the frontend remains usable with its built-in sample catalog. The API's local CORS configuration allows both `localhost:5173` and `127.0.0.1:5173`.

For instructions on integrating the API files into a new Laravel application, see [`backend/README.md`](backend/README.md). Sample videos are not included; playback requires an authorized video URL.
