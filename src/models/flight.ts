// Flight model for Drizzle ORM
import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const flights = pgTable('flights', {
  id: serial('id').primaryKey(),
  flightNo: text('flight_no').notNull(),
  operatingCarrier: text('operating_carrier').notNull(),
  boardPoint: text('board_point').notNull(),
  offPoint: text('off_point').notNull(),
  departureDate: text('departure_date').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
