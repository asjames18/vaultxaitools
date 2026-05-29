# Next Tasks

**Last updated:** 2026-05-29  
**Ordered by value — tackle top-down unless blocked.**

---

## Immediate (This Sprint)

### 1. Fix CI Blockers
- [x] Fix ESLint config for Next.js 15 (`eslint` CLI + flat config)
- [x] Diagnose Windows build error — use `next build --turbo`; skip build in Windows CI runner
- [x] Add `npx tsc --noEmit` to CI script

### 2. Security Hardening (Quick Wins)
- [x] Remove `/api/debug-env`
- [x] Gate debug/test pages in production via `middleware.ts`
- [x] Remove hardcoded admin emails; use `ADMIN_EMAILS` env + `user_roles`
- [x] Document `ADMIN_EMAILS` in `env.example`

### 3. Consolidate Supabase Clients
- [x] Created `lib/supabase-admin.ts` with `createServiceRoleClient()`
- [x] Deprecated `lib/supabaseClient.ts` and `lib/supabaseAdminClient.ts` (re-exports)
- [x] Updated `lib/auth.ts` to use canonical admin client

---

## High Value (Next 2–4 Weeks)

### 4. Single Source of Truth for Tools
- [x] Extract shared types to `lib/types/tool.ts`
- [x] Migrated UI imports from `data/tools.ts` to `lib/types/tool.ts`
- [x] Marked `data/tools.ts` as seed-only
- [x] Added `lib/services/tools.ts` for runtime DB access
- [x] Add npm scripts: `seed:tools`, `update:ai-data`

### 5. Generate Database Types
- [x] Hand-written schema types in `lib/database.types.ts`
- [x] Fixed type errors in admin forms and sitemap

### 6. Wire Dashboard to Real Data
- [x] Replace mock data in `/api/dashboard` with Supabase queries
- [x] Migration `002_schema_alignment.sql` adds profiles + user_activity

### 7. Schema Alignment Migration
- [x] Created `supabase/migrations/002_schema_alignment.sql`

---

## Medium Value

### 8. Split Oversized Admin Components
- [x] `AdminDashboard.tsx` (1276 → ~804 lines) → extracted header, tabs, tools panel, categories panel, shared types
- [x] `UserManagement.tsx` (744 → ~100 lines) → extracted hook, list, filters, create form, shared types
- [x] `ContentManagementClient.tsx` (743 → ~110 lines) → extracted hook, stats, table, modal, tab nav
- **Why:** Maintainability and agent context limits

### 9. Deduplicate AdvancedSearch
- [x] Extract shared logic to `lib/search/search-utils.ts` and `lib/hooks/useRecentSearches.ts`
- [x] Public + admin search components use shared recent-search helpers

### 10. Extract Shared API Auth Utility
- [x] Create `lib/api-auth.ts` with `getAuthenticatedUser(request)`
- [x] Refactor profile, export, favorites DELETE routes

### 11. Expand Test Coverage (P0 from rubric)
- [x] `lib/__tests__/auth.test.ts`
- [x] `lib/__tests__/api-auth.test.ts`
- [x] `lib/__tests__/search-utils.test.ts`
- [x] Wire `smoke-test.js` into CI
- **Why:** 2 tests for ~450 source files is insufficient

### 12. Re-enable Affiliate Tracking
- [ ] Review FTC/consent requirements
- [ ] Restore `/api/analytics/affiliate-click`
- [ ] Add tests for UTM generation + click logging
- **Why:** Monetization path incomplete

---

## Lower Priority / Cleanup

### 13. Remove Dead Code
- [x] Delete `lib/api.js`
- [x] Trim legacy vars from `env.example`
- [x] Update README tech stack (remove Express/JWT claims)
- [ ] Remove or archive duplicate seed scripts

### 14. Workflow Automation Completion
- [ ] Un-stub `/api/admin/automation`
- [ ] Connect `AutomationDashboard` to real workflow execution
- [ ] Document in `10-ai-orchestration.md`

### 15. Route Casing Strategy
- [ ] Evaluate `/AITools` → `/tools` redirect (SEO impact analysis first)
- **Why:** Non-standard casing confuses agents and URLs

### 16. Feature Folder Pilot
- [ ] Migrate `favorites` as first `features/favorites/` vertical slice
- [ ] Document pattern for subsequent features

---

## Blocked / Needs Decision

| Task | Blocker |
|------|---------|
| Stripe/billing integration | No product requirement — do not start |
| In-app AI chat | Requires ADR + product approval |
| Full `src/` restructure | Risk vs reward — incremental only |

---

## Definition of Done (Per Task)

1. Code change merged
2. Relevant project-intelligence doc updated
3. Lint + build + tests pass
4. Manual smoke test for affected flow
5. Decision logged if architectural
