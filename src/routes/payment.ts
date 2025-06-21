import { Hono } from "hono";
import { db } from "../db";
import { payments } from "../models/payment";
import { pax } from "../models/pax";
import { eq } from "drizzle-orm";
import { createBaggageTracking } from '../models/baggage';

const paymentRoute = new Hono();

// Create payment
paymentRoute.post("/", async (c) => {
  const body = await c.req.json();

  //tambahkan validasi apabila body kosong atau body.transaction_id kosong maka akan bad request
  if (!body || !body.transaction_id) {
    return c.text("Transaction ID is required", 400);
  }
  // Check if transaction_id already exists
  const existing = await db
    .select()
    .from(payments)
    .where(eq(payments.transId, body.transactionId));
  if (existing.length > 0) {
    return c.text("Transaction ID already exists", 409);
  }
  // Insert new payment
  const newPayment = {
    transId: body.transaction_id,
    paymentId: body.payment_details?.payment_id ?? "",
    totalPax: body.total_passengers,
    totalAmount: Number(
      (body.payment_details?.total_amount || "0").replace(/[^\d.-]/g, "")
    ),
    totalWaiveWeight: Number(
      (body.payment_details?.total_waive_weight || "0").replace(/[^\d.-]/g, "")
    ),
    totalWaiveAmount: Number(
      (body.payment_details?.total_waive_amount || "0").replace(/[^\d.-]/g, "")
    ),
    paymentMethod: body.payment_details?.payment_method,
    status: body.payment_details?.status,
  };
  const [created] = await db.insert(payments).values(newPayment).returning();

  if (created) {
    const passengerIds: number[] =
      body.passengers?.map((p: any) => p.pax_id) ?? [];
    if (passengerIds.length > 0) {
      await Promise.all(
        passengerIds.map(async (paxId: number) => {
          await db
            .update(pax)
            .set({ statusPayment: true, paymentId: created.id })
            .where(eq(pax.id, paxId));
          // Generate baggage number and create tracking
          const baggageNumber = `BG${paxId}${Date.now()}`;
          await createBaggageTracking(paxId, baggageNumber);
        })
      );
    }
  }
  return c.json(created);
});

// Get all payments
paymentRoute.get("/", async (c) => {
  const all = await db.select().from(payments);
  return c.json(all);
});

// Get payment by id
paymentRoute.get("/:id", async (c) => {
  const id = Number(c.req.param("id"));
  const [found] = await db.select().from(payments).where(eq(payments.id, id));
  if (!found) return c.notFound();

  // Fetch passengers related to this payment
  const passengers = await db
    .select()
    .from(pax)
    .where(eq(pax.paymentId, found.id));

  // Map payment details
  const paymentDetails = {
    payment_id: found.paymentId ?? "",
    total_amount: found.totalAmount?.toString() ?? "0",
    total_waive_weight: found.totalWaiveWeight?.toString() ?? "0",
    total_waive_amount: found.totalWaiveAmount?.toString() ?? "0",
    payment_method: found.paymentMethod ?? "",
    status: found.status ?? "",
  };

  // Map passengers
  const passengerList = passengers.map((p: any) => ({
    name: p.paxName,
    nik: p.paxNik,
    ktp: p.paxNik,
    phone: p.paxPhone,
    booking_id: p.bookingId?.toString() ?? "",
    flight_number: p.flightCode ?? "",
    route:
      p.departureAirport && p.destinationAirport
        ? `${p.departureAirport} - ${p.destinationAirport}`
        : "",
    departure_date: p.departureDate ? p.departureDate.toString() : "",
    free_baggage: p.freeBagAllow?.toString() ?? "0",
    actual_weight: p.totalBagWeight?.toString() ?? "0",
    excess_weight: p.excessWeight?.toString() ?? "0",
    excess_charge: p.excessCharge?.toString() ?? "0",
    pax_id: p.id,
  }));

  // Compose response
  const paymentDTO = {
    transaction_id: found.transId,
    timestamp: found.createdAt ? found.createdAt.toString() : "",
    total_passengers: found.totalPax ?? 0,
    payment_details: paymentDetails,
    passengers: passengerList,
  };

  return c.json(paymentDTO);
  // if (!found) return c.notFound();
  // return c.json(found);
});

// Update payment status
paymentRoute.put("/:id", async (c) => {
  const id = Number(c.req.param("id"));
  const body = await c.req.json();
  const [updated] = await db
    .update(payments)
    .set(body)
    .where(eq(payments.id, id))
    .returning();
  if (!updated) return c.notFound();
  return c.json(updated);
});

export default paymentRoute;
