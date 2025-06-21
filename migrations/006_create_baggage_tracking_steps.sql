-- 006_create_baggage_tracking_steps.sql
CREATE TABLE IF NOT EXISTS baggage_tracking_steps (
    id SERIAL PRIMARY KEY,
    baggage_number VARCHAR(20) NOT NULL REFERENCES baggage_tracking(baggage_number),
    step VARCHAR(50) NOT NULL,
    step_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
