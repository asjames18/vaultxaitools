# Testing Rubric

**Last updated:** 2026-05-29  
**Purpose:** Define what must be validated before merging or deploying changes.

---

## CI Pipeline (Current)

```bash
npm run ci
# Equivalent to:
npm run verify-env:prod && npm run lint && npm run build && npm test -- --ci
```

---

## Validation Tiers

### Tier 1 — Required for Every Change

| Check | Command | Pass Criteria |
|-------|---------|---------------|
| Environment | `npm run verify-env` | Required Supabase vars present |
| Unit tests | `npm test -- --ci` | All suites green |
| TypeScript | `npx tsc --noEmit` | Zero errors (not in CI today — add) |
| Import integrity | Build | No module resolution errors |

### Tier 2 — Required for Release / PR Merge

| Check | Command | Pass Criteria |
|-------|---------|---------------|
| Lint | `npm run lint` | Zero errors (currently broken — see debt) |
| Production build | `npm run build` | Completes without webpack errors |
| Route smoke | Manual or script | Key routes return 200 |

### Tier 3 — Required for Domain-Critical Changes

| Domain | What to Test |
|--------|--------------|
| **Auth** | Sign in, sign out, protected route redirect, admin gate |
| **Admin tools** | CRUD, publish, enrich, audit log entry |
| **Favorites** | Add, list, delete with authenticated user |
| **Reviews** | Submit, list, rating aggregation |
| **Search** | Query, filters, empty state |
| **Blog** | Create draft, publish, public slug access |
| **Contact** | Form submit, admin inbox |
| **RLS** | Non-admin cannot mutate admin tables |

---

## Current Test Inventory

| File | Covers | Priority to Expand |
|------|--------|-------------------|
| `lib/__tests__/trending.test.ts` | Trending score algorithm | Medium |
| `lib/__tests__/affiliate.test.ts` | UTM URL generation | Medium |

**Coverage gap:** ~99% of app logic untested.

---

## Recommended Test Additions (Priority Order)

### P0 — Auth & Admin
- [ ] `lib/auth.ts` — `getUserRole`, `canAccessAdmin` with mocked Supabase
- [ ] Admin API routes — 401 for unauthenticated, 403 for non-admin
- [ ] Middleware — public vs protected route classification

### P1 — Core Product
- [ ] `/api/search` — filter combinations, pagination
- [ ] `/api/favorites` — CRUD with mock auth
- [ ] `/api/reviews` — validation, duplicate prevention
- [ ] `lib/toolValidation.ts` — publish validation rules

### P2 — Data Integrity
- [ ] Tool seed script idempotency
- [ ] Category name normalization
- [ ] `scripts/data-quality-monitor.js` — exit codes for CI

### P3 — UI (Optional)
- [ ] Component smoke tests for `ToolCard`, `ReviewForm`
- [ ] E2E with Playwright for sign-in → favorite flow

---

## Manual Test Scripts

Existing in `scripts/` (run ad hoc):

| Script | Purpose |
|--------|---------|
| `smoke-test.js` | Basic health checks |
| `accessibility-test.js` | a11y scan |
| `test-supabase-connection.js` | DB connectivity |
| `test-admin-access.js` | Admin auth |
| `test-favorites-api.js` | Favorites API |

Wire critical smoke tests into CI when stabilized.

---

## Auth Test Matrix

| Scenario | Expected |
|----------|----------|
| Anonymous → `/dashboard` | Redirect to `/sign-in` |
| User → `/admin` | Redirect to `/admin/unauthorized` or login |
| Admin email → `/admin` | Access granted |
| Expired session → API mutation | 401 |
| Bearer token on favorites API | 200 with valid token |

---

## Database Write Test Matrix

| Operation | RLS Expectation |
|-----------|-----------------|
| Public read published tools | Allowed |
| User insert own favorite | Allowed |
| User delete own favorite | Allowed |
| Non-admin insert tool | Denied |
| Admin insert/update tool | Allowed |
| Public insert contact message | Allowed |

---

## Build Validation Notes (2026-05-29)

| Check | Result |
|-------|--------|
| `npm test -- --ci` | ✅ 2/2 suites pass |
| `npm run lint` | ❌ ESLint/Next.js 15 config incompatibility |
| `npm run build` | ❌ `EISDIR` webpack error on `app/api/admin/automation/route.ts` (Windows env) |

Document environment-specific failures; do not mark as passing without verification.

---

## Pre-Deploy Checklist

- [ ] `npm run ci` green (after lint/build fixes)
- [ ] Debug routes disabled or removed
- [ ] `NEXT_PUBLIC_DEBUG=false` in production
- [ ] `ADMIN_EMAILS` set via env (no hardcoded fallback reliance)
- [ ] Supabase migrations applied
- [ ] RLS policies verified
- [ ] No `console.log` in hot paths (or gated by debug flag)
- [ ] ISR revalidation tested for tool publish

---

## Adding New Tests

Place unit tests adjacent to source:

```
lib/
  trending.ts
  __tests__/
    trending.test.ts
```

Use Jest with existing `jest.config.js` (root-based module paths, `@/` alias).

Do not add tests that only assert mocks return mocks — test real business logic.
