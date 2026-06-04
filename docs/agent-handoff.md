# Melanated In Tech — Agent Handoff Package

---

**Purpose:** This document enables any AI agent (Claude Code, GPT, or any future model) to pick up the Melanated In Tech project cold — with full context on what exists, what the priorities are, and how to work within the established systems. Read this before doing anything.

**Owner:** Founder / Technical Lead

**Dependencies:** All other documents in `/docs/`

**Status:** Living document — update at each major milestone

**Last Updated:** 2026-06-03

**Next Actions:** Keep this document updated as platform evolves

---

## If You Are an AI Agent Reading This

This document was written specifically for you. The humans who built this project have documented their decisions, architecture, and priorities so that you can continue the work without losing context. Follow these instructions carefully.

**Before you do anything:**
1. Read `project-brief.md` — the 2-minute overview
2. Read this document completely
3. Check `implementation-roadmap.md` for current phase and priorities
4. Check GitHub Issues for the current sprint backlog

---

## Project State (as of June 2026)

**Platform Name:** Melanated In Tech
**Live Domain:** melanatedintech.com
**Legacy Domain:** vaultxaitools.com (old brand — in process of being deprecated)
**Repository Location:** `E:\vaultxaitools`

**What exists today:**
- Working AI tools directory (38+ curated tools, 10 categories)
- Basic blog with 6 posts (all dated same day, likely placeholder content — see `content-audit.md`)
- About page, contact page, legal pages
- User authentication (Supabase Auth)
- Admin portal for user management, blog, tools
- Email newsletter (MailerLite integration)
- Basic Resend transactional email
- Vercel Analytics + Google Analytics
- Consulting page (buried in footer navigation)

**What does NOT exist yet:**
- Academy / courses
- Marketplace (agents, MCP servers, prompts, blueprints)
- Community platform
- Stripe payment integration
- Membership tiers
- Certifications
- Creator/seller dashboard
- PostHog analytics

**Critical Known Issues:**
1. Sitemap.xml and robots.txt still reference `vaultxaitools.com` — must fix before any SEO work
2. Admin auth has been buggy (multiple commits attempting to fix) — service role key may be improperly exposed client-side — FIX THIS BEFORE ADDING ANY PAID FEATURES
3. Blog posts have placeholder author names (David Lee, Sarah Johnson, Mike Chen) — these are not real people
4. All 6 blog posts dated the same day (7/25/2025) — signals bulk generation

---

## Current Priorities (In Order)

1. **Fix sitemap and robots.txt domain references** (vaultxaitools.com → melanatedintech.com)
2. **Audit and fix admin auth** — ensure service role key is never client-side
3. **Delete debug/test pages** — see list in `implementation-roadmap.md` Week 1
4. **Complete brand rebrand** — search-replace all "VaultX" strings
5. **Implement Supabase schema expansion** — courses, marketplace, community tables
6. **Integrate Stripe** — before any paid product can launch
7. **Build Academy MVP** — courses, enrollment, progress tracking

---

## Tech Stack (What's Actually in the Codebase)

| Layer | Technology | Status |
|---|---|---|
| Framework | Next.js 15 (App Router) | Active |
| Database | Supabase (PostgreSQL) | Active |
| Auth | Supabase Auth (NOT Clerk) | Active — has RBAC issues |
| Styling | Tailwind CSS | Active |
| Animations | Framer Motion | Active |
| Email (marketing) | MailerLite | Active |
| Email (transactional) | Resend | Active |
| Analytics | Vercel Analytics + GA4 | Active |
| Hosting | Vercel AND Netlify (both configs exist) | Verify which is primary |
| Icons | Lucide React + Heroicons | Active |
| Payments | **NOT YET INTEGRATED** | Planned: Stripe |
| Search | Fuse.js (client-side) | Active — replace with Typesense |
| Community | **NOT YET BUILT** | Planned: Circle.so or custom |
| CMS | Supabase (blog table) | Active |

---

## Key Files and Their Purpose

| File | Purpose |
|---|---|
| `CLAUDE.md` | **Read this first** — agent instructions for Claude Code |
| `app/layout.tsx` | Global layout, fonts, providers |
| `middleware.ts` | Auth routing — BROKEN, needs fix |
| `lib/supabase/` | Supabase client utilities |
| `lib/auth/` | Auth helpers (if exists) |
| `app/admin/` | Admin portal — user management, blog, tools, analytics |
| `app/api/` | All API routes |
| `app/AITools/` | Tools directory (will be migrated to /tools) |
| `app/page.tsx` | Homepage — needs full rewrite |
| `app/about/` | About page — needs rewrite |
| `app/blog/` | Blog system |
| `components/` | Shared UI components |
| `tailwind.config.js` | Design tokens and brand colors |
| `next.config.js` | Next.js configuration including redirects |
| `netlify.toml` | Netlify config (verify if active deployment) |
| `docs/` | All strategy documentation |

---

## Environment Variables Required

