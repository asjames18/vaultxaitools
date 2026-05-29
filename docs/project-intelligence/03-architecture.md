# Architecture

**Last updated:** 2026-05-29  
**Stack:** Next.js 15 App Router · React 18 · TypeScript · Tailwind · Supabase (PostgreSQL + Auth)

---

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client (Browser)                          │
│  app/* pages · components/* · lib/hooks                        │
└───────────────────────────┬─────────────────────────────────────┘
                            │
              ┌─────────────▼─────────────┐
              │     middleware.ts          │
              │  Session refresh · RBAC    │
              └─────────────┬─────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────────┐
│              Next.js API Routes (app/api/*)                      │
│  Public: search, reviews, contact, news, health                  │
│  Auth: favorites, profile, export, dashboard                     │
│  Admin: tools, blog, users, workflows, revalidate                │
└───────────────────────────┬─────────────────────────────────────┘
                            │
              ┌─────────────▼─────────────┐
              │   Supabase PostgreSQL      │
              │   + Auth + RLS             │
              └───────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  Offline: scripts/* (seeding, AI data fetch, automation, QA)     │
└─────────────────────────────────────────────────────────────────┘
```

---

## Directory Layout (Current)

| Path | Responsibility |
|------|----------------|
| `app/` | Pages, layouts, API routes (App Router) |
| `components/` | Shared UI; `components/admin/` for admin-only |
| `lib/` | Supabase clients, auth, data access, hooks, utilities |
| `data/` | Static seed/fallback tool and category data |
| `supabase/` | Schema SQL + migrations |
| `scripts/` | Ops, seeding, automation, data quality (104 files) |
| `docs/` | Human + agent documentation |
| `public/` | Static assets, PWA manifest, service worker |
| `middleware.ts` | Auth gate, admin route protection |

### Target Layout (Incremental Migration)

```
src/                          # optional future root
features/
  tools/                      # directory, search, detail
  reviews/
  favorites/
  blog/
  news/
  admin/
  auth/
  affiliate/
components/                   # truly shared UI only
lib/                          # infra: supabase, auth, utils
orchestration/                # workflow runners (from scripts/)
ai/                           # data ingestion pipelines
```

Migrate feature-by-feature; do not big-bang move.

---

## Authentication Flow

1. User signs in/up via Supabase (`/sign-in`, `/sign-up`)
2. OAuth callback at `/auth/callback`
3. `middleware.ts` refreshes session cookies via `@supabase/ssr`
4. Protected routes: `/dashboard`, `/settings`, `/favorites`
5. Admin routes: `/admin/*` — checks `user_roles` + `ADMIN_EMAILS` env allowlist
6. API routes use cookie session and/or Bearer token (inconsistent — see debt)

**Auth provider:** Supabase Auth only (no Clerk).

---

## API Flow Summary

| Domain | Public | Auth Required | Admin |
|--------|--------|---------------|-------|
| Tool search | `/api/search`, `/api/search/advanced` | — | — |
| Reviews | `/api/reviews` GET/POST | — | — |
| Favorites | — | `/api/favorites` | — |
| User profile | — | `/api/user/*` | — |
| Dashboard | — | `/api/dashboard` (mock data) | — |
| Tool CRUD | — | — | `/api/admin/tools/*` |
| Blog CMS | — | — | `/api/admin/blog` |
| Users | — | — | `/api/admin/users/*` |
| Workflows | — | — | `/api/admin/workflows/*` |
| Health | `/api/health` | — | — |

---

## Data Layer (Dual Source Problem)

**Problem:** Tools exist in both Supabase and static files.

| Source | File | Role (Target) |
|--------|------|---------------|
| Supabase `tools` | Live DB | **Primary** runtime source |
| `data/tools.ts` | 639 lines static | Seed / offline fallback only |
| `data/tools.json` | JSON export | Script input |
| `lib/database-client.ts` | Client CRUD + static categories | Mixed — needs split |

**Target:** All pages read from Supabase; `data/` used only by seed scripts.

---

## Supabase Client Factories (Fragmented)

| Module | Purpose | Usage |
|--------|---------|-------|
| `lib/supabase.ts` | Browser client | Client components |
| `lib/supabase-server.ts` | Server SSR client | API routes, RSC |
| `lib/supabaseClient.ts` | Legacy direct client | Some older imports |
| `lib/supabaseAdminClient.ts` | Service role singleton | Admin ops |
| `lib/auth.ts` | `createAdminClient()` duplicate | Admin auth |

**Target:** Two factories only — `createBrowserClient()` + `createServerClient()` + one `createServiceRoleClient()` for admin.

---

## Database Schema (Core Tables)

Defined in `supabase/schema.sql` + supplemental scripts:

- `user_roles`, `tools`, `categories`, `favorites`, `blog_posts`
- `contact_messages`, `sponsored_slots`
- Extended via scripts: `reviews`, `workflows`, `workflow_runs`, `profiles`, `ai_news`, `audit_logs`

See `02-domain-language.md` for entity definitions.

---

## AI Integration Points

AI is **offline data pipeline**, not runtime chat:

| Component | Role |
|-----------|------|
| `scripts/fetch-real-ai-data.js` | External tool metadata ingestion |
| `scripts/ai-news-automation.js` | News feed population |
| `scripts/real-time-ai-data-fetcher.js` | Scheduled refresh |
| `app/api/admin/tools/enrich/route.ts` | OG/meta scrape (no LLM) |
| `env.example` OPENAI/REPLICATE keys | Script-only |

---

## Billing / Monetization

- **No Stripe or payment processing**
- Monetization: affiliate UTM links + sponsored slots
- Affiliate click API currently **disabled** (`/api/analytics/affiliate-click`)

---

## Deployment

- **Primary:** Vercel (`vercel.json`)
- **Alternate:** Netlify (`netlify.toml`)
- **CI script:** `npm run ci` (verify-env → lint → build → test)

---

## Security Headers

Configured in `next.config.ts` — review before adding new external domains.

---

## Key Architectural Risks

1. Dual tool data sources cause stale UI
2. Six Supabase client patterns increase auth bugs
3. Debug routes publicly reachable (`/debug-supabase`, `/api/debug-env`)
4. Hardcoded admin emails in `lib/auth.ts` and `middleware.ts`
5. `database.types.ts` is `any` — no compile-time schema safety
6. Schema drift between `schema.sql` and `scripts/create-*.sql`
