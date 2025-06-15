-- Add payment_id column to pax table
ALTER TABLE pax ADD COLUMN payment_id INTEGER;
-- Optionally, add a foreign key constraint if you want to link to payments table:
-- ALTER TABLE pax ADD CONSTRAINT pax_payment_id_fkey FOREIGN KEY (payment_id) REFERENCES payments(id);
