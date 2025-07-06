import { db } from '../db';
import { pax } from './_schema';
import { eq } from 'drizzle-orm';

export async function updatePax(id: number, data: any) {
  const [updatedPax] = await db.update(pax).set(data).where(eq(pax.id, id)).returning();
  return updatedPax;
}

export async function getPaxById(id: number) {
  const [paxData] = await db.select().from(pax).where(eq(pax.id, id));
  return paxData;
}
