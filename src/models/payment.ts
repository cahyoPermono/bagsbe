// Payment model for Drizzle ORM
import { integer, text, timestamp, pgTable, serial, doublePrecision, boolean } from 'drizzle-orm/pg-core';
import { pax } from './pax';

export const payments = pgTable('payments', {
  id: serial('id').primaryKey(),
  transId: text('trans_id').unique().notNull(),
  paymentId: text('payment_id'),
  totalPax: integer('total_pax'),
  totalAmount: doublePrecision('total_amount'),
  totalWaiveWeight: doublePrecision('total_waive_weight'),
  totalWaiveAmount: doublePrecision('total_waive_amount'),
  paymentMethod: text('payment_method'),
  status: text('status'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
  createdBy: integer('created_by'),
});
