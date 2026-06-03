# Decision Log

**Format:** ADR-lite entries. Newest first.  
**Last updated:** 2026-05-29

---

## ADR-001: Project Intelligence System

**Date:** 2026-05-29  
**Status:** Accepted  
**Context:** Codebase grew organically with inconsistent docs, dual data layers, and no agent-readable system memory.  
**Decision:** Create `docs/project-intelligence/` with 10 mandatory operational files. All AI agents and developers treat these as source of truth for architecture and domain language.  
**Consequences:** Documentation must be updated alongside code changes. Initial audit captured current state without restructuring.

---

## ADR-002: Supabase as Sole Backend

**Date:** (Historical — inferred from codebase)  
**Status:** Accepted  
**Context:** README references Express + JWT + MongoDB; runtime uses Next.js API routes only.  
**Decision:** Supabase PostgreSQL + Auth is the production backend. Legacy env vars (MongoDB, JWT_SECRET) are deprecated.  
**Consequences:** Remove legacy references from README and env.example incrementally. Do not add Express.

---

## ADR-003: Melanated In Tech Rebrand (2026-06-02)

**Date:** 2026-06-02  
**Status:** Accepted  
**Context:** Product rebranded from VaultX Tech (church/ministry media focus) to Melanated In Tech (AI and tech education platform for learners, builders, and entrepreneurs).  
**Decision:** All categories, copy, metadata, and curation now target AI tools, automation, software development, and emerging technology.  
**Consequences:** Categories in `data/categories.json`, `data/tools.ts`, and `lib/database-client.ts` updated to AI/tech focus. Domain vaultxaitools.com retained pending migration to melanatedintech.com.

---

## ADR-004: Static + DB Dual Tool Layer (Legacy — Pending Retirement)

**Date:** (Historical)  
**Status:** Deprecated — pending removal  
**Context:** `data/tools.ts` (639 lines) coexists with Supabase `tools` table.  
**Decision (original):** Static data for fast dev bootstrapping.  
**Revised decision:** Supabase is primary; static data is seed-only.  
**Consequences:** Pages may show stale data if they import from `data/` instead of DB. Consolidation is high-priority debt.

---

## ADR-005: Admin Email Allowlist + DB Roles

**Date:** (Historical)  
**Status:** Accepted with caveats  
**Context:** Admin access via hardcoded emails, env `ADMIN_EMAILS`, and `user_roles` table.  
**Decision:** Triple fallback: env allowlist → DB role → user_metadata.role.  
**Consequences:** Hardcoded emails in `lib/auth.ts` and `middleware.ts` are a security/maintainability risk. Target: DB roles + env only.

---

## ADR-006: Affiliate Click Tracking Disabled

**Date:** (Recent — inferred from stubbed API)  
**Status:** Accepted (temporary)  
**Context:** `/api/analytics/affiliate-click` returns "tracking disabled".  
**Decision:** Disable click tracking until privacy/compliance review complete.  
**Consequences:** Revenue analytics incomplete. Re-enable with proper consent and disclosure.

---

## ADR-007: Dashboard Mock Data

**Date:** (Historical)  
**Status:** Accepted (temporary)  
**Context:** User profile/activity tables exist in scripts but dashboard API returns hardcoded mock data.  
**Decision:** Ship dashboard UI with mock data until profile tables are migrated and wired.  
**Consequences:** User-facing dashboard is misleading. Wire to real tables or mark as preview.

---

## ADR-008: ESLint Disabled During Build

**Date:** (From AUDIT_REPORT.md)  
**Status:** Accepted (temporary)  
**Context:** Next.js 15 ESLint integration deprecated; build fails on lint.  
**Decision:** Disable ESLint/TS strict checks in `next.config.ts` during build.  
**Consequences:** CI lint step may fail independently. Migrate to ESLint CLI per Next.js 16 guidance.

---

## ADR-009: Feature-Based Folder Migration (Deferred)

