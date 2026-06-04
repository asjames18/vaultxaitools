# Architecture — Melanated In Tech

> **North Star:** Melanated In Tech is building the world's most practical ecosystem for AI Agents, MCP Servers, Agent Skills, Automation Systems, and Agent Commerce. Every decision should move the platform closer to becoming the trusted place where people learn, build, deploy, buy, sell, and scale AI-powered systems.

---

## Purpose

This directory contains all **technical architecture documentation** — system diagrams, infrastructure decisions, security models, data flows, and the technical decision record for the Melanated In Tech platform.

This is distinct from `/project-intelligence/adrs/` (which holds business/strategic ADRs). This directory focuses on *how the system is built* — not why it was chosen.

---

## Directory Structure

```
/architecture
├── README.md                          ← You are here
│
├── system/
│   ├── overview.md                    ← End-to-end system architecture
│   ├── data-flow.md                   ← How data moves through the platform
│   ├── auth-model.md                  ← Authentication + RBAC design
│   └── payment-flow.md                ← Stripe + Connect payment architecture
│
├── database/
│   ├── schema.md                      ← Complete database schema reference
│   ├── rls-policies.md                ← Row-level security policy patterns
│   ├── migrations/                    ← Migration planning docs (code in /supabase/migrations)
│   └── query-patterns.md              ← Common query patterns + optimizations
│
├── api/
│   ├── route-catalog.md               ← All API routes with method, auth, purpose
│   ├── webhook-architecture.md        ← Stripe + other webhook patterns
│   └── rate-limiting.md               ← Rate limiting strategy by endpoint
│
├── infrastructure/
│   ├── hosting.md                     ← Vercel config, edge functions, CDN
│   ├── storage.md                     ← Supabase Storage + Cloudflare R2
│   ├── search.md                      ← Typesense search architecture
│   ├── email.md                       ← Resend + MailerLite integration map
│   └── scaling-plan.md                ← Phase 1→2→3 infrastructure evolution
│
├── security/
│   ├── security-model.md              ← Security principles + threat model
│   ├── secrets-management.md          ← How secrets are managed
│   ├── audit-checklist.md             ← Security audit checklist
│   └── incident-response.md          ← What to do if something goes wrong
│
└── decisions/
    ├── README.md                      ← Points to /project-intelligence/adrs/
    └── technical-notes.md             ← Lightweight notes below ADR threshold
```

---

## System Overview (Quick Reference)

```
USER REQUEST
    ↓
VERCEL EDGE NETWORK (CDN + DDoS protection)
    ↓
NEXT.JS 15 APP ROUTER
    ├── Middleware (auth check, rate limiting, RBAC)
    ├── React Server Components (server-side rendering)
    ├── Route Handlers /api/* (server-side logic)
    └── Client Components (interactive UI)
         │
    EXTERNAL SERVICES
    ├── Supabase
    │   ├── PostgreSQL 16 (primary data store)
    │   ├── Auth (identity + sessions)
    │   ├── Edge Functions (background jobs, webhooks)
    │   ├── Realtime (community notifications)
    │   └── Storage (public assets)
    │
    ├── Cloudflare R2 (paid product delivery — zero egress)
    ├── Stripe (payments + Connect + Billing)
    ├── Resend (transactional email)
    ├── MailerLite (marketing email)
    ├── Anthropic API (Claude — AI features + content)
    ├── PostHog (product analytics)
    ├── Sentry (error tracking)
    └── Typesense (search — Phase 2)
```

---

## Current Known Architecture Issues

| Issue | Severity | Status |
|-------|---------|--------|
| Service role key possible client-side exposure | 🔴 CRITICAL | Unresolved |
| Admin RBAC not enforced in middleware | 🔴 CRITICAL | Unresolved |
| No Stripe integration | 🔴 CRITICAL | Not started |
| No RLS on new tables (tables don't exist yet) | 🟠 HIGH | Needs migration first |
| In-memory rate limiting only | 🟠 HIGH | Phase 2 fix (Upstash Redis) |
| No CSP headers | 🟠 HIGH | Not configured |
| Client-side search (Fuse.js) | 🟡 MEDIUM | Replace with Typesense Phase 2 |
| No semantic search (pgvector) | 🟡 MEDIUM | Phase 2 |

---

## Architecture Principles

1. **Security first** — Never ship a feature that compromises user data or financial security
2. **Supabase-native** — Use built-in Supabase capabilities before reaching for external services
3. **Phase-appropriate** — Don't over-engineer for Phase 3 while in Phase 1
4. **Typed end-to-end** — TypeScript strict mode from DB schema (generated types) to UI
5. **Fail safely** — Payment failures, auth errors, and webhook failures should fail gracefully with audit trails

---

## Architecture Operator: Technical Agent

All architecture decisions and implementations are owned by the **Technical Agent**.
See: `agents/technical-agent.md` for full agent profile.
See: `project-intelligence/adrs/ADR-005-technical-stack.md` for stack decision rationale.
