# Panduan Backup & Restore PostgreSQL dengan pg_dump

Panduan ini menjelaskan cara melakukan backup dan restore database PostgreSQL pada container Docker menggunakan `pg_dump` dan `psql`.

## Backup Database

1. **Backup ke file lokal**

   Jalankan perintah berikut untuk membuat backup database `bagsbe` ke file `backup.sql` di direktori saat ini:

   ```sh
   docker-compose exec db pg_dump -U user -d bagsbe > backup.sql
   ```

   - `db` adalah nama service database di `docker-compose.yml`.
   - `user` adalah username PostgreSQL.
   - `bagsbe` adalah nama database.
   - `backup.sql` adalah nama file hasil backup.

2. **Backup dengan timestamp (opsional)**

   ```sh
   docker-compose exec db pg_dump -U user -d bagsbe > backup_$(date +%Y%m%d_%H%M%S).sql
   ```

## Restore Database

1. **Restore dari file backup**

   Pastikan database tujuan sudah ada dan kosong. Jalankan:

   ```sh
   cat backup.sql | docker-compose exec -T db psql -U user -d bagsbe
   ```

   - `-T` diperlukan agar stdin bisa diteruskan ke container.

2. **Restore ke database baru (opsional)**

   Buat database baru terlebih dahulu:
   ```sh
   docker-compose exec db psql -U user -c "CREATE DATABASE bagsbe_restore;"
   ```
   Lalu restore:
   ```sh
   cat backup.sql | docker-compose exec -T db psql -U user -d bagsbe_restore
   ```

## Tips
- Simpan file backup di tempat aman.
- Lakukan backup rutin, terutama sebelum update/migrasi.
- Untuk backup otomatis, bisa gunakan cron di host.

---
