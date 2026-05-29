# Technical Debt Register

**Last updated:** 2026-05-29  
**Severity:** Critical · High · Medium · Low

---

## Critical

### TD-C01: Debug Routes Publicly Accessible
**Location:** `middleware.ts` public routes include `/debug-supabase`, `/test-favorites`, `/ui-showcase`; debug pages exist under `app/debug*`  
**Impact:** Information disclosure, unauthorized testing surface in production  
**Fix:** Remove from public routes; delete or gate behind `NODE_ENV=development`  
**Effort:** Small

### TD-C02: `/api/debug-env` Exposes Configuration
**Location:** `app/api/debug-env/route.ts`  
**Impact:** Leaks Supabase URL and env presence to unauthenticated callers  
**Fix:** Delete route or restrict to admin + non-production  
**Effort:** Small

### TD-C03: Hardcoded Admin Credentials
**Location:** `lib/auth.ts` lines 5–8, `middleware.ts` lines 64–66  
**Impact:** Cannot rotate admin access without code deploy; emails in source control  
**Fix:** Env-only allowlist + DB `user_roles`; remove hardcoded fallback in production  
**Effort:** Small

### TD-C04: Build Fails on Windows
**Location:** `npm run build` → `EISDIR` on `app/api/admin/automation/route.ts`  
**Impact:** Cannot verify production build in current dev environment  
**Fix:** Investigate webpack/Next.js Windows path issue; verify in CI (Linux)  
**Effort:** Medium

---

## High

### TD-H01: Dual Tool Data Sources
**Location:** `data/tools.ts` (639 lines) vs Supabase `tools` table; mixed imports across app  
**Impact:** Stale data, inconsistent counts, agent confusion  
**Fix:** Supabase primary; static seed-only  
**Effort:** Medium

### TD-H02: Fragmented Supabase Client Factories
**Location:** `lib/supabase.ts`, `supabase-server.ts`, `supabaseClient.ts`, `supabaseAdminClient.ts`, `lib/auth.ts`  
**Impact:** Session bugs, service key misuse risk, duplicated config  
**Fix:** Consolidate to 2–3 canonical factories  
**Effort:** Medium

### TD-H03: `database.types.ts` Is `any`
**Location:** `lib/database.types.ts` — single line stub  
**Impact:** No type safety on DB queries; `database-client.ts` types are illusory  
**Fix:** Generate from Supabase CLI  
**Effort:** Small

### TD-H04: Dashboard Returns Mock Data
**Location:** `app/api/dashboard/route.ts` lines 18–56  
**Impact:** Users see fake activity/stats  
**Fix:** Wire to profile/activity tables  
**Effort:** Medium

### TD-H05: ESLint Broken / Disabled in Build
**Location:** `eslint.config.mjs`, `next.config.ts`, `npm run lint` fails  
**Impact:** No automated code quality gate  
**Fix:** Migrate to ESLint CLI per Next.js 15 guidance  
**Effort:** Medium

### TD-H06: Schema Drift Across SQL Files
**Location:** `supabase/schema.sql` vs `scripts/create-*.sql` vs `supabase/migrations/`  
**Impact:** `read_time` type conflict, missing FK on favorites, tables only in scripts  
**Fix:** Numbered migrations as single source of truth  
**Effort:** Medium

### TD-H07: Category Naming Inconsistency
**Location:** DB seeds ("Video", "Writing") vs `database-client.ts` ("Video Editing", "Live Streaming")  
**Impact:** Broken filters, empty category pages, SEO duplicates  
**Fix:** Migration to canonical ministry categories  
**Effort:** Medium

### TD-H08: Minimal Test Coverage
**Location:** Only 2 Jest suites (`affiliate`, `trending`)  
**Impact:** Regressions undetected in auth, admin, API routes  
**Fix:** P0 tests per `06-testing-rubric.md`  
**Effort:** Large (ongoing)

---

## Medium

### TD-M01: Oversized Component Files
**Location:** `AdminDashboard.tsx` (1276), `CategoryPageClient.tsx` (788), `SEOContentOptimizer.tsx` (811), +15 files >400 lines  
**Impact:** Hard to maintain, exceeds agent context windows  
**Fix:** Split on next touch  
**Effort:** Medium per file

### TD-M02: Duplicate AdvancedSearch Components
**Location:** `components/AdvancedSearch.tsx`, `components/admin/AdvancedSearch.tsx`  
**Impact:** Double maintenance  
**Fix:** Shared hook + thin wrappers  
**Effort:** Small

