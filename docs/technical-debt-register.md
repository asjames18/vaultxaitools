# Technical Debt Register — Melanated In Tech

**Last Updated:** 2026-06-03
**Audit Scope:** Full codebase analysis of `E:\vaultxaitools`
**Total Issues:** 30

---

## Summary

| Severity | Count |
|----------|-------|
| CRITICAL | 4 |
| HIGH | 9 |
| MEDIUM | 13 |
| LOW | 4 |
| **TOTAL** | **30** |

---

## CRITICAL Issues

| ID | File(s) | Category | Description | Fix Effort |
|----|---------|----------|-------------|-----------|
| C01 | `middleware.ts`, `app/debug*` pages | Dead Code / Security | Debug routes (`/debug-supabase`, `/debug-admin`, `/test-*`, `/ui-showcase`) publicly accessible in production. Exposes internal system state. | Small |
| C02 | `app/api/debug-admin/route.ts` | Security | API route that exposes admin configuration to unauthenticated callers. | Small |
| C03 | `lib/admin-emails.ts` (lines 5–8) | Security / Config | Admin access controlled via `ADMIN_EMAILS` env var only. If env var leaks, cannot rotate access without redeployment. | Small |
| C04 | `package.json` (build) | Build / Platform | Build fails on Windows with EISDIR errors on `app/api/admin/automation/route.ts`. Cannot verify production build locally. | Medium |

---

## HIGH Issues

| ID | File(s) | Category | Description | Fix Effort |
|----|---------|----------|-------------|-----------|
| H01 | `lib/supabase.ts`, `lib/supabase-server.ts`, `lib/supabaseClient.ts`, `lib/supabaseAdminClient.ts` | Architecture / Duplication | Five Supabase client factories with overlapping responsibility. Deprecated wrappers cause confusion and potential session bugs. | Medium |
| H02 | `lib/database.types.ts` | Type Safety | Type stub only — single generic `Database` interface. No actual schema generation. Zero type safety on DB queries. | Small |
| H03 | `lib/supabase-server.ts` (lines 22, 33, 62) | Type Safety | Multiple `as any` casts on cookie handler and auth config. | Small |
| H04 | `lib/useOptimizedSubscriptions.ts` (lines 7, 14, 74) | Type Safety | `automationStatus: any`, `supabase: any = null` — prevents compile-time checks. | Small |
| H05 | `app/api/admin/workflows/execute/route.ts` (lines 130–157) | Dead Code | Mock workflow executor with simulated random 10% failure rate. Not wired to real engine. Admin dashboard UI is non-functional. | Medium |
| H06 | `middleware.ts`, `/admin/login` | Authorization | Admin access relies on `isAdminEmail()` check. If `ADMIN_EMAILS` env var is empty in prod, no fallback — risk of lockout. | Small |
| H07 | `app/api/favorites/route.ts` + 5 others | Duplication / Auth | Copy-pasted Bearer token extraction across 6+ API routes. Inconsistent handling. | Small |
| H08 | `next.config.ts` | Developer Experience | ESLint disabled in Next.js 15 build. No automated code quality gate in CI. | Medium |
| H09 | `supabase/schema.sql`, `scripts/create-*.sql`, `supabase/migrations/` | Schema | Schema sources fragmented across multiple files. Missing FK `favorites → tools`. Unclear source of truth. | Medium |

---

## MEDIUM Issues

