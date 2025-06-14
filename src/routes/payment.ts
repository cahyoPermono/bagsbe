import { Hono } from 'hono';
import { db } from '../db';
import { payments } from '../models/payment';
import { pax } from '../models/pax';
import { eq } from 'drizzle-orm';

const paymentRoute = new Hono();

// Create payment
paymentRoute.post('/', async (c) => {
  const body = await c.req.json();

  //tambahkan validasi apabila body kosong atau body.transaction_id kosong maka akan bad request
  if (!body || !body.transaction_id) {
    return c.text('Transaction ID is required', 400);
  }
  // Check if transaction_id already exists
  const existing = await db.select().from(payments).where(eq(payments.transId, body.transactionId));
  if (existing.length > 0) {
    return c.text('Transaction ID already exists', 409);
  }
  // Insert new payment
  const newPayment = {
    transId: body.transaction_id,
    paymentId: body.payment_details?.payment_id ?? '',
    totalPax: body.total_passengers,
    totalAmount: Number((body.payment_details?.total_amount || '0').replace(/[^\d.-]/g, '')),
    totalWaiveWeight: Number((body.payment_details?.total_waive_weight || '0').replace(/[^\d.-]/g, '')),
    totalWaiveAmount: Number((body.payment_details?.total_waive_amount || '0').replace(/[^\d.-]/g, '')),
    paymentMethod: body.payment_details?.payment_method,
    status: body.payment_details?.status,
  };
  const [created] = await db.insert(payments).values(newPayment).returning();

  if (created) {
    const passengerIds: number[] = body.passengers?.map((p: any) => p.pax_id) ?? [];
    if (passengerIds.length > 0) {
      // Assuming you have a 'paxes' table/model and a db.update method
      await Promise.all(
        passengerIds.map((paxId: number) =>
          db
            .update(pax)
            .set({ statusPayment: true })
            .where(eq(pax.id, paxId))
        )
      );
    }
  }
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
