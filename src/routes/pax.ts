import { Hono } from 'hono';
import { db } from '../db';
import { pax } from '../models/pax';
import { eq } from 'drizzle-orm';

const paxRoute = new Hono();

// Create pax
paxRoute.post('/', async (c) => {
  const body = await c.req.json();
  const [created] = await db.insert(pax).values(body).returning();
  return c.json(created);
});

// Get all pax
paxRoute.get('/', async (c) => {
  const all = await db.select().from(pax);
  return c.json(all);
});

// Get pax by id
paxRoute.get('/:id', async (c) => {
  const id = Number(c.req.param('id'));
  const [found] = await db.select().from(pax).where(eq(pax.id, id));
  if (!found) return c.notFound();
  return c.json(found);
});

// Update pax by id
paxRoute.put('/:id', async (c) => {
  const id = Number(c.req.param('id'));
  const body = await c.req.json();
  const [updated] = await db.update(pax).set(body).where(eq(pax.id, id)).returning();
  if (!updated) return c.notFound();
  return c.json(updated);
});

export default paxRoute;