Request these from the founder (asjames18@gmail.com). Never hardcode secrets.

```
NEXT_PUBLIC_SUPABASE_URL          Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY     Safe for client — read-only
SUPABASE_SERVICE_ROLE_KEY         SERVER ONLY — never expose to client
STRIPE_SECRET_KEY                 Server only (not yet set up)
STRIPE_WEBHOOK_SECRET             For webhook verification (not yet set up)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY Safe for client (not yet set up)
MAILER_LITE_API_KEY               Exists in codebase
RESEND_API_KEY                    Exists in codebase
NEXT_PUBLIC_GA_MEASUREMENT_ID     Check GoogleAnalytics.tsx
ANTHROPIC_API_KEY                 For content generation features
```

---

## Rules for AI Agents Working on This Codebase

### Security Rules (Non-Negotiable)
1. **Never expose `SUPABASE_SERVICE_ROLE_KEY` in client-side code.** If you see this in a client component, fix it immediately before doing anything else.
2. **Never commit secrets.** All sensitive values go in `.env.local` (not `.env`) and are never committed.
3. **All new Supabase tables must have RLS policies.** No exceptions.
4. **Stripe webhook endpoints must verify the Stripe-Signature header** before processing any event.

### Code Quality Rules
5. **Run `npm run typecheck` before declaring any task complete.** Do not introduce new TypeScript errors.
6. **Run `npm run lint` before committing.** Do not introduce new lint errors.
7. **Never delete files without first checking if they are imported** — use Grep to verify.
8. **Do not add features that were not requested.** Scope creep kills timelines.
9. **Use `components/` first** before creating new components — check if something similar exists.

### Database Rules
10. **Never modify production database schema without a migration file** in `supabase/migrations/`.
11. **Test migrations locally first** using `npx supabase db push` against local stack.
12. **Generate updated TypeScript types** after any schema change: `npx supabase gen types typescript --local > lib/database.types.ts`

### Content Rules
13. **Never auto-publish content.** All AI-generated content saves as draft for human review.
14. **Do not write on behalf of the founder** unless explicitly requested. Drafts only.

### Git Rules
15. **Never push directly to `main`.** Create a feature branch, make changes, create PR.
16. **Never use --no-verify** to skip hooks.
17. **Write meaningful commit messages** that describe WHY, not just WHAT.

---

## How to Read the Documentation

**Reading order for a new AI agent:**
1. `project-brief.md` — 5-minute overview of everything
2. `agent-handoff.md` — this file, for operational context
3. `current-site-audit.md` — what exists now and what's broken
4. `implementation-roadmap.md` — what to build and in what order
5. `technical-architecture.md` — tech stack decisions and patterns
6. `brand-positioning.md` — voice and messaging (important for content work)

**For specific tasks:**
- Content work → `content-strategy.md` + `keyword-strategy.md`
- Product decisions → `product-catalog.md` + `marketplace-strategy.md`
- Database work → `data-model.md` + `technical-architecture.md`
- SEO work → `seo-audit.md` + `keyword-strategy.md`
- UX work → `new-site-architecture.md` + `homepage-wireframe.md`

---

## Verification Checklist Before Completing Any Task

Before reporting a task as done, verify:

- [ ] `npm run typecheck` passes with no new errors
- [ ] `npm run lint` passes with no new errors
- [ ] The feature works in the browser (not just compiles)
- [ ] Mobile: tested on a mobile viewport
- [ ] No console errors in the browser
- [ ] No service role key exposed to client
- [ ] If database change: migration file created and RLS policy added
- [ ] If new page: `generateMetadata()` implemented
- [ ] If content: saved as draft, not published
- [ ] If API route: input validated with zod

---

## Contact and Escalation

**Founder:** Antonio James | asjames18@gmail.com
**GitHub Issues:** Use for all task tracking, bugs, and feature requests
**Branch strategy:** `main` → production | feature branches for all development
**PR reviews:** Required before merging to main

When blocked, document the blocker clearly in the GitHub Issue and move to the next priority item. Do not sit idle on a single blocker.

---

## Platform Milestone Tracker

| Milestone | Status | Target Date |
|---|---|---|
| Brand rebrand complete | 🔄 In progress | Day 7 |
| Sitemap/robots.txt fixed | ❌ Not done | Day 1 (URGENT) |
| Admin auth fixed | ❌ Not done | Day 7 |
| Debug pages removed | ❌ Not done | Day 2 |
| Schema expansion | ❌ Not done | Day 10 |
| Academy MVP | ❌ Not done | Day 21 |
| Stripe integration | ❌ Not done | Day 19 |
| First paid course | ❌ Not done | Day 25 |
| Marketplace MVP | ❌ Not done | Day 37 |
| Community forums | ❌ Not done | Day 44 |
| Public launch | ❌ Not done | Day 60 |
| Pro membership tier | ❌ Not done | Day 67 |
| 90-day targets met | ❌ Not done | Day 90 |

Update this table as milestones are completed.
