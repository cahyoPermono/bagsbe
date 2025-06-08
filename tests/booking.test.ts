import { describe, it, expect } from 'vitest';
import { bookings } from '../src/models/booking';

describe('bookings model', () => {
  it('should have correct columns', () => {
    // Drizzle ORM exposes columns as properties on the table object
    expect(Object.keys(bookings)).toEqual(
      expect.arrayContaining([
        'id',
        'pnrCode',
        'flightCode',
        'flightDate',
        'createdAt',
        'updatedAt',
        'deletedAt',
      ])
    );
  });
});
