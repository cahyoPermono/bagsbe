// Booking model for Drizzle ORM
import { integer, text, timestamp, pgTable, serial } from 'drizzle-orm/pg-core';

export const bookings = pgTable('bookings', {
  id: serial('id').primaryKey(),
  pnrCode: text('pnr_code').notNull(),
  flightCode: text('flight_code').notNull(),
  flightDate: timestamp('flight_date').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
});
