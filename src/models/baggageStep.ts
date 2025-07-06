import { db } from './../db';
import { baggageTrackingSteps } from './_schema';

export async function addBaggageStepForBagTag(bagTagId: number, step: string, baggageNumber: string) {
  return db.insert(baggageTrackingSteps).values({ bagTagId, step, baggageNumber }).returning();
}
