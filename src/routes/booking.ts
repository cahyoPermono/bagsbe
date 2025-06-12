import { Hono } from 'hono';
import { db } from '../db';
import { bookings } from '../models/booking';
import { eq } from 'drizzle-orm';
import { fetchFlights } from '../services/flightService';
import { pax } from '../models/pax';

const bookingRoute = new Hono();

// Create booking
bookingRoute.post('/', async (c) => {
  const body = await c.req.json();
  const [booking] = await db.insert(bookings).values(body).returning();
  return c.json(booking);
});

// Get all bookings
bookingRoute.get('/', async (c) => {
  // const all = await db.select().from(bookings);
  const rows = await db
    .select()
    .from(bookings)
    .leftJoin(pax, eq(bookings.id, pax.bookingId));

  // Group pax by booking
  const bookingMap: Record<number, any> = {};
  for (const row of rows) {
    const booking = row.bookings;
    const paxData = row.pax;
    if (!bookingMap[booking.id]) {
      bookingMap[booking.id] = { ...booking, pax: [] };
    }
    if (paxData) {
      bookingMap[booking.id].pax.push(paxData);
    }
  }
  const all = Object.values(bookingMap);
  // const all = await db.select().from(bookings);
  return c.json(all);
});

// Get booking by id
bookingRoute.get('/:id', async (c) => {
  const id = Number(c.req.param('id'));
  const [booking] = await db.select().from(bookings).where(eq(bookings.id, id));
  if (!booking) return c.notFound();
  return c.json(booking);
});

// Get bookings by PNR code
bookingRoute.get('/pnr/:pnrCode', async (c) => {
  const pnrCode = c.req.param('pnrCode');
  const rows = await db
    .select()
    .from(bookings)
    .leftJoin(pax, eq(bookings.id, pax.bookingId))
    .where(eq(bookings.pnrCode, pnrCode));

  // Group pax by booking
  const bookingMap: Record<number, any> = {};
  for (const row of rows) {
    const booking = row.bookings;
    const paxData = row.pax;
    if (!bookingMap[booking.id]) {
      bookingMap[booking.id] = { ...booking, paxes: [] };
    }
    if (paxData) {
      bookingMap[booking.id].paxes.push(paxData);
    }
  }
  const result = Object.values(bookingMap);
  return c.json(result);
});

// Endpoint to fetch flights from external API
bookingRoute.post('/fetch-flights', async (c) => {
  await c.req.json(); // Ignore payload, API uses hardcoded structure
  await fetchFlights(); // Call without arguments
  return c.json({ message: 'Flight API called, check server logs for result.' });
});

export default bookingRoute;
