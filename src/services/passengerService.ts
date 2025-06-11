import axios from "axios";
import https from "https";
import tls from "tls";
import { db } from "../db";
import { pax } from "../models/pax";
import { bookings } from "../models/booking";
// Import eq from your query builder (adjust the path if needed)
import { eq } from "drizzle-orm";

const PASSENGER_API_URL =
  "https://sapp-api.asyst.co.id/exbag-dcs-dev/DCSLST_GetPassengerList";
const PASSENGER_API_HEADERS = {
  Authorization: "Bearer 810859fc-7b18-3d2f-a79c-eb9712d236ec",
  env: "PDT",
  oid: "CGKGA00CM",
  "Content-Type": "application/json",
};

// Create relaxed TLS context
const secureContext = tls.createSecureContext({
  ciphers: "ALL:@SECLEVEL=0",
  honorCipherOrder: true,
});

// HTTPS agent using custom TLS settings
const httpsAgent = new https.Agent({
  secureContext,
});

export async function fetchPassengerList(
  flightNumber: string | number,
  departureDate: string,
  boardPoint: string
) {
  const payload = {
    data: {
      flightInfo: {
        carrierDetails: {
          marketingCarrier: "GA",
        },
        flightDetails: {
          flightNumber: flightNumber,
        },
        departureDate: departureDate,
        boardPoint: boardPoint,
      },
    },
  };
  try {
    const response = await axios.post(PASSENGER_API_URL, payload, {
      headers: PASSENGER_API_HEADERS,
      httpsAgent,
    });
    const extracted =
      response.data?.data?.flightDetailsGroup?.customerLevel || [];

    for (const p of extracted) {
      const now = new Date();
      let pnrCode = p.productLevel.sbrRecordLocator.reservation.controlNumber;

      let paxNew = {
        paxName: `${p.customerData.paxDetails.surname} ${
          p.customerData.otherPaxDetails?.givenName || ""
        }`.trim(),
        paxNik: p.uniqueCustomerId.idSection.primeId,
        departureDate: parseFlightDate(p.productLevel.flightInformation.flightDate.departureDate),
        departureAirport:
          p.productLevel.flightInformation.boardPointDetails.trueLocationId,
        destinationAirport:
          p.productLevel.flightInformation.offpointDetails.trueLocationId,
        flightNo:
          p.productLevel.flightInformation.flightIdentification.flightNumber,
        freeBagAllow: 20,
        totalBagWeight: 0.0,
        createdAt: now,
        updatedAt: now,
        bookingId: 0, // TODO: set correct bookingId if available
      };

      const existingBooking = await db
        .select()
        .from(bookings)
        .where(eq(bookings.pnrCode, pnrCode));

      if (existingBooking.length > 0) {
        paxNew.bookingId = existingBooking[0].id;
      } else {
        // If no existing booking, create a new one
        const newBooking = {
          pnrCode: pnrCode,
          flightCode: paxNew.flightNo,
          flightDate: paxNew.departureDate, // Use helper to parse string to Date
          createdAt: now,
          updatedAt: now,
          deletedAt: null,
        };
        const inserted = await db
          .insert(bookings)
          .values(newBooking)
          .returning();
        paxNew.bookingId = inserted[0].id;
      }
      // Convert createdAt/updatedAt to Date if not already
      if (typeof paxNew.createdAt === "string")
        paxNew.createdAt = new Date(paxNew.createdAt);
      if (typeof paxNew.updatedAt === "string")
        paxNew.updatedAt = new Date(paxNew.updatedAt);

      await db.insert(pax).values(paxNew).onConflictDoNothing();
    }
    console.log("Passenger List API result:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching passenger list:", error);
    throw error;
  }
}

// Helper function to parse 'YYYYMMDD' string to Date
function parseFlightDate(dateStr: string): Date {
  if (!dateStr || typeof dateStr !== "string" || dateStr.length !== 8)
    return new Date();
  const year = Number(dateStr.slice(0, 4));
  const month = Number(dateStr.slice(4, 6)) - 1; // JS months 0-based
  const day = Number(dateStr.slice(6, 8));
  return new Date(year, month, day);
}
