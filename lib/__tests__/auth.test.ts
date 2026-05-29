import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';

describe('admin-emails', () => {
  const originalEnv = process.env.ADMIN_EMAILS;

  beforeEach(() => {
    delete process.env.ADMIN_EMAILS;
  });

  afterEach(() => {
    if (originalEnv) {
      process.env.ADMIN_EMAILS = originalEnv;
    } else {
      delete process.env.ADMIN_EMAILS;
    }
  });

  it('returns empty list when ADMIN_EMAILS is unset', async () => {
    const { getAdminEmails } = await import('../admin-emails');
    expect(getAdminEmails()).toEqual([]);
  });

  it('parses comma-separated admin emails', async () => {
    process.env.ADMIN_EMAILS = 'Admin@Example.com, other@example.com';
    const { getAdminEmails, isAdminEmail } = await import('../admin-emails');
    expect(getAdminEmails()).toEqual(['admin@example.com', 'other@example.com']);
    expect(isAdminEmail('other@example.com')).toBe(true);
    expect(isAdminEmail('not-admin@example.com')).toBe(false);
  });
});

describe('auth isAdmin', () => {
  it('returns false when user is null', async () => {
    const { isAdmin } = await import('../auth');
    expect(isAdmin(null)).toBe(false);
  });

  it('returns true for allowlisted email', async () => {
    process.env.ADMIN_EMAILS = 'admin@example.com';
    const { isAdmin } = await import('../auth');
    expect(isAdmin({ email: 'admin@example.com' } as never)).toBe(true);
  });
});
