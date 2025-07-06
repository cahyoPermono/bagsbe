import { db } from '../db';
import { integer, text, timestamp, pgTable, serial } from 'drizzle-orm/pg-core';
import { eq, relations } from 'drizzle-orm';
import { baggageTrackingSteps } from '../models/baggageStep';
import { bagTags } from './bagTag';

export const baggageTracking = pgTable('baggage_tracking', {
  id: serial('id').primaryKey(),
  baggageNumber: text('baggage_number').notNull().unique(),
  paxId: integer('pax_id').notNull(),
  status: text('status').notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const baggageTrackingRelations = relations(baggageTracking, ({ many }) => ({
  bagTags: many(bagTags),
}));

export type BaggageStatus =
  | 'checkin counter'
  | 'security cleared (origin)'
  | 'loaded onto aircraft'
  | 'unloaded at destination'
  | 'security cleared (destination)'
  | 'in baggage claim area';

export interface BaggageTracking {
  id: number;
  baggage_number: string;
  pax_id: number;
  status: BaggageStatus;
  updated_at: string;
}

export async function createBaggageTrackingEntry(paxId: number, baggageNumber: string) {
  // Insert into baggageTracking
  const [tracking] = await db.insert(baggageTracking).values({ paxId, baggageNumber, status: 'checkin counter' }).returning();
  return tracking;
}

export async function updateBaggageStatus(baggageNumber: string, status: BaggageStatus) {
  return db.update(baggageTracking)
    .set({ status, updatedAt: new Date() })
    .where(eq(baggageTracking.baggageNumber, baggageNumber))
    .returning();
}

export async function getBaggageTracking(baggageNumber: string) {
  const result = await db.select().from(baggageTracking).where(eq(baggageTracking.baggageNumber, baggageNumber));
  const tracking = result[0];
  if (!tracking) return null;
  // Ambil steps dari baggageTrackingSteps
  const steps = await db.select().from(baggageTrackingSteps).where(eq(baggageTrackingSteps.baggageNumber, baggageNumber));
  return { ...tracking, steps };
}

export async function addBaggageStep(baggageNumber: string, step: BaggageStatus, bagTagId: number) {
  return db.insert(baggageTrackingSteps).values({ baggageNumber, step, bagTagId }).returning();
}
