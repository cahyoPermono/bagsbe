import { db } from '../db';
import { payments } from './_schema';
import { eq } from 'drizzle-orm';

export async function createPayment(newPayment: any) {
  const [created] = await db.insert(payments).values(newPayment).returning();
  return created;
}

export async function getPaymentById(id: number) {
  const [found] = await db.select().from(payments).where(eq(payments.id, id));
  return found;
}

export async function getAllPayments() {
  const all = await db.select().from(payments);
  return all;
}

export async function updatePayment(id: number, data: any) {
  const [updated] = await db.update(payments).set(data).where(eq(payments.id, id)).returning();
  return updated;
}

export async function getPaymentByTransId(transId: string) {
  const [existing] = await db.select().from(payments).where(eq(payments.transId, transId));
  return existing;
}
