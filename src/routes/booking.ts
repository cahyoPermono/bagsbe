import { Hono } from 'hono';
import { db } from '../db';
import { bookings } from '../models/booking';
import { eq } from 'drizzle-orm';
import { fetchFlights } from '../services/flightService';

const bookingRoute = new Hono();

// Create booking
bookingRoute.post('/', async (c) => {
  const body = await c.req.json();
  const [booking] = await db.insert(bookings).values(body).returning();
  return c.json(booking);
});

// Get all bookings
bookingRoute.get('/', async (c) => {
  const all = await db.select().from(bookings);
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
  const result = await db.select().from(bookings).where(eq(bookings.pnrCode, pnrCode));
  return c.json(result);
});

// Endpoint to fetch flights from external API
bookingRoute.post('/fetch-flights', async (c) => {
  await c.req.json(); // Ignore payload, API uses hardcoded structure
  await fetchFlights(); // Call without arguments
  return c.json({ message: 'Flight API called, check server logs for result.' });
});

export default bookingRoute;
