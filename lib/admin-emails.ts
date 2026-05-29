/**
 * Admin email allowlist from ADMIN_EMAILS env var.
 * Comma-separated list, e.g. ADMIN_EMAILS=admin@example.com,other@example.com
 */
export function getAdminEmails(): string[] {
  const raw = process.env.ADMIN_EMAILS;
  if (!raw) return [];
  return raw.split(',').map((email) => email.trim().toLowerCase()).filter(Boolean);
}

export function isAdminEmail(email: string): boolean {
  return getAdminEmails().includes(email.toLowerCase());
}
