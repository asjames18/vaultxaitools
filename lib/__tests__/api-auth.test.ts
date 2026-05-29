import { describe, it, expect } from '@jest/globals';

describe('api-auth exports', () => {
  it('exports getAuthenticatedUser helper', async () => {
    const mod = await import('../api-auth');
    expect(typeof mod.getAuthenticatedUser).toBe('function');
    expect(typeof mod.requireAuthenticatedUser).toBe('function');
  });
});
