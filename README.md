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