| ID | File(s) | Category | Description | Fix Effort |
|----|---------|----------|-------------|-----------|
| M01 | `app/admin/blog/BlogManagementClient.tsx` (788 lines), `components/SEOContentOptimizer.tsx` (811+ lines), +12 others | Maintainability | Oversized component files >400–1200 lines. Exceeds AI agent context windows. | Medium |
| M02 | `components/AdvancedSearch.tsx`, `components/admin/AdvancedSearch.tsx` | Duplication | Two nearly identical AdvancedSearch components with different prop shapes. Double maintenance burden. | Small |
| M03 | Multiple API routes | Code Quality | Bearer token auth repeated 6+ places without centralization. | Small |
| M04 | `lib/api.js` | Dead Code | Unused Express/JWT backend client — zero imports. | Trivial |
| M05 | `env.example` | Documentation | References MongoDB, JWT, Cloudinary, PORT=5000 — all removed. Wrong setup instructions. | Small |
| M06 | `README.md` (lines 1–5) | Documentation | Claims "Express.js" backend and "JWT" — both replaced. | Small |
| M07 | `scripts/` (104 files) | Tooling | Duplicate seed scripts. Unclear which to run. No canonical seeder. | Medium |
| M08 | `lib/database-client.ts` (lines 267–268) | Type Safety | `any` casts on category filtering. | Small |
| M09 | `app/api/analytics/affiliate-click/route.ts` | Incomplete | Affiliate click tracking disabled or stubbed. Admin affiliate dashboard non-functional. | Medium |
| M10 | `app/api/admin/automation-status/route.ts` | Dead Code | Returns stub status. Not wired to real data source. | Small |
| M11 | Multiple API routes | Error Handling | Inconsistent error logging. Some routes have `console.error()`, others silently catch. | Small |
| M12 | `package.json` | Dependencies | `@supabase/auth-helpers-nextjs` deprecated and redundant alongside `@supabase/ssr`. | Small |
| M13 | `lib/useOptimizedSubscriptions.ts` | Type Safety | Loose typing on subscription state. `any` casts hide errors. | Small |

---

## LOW Issues

| ID | File(s) | Category | Description | Fix Effort |
|----|---------|----------|-------------|-----------|
| L01 | 18 component files | Code Quality | 31 `console.log()` statements in production components. | Small |
| L02 | `components/ErrorBoundary.tsx`, `components/GoogleAnalytics.tsx` | Documentation | 2 untracked TODO comments. | Trivial |
| L03 | `app/AITools` route | SEO | Non-standard PascalCase route. Inconsistent with `/tools`. | Medium |
| L04 | `scripts/` | Code Quality | 104 mostly `.js` files without type safety. | Low Priority |

---

## Dependency Audit

| Package | Issue | Severity |
|---------|-------|----------|
| `@supabase/auth-helpers-nextjs` ^0.10.0 | Deprecated; replaced by `@supabase/ssr` | MEDIUM |
| `postcss` ^8.4.32 | 2 moderate vulnerabilities — build-time only | MEDIUM |
| ESLint config | Incompatible with Next.js 15 | HIGH |

---

## API Route Error Handling Audit

| Route | Try/Catch | Auth Check | Rate Limit | Notes |
|-------|-----------|-----------|-----------|-------|
| `app/api/admin/tools/route.ts` | ✅ | ✅ | ✅ | Well-structured |
| `app/api/favorites/route.ts` | ✅ | ✅ | ✅ | Missing error log |
| `app/api/search/route.ts` | ✅ | ❌ | ❌ | No auth or rate limit |
| `app/api/reviews/route.ts` | ✅ | ❌ | ✅ | Missing auth |
| `app/api/admin/workflows/execute/route.ts` | ✅ | ❌ | ❌ | Mock executor |

---

## Debt Paydown Roadmap

### Week 1 — Security & Build (CRITICAL)
1. C03 — Enforce `user_roles` table for admin check
2. C01 — Remove/gate all debug routes
3. C04 — Fix Windows build issue; verify in CI
4. H08 — Fix ESLint for Next.js 15

### Week 2 — Architecture & Types (HIGH)
1. H01 — Consolidate to 3 Supabase client exports
2. H02 — Run `supabase gen types` and wire to CI
3. H03, H04 — Remove `any` casts from server/hooks

### Week 3 — Code Quality (MEDIUM)
1. M03 — Centralize API auth in `lib/api-auth.ts`
2. M07 — Consolidate seed scripts
3. H05 — Implement or remove workflow mock
4. H09 — Unify schema under `supabase/migrations/`

### Ongoing — Polish
- M01 — Split oversized components on next touch
- L01 — Remove `console.log()` from production code
- M05, M06 — Update `env.example` and `README.md`
