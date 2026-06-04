# Agent Onboarding — Melanated In Tech

> **North Star:** Melanated In Tech is building the world's most practical ecosystem for AI Agents, MCP Servers, Agent Skills, Automation Systems, and Agent Commerce. Every decision should move the platform closer to becoming the trusted place where people learn, build, deploy, buy, sell, and scale AI-powered systems.

---

> Read this first. Everything you need to become productive in under 10 minutes.

---

## Who You Are

You are an AI agent (or developer) joining the Melanated In Tech project. You may be working on code, content, SEO, strategy, product design, or marketplace operations. Hundreds of agents may work on this project over its lifetime. This document ensures each session starts from the same well-informed position.

---

## The 10-Minute Onboarding Protocol

### ⏱ Minute 1–2: Orientation

**What is this project?**
Melanated In Tech is a global AI agent platform for Black and melanated professionals who want to build AI-powered businesses — not just use AI tools. The platform has five pillars: Academy (education), Marketplace (monetization), Community (peer network), Consulting (enterprise services), and Content (organic acquisition).

**What's the mission?**
Close the AI wealth gap. Give Black builders the tools, knowledge, infrastructure, and community to own what they build.

**Brand promise:** "We give you everything you need to go from AI curious to AI sovereign."

---

### ⏱ Minute 3–4: Current Reality

**What exists today (June 2026):**
- Tools directory (38+ tools) at `/AITools` (migrate to `/tools`)
- Blog with 6 placeholder posts (fake authors — do not use)
- Supabase Auth (has RBAC bugs — do not expand admin features until fixed)
- Email newsletter (MailerLite) and transactional email (Resend)
- Vercel Analytics + GA4

**What does NOT exist yet:**
- Academy, Marketplace, Community, Certifications
- Stripe payments — no revenue flow is live
- Membership tiers

**Critical flags — read before touching anything:**
1. 🔴 `sitemap.xml` and `robots.txt` reference `vaultxaitools.com` — wrong domain
2. 🔴 Admin auth has RBAC bug + possible service role key client-side exposure (SECURITY)
3. 🟡 Codebase folder is `E:\vaultxaitools` — legacy name. The live domain is `melanatedintech.com`.

---

### ⏱ Minute 5–6: What You Must Never Do

These rules apply to every agent, no exceptions:

```
🚫 Never expose SUPABASE_SERVICE_ROLE_KEY in client-side code
🚫 Never auto-publish content (all content = draft only)
🚫 Never commit directly to main branch
🚫 Never write first-person content as Antonio James unless explicitly instructed
🚫 Never add features outside current sprint scope
🚫 Never create a Supabase table without RLS policies
🚫 Never process Stripe webhooks without verifying Stripe-Signature header
🚫 Never make claims about MIT community size/revenue without verified data
🚫 Never delete strategy docs in /docs/ — they are the source of truth
```

---

### ⏱ Minute 7–8: Find Your Role

Identify which agent role best matches your current task:

| Task Type | Read This Agent Doc |
|-----------|-------------------|
| Building features / fixing bugs | `agents/technical-agent.md` |
| Writing content (blog, tutorials, newsletter) | `agents/content-agent.md` |
| SEO research or optimization | `agents/seo-agent.md` |
| Product design / user flows / specs | `agents/product-agent.md` |
| Business model / competitive analysis | `agents/strategy-agent.md` |
| Marketplace operations / seller program | `agents/marketplace-agent.md` |
| UI/UX / component design | `agents/design-agent.md` |
| Cross-domain / orchestration | `agents/superagent.md` |

Read your agent doc now. It contains responsibilities, inputs, outputs, success metrics, and example tasks.

---

### ⏱ Minute 9–10: Verify Context and Start

1. **Check `agent-memory.md`** — Are there any new critical flags added since this doc was written?
2. **Check `current-state.md`** — What has changed since this document was last updated?
3. **Identify your specific task** — Is it on the roadmap? Does it match a sprint? If not, flag before starting.
4. **Begin work.**

---

## Full Document Map (When You Need More Depth)

| Document | When to Read |
|----------|-------------|
| `README.md` | Overview and navigation |
| `project-context.md` | Full platform description |
| `vision.md` | Mission, values, brand promise |
| `business-model.md` | Revenue engines, pricing, projections |
| `brand-system.md` | Visual identity, voice, CTAs |
| `product-ecosystem.md` | All 5 pillars in detail |
| `marketplace-system.md` | Marketplace architecture |
| `content-system.md` | Content pillars, publishing rules |
| `seo-system.md` | SEO audit, keywords, technical fixes |
| `technical-system.md` | Stack, security, data model |
| `roadmap.md` | Build order and milestones |
| `current-state.md` | What's built, what's broken, what's next |
| `future-state.md` | 3-year platform vision |
| `agent-memory.md` | Cross-session state (critical flags, decisions) |
| `open-questions.md` | Unresolved decisions |
| `knowledge-graph.md` | Entity relationships |
| `architecture-decisions.md` | Summary of all ADRs |
| `adrs/` | Full ADR records |

