# Panduan Pengujian Backend API

Dokumen ini berisi panduan lengkap untuk pengujian backend BagsBe, baik secara manual (API endpoint) maupun otomatis (unit test).

---

## Daftar Isi

- [1. Pengujian Otomatis (Unit Test)](#1-pengujian-otomatis-unit-test)
- [2. Pengujian Manual API (Endpoint)](#2-pengujian-manual-api-endpoint)
  - [User Authentication Endpoints](#user-authentication-endpoints)
  - [Booking Endpoints](#booking-endpoints)
  - [Payment Endpoints](#payment-endpoints)
  - [Baggage Tracking Endpoints](#baggage-tracking-endpoints)
  - [Passenger Endpoints](#passenger-endpoints)
  - [Flight Endpoints](#flight-endpoints)
- [Tips Pengujian Manual](#tips-pengujian-manual)
- [Catatan](#catatan)

---

## 1. Pengujian Otomatis (Unit Test)

Proyek ini menggunakan [Vitest](https://vitest.dev/) untuk unit test. Semua file test berada di folder `tests/`.

### Menjalankan Seluruh Test
```bash
pnpm test
```

- Test akan berjalan otomatis untuk seluruh file di `tests/`.
- Pastikan database test sudah siap dan environment variable sudah di-setup (misal: `DATABASE_URL`).
- Contoh file test: `tests/auth.test.ts`, `tests/booking.test.ts`, dll.

---

## 2. Pengujian Manual API (Endpoint)

Pastikan backend server dan database sudah berjalan sebelum melakukan pengujian manual.

### Prasyarat
- Jalankan backend: `pnpm start` atau `pnpm dev`
- Jalankan migrasi jika tabel belum ada: `pnpm migrate`
- Pastikan environment variable (misal: `DATABASE_URL`) sudah di-set
- Gunakan `Content-Type: application/json` untuk request JSON

---

## Contoh Pengujian Manual Endpoint

### User Authentication Endpoints

Endpoint terkait autentikasi user (register, login, akses protected route).

#### Register User
- **POST /auth/register**
- **Body:**
  ```json
  { "username": "testuser", "password": "testpassword" }
  ```
- **Expected:** 200 OK dengan userId, atau 409 jika username sudah ada.
- **Curl:**
  ```bash
  curl -X POST http://localhost:3000/auth/register -H "Content-Type: application/json" -d '{"username":"testuser","password":"testpassword"}'
  ```

#### Login User
- **POST /auth/login**
- **Body:**
  ```json
  { "username": "testuser", "password": "testpassword" }
  ```
- **Expected:** 200 OK dengan JWT token, atau 401 jika salah.
- **Curl:**
  ```bash
  curl -X POST http://localhost:3000/auth/login -H "Content-Type: application/json" -d '{"username":"testuser","password":"testpassword"}'
  ```

#### Access Protected Route
- **GET /protected**
- **Header:** `Authorization: Bearer <JWT_TOKEN>`
- **Expected:** 200 OK dengan user info, atau 401 Unauthorized.
- **Curl:**
  ```bash
  curl -H "Authorization: Bearer <JWT_TOKEN>" http://localhost:3000/protected
  ```

---

### Booking Endpoints

Endpoint untuk membuat, melihat, dan mencari booking berdasarkan ID atau kode PNR.

#### Create Booking
- **POST /booking**
- **Body:**
  ```json
  { "pnrCode": "PNR12345", "flightCode": "GA123", "flightDate": "2025-06-08T10:00:00.000Z" }
  ```
- **Expected:** 200 OK dengan booking object.
- **Curl:**
  ```bash
  curl -X POST http://localhost:3000/booking -H "Content-Type: application/json" -d '{"pnrCode":"PNR12345","flightCode":"GA123","flightDate":"2025-06-08T10:00:00.000Z"}'
  ```

#### Get All Bookings
- **GET /booking**
- **Expected:** 200 OK array bookings.
- **Curl:**
  ```bash
  curl http://localhost:3000/booking
  ```

#### Get Booking by ID
- **GET /booking/:id**
- **Expected:** 200 OK booking, 404 jika tidak ditemukan.
- **Curl:**
  ```bash
  curl http://localhost:3000/booking/1
  ```

#### Get Bookings by PNR Code
- **GET /booking/pnr/:pnrCode**
- **Expected:** 200 OK array bookings.
- **Curl:**
  ```bash
  curl http://localhost:3000/booking/pnr/PNR12345
  ```

#### Fetch Flights (External API)
- **POST /booking/fetch-flights**
- **Body:** `{}`
- **Expected:** 200 OK, hasil response API eksternal di server log.
- **Curl:**
  ```bash
  curl -X POST http://localhost:3000/booking/fetch-flights -H "Content-Type: application/json" -d '{}'
  ```

---

### Payment Endpoints

Endpoint untuk membuat, melihat, dan mengupdate pembayaran.

#### Membuat Pembayaran
- **POST /payment**
- **Body:**
  ```json
  {
    "transaction_id": "TRX123",
    "total_passengers": 2,
    "payment_details": {
      "payment_id": "PAY001",
      "total_amount": "100000",
      "total_waive_weight": "10",
      "total_waive_amount": "5000",
      "payment_method": "transfer",
      "status": "paid"
    },
    "passengers": [
      { "pax_id": 1 },
      { "pax_id": 2 }
    ]
  }
  ```
- **Validasi:**
  - Jika `transaction_id` kosong, response 400.
  - Jika `transaction_id` sudah ada, response 409.
  - Jika sukses, status pembayaran penumpang diupdate otomatis.
- **Curl:**
  ```bash
  curl -X POST http://localhost:3000/payment -H "Content-Type: application/json" -d '{"transaction_id":"TRX123","total_passengers":2,"payment_details":{"payment_id":"PAY001","total_amount":"100000","total_waive_weight":"10","total_waive_amount":"5000","payment_method":"transfer","status":"paid"},"passengers":[{"pax_id":1},{"pax_id":2}]}'
  ```

#### Melihat Semua Pembayaran
- **GET /payment**
- **Expected:** 200 OK array pembayaran.
- **Curl:**
  ```bash
  curl http://localhost:3000/payment
  ```

#### Melihat Pembayaran Berdasarkan ID
- **GET /payment/:id**
- **Expected:** 200 OK pembayaran, 404 jika tidak ditemukan.
- **Curl:**
  ```bash
  curl http://localhost:3000/payment/1
  ```

#### Update Status/Data Pembayaran
- **PUT /payment/:id**
- **Body:**
  ```json
  { "status": "paid" }
  ```
- **Expected:** 200 OK pembayaran terupdate, 404 jika tidak ditemukan.
- **Curl:**
  ```bash
  curl -X PUT http://localhost:3000/payment/1 -H "Content-Type: application/json" -d '{"status":"paid"}'
  ```

---

### Baggage Tracking Endpoints

Endpoint untuk update status bagasi, melihat status, dan riwayat tracking bagasi.
### Passenger Endpoints

#### Membuat Penumpang
- **POST /pax**
- **Body:**
  ```json
  { "booking_id": 1, "name": "John Doe", "passport": "A1234567", "payment_id": 1 }
  ```
- **Expected:** 201 Created dengan data penumpang.
- **Curl:**
  ```bash
  curl -X POST http://localhost:3000/pax -H "Content-Type: application/json" -d '{"booking_id":1,"name":"John Doe","passport":"A1234567","payment_id":1}'
  ```

#### Melihat Semua Penumpang
- **GET /pax**
- **Expected:** 200 OK array penumpang.
- **Curl:**
  ```bash
  curl http://localhost:3000/pax
  ```

#### Melihat Penumpang Berdasarkan ID
- **GET /pax/:id**
- **Expected:** 200 OK penumpang, 404 jika tidak ditemukan.
- **Curl:**
  ```bash
  curl http://localhost:3000/pax/1
  ```

#### Update Data Penumpang
- **PUT /pax/:id**
- **Body:**
  ```json
  { "name": "Jane Doe" }
  ```
- **Expected:** 200 OK penumpang terupdate, 404 jika tidak ditemukan.
- **Curl:**
  ```bash
  curl -X PUT http://localhost:3000/pax/1 -H "Content-Type: application/json" -d '{"name":"Jane Doe"}'
  ```

#### Hapus Penumpang
- **DELETE /pax/:id**
- **Expected:** 204 No Content jika sukses, 404 jika tidak ditemukan.
- **Curl:**
  ```bash
  curl -X DELETE http://localhost:3000/pax/1
  ```

---

### Flight Endpoints

#### Membuat Flight
- **POST /flights**
- **Body:**
  ```json
  { "code": "GA123", "origin": "CGK", "destination": "DPS", "departure": "2025-07-01T10:00:00.000Z", "arrival": "2025-07-01T13:00:00.000Z", "status": "scheduled" }
  ```
- **Expected:** 201 Created dengan data flight.
- **Curl:**
  ```bash
  curl -X POST http://localhost:3000/flights -H "Content-Type: application/json" -d '{"code":"GA123","origin":"CGK","destination":"DPS","departure":"2025-07-01T10:00:00.000Z","arrival":"2025-07-01T13:00:00.000Z","status":"scheduled"}'
  ```

#### Melihat Semua Flight
- **GET /flights**
- **Expected:** 200 OK array flight.
- **Curl:**
  ```bash
  curl http://localhost:3000/flights
  ```

#### Melihat Flight Berdasarkan ID
- **GET /flights/:id**
- **Expected:** 200 OK flight, 404 jika tidak ditemukan.
- **Curl:**
  ```bash
  curl http://localhost:3000/flights/1
  ```

#### Update Data Flight
- **PUT /flights/:id**
- **Body:**
  ```json
  { "status": "departed" }
  ```
- **Expected:** 200 OK flight terupdate, 404 jika tidak ditemukan.
- **Curl:**
  ```bash
  curl -X PUT http://localhost:3000/flights/1 -H "Content-Type: application/json" -d '{"status":"departed"}'
  ```

#### Hapus Flight
- **DELETE /flights/:id**
- **Expected:** 204 No Content jika sukses, 404 jika tidak ditemukan.
- **Curl:**
  ```bash
  curl -X DELETE http://localhost:3000/flights/1
  ```

---

#### Update Baggage Status (Staff)
- **PUT /baggage/:baggageNumber/status**
- **Body:**
  ```json
  { "status": "security cleared (origin)" }
  ```
- **Valid Status:**
  - "checkin counter"
  - "security cleared (origin)"
  - "loaded onto aircraft"
  - "unloaded at destination"
  - "security cleared (destination)"
  - "in baggage claim area"
- **Expected:** 200 OK data terbaru, 400 jika status tidak valid, 404 jika nomor bagasi tidak ditemukan.
- **Curl:**
  ```bash
  curl -X PUT http://localhost:3000/baggage/BG123456789/status -H "Content-Type: application/json" -d '{"status":"loaded onto aircraft"}'
  ```

#### Lihat Status Bagasi
- **GET /baggage/:baggageNumber**
- **Expected:** 200 OK data tracking bagasi, 404 jika tidak ditemukan.
- **Curl:**
  ```bash
  curl http://localhost:3000/baggage/BG123456789
  ```

#### Lihat Riwayat Step & Waktu Bagasi
- **GET /baggage/:baggageNumber/steps**
- **Expected:** 200 OK array step & waktu.
- **Curl:**
  ```bash
  curl http://localhost:3000/baggage/BG123456789/steps
  ```

#### Lihat Semua Tracking Bagasi (Hanya Authenticated)
- **GET /baggage/**
- **Header:** `Authorization: Bearer <JWT_TOKEN>`
- **Expected:** 200 OK array tracking bagasi, 401 jika tidak ada/mismatch token.
- **Curl:**
  ```bash
  curl -H "Authorization: Bearer <JWT_TOKEN>" http://localhost:3000/baggage/
  ```

#### Next Step Baggage (Advance Step)
- **PUT /baggage/:baggageNumber/next-step**
- **Body:**
  ```json
  { "step": "loaded onto aircraft", "location": "CGK" }
  ```
- **Expected:** 200 OK data step terbaru, 400 jika step tidak valid, 404 jika nomor bagasi tidak ditemukan.
- **Curl:**
  ```bash
  curl -X PUT http://localhost:3000/baggage/BG123456789/next-step -H "Content-Type: application/json" -d '{"step":"loaded onto aircraft","location":"CGK"}'
  ```

---

## Tips Pengujian Manual
- Gunakan Postman/Insomnia untuk manajemen request.
- Untuk POST, coba juga field kosong/invalid untuk cek error handling.
- Untuk GET by ID, coba ID yang tidak ada untuk cek 404.
- Untuk GET by PNR, coba PNR yang tidak ada untuk cek array kosong.
- Cek database untuk integritas data setelah operasi.
- Jika ada error, cek log backend server.

- Untuk endpoint yang membutuhkan autentikasi, pastikan JWT token valid dan expired token ditolak.
- Uji skenario edge-case: data duplikat, data tidak ditemukan, dan validasi tipe data.
- Cek response time untuk endpoint utama (pastikan < 1 detik untuk query sederhana).

---

## Catatan
- Jalankan migrasi jika tabel belum ada: `pnpm migrate`
- Reset database jika perlu: `pnpm reset_db`
- Hapus instruksi test yang sudah tidak relevan secara berkala.

- Untuk coverage test, gunakan perintah: `pnpm test -- --coverage`.
- Dokumentasi API tersedia di file `openapi.yaml`.
