# Agent Memory — Melanated In Tech

> **North Star:** Melanated In Tech is building the world's most practical ecosystem for AI Agents, MCP Servers, Agent Skills, Automation Systems, and Agent Commerce. Every decision should move the platform closer to becoming the trusted place where people learn, build, deploy, buy, sell, and scale AI-powered systems.

---

> Cross-session shared state. Every agent reads this on session start.
> Update this file when significant state changes occur that future agents need to know.

---

## Last Updated
2026-06-03

---

## Critical Flags (Read These First)

| Flag | Status | Detail |
|------|--------|--------|
| 🔴 SECURITY | UNRESOLVED | Admin auth RBAC bug — service role key may be exposed client-side. Do NOT add features to admin until fixed. |
| 🔴 SEO | UNRESOLVED | sitemap.xml + robots.txt reference vaultxaitools.com. Must fix before any content effort compounds. |
| 🟡 REBRAND | IN PROGRESS | VaultX → Melanated In Tech partially complete. Domain live. Code may still have "VaultX" references. |
| 🟡 PAYMENTS | NOT STARTED | No Stripe integration exists. No revenue flow is live. |

---

## Completed Work (Don't Redo)

| Item | Completed | Notes |
|------|-----------|-------|
| Domain migration | ✅ | melanatedintech.com is live |
| Tools directory build | ✅ | 38+ tools, 10 categories at /AITools (migrate to /tools) |
| Supabase Auth setup | ✅ | Has RBAC issues but base auth works |
| MailerLite integration | ✅ | Newsletter signup active |
| Resend integration | ✅ | Transactional email active |
| Vercel Analytics | ✅ | Basic analytics active |
| GA4 setup | ✅ | Verify it's firing correctly |
| Admin portal (basic) | ✅ | Has auth bugs — don't expand until fixed |
| 20 strategy documents | ✅ | In /docs/ — these are the source of truth |

---

## In Progress

| Item | Status | Who | Notes |
|------|--------|-----|-------|
| Brand rebrand (code) | 🔄 | Technical Agent | Replace all "VaultX" references in codebase |
| Project Intelligence System | 🔄 | SuperAgent | Creating /project-intelligence docs |

---

## Blocked Items

| Item | Blocker | What's Needed |
|------|---------|--------------|
| Stripe integration | Depends on auth fix | Must fix RBAC first to know auth flow |
| Marketplace MVP | Depends on Stripe | Can't sell without payments |
| Creator dashboard | Depends on Stripe Connect | Payouts require Stripe Connect |
| Public launch | Depends on Marketplace + Academy | Both needed for meaningful launch |

---

## Known Decisions Made

| Decision | Rationale | Date |
|----------|-----------|------|
| Use Next.js 15 App Router | Modern RSC + streaming architecture | Before June 2026 |
| Use Supabase for DB + initial auth | Full-stack DB + auth with good DX | Before June 2026 |
| Migrate to Clerk for auth (planned) | Better RBAC, SSO, org accounts | Planned, not executed |
| Use Cloudflare R2 for paid product delivery | Zero egress costs | Planned, not executed |
| Use Typesense for search (planned) | Replace Fuse.js at scale | Planned, not executed |
| Content AI-assisted + human reviewed | Sustainable publishing at quality | June 2026 |
| Marketplace commission: 30/70 standard | Competitive with Gumroad/Lemon Squeezy | June 2026 |
| Launch with MIT-seeded products first | Validate flow before opening to community | June 2026 |

---

## Open Risks to Monitor

| Risk | Monitoring Signal | Action if Triggered |
|------|------------------|---------------------|
| Service role key exposed | Admin auth RBAC audit | Emergency security patch, rotate keys |
| Sitemap SEO damage | GSC coverage errors for both domains | Fix immediately, file sitemap recrawl |
| Stripe webhook failure | Missed subscription events | Check idempotency log, replay events |
| Creator quality issues | Dispute rate > 5% | Tighten review process, temporarily pause new listings |

---

## Context That Won't Fit Elsewhere

### On the Codebase Folder Name
The project lives at `E:\vaultxaitools`. This folder name reflects the old brand. **Do not rename the folder** — it would break all paths. The live domain is `melanatedintech.com`. These are two different things.

### On the Blog Content
The 6 existing blog posts have:
- Fake author names (David Lee, Sarah Johnson, Mike Chen) — need to be replaced
- All dated 7/25/2025 — signals bulk AI generation
- Generic topics unrelated to MIT's actual content pillars
**These posts should be replaced/deleted before public launch.**

### On Netlify vs Vercel
Both Netlify and Vercel config files exist in the codebase. Primary hosting should be Vercel. The Netlify config may be stale. Verify before making hosting changes.

### On the Authentication Architecture
Current: Supabase Auth with a broken RBAC implementation
Planned Option A: Migrate to Clerk (recommended — better RBAC, org support)
Planned Option B: Fix Supabase Auth RBAC properly
**This decision is unresolved.** See ADR-005 for context. Founder makes final call.

### On Commission Rates
The standard commission is 30% (MIT) / 70% (seller). This was benchmarked against:
- Gumroad: 10% flat
- Lemon Squeezy: 5% + $0.50
- Shopify Digital: varies
The higher rate is justified by the targeted audience + community + marketing MIT provides. It should be revisited at Month 6 if seller acquisition is slow.

---

## Agent Session Log

| Date | Agent | Work Done | Files Modified |
|------|-------|-----------|---------------|
| 2026-06-03 | SuperAgent | Created full Project Intelligence System | /project-intelligence/* |

---

## How to Update This File

1. Add session entry to Agent Session Log at the bottom
2. Move completed items from "In Progress" to "Completed Work"
3. Add new blockers as discovered
4. Update "Last Updated" date
5. Never delete Critical Flags until the underlying issue is resolved
