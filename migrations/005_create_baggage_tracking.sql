-- 005_create_baggage_tracking.sql
CREATE TABLE IF NOT EXISTS baggage_tracking (
    id SERIAL PRIMARY KEY,
    baggage_number VARCHAR(20) UNIQUE NOT NULL,
    pax_id INTEGER NOT NULL REFERENCES pax(id),
    status VARCHAR(50) NOT NULL DEFAULT 'checkin counter',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
