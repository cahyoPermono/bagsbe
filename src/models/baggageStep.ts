import { db } from './../db';
import { baggageTracking } from './baggage';
import { integer, text, timestamp, pgTable, serial } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { bagTags } from './bagTag';

export const baggageTrackingSteps = pgTable('baggage_tracking_steps', {
  id: serial('id').primaryKey(),
  baggageNumber: text('baggage_number').notNull(),
  step: text('step').notNull(),
  stepTime: timestamp('step_time').defaultNow().notNull(),
  bagTagId: integer('bag_tag_id').references(() => bagTags.id).notNull(),
});

export const baggageTrackingStepsRelations = relations(baggageTrackingSteps, ({ one }) => ({
  bagTag: one(bagTags, {
    fields: [baggageTrackingSteps.bagTagId],
    references: [bagTags.id],
  }),
}));

export async function addBaggageStepForBagTag(bagTagId: number, step: string, baggageNumber: string) {
  return db.insert(baggageTrackingSteps).values({ bagTagId, step, baggageNumber }).returning();
}
