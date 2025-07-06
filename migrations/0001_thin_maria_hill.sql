CREATE TABLE IF NOT EXISTS "bag_tags" (
	"id" serial PRIMARY KEY NOT NULL,
	"nomor" text NOT NULL,
	"status" text NOT NULL,
	"keterangan" text,
	"pax_id" integer NOT NULL,
	"baggage_tracking_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "baggage_tracking" (
	"id" serial PRIMARY KEY NOT NULL,
	"baggage_number" text NOT NULL,
	"pax_id" integer NOT NULL,
	"status" text NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "baggage_tracking_baggage_number_unique" UNIQUE("baggage_number")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "baggage_tracking_steps" (
	"id" serial PRIMARY KEY NOT NULL,
	"baggage_number" text NOT NULL,
	"step" text NOT NULL,
	"step_time" timestamp DEFAULT now() NOT NULL,
	"bag_tag_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "flights" (
	"id" serial PRIMARY KEY NOT NULL,
	"flight_no" text NOT NULL,
	"operating_carrier" text NOT NULL,
	"board_point" text NOT NULL,
	"off_point" text NOT NULL,
	"departure_date" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "payments" DROP CONSTRAINT "payments_pax_id_pax_id_fk";
--> statement-breakpoint
ALTER TABLE "payments" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "payments" ALTER COLUMN "status" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "pax" ADD COLUMN "payment_id" integer;--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "trans_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "payment_id" text;--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "total_pax" integer;--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "total_amount" double precision;--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "total_waive_weight" double precision;--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "total_waive_amount" double precision;--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "payment_method" text;--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "payments" DROP COLUMN IF EXISTS "pax_id";--> statement-breakpoint
ALTER TABLE "payments" DROP COLUMN IF EXISTS "amount";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bag_tags" ADD CONSTRAINT "bag_tags_pax_id_pax_id_fk" FOREIGN KEY ("pax_id") REFERENCES "pax"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bag_tags" ADD CONSTRAINT "bag_tags_baggage_tracking_id_baggage_tracking_id_fk" FOREIGN KEY ("baggage_tracking_id") REFERENCES "baggage_tracking"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "baggage_tracking_steps" ADD CONSTRAINT "baggage_tracking_steps_bag_tag_id_bag_tags_id_fk" FOREIGN KEY ("bag_tag_id") REFERENCES "bag_tags"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_trans_id_unique" UNIQUE("trans_id");