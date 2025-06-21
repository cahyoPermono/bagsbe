import { integer, text, timestamp, pgTable, serial } from 'drizzle-orm/pg-core';

export const baggageTrackingSteps = pgTable('baggage_tracking_steps', {
  id: serial('id').primaryKey(),
  baggageNumber: text('baggage_number').notNull(),
  step: text('step').notNull(),
  stepTime: timestamp('step_time').defaultNow().notNull(),
});
