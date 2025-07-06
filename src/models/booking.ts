import { db } from '../db';
import { bookings } from './_schema';
import { eq } from 'drizzle-orm';

export async function getBookingById(id: number) {
  const [bookingData] = await db.select().from(bookings).where(eq(bookings.id, id));
  return bookingData;
}
