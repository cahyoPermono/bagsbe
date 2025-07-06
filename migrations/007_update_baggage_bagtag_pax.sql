-- Migration: Update baggage_tracking_steps, bag_tags, baggage_tracking, pax tables

-- CREATE bag_tags table if not exists
CREATE TABLE IF NOT EXISTS bag_tags (
  id SERIAL PRIMARY KEY,
  nomor TEXT NOT NULL,
  status TEXT NOT NULL,
  keterangan TEXT,
  pax_id INTEGER NOT NULL REFERENCES pax(id),
  baggage_tracking_id INTEGER NOT NULL REFERENCES baggage_tracking(id)
);

-- 1. Update baggage_tracking_steps table
ALTER TABLE baggage_tracking_steps
  ADD COLUMN bag_tag_id integer NOT NULL REFERENCES bag_tags(id);

-- 2. Update bag_tags table
ALTER TABLE bag_tags
  ADD COLUMN baggage_tracking_id integer NOT NULL REFERENCES baggage_tracking(id);

-- 3. Update baggage_tracking table
-- (No structural changes detected, only code/logic changes)

-- 4. Update pax table
-- (No structural changes detected, only code/logic changes)

-- Note: If these columns already exist, this migration will fail. Please ensure to run this only once or adjust as needed for your environment.
