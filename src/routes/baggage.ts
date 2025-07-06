import { Hono } from "hono";
import {
  updateBaggageStatus,
  getBaggageTracking,
  BaggageStatus,
  addBaggageStep,
  getBagTags,
  updateBagTagStatus,
  getBaggageTrackingById,
} from "../models/baggage";
import { addBaggageStepForBagTag } from "../models/baggageStep";
import { db } from "../db";
import { eq, desc } from "drizzle-orm";
import { pax, baggageTracking, baggageTrackingSteps, bookings, flights, bagTags } from "../models/_schema";
import { authMiddleware } from "../middleware/auth";
import { getPaxById } from "../models/pax";
import { getBookingById } from "../models/booking";
import { getFlightById } from "../models/flight";

const baggageRoute = new Hono();

// Update baggage status (for staff)
baggageRoute.put("/:baggageNumber/status", async (c) => {
  const { status } = await c.req.json();
  const { baggageNumber } = c.req.param();
  const validStatuses: BaggageStatus[] = [
    "checkin counter",
    "security cleared (origin)",
    "loaded onto aircraft",
    "unloaded at destination",
    "security cleared (destination)",
    "in baggage claim area",
  ];
  if (!validStatuses.includes(status)) {
    return c.json({ error: "Invalid status" }, 400);
  }
  const updated = await updateBaggageStatus(baggageNumber, status);
  if (!updated.length) return c.notFound();
  // await addBaggageStep(baggageNumber, status); // log waktu step
  return c.json(updated[0]);
});

// Update baggage to next step automatically
baggageRoute.put("/:baggageNumber/next-step", async (c) => {
  const { baggageNumber } = c.req.param();
  // Urutan step
  const steps: BaggageStatus[] = [
    "checkin counter",
    "security cleared (origin)",
    "loaded onto aircraft",
    "unloaded at destination",
    "security cleared (destination)",
    "in baggage claim area",
  ];
  const tracking = await getBagTags(baggageNumber);
  if (!tracking)
    return c.json(
      { message: "Nomor bagasi yang dimaksud tidak ditemukan." },
      404
    );
  // Pastikan status bertipe BaggageStatus
  const currentStatus = tracking.status as BaggageStatus;
  const currentIdx = steps.indexOf(currentStatus);
  if (currentIdx === -1) {
    return c.json({ error: "Status tidak valid pada data" }, 400);
  }
  if (currentIdx === steps.length - 1) {
    return c.json({
      message: "Baggage sudah berada di tempat terakhir",
      status: tracking.status,
    });
  }
  const nextStatus = steps[currentIdx + 1];
  const [updated] = await updateBagTagStatus(baggageNumber, nextStatus);
  const baggageTracking = await getBaggageTrackingById(updated.baggageTrackingId);

  await addBaggageStepForBagTag(updated.id, nextStatus, baggageTracking!.baggageNumber.toString());
  return c.json({
    message: `Status baggage diperbarui ke ${nextStatus}`,
    data: updated,
  });
});

// Update get baggage tracking info to include flight, pax, and booking info
baggageRoute.get("/:baggageNumber", async (c) => {
  const { baggageNumber } = c.req.param();
  const tracking = await getBaggageTracking(baggageNumber);
  if (!tracking) return c.notFound();

  // Get passenger info
  const paxResult = await db
    .select()
    .from(pax)
    .where(eq(pax.id, tracking.paxId));
  const paxData = paxResult[0];

  return c.json({
    baggageTracking: tracking,
    passenger: paxData,
  });
});

// Get all steps for a baggage number
baggageRoute.get("/:baggageNumber/steps", async (c) => {
  const { baggageNumber } = c.req.param();
  const tracking = await getBaggageTracking(baggageNumber);
  if (!tracking) return c.notFound();
  return c.json(tracking);
});

baggageRoute.get("/", authMiddleware, async (c) => {
  // Optionally, add pagination/filtering here
  const allTracking = await db
    .select()
    .from(baggageTracking)
    .orderBy(desc(baggageTracking.id));
  return c.json(allTracking);
});

export default baggageRoute;



