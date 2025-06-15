#!/bin/bash
# reset_db.sh - Reset database PostgreSQL untuk pengembangan
# WARNING: Semua data di database akan dihapus!

set -e

DB_URL=${DATABASE_URL:-"postgres://tes_garuda:978guns32rdds4r5@192.168.1.41:6432/tes_garuda"}

# Parse DB connection string
regex='postgres://([^:]+):([^@]+)@([^:/]+):([0-9]+)/(.+)'
if [[ $DB_URL =~ $regex ]]; then
  DB_USER="${BASH_REMATCH[1]}"
  DB_PASS="${BASH_REMATCH[2]}"
  DB_HOST="${BASH_REMATCH[3]}"
  DB_PORT="${BASH_REMATCH[4]}"
  DB_NAME="${BASH_REMATCH[5]}"
else
  echo "Gagal parsing DATABASE_URL. Edit skrip ini manual."
  exit 1
fi

export PGPASSWORD="$DB_PASS"
echo "Drop database $DB_NAME (jika ada)..."
# Tidak boleh drop database yang sedang dipakai, gunakan template1
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d template1 -c "DROP DATABASE IF EXISTS \"$DB_NAME\";"
echo "Create database $DB_NAME..."
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d template1 -c "CREATE DATABASE \"$DB_NAME\";"
echo "Database $DB_NAME sudah direset."
