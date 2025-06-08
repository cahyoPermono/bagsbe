// Payment model for Drizzle ORM
import { integer, text, timestamp, pgTable, serial, doublePrecision, boolean } from 'drizzle-orm/pg-core';
import { pax } from './pax';

export const payments = pgTable('payments', {
  id: serial('id').primaryKey(),
  paxId: integer('pax_id').references(() => pax.id).notNull(),
  amount: doublePrecision('amount').notNull(),
  status: boolean('status').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
