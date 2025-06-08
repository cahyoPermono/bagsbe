import { describe, it, expect } from 'vitest';
import { pax } from '../src/models/pax';

describe('pax model', () => {
  it('should have correct columns', () => {
    expect(Object.keys(pax)).toEqual(
      expect.arrayContaining([
        'id', 'paxName', 'paxNik', 'paxEmail', 'paxPhone', 'departureDate',
        'departureAirport', 'destinationAirport', 'flightNo', 'ticketNo', 'ticketType',
        'gaMilesNo', 'gaMilesTier', 'freeBagAllow', 'totalBagWeight', 'excessWeight',
        'excessCharge', 'statusPayment', 'ktpNik', 'ktpNama', 'ktpTptLahir', 'ktpTglLahir',
        'ktpKelamin', 'ktpGolDarah', 'ktpAlamat', 'ktpRt', 'ktpRw', 'ktpDesa',
        'ktpKecamatan', 'ktpPekerjaan', 'ktpCitizenship', 'createdAt', 'updatedAt',
        'deletedAt', 'bookingId'
      ])
    );
  });
});
