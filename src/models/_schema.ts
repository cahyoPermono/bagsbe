import { integer, text, timestamp, pgTable, serial, boolean, doublePrecision, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Tables
export const baggageTracking = pgTable("baggage_tracking", {
  id: serial("id").primaryKey(),
  baggageNumber: text("baggage_number").notNull().unique(),
  paxId: integer("pax_id").notNull(),
  status: text("status").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const baggageTrackingSteps = pgTable('baggage_tracking_steps', {
  id: serial('id').primaryKey(),
  baggageNumber: text('baggage_number').notNull(),
  step: text('step').notNull(),
  stepTime: timestamp('step_time').defaultNow().notNull(),
  bagTagId: integer('bag_tag_id').notNull(),
});

export const bagTags = pgTable('bag_tags', {
  id: serial('id').primaryKey(),
  nomor: text('nomor').notNull(),
  status: text('status').notNull(),
  keterangan: text('keterangan'),
  paxId: integer('pax_id').notNull(),
  baggageTrackingId: integer('baggage_tracking_id').notNull(),
});

export const bookings = pgTable('bookings', {
  id: serial('id').primaryKey(),
  pnrCode: text('pnr_code').notNull(),
  flightCode: text('flight_code').notNull(),
  flightDate: timestamp('flight_date').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
});

export const flights = pgTable('flights', {
  id: serial('id').primaryKey(),
  flightNo: text('flight_no').notNull(),
  operatingCarrier: text('operating_carrier').notNull(),
  boardPoint: text('board_point').notNull(),
  offPoint: text('off_point').notNull(),
  departureDate: text('departure_date').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const pax = pgTable('pax', {
  id: serial('id').primaryKey(),
  paxName: text('pax_name').notNull(),
  paxNik: text('pax_nik'),
  paxEmail: text('pax_email'),
  paxPhone: text('pax_phone'),
  departureDate: timestamp('departure_date'),
  departureAirport: text('departure_airport'),
  destinationAirport: text('destination_airport'),
  flightNo: text('flight_no'),
  ticketNo: text('ticket_no'),
  ticketType: text('ticket_type'),
  gaMilesNo: text('ga_miles_no'),
  gaMilesTier: text('ga_miles_tier'),
  freeBagAllow: integer('free_bag_allow'),
  totalBagWeight: doublePrecision('total_bag_weight'),
  excessWeight: doublePrecision('excess_weight'),
  excessCharge: doublePrecision('excess_charge'),
  statusPayment: boolean('status_payment').default(false),
  ktpNik: text('ktp_nik'),
  ktpNama: text('ktp_nama'),
  ktpTptLahir: text('ktp_tpt_lahir'),
  ktpTglLahir: timestamp('ktp_tgl_lahir'),
  ktpKelamin: boolean('ktp_kelamin'),
  ktpGolDarah: text('ktp_gol_darah'),
  ktpAlamat: text('ktp_alamat'),
  ktpRt: text('ktp_rt'),
  ktpRw: text('ktp_rw'),
  ktpDesa: text('ktp_desa'),
  ktpKecamatan: text('ktp_kecamatan'),
  ktpPekerjaan: text('ktp_pekerjaan'),
  ktpCitizenship: text('ktp_citizenship'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
  bookingId: integer('booking_id').notNull(),
  paymentId: integer('payment_id'),
});

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

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 255 }).notNull().unique(),
  password: text('password').notNull(),
  role: varchar('role', { length: 50 }).notNull().default('user'),
});

// Relations
export const baggageTrackingRelations = relations(baggageTracking, ({ many }) => ({
  bagTags: many(bagTags),
}));

export const baggageTrackingStepsRelations = relations(baggageTrackingSteps, ({ one }) => ({
  bagTag: one(bagTags, {
    fields: [baggageTrackingSteps.bagTagId],
    references: [bagTags.id],
  }),
}));

export const bagTagsRelations = relations(bagTags, ({ one, many }) => ({
  pax: one(pax, {
    fields: [bagTags.paxId],
    references: [pax.id],
  }),
  baggageTracking: one(baggageTracking, {
    fields: [bagTags.baggageTrackingId],
    references: [baggageTracking.id],
  }),
  steps: many(baggageTrackingSteps),
}));

export const bookingsRelations = relations(bookings, ({ many }) => ({
  pax: many(pax),
}));

export const paxRelations = relations(pax, ({ one, many }) => ({
  booking: one(bookings, {
    fields: [pax.bookingId],
    references: [bookings.id],
  }),
  bagTags: many(bagTags),
}));
