# Security Register — Melanated In Tech

**Audit Date:** 2026-06-03
**Application:** Next.js + Supabase + Clerk
**Overall Security Posture:** MODERATE — CRITICAL findings require immediate remediation before production

---

## Overall Score: 6.5 / 10

**Strengths:** Middleware-based auth, RLS policies, rate limiting, security headers
**Blockers:** Service role key exposure, SQL injection in search, no CSRF protection

---

## 🔴 CRITICAL Findings

### CRIT-1: Service Role Key Exposed in Debug Page
- **File:** `app/debug-admin-blog/page.tsx` (lines 7–8)
- **Issue:** `SUPABASE_SERVICE_ROLE_KEY` (full admin privileges) used in a publicly accessible debug page's HTTP headers. Anyone can make admin API calls.
- **Fix:** Delete this page immediately. Never use service role key in client-accessible code.

### CRIT-2: Service Role Client Initialized at Module Level
- **Files:** `app/api/admin/users/route.ts`, `app/api/admin/workflows/route.ts`, `app/api/admin/blog/route.ts`, `app/api/search/advanced/route.ts`
- **Issue:** Service role client created at module level before authentication is verified. If any handler is missing an auth check, the key is accessible.
- **Fix:** Initialize service role client inside route handlers, after auth verification completes.

### CRIT-3: SQL Injection via Unsanitized `.or()` Queries
- **File:** `app/api/search/route.ts` (lines 60, 67, 73, 79–81)
- **Issue:** User input directly interpolated into PostgREST `.or()` filter strings:
  ```typescript
  supabaseQuery = supabaseQuery.or(`integrations::text.ilike.%${integration}%`);
  ```
  Attackers can bypass filters or extract unintended data.
- **Fix:** Replace string interpolation with proper parameterized filter methods (`.ilike()`, `.overlaps()`).

### CRIT-4: Admin Auth Falls Back to "Trust Middleware" on Error
- **File:** `app/admin/page.tsx` (line 54)
- **Issue:** Client-side admin check falls back to `setCanAccess(true)` if the API call fails — any network error grants admin access.
- **Fix:** Fail closed. Network errors should deny access, not grant it.

---

## 🟠 HIGH Findings

### HIGH-1: Debug Routes Expose Internal State
- **Files:** `app/debug/page.tsx`, `app/debug-supabase/page.tsx` + others
- **Issue:** Expose DB schema, env var names, user auth state in staging/QA. Enables schema enumeration.
- **Fix:** Delete all debug pages. If needed for development, gate by IP allowlist.

### HIGH-2: No Input Validation on Admin Password Reset
- **File:** `app/api/admin/users/[id]/password/route.ts` (lines 15–20)
- **Issue:** Only enforces 6-character minimum. Admins can set passwords like "123456".
- **Fix:** Require 12+ characters with complexity (uppercase, lowercase, number, special char).

### HIGH-3: RLS Allows Self-Modification of Recommendation Scores
- **File:** `supabase/migrations/003_phase15_gamification.sql` (lines 193–210)
- **Issue:** UPDATE policy lets any user modify their own recommendation scores — gameable.
- **Fix:** Remove the UPDATE policy. Recommendations are system-generated and should not be user-editable.

### HIGH-4: No CSRF Protection on Admin State-Changing Operations
- **Files:** All `app/api/admin/**` routes with PUT/POST/DELETE
- **Issue:** No CSRF token validation. A malicious site could trick an admin into executing destructive actions.
- **Fix:** Implement CSRF token generation/validation in middleware. Set `SameSite=Strict` on cookies.

### HIGH-5: No Rate Limiting on Password Reset Requests
- **File:** `app/api/admin/users/[id]/resend-verification/route.ts`
- **Issue:** No per-user rate limiting on password reset requests — allows token farming.
- **Fix:** Max 5 reset requests per user per hour, consistent with login rate limiting in `lib/rateLimit.ts`.

---

## 🟡 MEDIUM Findings

| ID | File | Issue | Fix |
|----|------|-------|-----|
| MED-1 | `middleware.ts` (lines 158–166) | Service role key in HTTP headers for PostgREST calls in edge middleware | Use Supabase client library instead of raw fetch |
| MED-2 | `lib/rateLimit.ts` | In-memory rate limiter — lost on restart, not shared across instances | Replace with Redis or Supabase-backed store |
| MED-3 | `next.config.ts` (line 68) | CSP uses `unsafe-inline` and `unsafe-eval` — weakens XSS protection | Migrate to nonce-based CSP |
| MED-4 | `app/api/admin/blog/route.ts` | Blog slug not validated for uniqueness — duplicate slugs cause routing/SEO issues | Add unique constraint check before insert/update |
| MED-5 | `app/api/admin/users/route.ts` | New user creation doesn't check for existing email — silent failures possible | Check email existence before creating |
| MED-6 | Multiple API routes | Error responses return raw Supabase error messages — leaks schema info | Return generic error messages in production |

---

## 🟢 LOW Findings

| ID | Issue | Fix |
|----|-------|-----|
| LOW-1 | No explicit idle session timeout | Implement session expiry after 1 hour of inactivity |
| LOW-2 | No `/.well-known/security.txt` | Create with contact email and expiry |

---

## ✅ Positive Findings (Working Correctly)

1. **RLS Policies** — Correctly implemented for `favorites`, `user_achievements`, `user_recommendations`. Users cannot access each other's data.
2. **Middleware-Level Auth** — Routes protected before handlers execute. Defense in depth.
3. **Security Headers** — CSP, X-Frame-Options, Referrer-Policy configured in `next.config.ts`.
4. **Rate Limiting** — Login (5/15min), admin (100/15min), sensitive ops (10/1hr) in `lib/rateLimit.ts`.
5. **Admin Allowlist** — Environment variable-based admin control avoids hardcoded credentials.
6. **Anon Key for Public APIs** — Public routes use anon key with RLS, not service role key.

---

## Remediation Timeline

### Immediate — This Week
1. Delete `app/debug-admin-blog/page.tsx`
2. Move service role client init inside route handlers (after auth check)
3. Fix SQL injection in `app/api/search/route.ts`
4. Fix admin page fallback to deny-on-error

### Short-Term — This Sprint
5. Add CSRF token validation to all admin state-changing routes
6. Increase password complexity requirements
7. Remove `user_recommendations` UPDATE policy
8. Implement per-user password reset rate limiting

### Medium-Term — This Quarter
9. Replace in-memory rate limiter with Redis
10. Replace `unsafe-inline`/`unsafe-eval` in CSP with nonce-based approach
11. Add email uniqueness check in user creation
12. Standardize error responses (no raw DB errors to client)

### Long-Term — Ongoing
13. Automated security scanning in CI/CD
14. Regular `npm audit` in pipeline
15. WAF rules
16. Bug bounty program with `security.txt`
