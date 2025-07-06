import { db } from '../db';
import { bagTags } from './_schema';

export async function createBagTag(nomor: string, status: string, keterangan: string, paxId: number, baggageTrackingId: number) {
  const [newBagTag] = await db.insert(bagTags).values({
    nomor,
    status,
    keterangan,
    paxId,
    baggageTrackingId,
  }).returning();
  return newBagTag;
}

export { bagTags };
