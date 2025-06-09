import fetch from 'node-fetch';
import https from 'https';

const FLIGHT_API_URL = 'https://sapp-api.asyst.co.id/exbag-dcs-devDCSLST_FlightListDisplay';
const FLIGHT_API_HEADERS = {
  'Content-Type': 'application/json',
  'env': 'PDT',
  'oid': 'JKTGA0605',
  'Authorization': 'Bearer 810859fc-7b18-3d2f-a79c-eb9712d236ec',
};

export async function fetchFlights() {
  const payload = {
    data: {
      carrier: {
        companyIdentification: {
          operatingCompany: 'GA',
        },
      },
      searchPeriod: {
        businessSemantic: 'SDT',
        beginDateTime: {
          year: 2025,
          month: 2,
          day: 15,
          hour: 0,
          minutes: 1,
        },
        endDateTime: {
          year: 2025,
          month: 2,
          day: 15,
          hour: 23,
          minutes: 59,
        },
      },
      portCode: [
        { airportCode: 'CGK' },
        { airportCode: 'SUB' },
      ],
      displayType: {
        statusInformation: {
          indicator: 'DD',
        },
      },
    },
  };
  try {
    const agent = new https.Agent({
      secureProtocol: 'TLSv1_2_method',
    });
    const response = await fetch(FLIGHT_API_URL, {
      method: 'POST',
      headers: FLIGHT_API_HEADERS,
      body: JSON.stringify(payload),
      agent,
    });
    const data = await response.json();
    console.log('Flight API result:', data);
    return data;
  } catch (error) {
    console.error('Error fetching flights:', error);
    throw error;
  }
}
