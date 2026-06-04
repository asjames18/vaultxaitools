# Sprint 0 Readiness Report — Melanated In Tech

**Date:** 2026-06-03
**Prepared by:** SuperAgent
**Status: READY TO PROCEED — with critical security items on parallel track**

---

## The Central Question

> "What is the fastest path from today's codebase to the first paying customer?"

**Answer:** 4 sprints (~16 weeks) from now, assuming:
- CRITICAL security fixes completed in Week 0 (before Sprint 1 begins)
- Stripe account and creator commission model decided by Week 1
- 1 full-time engineer or equivalent AI-agent-assisted velocity

**First revenue target:** $500 in 30 days post-launch

---

## What Exists (Don't Rebuild)

| Asset | Status | Reuse Value |
|-------|--------|-------------|
| Auth system (Supabase) | Working | HIGH |
| Search infrastructure | Working | HIGH |
| Review & rating system | Working | HIGH |
| Blog CMS | Working | HIGH |
| Admin CRUD patterns | Working | HIGH |
| Email integration (Resend) | Working | HIGH |
| UI component library (50+ components) | Working | HIGH |
| Tailwind design system | Working | HIGH |
| ISR caching | Working | MEDIUM |
| User dashboard shell | Exists (mock data) | MEDIUM |
| Newsletter signup | Working | MEDIUM |
| Sponsored slots | Exists (unused) | LOW |

---

## What's Broken (Fix Before Sprint 1)

These are CRITICAL items. Do not start Sprint 1 until these are resolved.

### Security — Fix This Week

| # | Fix | File | Effort |
|---|-----|------|--------|
| 1 | **Delete** `app/debug-admin-blog/page.tsx` — service role key exposed | `app/debug-admin-blog/` | 15 min |
| 2 | **Delete or gate** all `/debug*`, `/test-*`, `/ui-showcase` routes | `app/debug*/`, middleware.ts | 1 hr |
| 3 | **Fix** admin page auth fallback — change `setCanAccess(true)` in catch to `setCanAccess(false)` | `app/admin/page.tsx:54` | 15 min |
| 4 | **Move** service role client init inside route handlers (after auth check) | `app/api/admin/users/route.ts`, `workflows/route.ts`, `blog/route.ts` | 2 hrs |
| 5 | **Fix** SQL injection in search route — replace `.or()` string interpolation with `.ilike()` | `app/api/search/route.ts:60,67,73` | 1 hr |

Total: ~4 hours of work. **Block Sprint 1 on these.**

### Architecture — Fix Week 1

| # | Fix | Effort |
|---|-----|--------|
| 6 | Consolidate 5 Supabase client factories → 3 canonical exports | 2 days |
| 7 | Run `supabase gen types` — replace type stub with real schema types | 2 hrs |
| 8 | Consolidate schema migrations — one source of truth under `supabase/migrations/` | 2 days |
| 9 | Fix ESLint config for Next.js 15 | 1 day |
| 10 | Investigate and fix Windows build failure (EISDIR on automation route) | half day |

---

## What's Missing (Build for MVP)

### Must Have for First Paying Customer

| Feature | Effort | Sprint |
|---------|--------|--------|
| Multi-product type support (6 types) | 3 days | 1 |
| Stripe checkout flow | 2 weeks | 1 |
| Orders, purchases, downloads schema | 1 week | 1 |
| User tier system (Free/Pro/Elite) | 1 week | 1 |
| AI Agent directory | 3 days | 1 |
| MCP Server directory | 2 days | 1 |
| Agent Skills directory | 2 days | 1 |
| Homepage rebuild (authority, email capture) | 1 week | 2 |
| Creator account basics | 2 weeks | 2 |
| Purchase confirmation emails | 2 days | 2 |
| Digital download delivery | 1 week | 2 |

### Nice to Have (Sprint 3+)

| Feature | Sprint |
|---------|--------|
| Learn section (tutorials, Agent Academy) | 3 |
| Newsletter automation sequences | 3 |
| Creator dashboard analytics | 3 |
| Marketplace analytics for admin | 3 |
| Content moderation queue | 3 |
| Stripe Connect (creator payouts) | 4 |

### Out of Scope for MVP

- Community features
- Certifications
- Enterprise / team accounts
- App store / third-party marketplace
- Courses (video platform)
- Mobile app

---

## Sprint Plan

### Sprint 0 (This Week — Now)
**Goal:** Unblock Sprint 1

- [ ] Fix 5 CRITICAL security items (see above)
- [ ] Fix 5 architecture items (see above)
- [ ] Stripe account setup + verify credentials
- [ ] Decide: creator commission rate (e.g., 70/30)
- [ ] Decide: product tier pricing (Free / Pro $29/mo / Elite $99/mo)
- [ ] Decide: refund policy
- [ ] Document all decisions as Constitution amendments

**Exit criteria:** All CRITICAL security items resolved, Stripe account live, pricing model documented.

---

