> **North Star:** Melanated In Tech is building the world's most practical ecosystem for AI Agents, MCP Servers, Agent Skills, Automation Systems, and Agent Commerce. Every decision should move the platform closer to becoming the trusted place where people learn, build, deploy, buy, sell, and scale AI-powered systems.

---

# ADR-005: Technical Stack Selection

**Date:** 2026-06
**Status:** Active
**Deciders:** Antonio James (Founder)

---

## Context

The platform needs a technical stack that can:
1. Support a marketing site + tools directory (now)
2. Handle a full-stack application with auth, payments, and database (Phase 1)
3. Scale to a multi-sided marketplace with community features (Phase 2+)
4. Run AI-powered features (agent-assisted content, search, recommendations) (Phase 2+)

The founding constraint: this is a bootstrapped, solo-founder project. The stack must be operable by one developer (or a small team), low on infrastructure overhead, and fast to iterate.

---

## Decision

**Primary stack:**
- **Frontend:** Next.js 15 (App Router) — server-side rendering, RSC, streaming
- **Database:** Supabase (PostgreSQL 16) — managed Postgres with Auth, Storage, Realtime, Edge Functions
- **Auth:** Start with Supabase Auth, evaluate Clerk migration (see open question in open-questions.md)
- **Payments:** Stripe + Stripe Connect
- **Hosting:** Vercel — integrated with Next.js, zero-config deployment
- **Styling:** Tailwind CSS + Radix UI
- **Email:** Resend (transactional) + MailerLite (marketing campaigns)
- **Analytics:** PostHog (custom events) + Vercel Analytics (performance)
- **Error Tracking:** Sentry
- **File Delivery:** Cloudflare R2 (paid product delivery — zero egress costs)
- **Search:** Typesense (Phase 2, replaces Fuse.js)
- **AI:** Anthropic Claude API (content generation, AI features)
- **Background Jobs:** Supabase Edge Functions + pg_cron (Phase 1), Inngest (Phase 2+)

---

## Alternatives Considered

### Frontend: Next.js vs. Remix vs. SvelteKit

| | Next.js 15 | Remix | SvelteKit |
|-|-----------|-------|----------|
| Ecosystem | Largest | Medium | Growing |
| AI tooling support | Best | Good | Good |
| RSC / Streaming | Yes | Partial | No |
| Deployment | Vercel (zero-config) | Multiple | Multiple |
| Team familiarity | Current stack | Unknown | Unknown |

**Why Next.js:** Already in use. Largest ecosystem. Best-in-class Vercel deployment. RSC architecture ideal for server-heavy platform features. Moving away from it would lose weeks of rebuild time.

### Database: Supabase vs. PlanetScale vs. Neon vs. raw AWS RDS

| | Supabase | PlanetScale | Neon | AWS RDS |
|-|---------|-------------|------|---------|
| Managed | Yes | Yes | Yes | Partial |
| Auth included | Yes | No | No | No |
| Storage included | Yes | No | No | No |
| Realtime | Yes | No | No | No |
| Edge Functions | Yes | No | No | No |
| Pricing at scale | Competitive | Premium | Competitive | Complex |
| pgvector support | Yes | No | Yes | Yes |

**Why Supabase:** Already in use. Most complete full-stack offering for a solo developer — Auth, DB, Storage, Realtime, and Edge Functions in one service. PostgreSQL means full SQL power and pgvector for future semantic search. The only gap is RBAC complexity (hence the Clerk migration consideration).

### Payments: Stripe vs. Lemon Squeezy vs. Paddle

| | Stripe | Lemon Squeezy | Paddle |
|-|--------|---------------|--------|
| Marketplace (multi-seller) | Stripe Connect | No | No |
| Tax handling | Manual/Stripe Tax | Automatic | Automatic (MoR) |
| Documentation | Excellent | Good | Good |
| Fees | 2.9% + $0.30 | 5% + $0.50 | 5% + $0.50 |
| US-focused | Yes | Yes | Global MoR |

**Why Stripe:** Stripe Connect is the only mature solution for a multi-seller marketplace with automated payouts. Lemon Squeezy and Paddle don't support marketplace/multi-seller payout architecture. The higher implementation complexity of Stripe is unavoidable for the marketplace model.

### Hosting: Vercel vs. Railway vs. Fly.io vs. AWS

**Why Vercel:** Zero-config Next.js deployment. Edge network included. Preview deployments for every PR. Already in use. At Phase 1 scale, no infrastructure overhead at all. Move to self-hosted or hybrid only if Vercel costs become prohibitive at Phase 3+ scale (>$500/month).

---

## Why Chosen (Combined Rationale)

1. **Already in use.** The codebase already runs on Next.js + Supabase + Vercel. Switching stacks at this stage would cost 4–6 weeks of rebuild time with no user benefit.

2. **Optimal for solo developer.** This stack requires zero DevOps. No servers to manage. No database replication to configure. No deployment pipelines to build. The founder can focus entirely on product.

3. **Scales to the needed level.** The stack can handle 10K+ concurrent users before requiring significant architecture changes. Phase 2 adds Redis and read replicas. Phase 3 upgrades to Supabase Enterprise. This is a known, well-documented scaling path.

4. **Strong AI/ML integration path.** Supabase's pgvector extension enables semantic search. Supabase Edge Functions enable AI-powered API routes. Next.js API routes can call any AI provider. The stack doesn't limit future AI features.

5. **Ecosystem support.** Next.js + Supabase + Stripe + Vercel is the most widely documented full-stack web combination in 2025–2026. Every problem has been solved and documented somewhere. Debugging is faster. Hiring (if needed) is easier.

---

## Tradeoffs

| Accepted Tradeoff | Reasoning |
|------------------|----------|
| Supabase Auth has RBAC limitations | Known issue; being resolved via Clerk migration or custom fix |
| Vercel can be expensive at scale | Acceptable at Phase 1–2; re-evaluate at $500+/month billing |
| Stripe complexity for marketplace | Unavoidable for multi-seller payout model |
| Next.js App Router is newer with occasional rough edges | RSC benefits outweigh edge cases; community/docs are strong |
| Vendor lock-in risk (Vercel/Supabase) | Both are portable in theory; risk is low at current scale |

---

## Infrastructure Scaling Plan

| Phase | Monthly Cost | Key Changes |
|-------|-------------|------------|
| Phase 1 (0–1K users) | ~$75 | Vercel Hobby/Pro, Supabase Free/Pro |
| Phase 2 (1K–10K users) | ~$325 | + Upstash Redis, Typesense (Railway), Sanity CMS |
| Phase 3 (10K+ users) | ~$3,000+ | + Supabase Enterprise, Mux video, ClickHouse analytics, multi-region |

---

## Future Impact

**This decision enables:**
- Fast iteration without infrastructure overhead
- AI features via Claude API + pgvector without additional infrastructure
- Realtime community features via Supabase Realtime
- Serverless background jobs via Edge Functions + pg_cron

**This decision constrains:**
- Vercel billing can become a scaling bottleneck (mitigated by moving compute to Supabase Edge)
- Supabase Auth limitations require either Clerk migration or custom RBAC work
- Typesense self-hosting on Railway adds an operational dependency in Phase 2

**When to revisit this ADR:**
- If Supabase pricing increases significantly
- If Vercel billing exceeds $500/month
- If a new AI-native platform emerges with materially better DX for the MIT use case
