import { baggageTracking } from './_schema';
import { relations } from 'drizzle-orm';
import { bagTags } from './bagTag';
import { baggageTrackingSteps } from './_schema';
import { pax } from './_schema';
import { bookings } from './_schema';

export const baggageTrackingRelations = relations(baggageTracking, ({ many }) => ({
  bagTags: many(bagTags),
}));

export const bagTagsRelations = relations(bagTags, ({ one, many }) => ({
  pax: one(pax, {
    fields: [bagTags.paxId],
    references: [pax.id],
  }),
  baggageTracking: one(baggageTracking, {
    fields: [bagTags.baggageTrackingId],
    references: [baggageTracking.id],
  }),
  steps: many(baggageTrackingSteps),
}));

export const baggageTrackingStepsRelations = relations(baggageTrackingSteps, ({ one }) => ({
  bagTag: one(bagTags, {
    fields: [baggageTrackingSteps.bagTagId],
    references: [bagTags.id],
  }),
}));

export const paxRelations = relations(pax, ({ many }) => ({
  bagTags: many(bagTags),
}));

export const bookingsRelations = relations(bookings, ({ many }) => ({
  pax: many(pax),
}));
