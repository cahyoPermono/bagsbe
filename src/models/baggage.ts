import { db } from "../db";
import { eq } from "drizzle-orm";
import { baggageTracking, baggageTrackingSteps, bagTags } from "./_schema";

export type BaggageStatus =
  | "checkin counter"
  | "security cleared (origin)"
  | "loaded onto aircraft"
  | "unloaded at destination"
  | "security cleared (destination)"
  | "in baggage claim area";

export interface BaggageTracking {
  id: number;
  baggage_number: string;
  pax_id: number;
  status: BaggageStatus;
  updated_at: string;
}

export async function createBaggageTrackingEntry(
  paxId: number,
  baggageNumber: string
) {
  // Insert into baggageTracking
  const [tracking] = await db
    .insert(baggageTracking)
    .values({ paxId, baggageNumber, status: "checkin counter" })
    .returning();
  return tracking;
}

export async function updateBaggageStatus(
  baggageNumber: string,
  status: BaggageStatus
) {
  return db
    .update(baggageTracking)
    .set({ status, updatedAt: new Date() })
    .where(eq(baggageTracking.baggageNumber, baggageNumber))
    .returning();
}

export async function updateBagTagStatus(nomor: string, status: string) {
  return db
    .update(bagTags)
    .set({ status })
    .where(eq(bagTags.nomor, nomor))
    .returning();
}

export async function getBaggageTracking(baggageNumber: string) {
  const result = await db.query.baggageTracking.findFirst({
    where: eq(baggageTracking.baggageNumber, baggageNumber),
    with: {
      bagTags: {
        with: {
          steps: true,
        },
      },
    },
  });
  return result;
}

export async function getBaggageTrackingById(id: number) {
  const [result] = await db
    .select()
    .from(baggageTracking)
    .where(eq(baggageTracking.id, id));
  if (!result) return null;
  return result;
}
export async function getBagTags(baggageNumber: string) {
  const [result] = await db
    .select()
    .from(bagTags)
    .where(eq(bagTags.nomor, baggageNumber));
  if (!result) return null;
  return result;
}

export async function addBaggageStep(
  baggageNumber: string,
  step: BaggageStatus,
  bagTagId: number
) {
  return db
    .insert(baggageTrackingSteps)
    .values({ baggageNumber, step, bagTagId })
    .returning();
}