**Date:** 2026-05-29  
**Status:** Proposed  
**Context:** Prompt recommends `features/` vertical slices; current layout is flat `app/` + `components/`.  
**Decision:** Incremental migration only — no big-bang restructure. New features may use `features/<domain>/` when touched.  
**Consequences:** Mixed layout during transition. Document in agent rules.

---

## ADR-010: AI as Offline Pipeline Only

**Date:** (Historical)  
**Status:** Accepted  
**Context:** OpenAI/Replicate keys in env.example; no runtime LLM SDK in dependencies.  
**Decision:** AI used for scripts (tool ingestion, news automation), not in-app chat.  
**Consequences:** No `@ai-sdk` or streaming chat without new ADR and product approval.

---

## ADR-011: Debug Page Production Gating

**Date:** 2026-05-29
**Status:** Accepted
**Context:** Debug/test pages were publicly accessible; `/api/debug-env` exposed config.
**Decision:** Delete debug-env API; block `/debug*`, `/test-*`, `/seed-blog`, `/ui-showcase` in production via middleware (404). Keep files for local dev.
**Consequences:** Zero production debug surface; dev workflow preserved.

---

## ADR-012: Windows Build Workaround

**Date:** 2026-05-29
**Status:** Accepted
**Context:** Webpack `EISDIR` on Windows when building API routes.
**Decision:** Use `next build --turbo` for builds; skip build step in Windows local CI (`scripts/run-ci.js`). Linux CI (Vercel) runs full build.
**Consequences:** Local Windows dev validates lint/typecheck/test; production build verified on deploy.

---

## ADR-013: Canonical Supabase Client Modules

**Date:** 2026-05-29
**Status:** Accepted
**Decision:** Three modules — `lib/supabase.ts` (browser), `lib/supabase-server.ts` (SSR/API), `lib/supabase-admin.ts` (service role). Legacy files re-export only.
**Consequences:** Clear import paths for agents and developers.

---

## ADR-014: AdminDashboard Component Extraction

**Date:** 2026-05-29  
**Status:** Accepted  
**Context:** `AdminDashboard.tsx` exceeded 1,200 lines — hard to navigate for humans and AI agents.  
**Decision:** Extract focused sub-components under `app/admin/components/` (`AdminDashboardHeader`, `AdminTabNav`, `ToolsTabPanel`, `CategoriesTabPanel`, `CategoriesOverviewTable`, `AdminMessageBanner`) and shared types in `app/admin/types.ts`. Main file retains state, handlers, and remaining tab panels.  
**Consequences:** ~470 lines moved out; duplicate category table consolidated into one shared component. Further splits (`UserManagement`, `ContentManagementClient`) remain pending.

---

## ADR-015: UserManagement Component Extraction

**Date:** 2026-05-29  
**Status:** Accepted  
**Context:** `UserManagement.tsx` exceeded 740 lines with inline create form, duplicated mobile/desktop role-update logic, and fetch handlers mixed with UI.  
**Decision:** Extract `useAdminUsers` hook, `UsersList`, `CreateUserForm`, filter/message/status sub-components, and types under `app/admin/components/user-management/` and `app/admin/types/user-management.ts`.  
**Consequences:** Main file reduced to ~100 lines; role-change handler deduplicated. See ADR-016 for ContentManagementClient split.

---

## ADR-016: ContentManagementClient Component Extraction

**Date:** 2026-05-29  
**Status:** Accepted  
**Context:** `ContentManagementClient.tsx` exceeded 740 lines with inline types, fetch/CRUD handlers, stats cards, table, and modal in one file.  
**Decision:** Extract `useContentManagement` hook, header/tab nav/stats/table/modal components, shared types, and badge color utils under `app/admin/content-management/`.  
**Consequences:** Main file reduced to ~110 lines; unused icon imports and dead `setupContentTable` helper removed. Task 8 (admin component splits) complete.

---

## Template for New Entries

```markdown
## ADR-NNN: Title

**Date:** YYYY-MM-DD
**Status:** Proposed | Accepted | Deprecated
**Context:** What problem or question?
**Decision:** What was decided?
**Consequences:** What follows?
```
