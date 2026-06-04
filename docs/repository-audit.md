# Repository Audit — Melanated In Tech

**Date:** 2026-06-03
**Scope:** Full Sprint 0 audit across business, technical, product, documentation, and AI agent alignment
**Auditors:** 5-agent parallel audit (Repository Architect, Technical Debt, Security, Product Alignment, MVP)

---

## Business Alignment

### Does the current code support the new vision?

**Partially.** The codebase is a functional AI tools discovery directory — not yet a marketplace. The foundation is reusable (~50–60%), but the vision requires commerce, multi-product types, and creator infrastructure that don't exist.

### Features that conflict with the new vision

| Feature | Conflict | Decision |
|---------|----------|----------|
| Single product type (AI Tools only) | Vision requires 6 product types | Refactor listing pages to multi-type |
| Affiliate monetization model | Vision requires direct commerce (Stripe) | Replace with Stripe checkout |
| Tool submission → admin queue | Vision requires creator self-publishing | Refactor to creator dashboard |
| Hardcoded admin email list | Conflicts with scalable governance | Replace with DB roles |
| Mock workflow executor | Admin dashboard non-functional | Remove or implement |
| Debug pages publicly accessible | Contradicts security posture | Delete immediately |

### What can be reused

- **All of:** auth system, search infrastructure, review/rating system, blog CMS, admin CRUD patterns, email integration (Resend), analytics, ISR caching, UI component library (50+ components), Tailwind design system
- **With refactoring:** Product listing/detail pages, user dashboard, admin dashboard, categories system, trending algorithm, newsletter signup

### What should be archived

- `lib/api.js` — unused Express/JWT backend client, zero imports
- All `/debug*`, `/test-*`, `/ui-showcase`, `/seed-blog` routes
- `lib/supabaseClient.ts` and `lib/supabaseAdminClient.ts` — deprecated wrappers
- `scripts/` non-canonical seed files — keep one canonical seeder, archive the rest
- `env.example` entries for MongoDB, Cloudinary, JWT, PORT — all removed from project

---

## Technical Alignment

### Does the codebase match the architecture documents?

**Mostly yes, with gaps.** The documented stack (Next.js + Supabase + Clerk) doesn't match reality — Clerk is referenced in docs but not in the codebase. Auth is Supabase-native. Docs should be corrected.

### Technical risks

| Risk | Severity | File |
|------|----------|------|
| Service role key exposed in public debug page | CRITICAL | `app/debug-admin-blog/page.tsx` |
| SQL injection in search route via string interpolation | CRITICAL | `app/api/search/route.ts` |
| Admin page falls back to "grant access" on auth error | CRITICAL | `app/admin/page.tsx` (line 54) |
| Service role client init at module level (before auth check) | CRITICAL | Multiple admin API routes |
| No CSRF protection on admin state-changing routes | HIGH | All `app/api/admin/**` |
| In-memory rate limiter — not shared across instances | MEDIUM | `lib/rateLimit.ts` |
| Windows build failure (EISDIR) — cannot verify production build locally | CRITICAL | `app/api/admin/automation/` |

### Technical debt summary

- **30 total issues:** 4 CRITICAL, 9 HIGH, 13 MEDIUM, 4 LOW
- **Biggest architectural problem:** 5 Supabase client factories with overlapping responsibility
- **Biggest type safety gap:** `database.types.ts` is a stub — no actual schema types generated
- **Biggest dead code problem:** Mock workflow executor in admin dashboard returns fake results with 10% simulated failure rate
- Full register: [`technical-debt-register.md`](technical-debt-register.md)

### What to refactor vs. replace

| Item | Recommendation |
|------|---------------|
| Supabase client factories | Refactor — consolidate 5 → 3 canonical exports |
| Product listing pages | Refactor — generalize from single type to multi-type |
| Admin dashboard (1276 lines) | Refactor — split into modular panels |
| Debug routes | Replace — delete entirely |
| `@supabase/auth-helpers-nextjs` | Replace with `@supabase/ssr` (already present) |
| In-memory rate limiter | Replace with Redis/Supabase-backed store |
| Affiliate monetization | Replace with Stripe direct commerce |
| Mock workflow executor | Replace with real implementation or remove |

---

## Product Alignment

### Marketplace features that already exist

- Tool directory with search, filtering, categories, comparison
- Review and rating system with helpful voting
- Favorites (bookmarks)
- Sponsored tool placements
- Affiliate click tracking (disabled/stubbed)
- User dashboard shell (mock data)

### Agent-related features that already exist

- **None.** The directory only contains generic "AI Tools." There are no separate categories or schemas for Agents, MCP Servers, Agent Skills, Prompt Packs, Templates, or Blueprints.

