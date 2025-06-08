-- bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  pnr_code TEXT NOT NULL,
  flight_code TEXT NOT NULL,
  flight_date TIMESTAMP NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMP
);

-- pax table
CREATE TABLE IF NOT EXISTS pax (
  id SERIAL PRIMARY KEY,
  pax_name TEXT NOT NULL,
  pax_nik TEXT,
  pax_email TEXT,
  pax_phone TEXT,
  departure_date TIMESTAMP,
  departure_airport TEXT,
  destination_airport TEXT,
  flight_no TEXT,
  ticket_no TEXT,
  ticket_type TEXT,
  ga_miles_no TEXT,
  ga_miles_tier TEXT,
  free_bag_allow INTEGER,
  total_bag_weight DOUBLE PRECISION,
  excess_weight DOUBLE PRECISION,
  excess_charge DOUBLE PRECISION,
  status_payment BOOLEAN DEFAULT FALSE,
  ktp_nik TEXT,
  ktp_nama TEXT,
  ktp_tpt_lahir TEXT,
  ktp_tgl_lahir TIMESTAMP,
  ktp_kelamin BOOLEAN,
  ktp_gol_darah TEXT,
  ktp_alamat TEXT,
  ktp_rt TEXT,
  ktp_rw TEXT,
  ktp_desa TEXT,
  ktp_kecamatan TEXT,
  ktp_pekerjaan TEXT,
  ktp_citizenship TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMP,
  booking_id INTEGER NOT NULL REFERENCES bookings(id)
);

-- payments table
CREATE TABLE IF NOT EXISTS payments (
  id SERIAL PRIMARY KEY,
  pax_id INTEGER NOT NULL REFERENCES pax(id),
  amount DOUBLE PRECISION NOT NULL,
  status BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
