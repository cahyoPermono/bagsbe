import { Hono } from 'hono';
import { createBaggageTracking, updateBaggageStatus, getBaggageTracking, BaggageStatus, addBaggageStep } from '../models/baggage';
import { baggageTrackingSteps } from '../models/baggageStep';
import { db } from '../db';
import { eq } from 'drizzle-orm';

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

// Get baggage tracking info
baggageRoute.get('/:baggageNumber', async (c) => {
  const { baggageNumber } = c.req.param();
  const tracking = await getBaggageTracking(baggageNumber);
  if (!tracking) return c.notFound();
  return c.json(tracking);
});

// Get all steps for a baggage number
baggageRoute.get('/:baggageNumber/steps', async (c) => {
  const { baggageNumber } = c.req.param();
  const steps = await db.select().from(baggageTrackingSteps).where(eq(baggageTrackingSteps.baggageNumber, baggageNumber));
  return c.json(steps);
});

export default baggageRoute;