### MVP features that should be prioritized

Based on the mission: fastest path to first paying customer.

**Sprint 1 (Weeks 1–4):**
1. Clean schema + add multi-product type support
2. Stripe checkout flow (purchases working end-to-end)
3. Agent, MCP Server, Skill directories live
4. User tier system (Free/Pro/Elite)

**Sprint 2 (Weeks 5–8):**
5. Creator account + product submission
6. Purchase history + digital download delivery
7. Homepage authority rebuild (email capture, mission, social proof)
8. Transactional emails (purchase confirmation, welcome)

**Sprint 3 (Weeks 9–12):**
9. Learn section (tutorials, guides, Agent Academy)
10. Creator dashboard (earnings, analytics)
11. Newsletter email automation
12. Admin marketplace analytics

**First revenue target:** $500 in 30 days post-launch (~30 transactions at ~$17 AOV)

---

## Documentation Alignment

### Accurate documents

- `docs/technical-architecture.md` — generally accurate (minor: Clerk listed but not in codebase)
- `docs/brand-positioning.md` — current
- `docs/business-strategy.md` — current
- `docs/marketplace-strategy.md` — current
- `project-intelligence/MIT-CONSTITUTION.md` — current (v2.0, canonical)
- `operations/` — all 5 files current (created this session)
- `marketplace/master-asset-registry.md` — current (created this session)
- `agents/workspaces/` — all 5 files current (created this session)

### Outdated documents

| Document | Issue |
|----------|-------|
| `README.md` (lines 1–5) | Claims "Express.js" backend and "JWT" auth — both replaced |
| `env.example` | References MongoDB, JWT, Cloudinary, PORT=5000 — all removed |
| Any doc referencing "VaultX" as primary brand | Rebrand to Melanated In Tech is active |
| Any doc referencing Clerk auth | Not in codebase; auth is Supabase-native |

### Missing documents

| Document | Priority |
|----------|----------|
| `docs/sprint-0-readiness-report.md` | HIGH — being created now |
| `docs/mvp-build-plan.md` | HIGH — created this session |
| `docs/api-reference.md` | MEDIUM — no API docs exist |
| `docs/creator-onboarding-guide.md` | MEDIUM — needed before creator launch |
| `docs/admin-runbook.md` | MEDIUM — needed for operations |
| `supabase/migrations/` — clean consolidated migration | HIGH — schema sources fragmented |

---

## AI Agent Alignment

### Can Claude Code, Codex, Cursor, and HyperAgent safely work in this repository?

**Yes, with guardrails.** The workspace definitions in `agents/workspaces/` define safe operating boundaries. The primary risks are:

1. **Agents touching admin auth code without human review** — auth changes require human approval per workspace definitions
2. **Agents modifying Supabase schema** — schema changes require human approval
3. **Agents working in oversized files** (>400 lines, some >1200 lines) — context window truncation risk
4. **Agents using the deprecated Supabase client factories** — should use canonical exports only

### Areas requiring guardrails before agents touch them

| Area | Risk | Guardrail |
|------|------|-----------|
| `middleware.ts` | Controls all auth routing | Human review required on all changes |
| `lib/auth.ts`, `lib/admin-emails.ts` | Admin access logic | Human approval required |
| `supabase/migrations/` | Schema changes | Human approval required, tested locally first |
| `app/api/admin/**` | Admin operations | Security review on all new routes |
| `.env.local`, secrets | Environment config | Agents must never read or log secrets |
| Stripe webhook handlers | Payment integrity | Human review required |
| Any file referencing `SUPABASE_SERVICE_ROLE_KEY` | Admin privilege | Human review required |

### Agent-safe zones (no approval needed)

- `/components/` — UI-only changes
- `/content/` — copy and content
- `/docs/` — documentation
- `/lib/seo.ts`, `/lib/analytics.ts`, `/lib/utils.ts` — utility functions
- `/styles/` — CSS/Tailwind
- `/data/` seed files — data only, no logic

---

## Summary Scorecard

| Dimension | Score | Notes |
|-----------|-------|-------|
| Business Alignment | 5/10 | Good foundation; vision requires significant new build |
| Technical Quality | 6/10 | Solid patterns; 4 CRITICAL security issues, 30 total debt items |
| Security Posture | 6.5/10 | Good baseline; critical fixes needed before production |
| Product Completeness | 3/10 | Directory exists; no commerce, no multi-type, no creators |
| Documentation Quality | 7/10 | Strong doc system; some stale content |
| AI Agent Readiness | 7/10 | Workspace definitions in place; guardrails documented |

**Overall Sprint 0 Status: READY TO PROCEED** — with CRITICAL security fixes executed in parallel with Sprint 1 planning.