---

## Key Codebase Locations

```
E:\vaultxaitools\                   ← Project root (legacy folder name, do not rename)
├── CLAUDE.md                        ← Non-negotiable agent rules (READ THIS)
├── docs/                            ← All 20 strategy documents (source of truth)
├── project-intelligence/            ← This intelligence system
├── app/                             ← Next.js App Router pages
│   ├── layout.tsx                   ← Root layout
│   ├── page.tsx                     ← Homepage
│   ├── admin/                       ← Admin portal (has auth bugs)
│   ├── AITools/                     ← Tools directory (migrate to /tools)
│   └── api/                         ← Route Handlers
├── components/                      ← Shared UI (check here before creating new)
├── lib/                             ← Utilities, clients, types
│   └── database.types.ts            ← Generated Supabase types
├── supabase/
│   └── migrations/                  ← All DB migration files
├── middleware.ts                     ← Auth routing (BROKEN — do not rely on it)
├── tailwind.config.js               ← Brand colors/tokens
└── next.config.js                   ← Redirects, config
```

---

## Essential Commands

```bash
# Start dev server
pnpm dev

# Type check (must pass before PR)
npm run typecheck

# Lint (must pass before PR)
npm run lint

# Start local Supabase
npx supabase start

# Apply local DB migrations
npx supabase db push

# Generate TypeScript types from DB schema
npx supabase gen types typescript --local > lib/database.types.ts

# Test Stripe webhooks locally
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

---

## Tech Stack Reference Card

| Layer | Technology | Status |
|-------|-----------|--------|
| Framework | Next.js 15 App Router | ✅ Active |
| Database | Supabase PostgreSQL 16 | ✅ Active |
| Auth | Supabase Auth | ✅ Active (has RBAC bugs) |
| Payments | Stripe + Connect | ❌ Not integrated |
| Hosting | Vercel | ✅ Active |
| Styling | Tailwind CSS | ✅ Active |
| Email (marketing) | MailerLite | ✅ Active |
| Email (transact.) | Resend | ✅ Active |
| Analytics | Vercel + GA4 | ✅ Active |
| Search | Fuse.js | ✅ Active (replace with Typesense) |
| AI | Anthropic Claude API | Configured |
| Brand Colors | `#0A0A0A` bg + `#00FF41` accent | ✅ In Tailwind |

---

## Priority Task List (As of June 3, 2026)

If you don't have a specific task, work in this order:

1. Fix `sitemap.xml` domain → `melanatedintech.com`
2. Fix `robots.txt` domain reference
3. Audit + fix admin auth RBAC / service role key exposure
4. Delete debug/test pages (`/debug`, `/debug-admin`, `/debug-blog`, etc.)
5. Complete brand rebrand in codebase (replace "VaultX" everywhere)
6. Apply Supabase schema migration (all new tables from `technical-system.md`)
7. Integrate Stripe (checkout + webhook handler)
8. Build Academy MVP (course pages, enrollment, progress tracking)
9. Email sequences (Resend welcome series)
10. Add `generateMetadata()` to all pages

---

## Communication and Escalation

**Founder:** Antonio James | asjames18@gmail.com
**Escalate for:** Revenue decisions, brand changes, security incidents, budget decisions

**When uncertain about scope:**
1. Add question to `open-questions.md`
2. Complete what you can without the answer
3. Clearly document what is blocked pending the answer

**Code review:** All code goes to a feature branch → PR → merge to main
**Never skip:** `npm run typecheck` and `npm run lint` before declaring work done

---

## Session End Protocol

When ending a work session:
1. Commit all work to feature branch (never main directly)
2. Update `current-state.md` — what changed?
3. Update `agent-memory.md` — any new cross-session context?
4. Add any new unresolved questions to `open-questions.md`
5. If a significant decision was made, create an ADR in `/adrs/`

---

## You're Ready

You now have everything needed to work productively on Melanated In Tech.

The platform is pre-revenue, pre-academy, and in the most important build phase of its life. Every sprint matters. Every bug fixed, every page built, every piece of content created is one step closer to a platform that closes the AI wealth gap for an entire community.

Build with precision. Build with purpose. Build what comes next.

> *"We give you everything you need to go from AI curious to AI sovereign."*