### TD-M03: Copy-Pasted Bearer Token Auth
**Location:** `favorites`, `user/profile`, `user/export`, admin user routes  
**Impact:** Inconsistent auth behavior  
**Fix:** `lib/api-auth.ts` utility  
**Effort:** Small

### TD-M04: Dead Code — `lib/api.js`
**Location:** Express/JWT client, zero imports  
**Impact:** Confuses agents and developers  
**Fix:** Delete  
**Effort:** Trivial

### TD-M05: Legacy Env Template
**Location:** `env.example` — MongoDB, JWT, Cloudinary, PORT=5000  
**Impact:** Wrong setup instructions  
**Fix:** Trim to active vars only  
**Effort:** Small

### TD-M06: README Tech Stack Inaccuracy
**Location:** `README.md` claims Express + JWT backend  
**Impact:** Onboarding confusion  
**Fix:** Update to Next.js API + Supabase  
**Effort:** Small

### TD-M07: Duplicate Seed Scripts
**Location:** `seedTools.js` + `seedTools.ts`, 10+ overlapping seed/add scripts  
**Impact:** Unclear which script to run  
**Fix:** One canonical seeder + npm script  
**Effort:** Medium

### TD-M08: Affiliate Tracking Disabled
**Location:** `app/api/analytics/affiliate-click/route.ts`  
**Impact:** No revenue analytics  
**Fix:** Re-enable with compliance review  
**Effort:** Medium

### TD-M09: Automation API Stubbed
**Location:** `app/api/admin/automation/route.ts` — "scripts cleaned up"  
**Impact:** Admin automation dashboard non-functional  
**Fix:** Wire to workflow execution or remove UI  
**Effort:** Medium

### TD-M10: npm Audit Vulnerabilities
**Location:** 11 vulnerabilities (1 low, 5 moderate, 5 high) from `npm install`  
**Impact:** Supply chain risk  
**Fix:** `npm audit fix`; review breaking updates  
**Effort:** Small

### TD-M11: Missing npm Scripts Referenced in Docs
**Location:** Docs mention `update:ai-data`, `seed:ai-data` — not in `package.json`  
**Impact:** Broken developer workflow  
**Fix:** Add scripts or update docs  
**Effort:** Trivial

### TD-M12: `@supabase/auth-helpers-nextjs` Redundant
**Location:** `package.json` — legacy alongside `@supabase/ssr`  
**Impact:** Bundle bloat, pattern confusion  
**Fix:** Remove after confirming zero imports  
**Effort:** Small

---

## Low

### TD-L01: Console.log in Production Components
**Location:** 31 statements across 10 component files (per AUDIT_REPORT.md)  
**Impact:** Noise in production logs  
**Fix:** Remove or gate behind debug flag  
**Effort:** Small

### TD-L02: Non-Standard Route Casing `/AITools`
**Location:** App Router path  
**Impact:** SEO/agent inconsistency  
**Fix:** Redirect strategy to `/tools`  
**Effort:** Medium (SEO consideration)

### TD-L03: `data/README.md` Wrong Paths
**Location:** References `src/data/tools.ts`  
**Impact:** Doc confusion  
**Fix:** Update paths  
**Effort:** Trivial

### TD-L04: Mixed JS/TS in Scripts
**Location:** `scripts/` — 104 files, mostly `.js`  
**Impact:** No type safety in ops scripts  
**Fix:** Gradual TS migration for critical scripts only  
**Effort:** Low priority

### TD-L05: UX Demo / Showcase Pages
**Location:** `CachingStrategy.tsx`, `ResourceOptimizer.tsx`, `/performance`, `/ui-showcase`  
**Impact:** Dead weight in bundle if linked  
**Fix:** Move to Storybook or dev-only  
**Effort:** Low

### TD-L06: TODO Comments
**Location:** `GoogleAnalytics.tsx`, `ErrorBoundary.tsx`  
**Impact:** Minor  
**Fix:** Track in roadmap or resolve  
**Effort:** Trivial

---

## Debt Metrics

| Severity | Count |
|----------|-------|
| Critical | 4 |
| High | 8 |
| Medium | 12 |
| Low | 6 |
| **Total** | **30** |

---

## Paydown Strategy

1. **Week 1:** Critical security items (TD-C01–C03) + ESLint fix (TD-H05)
2. **Week 2:** Supabase client consolidation (TD-H02) + types generation (TD-H03)
3. **Week 3:** Tool data source unification (TD-H01) + category migration (TD-H07)
4. **Ongoing:** Test expansion (TD-H08), file splitting on touch (TD-M01)

Do not pay down debt by rewriting working features — incremental fixes only.
