import { db } from '../db';
import { flights } from './_schema';
import { eq } from 'drizzle-orm';

export async function getFlightById(id: number) {
  const [flightData] = await db.select().from(flights).where(eq(flights.id, id));
  return flightData;
}
