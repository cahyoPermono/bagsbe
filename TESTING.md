# Backend API Manual Testing Guide

This document provides standardized instructions for manually testing the backend API endpoints using tools like curl, Postman, or Insomnia. Please ensure your backend server and database are running before testing.

---

## Prerequisites
- Backend server is running (e.g., `pnpm exec tsx src/index.ts`).
- Database is accessible at `localhost:5432` with correct credentials.
- Use `Content-Type: application/json` for all JSON requests.

---

## User Authentication Endpoints

### Register User
- **POST /auth/register**
- **Body:**
  ```json
  { "username": "testuser", "password": "testpassword" }
  ```
- **Expected:** 200 OK with userId, or 409 if username exists.
- **Curl:**
  ```bash
  curl -X POST http://localhost:3000/auth/register -H "Content-Type: application/json" -d '{"username":"testuser","password":"testpassword"}'
  ```

### Login User
- **POST /auth/login**
- **Body:**
  ```json
  { "username": "testuser", "password": "testpassword" }
  ```
- **Expected:** 200 OK with JWT token, or 401 for invalid credentials.
- **Curl:**
  ```bash
  curl -X POST http://localhost:3000/auth/login -H "Content-Type: application/json" -d '{"username":"testuser","password":"testpassword"}'
  ```

### Access Protected Route
- **GET /protected**
- **Header:** `Authorization: Bearer <JWT_TOKEN>`
- **Expected:** 200 OK with user info, or 401 Unauthorized.
- **Curl:**
  ```bash
  curl -H "Authorization: Bearer <JWT_TOKEN>" http://localhost:3000/protected
  ```

---

## Booking Endpoints

### Create Booking
- **POST /booking**
- **Body:**
  ```json
  { "pnrCode": "PNR12345", "flightCode": "GA123", "flightDate": "2025-06-08T10:00:00.000Z" }
  ```
- **Expected:** 200 OK with created booking object.
- **Curl:**
  ```bash
  curl -X POST http://localhost:3000/booking -H "Content-Type: application/json" -d '{"pnrCode":"PNR12345","flightCode":"GA123","flightDate":"2025-06-08T10:00:00.000Z"}'
  ```

### Get All Bookings
- **GET /booking**
- **Expected:** 200 OK with array of bookings.
- **Curl:**
  ```bash
  curl http://localhost:3000/booking
  ```

### Get Booking by ID
- **GET /booking/:id**
- **Expected:** 200 OK with booking object, 404 if not found.
- **Curl:**
  ```bash
  curl http://localhost:3000/booking/1
  ```

### Get Bookings by PNR Code
- **GET /booking/pnr/:pnrCode**
- **Expected:** 200 OK with array of bookings matching the PNR code.
- **Curl:**
  ```bash
  curl http://localhost:3000/booking/pnr/PNR12345
  ```

### Fetch Flights (External API)
- **POST /booking/fetch-flights**
- **Body:**
  ```json
  {}
  ```
  (Payload body dikosongkan, karena API backend akan otomatis menggunakan struktur default yang sudah di-hardcode)
- **Expected:** 200 OK dengan pesan konfirmasi, hasil response API eksternal akan muncul di server log.
- **Curl:**
  ```bash
  curl -X POST http://localhost:3000/booking/fetch-flights -H "Content-Type: application/json" -d '{}'
  ```

---

## Manual Testing Guidance
- Use Postman/Insomnia for easier request management.
- For POST, test with missing/invalid fields for error handling.
- For GET by ID, use non-existent ID to confirm 404.
- For GET by PNR, use unknown PNR to confirm empty array.
- Check the database for data integrity after operations.
- If you encounter issues, check backend server logs for error messages.

---

## Notes
- Run migrations if tables are missing.
- Remove duplicate or outdated test instructions to keep this file clean and standardized.
