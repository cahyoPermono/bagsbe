# Backend API Testing Instructions

This document provides instructions to test the backend API endpoints for the Hono.js backend with Drizzle ORM.

## Prerequisites

- The backend server should be running (e.g., `pnpm exec tsx src/index.ts`).
- Use a tool like `curl` or Postman to send HTTP requests.

## Endpoints

### 1. Register User

- URL: `POST /auth/register`
- Body (JSON):
  ```json
  {
    "username": "testuser",
    "password": "testpassword"
  }
  ```
- Expected: 200 OK with message and userId, or 409 if username exists.

Example curl:
```bash
curl -X POST http://localhost:3000/auth/register -H "Content-Type: application/json" -d '{"username":"testuser","password":"testpassword"}'
```

### 2. Login User

- URL: `POST /auth/login`
- Body (JSON):
  ```json
  {
    "username": "testuser",
    "password": "testpassword"
  }
  ```
- Expected: 200 OK with JWT token, or 401 for invalid credentials.

Example curl:
```bash
curl -X POST http://localhost:3000/auth/login -H "Content-Type: application/json" -d '{"username":"testuser","password":"testpassword"}'
```

### 3. Access Protected Route

- URL: `GET /protected`
- Header: `Authorization: Bearer <JWT_TOKEN>`
- Expected: 200 OK with message and user info, or 401 Unauthorized.

Example curl:
```bash
curl -H "Authorization: Bearer <JWT_TOKEN>" http://localhost:3000/protected
```

Replace `<JWT_TOKEN>` with the token received from login.

## Manual Testing

You can also test the backend API manually using tools like Postman or Insomnia:

1. **Register User**
   - Open Postman and create a new POST request to `http://localhost:3000/auth/register`.
   - Set the request body to raw JSON and enter:
     ```json
     {
       "username": "testuser",
       "password": "testpassword"
     }
     ```
   - Send the request and verify you receive a success message with a user ID.
   - If the username already exists, you should receive a 409 Conflict response.

2. **Login User**
   - Create a new POST request to `http://localhost:3000/auth/login`.
   - Use the same JSON body as registration with the username and password.
   - Send the request and verify you receive a JWT token in the response.
   - If credentials are invalid, you should receive a 401 Unauthorized response.

3. **Access Protected Route**
   - Create a new GET request to `http://localhost:3000/protected`.
   - In the Headers tab, add an `Authorization` header with the value `Bearer <JWT_TOKEN>`, replacing `<JWT_TOKEN>` with the token from login.
   - Send the request and verify you receive a 200 OK response with user information.
   - Try sending the request without the Authorization header or with an invalid token to confirm you get a 401 Unauthorized response.

4. **Verify Database Changes**
   - Connect to your PostgreSQL database using a client like `psql` or pgAdmin.
   - Check the `users` table to verify that new users are created after registration.
   - Verify that roles or permissions are correctly assigned if applicable.

## Thorough Testing Instructions

This section provides detailed instructions to thoroughly test all backend API endpoints, including happy paths, error paths, edge cases, and manual testing guidance.

### Endpoints to Test

- `POST /auth/register`
- `POST /auth/login`
- `GET /protected` (requires authentication)
- `GET /admin` (requires authentication and admin role)
- `GET /` (public)

### 1. Register User (`POST /auth/register`)

- **Happy Path:**
  - Send a POST request with valid `username`, `password`, and optional `role`.
  - Expect 200 OK with success message and userId.
- **Error Paths:**
  - Missing `username` or `password`: expect 400 Bad Request with error message.
  - Username already exists: expect 409 Conflict with error message.
- **Edge Cases:**
  - Test with very long usernames or passwords.
  - Test with special characters in username and password.
  - Test with missing `role` field (should default to "user").

### 2. Login User (`POST /auth/login`)

- **Happy Path:**
  - Send a POST request with valid `username` and `password`.
  - Expect 200 OK with JWT token.
- **Error Paths:**
  - Missing `username` or `password`: expect 400 Bad Request.
  - Invalid username or password: expect 401 Unauthorized.
- **Edge Cases:**
  - Test login with correct username but wrong password.
  - Test login with non-existent username.

### 3. Access Protected Route (`GET /protected`)

- **Happy Path:**
  - Send a GET request with valid `Authorization: Bearer <JWT_TOKEN>` header.
  - Expect 200 OK with message and user info.
- **Error Paths:**
  - Missing or invalid token: expect 401 Unauthorized.
- **Edge Cases:**
  - Test with expired token (if applicable).
  - Test with malformed token.

### 4. Access Admin Route (`GET /admin`)

- **Happy Path:**
  - Send a GET request with valid token of a user with `admin` role.
  - Expect 200 OK with welcome message.
- **Error Paths:**
  - Missing or invalid token: expect 401 Unauthorized.
  - Valid token but user without `admin` role: expect 403 Forbidden.
- **Edge Cases:**
  - Test with token of user with other roles.
  - Test with expired or malformed token.

### 5. Public Route (`GET /`)

- Should return 200 OK with a simple text message.

### Manual Testing

You can use tools like Postman or Insomnia to manually test the above endpoints:

- Create requests as described above.
- Use the response tokens to test protected and admin routes.
- Verify error responses by omitting required fields or using invalid tokens.
- Check the database to confirm user creation and role assignments.

### Notes

- Ensure the database is running and accessible at `localhost:5432` with the configured credentials.
- You may need to create the `users` table in the database before testing or run migrations if applicable.
- If you encounter issues, check the backend server logs for error messages.
- Make sure to use the correct Content-Type header (`application/json`) when sending requests.
