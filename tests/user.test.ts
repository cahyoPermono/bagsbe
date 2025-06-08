import { describe, it, expect } from 'vitest';
import { users } from '../src/models/user';

describe('users model', () => {
  it('should have correct columns', () => {
    expect(Object.keys(users)).toEqual(
      expect.arrayContaining([
        'id', 'username', 'password', 'role'
      ])
    );
  });
});
