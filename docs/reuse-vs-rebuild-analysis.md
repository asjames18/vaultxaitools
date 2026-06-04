# Reuse vs. Rebuild Analysis — Melanated In Tech MVP

**Date:** 2026-06-03
**Auditor:** Product Alignment Agent
**Reference:** MIT Constitution v2.0

---

## Executive Summary

The codebase is a **partially-formed AI tools directory** with strong infrastructure but no commerce layer. Reuse potential is approximately **50–60%** for the MVP.

**What exists and is useful:**
- Tool discovery, search, filtering, reviews, ratings
- User auth, dashboard shell, favorites, admin portal, blog CMS
- Email integration (Resend), newsletter signup, analytics

**What is completely missing:**
- Stripe / payments / checkout
- Multi-product types (Agents, MCP Servers, Skills, Prompts, Templates, Blueprints)
- Membership tiers (Free/Pro/Elite)
- Creator accounts, dashboards, payouts
- Purchase history, license keys, download tracking
- Email automation sequences
- Moderation queue, marketplace analytics

---

## Feature Analysis

### Homepage & Authority Building

| Feature | Current State | Decision | Effort |
|---------|--------------|----------|--------|
| Homepage hero + featured sections | `HomeClient.tsx` with trending/popular sections | **KEEP** | 1 day |
| Email capture | `EnhancedNewsletter.tsx` + Resend live | **KEEP & EXTEND** | 2 days |
| Newsletter automation | Resend wired; no sequences defined | **REFACTOR** | 1 week |
| Testimonials / case studies | Does not exist | **BUILD** | 1 week |
| About / mission page | Exists; pre-Constitution | **REFACTOR** | 2 days |

### Product Directories

| Feature | Current State | Decision | Effort |
|---------|--------------|----------|--------|
| Product listing pages | `/AITools` + single tool type | **REFACTOR** | 3 days |
| Product detail pages | Full tool detail UI | **KEEP & EXTEND** | 2 days |
| Search & advanced filtering | `/api/search` + `/api/search/advanced` working | **KEEP** | 1 day |
| Comparison | `/compare` — UI only, no data | **REFACTOR** | 1 day |
| Category browse | Categories table + browse functional | **REFACTOR** | 2 days |
| Trending algorithm | `lib/trending.ts` working | **KEEP** | <1 day |
| Reviews & ratings | Full schema + RLS + voting | **KEEP & EXTEND** | 1 day |

### Marketplace & Commerce

| Feature | Current State | Decision | Effort |
|---------|--------------|----------|--------|
| Stripe integration | Does not exist | **BUILD** | 2 weeks |
| Product pricing / SKUs | Single text field on tools | **REPLACE** | 1 week |
| Shopping cart & checkout | Does not exist | **BUILD** | 2 weeks |
| Purchase history & downloads | Does not exist | **BUILD** | 1 week |
| Creator payout management | Does not exist | **BUILD** | 2 weeks |
| License key generation | Does not exist | **BUILD** | 1 week |

### User Accounts & Membership

| Feature | Current State | Decision | Effort |
|---------|--------------|----------|--------|
| User profiles | Basic auth exists; thin profile | **REFACTOR** | 1 week |
| Free/Pro/Elite tiers | Does not exist | **BUILD** | 1 week |
| Tier upgrade workflow | Does not exist | **BUILD** | 1 week |
| Tier-gated features | Does not exist | **BUILD** | 1 week |
| Creator accounts | Does not exist | **BUILD** | 2 weeks |
| User dashboard | Exists but returns mock data | **REFACTOR** | 1 week |

### Admin Portal

| Feature | Current State | Decision | Effort |
|---------|--------------|----------|--------|
| Admin dashboard | `AdminDashboard.tsx` — 1276 lines | **REFACTOR** | 2 weeks |
| Product CRUD | Tool admin fully functional | **KEEP** | 1 day |
| User management | Role, password, status management | **KEEP** | 2 days |
| Blog CMS | Full publish pipeline | **KEEP** | 1 day |
| Content moderation queue | Does not exist | **BUILD** | 1 week |
| Analytics dashboard | Stubs only | **BUILD** | 2 weeks |
| Creator management | Does not exist | **BUILD** | 1 week |

---

## What's Missing (Build from Scratch)

1. Payment processing — Stripe, checkout, receipts, refunds
2. Creator accounts — onboarding, dashboards, earnings, payouts
3. Membership tiers — Free/Pro/Elite gating, permission enforcement
4. Commerce data model — orders, order_items, licenses, payouts tables
5. Product types — Agent, MCP Server, Skill, Prompt, Template, Blueprint
6. License & download tracking — key generation, delivery, usage
7. Email automation — welcome sequence, weekly digest, tier upgrades
8. Marketplace analytics — GMV, conversions, creator earnings, top products
9. Content moderation — flagging, review queue, auto-moderation
10. Creator dashboard — analytics, earnings, product management

---

## Sprint 1 Recommended Sequence

**Week 1 — Schema & Foundation**
- Consolidate migrations; add products, orders, creators, payouts tables
- Fix debug routes (security)
- Consolidate Supabase client factories

**Week 2 — Stripe Integration**
- Stripe account + env setup
- Checkout UI + cart state
- Order creation + payment processing
- Webhook handler for confirmations

**Week 3 — Product Directories**
- Generalize listing/detail pages for 6 product types
- Update search for multi-type
- Seed 10–15 agents, 5 skills, 3 MCP servers

**Week 4 — User Tiers & Creator Basics**
- Add tier column to profiles
- Creator account flag + onboarding flow
- Creator dashboard skeleton
- Tier-gated product access

---

## Effort Estimates

| Category | Weeks | Risk |
|----------|-------|------|
| Reuse/extend existing (auth, search, reviews, blog) | 3 | Low |
| Refactor product pages to multi-type | 1.5 | Low |
| Build commerce (Stripe, checkout, orders) | 3 | Medium |
| Build user tiers & creator infrastructure | 4 | Medium |
| Build admin enhancements | 2 | Low |
| Build email sequences | 1.5 | Low |
| **MVP Total (excl. tests/docs)** | **15–17 weeks** | Medium |

---

## Critical Decisions Required Before Sprint 1

1. **Pricing model** — Per-product, tiered access, or subscription-only?
2. **Creator commission** — Fixed 70/30 split or sliding scale?
3. **Tax handling** — 1099 automation, W-9 collection, or creator-responsible?
4. **Content review model** — Pre-publish review or trust-and-flag?
5. **Refund policy** — 30-day money-back or no refunds for digital products?

All decisions must be documented as Constitution amendments before coding begins.

---

## Technical Debt to Clear Before Sprint 1

| Item | Effort |
|------|--------|
| Delete/gate debug routes | 1 day |
| Remove hardcoded admin emails from source | 1 day |
| Consolidate Supabase client factories (5 → 3) | 2 days |
| Consolidate schema migrations | 2 days |
| Fix ESLint for Next.js 15 | 1 day |

Total pre-work: ~1 week (can run in parallel with Stripe account setup)
