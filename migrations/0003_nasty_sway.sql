ALTER TABLE "bag_tags" DROP CONSTRAINT "bag_tags_pax_id_pax_id_fk";
--> statement-breakpoint
ALTER TABLE "bag_tags" DROP CONSTRAINT "bag_tags_baggage_tracking_id_baggage_tracking_id_fk";
--> statement-breakpoint
ALTER TABLE "baggage_tracking_steps" DROP CONSTRAINT "baggage_tracking_steps_bag_tag_id_bag_tags_id_fk";
--> statement-breakpoint
ALTER TABLE "pax" DROP CONSTRAINT "pax_booking_id_bookings_id_fk";
