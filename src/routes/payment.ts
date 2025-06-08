import { Hono } from 'hono';
import { db } from '../db';
import { payments } from '../models/payment';
import { eq } from 'drizzle-orm';

const paymentRoute = new Hono();

// Create payment
paymentRoute.post('/', async (c) => {
  const body = await c.req.json();
  const [created] = await db.insert(payments).values(body).returning();
  return c.json(created);
});

// Get all payments
paymentRoute.get('/', async (c) => {
  const all = await db.select().from(payments);
  return c.json(all);
});

// Get payment by id
paymentRoute.get('/:id', async (c) => {
  const id = Number(c.req.param('id'));
  const [found] = await db.select().from(payments).where(eq(payments.id, id));
  if (!found) return c.notFound();
  return c.json(found);
});

// Update payment status
paymentRoute.put('/:id', async (c) => {
  const id = Number(c.req.param('id'));
  const body = await c.req.json();
  const [updated] = await db.update(payments).set(body).where(eq(payments.id, id)).returning();
  if (!updated) return c.notFound();
  return c.json(updated);
});

export default paymentRoute;
