# BagsBe API

## Deskripsi
BagsBe adalah API backend untuk pengelolaan pembayaran dan data penumpang pada sistem bagasi maskapai. API ini dibangun menggunakan Node.js, TypeScript, Hono, dan Drizzle ORM.

## Fitur Utama
- **Manajemen Pembayaran**: Membuat, melihat, dan memperbarui data pembayaran.
- **Manajemen Penumpang**: Update status pembayaran penumpang secara otomatis setelah pembayaran berhasil.
- **Validasi Data**: Validasi input pada endpoint pembayaran.

## Struktur Proyek
```
├── src/
│   ├── db.ts                # Koneksi database
│   ├── index.ts             # Entry point aplikasi
│   ├── routes/              # Routing API
│   │   ├── payment.ts       # Endpoint pembayaran
│   │   └── ...
│   ├── models/              # Model database
│   └── ...
├── tests/                   # Unit test
├── package.json             # Konfigurasi npm
└── tsconfig.json            # Konfigurasi TypeScript
```

## Instalasi
1. **Clone repository**
   ```bash
   git clone <repo-url>
   cd bagsbe
   ```
2. **Install dependencies**
   ```bash
   pnpm install
   ```
3. **Konfigurasi Database**
   - Edit `src/db.ts` sesuai koneksi database Anda.
   - Jalankan migrasi jika perlu:
     ```bash
     pnpm run migrate
     ```

## Menjalankan Aplikasi
```bash
pnpm start
```
## Testing
Lihat file `TESTING.md` untuk panduan pengujian.

## Kontribusi
Pull request dan issue sangat diterima.

## Lisensi
IMANI PRIMA

## Deploy ke Production

### 1. Persiapan Lingkungan
- Pastikan Node.js, pnpm, dan PostgreSQL sudah terinstall di server.
- Siapkan environment variable `DATABASE_URL` pada server production, misal:
  ```sh
  export DATABASE_URL="postgres://user:password@localhost:5432/bagsbe"
  ```

### 2. Instalasi Dependensi
```sh
pnpm install
```

### 3. Migrasi Database
- Jalankan migrasi database untuk memastikan semua tabel sudah sesuai skema:
  ```sh
  pnpm exec tsx scripts/run_migrations.ts
  ```
  Atau, jika ingin menggunakan Drizzle Kit langsung:
  ```sh
  npx drizzle-kit push
  ```

### 4. Build & Jalankan Aplikasi
- Untuk menjalankan aplikasi:
  ```sh
  pnpm start
  ```
  Atau untuk mode development:
  ```sh
  pnpm dev
  ```

### 5. (Opsional) Menjalankan di Latar Belakang
- Gunakan process manager seperti PM2 atau systemd agar aplikasi tetap berjalan di background.

### 6. Reset Database & Migrasi

#### a. Jalankan di Luar Docker (Local/Manual)
- Untuk reset database dari host/local:
  ```sh
  pnpm reset_db
  ```
- Untuk menjalankan migrasi dari host/local:
  ```sh
  pnpm migrate
  ```
- Anda juga bisa menjalankan keduanya sekaligus:
  ```sh
  pnpm reset_db && pnpm migrate
  ```

#### b. Jalankan di Dalam Docker
- Untuk reset database di dalam container Docker:
  ```sh
  docker-compose exec app pnpm reset_db
  ```
- Untuk menjalankan migrasi di dalam container Docker:
  ```sh
  docker-compose exec app pnpm migrate
  ```
- Anda juga bisa menjalankan keduanya sekaligus:
  ```sh
  docker-compose exec app pnpm reset_db && docker-compose exec app pnpm migrate
  ```

### 7. Testing
- Pastikan aplikasi berjalan dengan baik dan endpoint dapat diakses.
- Lihat file `TESTING.md` untuk panduan pengujian API.

---
