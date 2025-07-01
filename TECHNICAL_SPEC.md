# Technical Specification Design

## Project Overview

**Project Name:** Bagsbe

Bagsbe is a baggage tracking and management system designed to streamline the process of handling, tracking, and managing baggage for airlines or travel-related services. The system provides features for user authentication, booking management, baggage tracking, payment processing, and notification services.

---

## Architecture

- **Backend:** Node.js (TypeScript)
- **Database:** PostgreSQL (managed via Drizzle ORM)
- **Containerization:** Docker
- **Task Runner:** pnpm
- **Testing:** Vitest
- **Process Management:** PM2 (ecosystem.config.js)

---

## Main Components

### 1. Authentication
- JWT-based authentication
- User roles and permissions
- Endpoints: `/auth`

### 2. User Management
- CRUD operations for users
- Role assignment (admin, staff, passenger)
- Endpoints: `/user`

### 3. Booking Management
- Create, update, and retrieve bookings
- Link bookings to users and flights
- Endpoints: `/booking`

### 4. Baggage Management
- Register and track baggage
- Track baggage steps (check-in, loading, unloading, delivery, etc.)
- Endpoints: `/baggage`, `/baggageStep`

### 5. Passenger Management
- Manage passenger data
- Link passengers to bookings and baggage
- Endpoints: `/pax`

### 6. Payment Processing
- Handle payment records and statuses
- Link payments to bookings and passengers
- Endpoints: `/payment`

### 7. Notification Service
- Email notifications for status updates
- Service: `emailService.ts`

### 8. Flight Management
- Manage flight data
- Link flights to bookings and baggage
- Service: `flightService.ts`

---

## Database Design

- **Migrations:** Located in `migrations/` (SQL files)
- **Tables:**
  - `users`: User accounts and roles
  - `bookings`: Booking records
  - `pax`: Passenger data
  - `baggage`: Baggage records
  - `baggage_steps`: Tracking steps for each baggage
  - `payments`: Payment records
  - `flights`: Flight information

### Table Structures

#### users
| Column      | Type         | Description                |
|------------|--------------|----------------------------|
| id         | SERIAL, PK   | User ID                    |
| name       | VARCHAR      | Full name                  |
| email      | VARCHAR, UQ  | Email address              |
| password   | VARCHAR      | Hashed password            |
| role       | VARCHAR      | User role (admin/staff/pax)|
| created_at | TIMESTAMP    | Creation timestamp         |
| updated_at | TIMESTAMP    | Last update timestamp      |

#### bookings
| Column      | Type         | Description                |
|------------|--------------|----------------------------|
| id         | SERIAL, PK   | Booking ID                 |
| user_id    | INT, FK      | Linked user                |
| flight_id  | INT, FK      | Linked flight              |
| status     | VARCHAR      | Booking status             |
| created_at | TIMESTAMP    | Creation timestamp         |
| updated_at | TIMESTAMP    | Last update timestamp      |

#### pax
| Column      | Type         | Description                |
|------------|--------------|----------------------------|
| id         | SERIAL, PK   | Passenger ID               |
| booking_id | INT, FK      | Linked booking             |
| name       | VARCHAR      | Passenger name             |
| passport   | VARCHAR      | Passport number            |
| payment_id | INT, FK      | Linked payment             |
| created_at | TIMESTAMP    | Creation timestamp         |
| updated_at | TIMESTAMP    | Last update timestamp      |

#### baggage
| Column      | Type         | Description                |
|------------|--------------|----------------------------|
| id         | SERIAL, PK   | Baggage ID                 |
| pax_id     | INT, FK      | Linked passenger           |
| tag        | VARCHAR      | Baggage tag/identifier     |
| weight     | FLOAT        | Weight (kg)                |
| status     | VARCHAR      | Current status             |
| created_at | TIMESTAMP    | Creation timestamp         |
| updated_at | TIMESTAMP    | Last update timestamp      |

#### baggage_steps
| Column      | Type         | Description                |
|------------|--------------|----------------------------|
| id         | SERIAL, PK   | Step ID                    |
| baggage_id | INT, FK      | Linked baggage             |
| step       | VARCHAR      | Step name                  |
| timestamp  | TIMESTAMP    | Step timestamp             |
| location   | VARCHAR      | Location info              |

#### payments
| Column      | Type         | Description                |
|------------|--------------|----------------------------|
| id         | SERIAL, PK   | Payment ID                 |
| amount     | DECIMAL      | Payment amount             |
| status     | VARCHAR      | Payment status             |
| method     | VARCHAR      | Payment method             |
| created_at | TIMESTAMP    | Creation timestamp         |

#### flights
| Column      | Type         | Description                |
|------------|--------------|----------------------------|
| id         | SERIAL, PK   | Flight ID                  |
| code       | VARCHAR      | Flight code                |
| origin     | VARCHAR      | Origin airport             |
| destination| VARCHAR      | Destination airport        |
| departure  | TIMESTAMP    | Departure time             |
| arrival    | TIMESTAMP    | Arrival time               |
| status     | VARCHAR      | Flight status              |

---

## API Structure

- **Routes:**
  - `src/routes/`
    - `auth.ts`
    - `user.ts`
    - `booking.ts`
    - `baggage.ts`
    - `pax.ts`
    - `payment.ts`

- **Middleware:**
  - Authentication and CORS handling in `src/middleware/`

- **Services:**
  - Business logic in `src/services/`

---

## Deployment & Operations

- **Docker:**
  - `Dockerfile` for containerizing the app
  - `docker-compose.yml` for multi-service orchestration
- **Process Management:**
  - PM2 via `ecosystem.config.js`
- **Logging:**
  - Log files in `logs/`

---

## Testing

- **Test Files:** Located in `tests/`
- **Framework:** Vitest

---

## Scripts

- **Database Reset:** `scripts/reset_db.sh`
- **Run Migrations:** `scripts/run_migrations.ts`

---

## Configuration

- **TypeScript:** `tsconfig.json`
- **Drizzle ORM:** `drizzle.config.ts`
- **Vitest:** `vitest.config.ts`

---

## Future Improvements

- Add real-time baggage tracking (WebSocket integration)
- Integrate with airline APIs for flight status
- Enhance notification system (SMS, push notifications)
- Add admin dashboard (web frontend)

---

## References

- See `README.md` and `TESTING.md` for more details on setup and testing.
