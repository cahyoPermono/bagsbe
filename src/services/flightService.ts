import fetch from "node-fetch";
import https from "https";
import axios from "axios";
import tls from "tls";
import { db } from "../db";
import { flights } from "../models/_schema";
import { fetchPassengerList } from "./passengerService";
import { and, eq } from "drizzle-orm";

const FLIGHT_API_URL =
  "https://sapp-api.asyst.co.id/exbag-dcs-devDCSLST_FlightListDisplay";
const FLIGHT_API_HEADERS = {
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

export async function fetchFlights() {
  const nowDate = new Date();
  const year = nowDate.getFullYear();
  const month = nowDate.getMonth() + 1; // getMonth() is 0-based
  const day = nowDate.getDate();
  const payload = {
    data: {
      carrier: {
        companyIdentification: {
          operatingCompany: "GA",
        },
      },
      searchPeriod: {
        businessSemantic: "SDT",
        beginDateTime: {
          year,
          month,
          day,
          hour: 0,
          minutes: 1,
        },
        endDateTime: {
          year,
          month,
          day,
          hour: 23,
          minutes: 59,
        },
      },
      portCode: [{ airportCode: "CGK" }, { airportCode: "SUB" }],
      displayType: {
        statusInformation: {
          indicator: "DD",
        },
      },
    },
  };
  try {
    console.log(payload);

    const response = await axios.post(
      "https://sapp-api.asyst.co.id/exbag-dcs-dev/DCSLST_FlightListDisplay",
      payload,
      {
        headers: FLIGHT_API_HEADERS,
        httpsAgent,
      }
    );
    const flightsData = response.data?.data?.flights || [];
    const now = new Date();
    for (const f of flightsData) {
      // jika fligth dengan flightno, operatingCarrier, boardPoint, offPoint, departureDate yang sama sudah ada, skip
      const existingFlight = await db
        .select()
        .from(flights)
        .where(
          and(
            eq(flights.flightNo, f.flightId.flightDetails.flightNumber),
            eq(
              flights.operatingCarrier,
              f.flightId.carrierDetails.operatingCarrier
            ),
            eq(flights.boardPoint, f.flightId.boardPoint),
            eq(flights.offPoint, f.flightId.offPoint),
            eq(flights.departureDate, f.flightId.departureDate)
          )
        );
      if (existingFlight.length == 0) {
        await db
          .insert(flights)
          .values({
            flightNo: f.flightId.flightDetails.flightNumber,
            operatingCarrier: f.flightId.carrierDetails.operatingCarrier,
            boardPoint: f.flightId.boardPoint,
            offPoint: f.flightId.offPoint,
            departureDate: f.flightId.departureDate,
            createdAt: now,
            updatedAt: now,
          })
          .onConflictDoNothing();
      }
      // Call fetchPassengerList after inserting each flight
      await fetchPassengerList(
        f.flightId.flightDetails.flightNumber,
        f.flightId.departureDate,
        f.flightId.boardPoint
      );
    }
    console.log("Flight API result:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching flights:", error);
    throw error;
  }
}
