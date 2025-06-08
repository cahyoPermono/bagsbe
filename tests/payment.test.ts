import { describe, it, expect } from 'vitest';
import { payments } from '../src/models/payment';

describe('payments model', () => {
  it('should have correct columns', () => {
    expect(Object.keys(payments)).toEqual(
      expect.arrayContaining([
        'id', 'paxId', 'amount', 'status', 'createdAt', 'updatedAt'
      ])
    );
  });
});