### Sprint 1 (Weeks 1–4)
**Goal:** Functional marketplace with 3+ product types and working checkout

**Week 1 — Schema**
- Add products, orders, order_items, creators, payouts tables
- RLS policies for new tables
- Seed 15 agents, 5 skills, 3 MCP servers

**Week 2 — Stripe**
- Stripe integration
- Checkout UI + cart
- Order creation API + payment webhook

**Week 3 — Directories**
- Generalize product listing/detail pages for 6 types
- `/agents`, `/mcp-servers`, `/skills` routes live

**Week 4 — Tiers**
- Free/Pro/Elite tier column + permission middleware
- Creator account flag + basic onboarding

**Sprint 1 success metric:** One real purchase processed end-to-end with Stripe test card.

---

### Sprint 2 (Weeks 5–8)
**Goal:** First real paying customer

- Homepage rebuilt (authority, email capture, mission)
- Creator can publish product → listed in directory
- Purchase → digital download delivery via Supabase Storage
- Purchase confirmation + welcome transactional emails
- User dashboard wired to real data (purchases, downloads, favorites)

**Sprint 2 success metric:** First real customer pays → downloads product → no support tickets.

---

### Sprint 3 (Weeks 9–12)
**Goal:** $500 total revenue, 500 email subscribers

- Learn section (5 tutorials, Agent Academy intro)
- Newsletter automation (welcome, weekly digest)
- Creator dashboard (earnings, products, ratings)
- Admin marketplace analytics (GMV, conversions, top products)

---

### Sprint 4 (Weeks 13–16)
**Goal:** Creator ecosystem live

- Stripe Connect (creator payouts)
- Moderation queue
- Community features (comments, upvotes)
- Creator analytics

---

## Decisions Required From Founder

These are blocking items. Agents cannot make these decisions.

| Decision | Deadline | Impact |
|----------|----------|--------|
| Creator commission split | Before Sprint 1 Week 2 | Blocks Stripe setup |
| Membership tier prices (Pro/Elite) | Before Sprint 1 Week 4 | Blocks tier system |
| Refund policy | Before Sprint 2 | Blocks launch |
| Content review model (pre-publish vs. trust-and-flag) | Before Sprint 2 | Blocks creator publishing |
| Tax handling for creators (1099, W-9) | Before Sprint 3 | Blocks Stripe Connect |

---

## First Revenue Path

**The two easiest products to sell on day 1** (both marked "Ready" in the asset registry):

1. **Content Creation Prompt Pack (PRP-002)** — $19 one-time
2. **Brand Kit Template (TPL-001)** — $15 one-time

**Why these first:**
- Already marked Ready in master-asset-registry.md
- Low price = low buyer friction
- No creator infrastructure needed (Antonio sells directly)
- Validates payment flow before creator system is built

**Target:** 30 sales at ~$17 AOV = $510 = first revenue milestone hit.

---

## Agent Operating Guidelines for Sprint 1

Per `agents/workspaces/` workspace definitions:

| Agent | Can Do Without Approval | Requires Human Approval |
|-------|------------------------|------------------------|
| Technical Agent | Bug fixes, component work, refactors | Schema changes, Stripe config, auth changes |
| Content Agent | Routine copy, product descriptions | Anything attributed to Antonio |
| Marketplace Agent | Product catalog updates | Any pricing changes |
| SEO Agent | Metadata, content briefs | URL structure changes |
| SuperAgent | Coordination, strategy docs | Payments, auth, infra |

**Human approval is required for:** Any change touching auth, payments, schema, admin access, or the Constitution.

---

## Repository Health Summary

| Category | Status | Blocking? |
|----------|--------|-----------|
| Security — 4 CRITICAL items | ⚠️ Fix immediately | YES |
| Technical debt — 30 items | 🟡 Fix in Week 1 | Partial |
| Commerce layer | ❌ Does not exist | YES — Sprint 1 |
| Multi-product types | ❌ Does not exist | YES — Sprint 1 |
| User tiers | ❌ Does not exist | YES — Sprint 1 |
| Auth & user system | ✅ Working | No |
| Search & discovery | ✅ Working | No |
| Blog & content | ✅ Working | No |
| Admin portal | ✅ Working (refactor needed) | No |
| Email (Resend) | ✅ Working | No |
| UI component library | ✅ Working | No |
| Documentation | ✅ Strong (some stale) | No |
| Agent governance | ✅ Workspace definitions in place | No |

---

## Final Verdict

Melanated In Tech is **not starting from zero.** It has a production-quality foundation with real infrastructure, a working admin system, and 50+ UI components.

The path to first paying customer is clear:
1. Fix 5 CRITICAL security items this week
2. Decide pricing/commission model this week
3. Build Stripe + multi-product directories in Sprint 1
4. Launch two "Ready" products in Sprint 2
5. First $500 in revenue 8–10 weeks from now

**The question is no longer "can we build this." The question is "how fast can we ship."**
