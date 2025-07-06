
import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text } from 'drizzle-orm/pg-core';
import { baggageTracking } from './baggage';
import { pax } from './pax';
import { baggageTrackingSteps } from './baggageStep';

export const bagTags = pgTable('bag_tags', {
  id: serial('id').primaryKey(),
  nomor: text('nomor').notNull(),
  status: text('status').notNull(),
  keterangan: text('keterangan'),
  paxId: integer('pax_id').references(() => pax.id).notNull(),
  baggageTrackingId: integer('baggage_tracking_id').references(() => baggageTracking.id).notNull(),
});

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
