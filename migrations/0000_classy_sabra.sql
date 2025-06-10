CREATE TABLE IF NOT EXISTS "bookings" (
	"id" serial PRIMARY KEY NOT NULL,
	"pnr_code" text NOT NULL,
	"flight_code" text NOT NULL,
	"flight_date" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "pax" (
	"id" serial PRIMARY KEY NOT NULL,
	"pax_name" text NOT NULL,
	"pax_nik" text,
	"pax_email" text,
	"pax_phone" text,
	"departure_date" timestamp,
	"departure_airport" text,
	"destination_airport" text,
	"flight_no" text,
	"ticket_no" text,
	"ticket_type" text,
	"ga_miles_no" text,
	"ga_miles_tier" text,
	"free_bag_allow" integer,
	"total_bag_weight" double precision,
	"excess_weight" double precision,
	"excess_charge" double precision,
	"status_payment" boolean DEFAULT false,
	"ktp_nik" text,
	"ktp_nama" text,
	"ktp_tpt_lahir" text,
	"ktp_tgl_lahir" timestamp,
	"ktp_kelamin" boolean,
	"ktp_gol_darah" text,
	"ktp_alamat" text,
	"ktp_rt" text,
	"ktp_rw" text,
	"ktp_desa" text,
	"ktp_kecamatan" text,
	"ktp_pekerjaan" text,
	"ktp_citizenship" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"booking_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "payments" (
	"id" serial PRIMARY KEY NOT NULL,
	"pax_id" integer NOT NULL,
	"amount" double precision NOT NULL,
	"status" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" varchar(255) NOT NULL,
	"password" text NOT NULL,
	"role" varchar(50) DEFAULT 'user' NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pax" ADD CONSTRAINT "pax_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "payments" ADD CONSTRAINT "payments_pax_id_pax_id_fk" FOREIGN KEY ("pax_id") REFERENCES "pax"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
