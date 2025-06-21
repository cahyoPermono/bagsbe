import { db } from '../db';
import { integer, text, timestamp, pgTable, serial } from 'drizzle-orm/pg-core';
import { eq } from 'drizzle-orm';
import { baggageTrackingSteps } from '../models/baggageStep';

export const baggageTracking = pgTable('baggage_tracking', {
  id: serial('id').primaryKey(),
  baggageNumber: text('baggage_number').notNull().unique(),
  paxId: integer('pax_id').notNull(),
  status: text('status').notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

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

export async function createBaggageTracking(paxId: number, baggageNumber: string) {
  return db.insert(baggageTracking).values({ paxId, baggageNumber, status: 'checkin counter' }).returning();
}

export async function updateBaggageStatus(baggageNumber: string, status: BaggageStatus) {
  return db.update(baggageTracking)
    .set({ status, updatedAt: new Date() })
    .where(eq(baggageTracking.baggageNumber, baggageNumber))
    .returning();
}

export async function getBaggageTracking(baggageNumber: string) {
  const result = await db.select().from(baggageTracking).where(eq(baggageTracking.baggageNumber, baggageNumber));
  return result[0];
}

export async function addBaggageStep(baggageNumber: string, step: BaggageStatus) {
  return db.insert(baggageTrackingSteps).values({ baggageNumber, step }).returning();
}
