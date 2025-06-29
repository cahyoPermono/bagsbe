import { Hono } from 'hono';
import { createBaggageTracking, updateBaggageStatus, getBaggageTracking, BaggageStatus, addBaggageStep } from '../models/baggage';
import { baggageTrackingSteps } from '../models/baggageStep';
import { db } from '../db';
import { eq } from 'drizzle-orm';
import { pax } from '../models/pax';
import { bookings } from '../models/booking';
import { flights } from '../models/flight';

const baggageRoute = new Hono();

// Update baggage status (for staff)
baggageRoute.put('/:baggageNumber/status', async (c) => {
  const { status } = await c.req.json();
  const { baggageNumber } = c.req.param();
  const validStatuses: BaggageStatus[] = [
    'checkin counter',
    'security cleared (origin)',
    'loaded onto aircraft',
    'unloaded at destination',
    'security cleared (destination)',
    'in baggage claim area',
  ];
  if (!validStatuses.includes(status)) {
    return c.json({ error: 'Invalid status' }, 400);
  }
  const updated = await updateBaggageStatus(baggageNumber, status);
  if (!updated.length) return c.notFound();
  await addBaggageStep(baggageNumber, status); // log waktu step
  return c.json(updated[0]);
});

// Update baggage to next step automatically
baggageRoute.put('/:baggageNumber/next-step', async (c) => {
  const { baggageNumber } = c.req.param();
  // Urutan step
  const steps: BaggageStatus[] = [
    'checkin counter',
    'security cleared (origin)',
    'loaded onto aircraft',
    'unloaded at destination',
    'security cleared (destination)',
    'in baggage claim area',
  ];
  const tracking = await getBaggageTracking(baggageNumber);
  if (!tracking) return c.notFound();
  // Pastikan status bertipe BaggageStatus
  const currentStatus = tracking.status as BaggageStatus;
  const currentIdx = steps.indexOf(currentStatus);
  if (currentIdx === -1) {
    return c.json({ error: 'Status tidak valid pada data' }, 400);
  }
  if (currentIdx === steps.length - 1) {
    return c.json({ message: 'Baggage sudah berada di tempat terakhir', status: tracking.status });
  }
  const nextStatus = steps[currentIdx + 1];
  const updated = await updateBaggageStatus(baggageNumber, nextStatus);
  await addBaggageStep(baggageNumber, nextStatus);
  return c.json({ message: `Status baggage diperbarui ke ${nextStatus}`, data: updated[0] });
});

// Update get baggage tracking info to include flight, pax, and booking info
baggageRoute.get('/:baggageNumber', async (c) => {
  const { baggageNumber } = c.req.param();
  const tracking = await getBaggageTracking(baggageNumber);
  if (!tracking) return c.notFound();

  // Get passenger info
  const paxResult = await db.select().from(pax).where(eq(pax.id, tracking.paxId));
  const paxData = paxResult[0];

  // Get booking info
  // let bookingData = null;
  // let flightData = null;
  // if (paxData) {
  //   const bookingResult = await db.select().from(bookings).where(eq(bookings.id, paxData.bookingId));
  //   bookingData = bookingResult[0];
  //   // Get flight info
  //   if (bookingData) {
  //     const flightResult = await db.select().from(flights).where(eq(flights.flightNo, bookingData.flightCode));
  //     flightData = flightResult[0];
  //   }
  // }

  return c.json({
    baggageTracking: tracking,
    passenger: paxData,
    // booking: bookingData,
    // flight: flightData,
  });
});

// Get all steps for a baggage number
baggageRoute.get('/:baggageNumber/steps', async (c) => {
  const { baggageNumber } = c.req.param();
  const steps = await db.select().from(baggageTrackingSteps).where(eq(baggageTrackingSteps.baggageNumber, baggageNumber));
  return c.json(steps);
});

export default baggageRoute;
