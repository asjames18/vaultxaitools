# Technical System — Melanated In Tech

> **North Star:** Melanated In Tech is building the world's most practical ecosystem for AI Agents, MCP Servers, Agent Skills, Automation Systems, and Agent Commerce. Every decision should move the platform closer to becoming the trusted place where people learn, build, deploy, buy, sell, and scale AI-powered systems.

---

> Complete reference for the tech stack, architecture, security model, data schema, and development rules.

---

## Current Tech Stack (Active as of June 2026)

| Layer | Technology | Version | Status |
|-------|-----------|---------|--------|
| Framework | Next.js (App Router) | 15 | Active |
| Database | Supabase (PostgreSQL) | 16 | Active |
| Auth | Supabase Auth | — | Active (has RBAC issues) |
| Styling | Tailwind CSS | 3.x | Active |
| Animations | Framer Motion | — | Active |
| Email (marketing) | MailerLite | — | Active |
| Email (transactional) | Resend | — | Active |
| Analytics | Vercel Analytics + GA4 | — | Active |
| Hosting | Vercel | — | Active |
| Icons | Lucide React + Heroicons | — | Active |
| Search | Fuse.js (client-side) | — | Active — replace with Typesense |
| Payments | None | — | **NOT INTEGRATED — critical gap** |
| Community | None | — | **NOT BUILT** |
| CMS | Supabase blog table | — | Active (basic) |

---

## Target Stack (What to Build Toward)

| Layer | Technology | Phase | Notes |
|-------|-----------|-------|-------|
| Frontend | Next.js 15 App Router (RSC + streaming) | Now | Keep |
| UI | Tailwind CSS + Radix UI | Phase 1 | Add Radix primitives |
| Database | Supabase PostgreSQL 16 + pgvector + pg_cron + pg_net | Phase 1 | Extend with extensions |
| Auth | Clerk **or** fixed Supabase Auth RBAC | Phase 1 | Decision pending (see ADR-005) |
| Payments | Stripe + Stripe Connect | Phase 1 | Critical — needed for all revenue |
| File Storage | Supabase Storage (public) + Cloudflare R2 (paid products) | Phase 1 | R2 = zero egress costs |
| Search | Typesense (self-hosted on Railway, ~$5/month) | Phase 2 | Replaces Fuse.js |
| Background Jobs | Supabase Edge Functions + pg_cron | Phase 1 | Inngest for Phase 2+ |
| CMS | Sanity.io | Phase 2 | For scalable content management |
| Analytics | PostHog + Vercel Analytics | Phase 1 | PostHog for custom events |
| Error Tracking | Sentry | Phase 1 | Add immediately |
| Cache | Upstash Redis | Phase 2 | After 1K users |
| CDN | Vercel Edge Network | Now | Already active |
| AI | Anthropic API (Claude) | Phase 1 | Content generation, agents |
| Embeddings | OpenAI text-embedding-3-small | Phase 2 | Semantic search via pgvector |
| Video | Mux | Phase 3 | Course video delivery at scale |

---

## System Architecture

```
USERS → VERCEL EDGE NETWORK → NEXT.JS 15 APP
                                 ├── Middleware (auth, rate limiting, RBAC)
                                 ├── React Server Components (RSC)
                                 ├── Route Handlers (/api/*)
                                 └── Client Components
                                    │
                                    ├── CLERK / SUPABASE AUTH (Identity)
                                    ├── SUPABASE (Data Layer)
                                    │     ├── PostgreSQL 16 (primary DB)
                                    │     ├── Edge Functions (webhooks, jobs)
                                    │     ├── Realtime (community notifications)
                                    │     └── Storage (public assets)
                                    │
                                    ├── CLOUDFLARE R2 (Paid product delivery)
                                    ├── STRIPE (Payments + Connect + Billing)
                                    ├── TYPESENSE (Full-text search)
                                    ├── RESEND (Transactional email)
                                    ├── MAILERLITE (Marketing email)
                                    ├── ANTHROPIC API (AI features)
                                    ├── POSTHOG (Event analytics)
                                    └── SENTRY (Error tracking)
```

---

## Codebase Structure

```
E:\vaultxaitools\
├── app/                          ← Next.js App Router pages
│   ├── layout.tsx                ← Root layout, fonts, providers
│   ├── page.tsx                  ← Homepage (needs full rewrite)
│   ├── admin/                    ← Admin portal (role=admin only)
│   ├── AITools/                  ← Tools directory (migrate to /tools)
│   ├── api/                      ← Route Handlers
│   │   ├── webhooks/stripe/      ← Stripe webhook handler
│   │   ├── academy/              ← Course enrollment, progress
│   │   └── marketplace/          ← Product CRUD, downloads
│   ├── academy/                  ← Academy pages
│   ├── marketplace/              ← Marketplace pages
│   ├── community/                ← Community pages
│   ├── consulting/               ← Consulting pages
│   ├── dashboard/                ← User dashboard
│   └── seller/                   ← Creator/seller portal
├── components/                   ← Shared UI components
│   └── ui/                       ← Atomic components
├── lib/                          ← Utilities, clients
│   ├── supabase/                 ← Supabase client (browser + server)
│   ├── stripe.ts                 ← Stripe client
│   └── database.types.ts         ← Generated Supabase types
├── supabase/
│   └── migrations/               ← SQL migration files (version controlled)
├── docs/                         ← Strategy documents
├── project-intelligence/         ← This directory
├── middleware.ts                  ← Auth routing (BROKEN — fix priority 2)
├── next.config.js                ← Redirects, config
├── tailwind.config.js            ← Brand tokens
└── .env.local                    ← Local secrets (NEVER commit)
```

---

## Environment Variables

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=           # Safe for client
NEXT_PUBLIC_SUPABASE_ANON_KEY=      # Safe for client
SUPABASE_SERVICE_ROLE_KEY=          # ⚠️ SERVER ONLY — never client-side

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY= # Safe for client
STRIPE_SECRET_KEY=                  # Server only
STRIPE_WEBHOOK_SECRET=              # Server only — webhook signature verification

# Email
MAILER_LITE_API_KEY=                # Server only
RESEND_API_KEY=                     # Server only

# Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=      # Safe for client

# AI
ANTHROPIC_API_KEY=                  # Server only

# Cloudflare R2 (when added)
CLOUDFLARE_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
```

---

## Database Schema (Core Tables)

### users
```sql
id UUID PRIMARY KEY,
auth_id TEXT UNIQUE,           -- from auth provider
email TEXT UNIQUE NOT NULL,
email_verified BOOLEAN,
username TEXT UNIQUE,
full_name TEXT,
avatar_url TEXT,
role TEXT DEFAULT 'member',    -- member | creator | moderator | admin
status TEXT DEFAULT 'active',  -- active | suspended | banned
stripe_customer_id TEXT,
created_at TIMESTAMPTZ DEFAULT NOW(),
updated_at TIMESTAMPTZ DEFAULT NOW(),
last_seen_at TIMESTAMPTZ
```

### profiles
```sql
id UUID PRIMARY KEY REFERENCES users(id),
bio TEXT,
headline TEXT,
location TEXT,
website_url TEXT,
twitter_handle TEXT,
linkedin_url TEXT,
github_url TEXT,
expertise_tags TEXT[],
is_public BOOLEAN DEFAULT TRUE,
points INTEGER DEFAULT 0,
level INTEGER DEFAULT 1,
streak_days INTEGER DEFAULT 0,
seller_bio TEXT,
seller_approved BOOLEAN DEFAULT FALSE,
stripe_account_id TEXT,      -- Stripe Connect
commission_rate DECIMAL DEFAULT 0.30,
total_sales INTEGER DEFAULT 0,
avg_rating DECIMAL,
created_at TIMESTAMPTZ,
updated_at TIMESTAMPTZ
```

### membership_tiers
```sql
id UUID PRIMARY KEY,
name TEXT,           -- Free | Community | Builder | Pro | Enterprise
slug TEXT UNIQUE,
price_monthly_cents INTEGER,
price_annually_cents INTEGER,
stripe_price_ids JSONB,
features JSONB,
limits JSONB,
is_active BOOLEAN DEFAULT TRUE
```

### courses
```sql
id UUID PRIMARY KEY,
creator_id UUID REFERENCES users(id),
title TEXT NOT NULL,
slug TEXT UNIQUE NOT NULL,
description TEXT,
short_description TEXT,
cover_image_url TEXT,
price_cents INTEGER,
min_tier_slug TEXT,
status TEXT DEFAULT 'draft',   -- draft | published | archived
difficulty TEXT,               -- beginner | intermediate | advanced
duration_minutes INTEGER,
has_certificate BOOLEAN DEFAULT FALSE,
tags TEXT[],
category TEXT,
seo_title TEXT,
seo_description TEXT,
enrollment_count INTEGER DEFAULT 0,
avg_rating DECIMAL,
published_at TIMESTAMPTZ,
created_at TIMESTAMPTZ,
updated_at TIMESTAMPTZ
```

### products (marketplace)
```sql
id UUID PRIMARY KEY,
seller_id UUID REFERENCES users(id),
type TEXT,    -- ai_agent | mcp_server | prompt_pack | agent_skill | blueprint | bundle
status TEXT,  -- draft | pending_review | published | archived | rejected
title TEXT NOT NULL,
slug TEXT UNIQUE NOT NULL,
short_description TEXT,
description TEXT,
thumbnail_url TEXT,
price_cents INTEGER,
is_free BOOLEAN GENERATED ALWAYS AS (price_cents = 0) STORED,
delivery_type TEXT,     -- download | api_key | repository
delivery_config JSONB,
metadata JSONB,
seo_title TEXT,
seo_description TEXT,
view_count INTEGER DEFAULT 0,
purchase_count INTEGER DEFAULT 0,
avg_rating DECIMAL,
tags TEXT[],
category TEXT,
search_vector TSVECTOR,   -- full-text search
embedding VECTOR(1536),   -- semantic search (Phase 2)
created_at TIMESTAMPTZ,
updated_at TIMESTAMPTZ,
published_at TIMESTAMPTZ
```

### orders
```sql
id UUID PRIMARY KEY,
buyer_id UUID REFERENCES users(id),
stripe_payment_intent_id TEXT UNIQUE,
stripe_session_id TEXT,
status TEXT,  -- pending | completed | refunded | disputed
total_cents INTEGER,
platform_fee_cents INTEGER,
currency TEXT DEFAULT 'usd',
metadata JSONB,
created_at TIMESTAMPTZ,
completed_at TIMESTAMPTZ
```

### community_posts
```sql
id UUID PRIMARY KEY,
author_id UUID REFERENCES users(id),
parent_id UUID REFERENCES community_posts(id),  -- null = top-level
category TEXT,  -- general | showcase | help | tools | career
title TEXT,
body TEXT NOT NULL,
tags TEXT[],
upvote_count INTEGER DEFAULT 0,
reply_count INTEGER DEFAULT 0,
is_pinned BOOLEAN DEFAULT FALSE,
status TEXT DEFAULT 'published',
search_vector TSVECTOR,
created_at TIMESTAMPTZ,
updated_at TIMESTAMPTZ
```

### certifications
```sql
id UUID PRIMARY KEY,
course_id UUID REFERENCES courses(id),
user_id UUID REFERENCES users(id),
credential_id TEXT UNIQUE NOT NULL,  -- publicly verifiable
issued_at TIMESTAMPTZ NOT NULL,
expires_at TIMESTAMPTZ,              -- null = no expiry
score DECIMAL,
metadata JSONB
```

### processed_webhooks (idempotency)
```sql
stripe_event_id TEXT PRIMARY KEY,
processed_at TIMESTAMPTZ DEFAULT NOW()
```

---

## Security Rules (Non-Negotiable)

| Rule | Priority | Detail |
|------|---------|--------|
| Never expose `SUPABASE_SERVICE_ROLE_KEY` client-side | **CRITICAL** | Server-side only in Route Handlers and Edge Functions |
| All Supabase tables need RLS policies | **CRITICAL** | No table should be accessible without proper row-level security |
| Verify `Stripe-Signature` header on all webhooks | **CRITICAL** | Never process unsigned webhook payloads |
| Never commit secrets to git | **CRITICAL** | `.env.local` only, in `.gitignore` |
| Input validation with Zod on all Route Handlers | **HIGH** | Never trust user input |
| Rate limiting on auth endpoints | **HIGH** | In-memory is insufficient at scale — use Upstash Redis |
| Signed URLs for paid product delivery | **HIGH** | 15-minute TTL max, verify purchase before generating |
| CSP headers configured | **HIGH** | Block XSS via Content-Security-Policy |
| RLS tested before deploying schema changes | **HIGH** | Use Supabase Studio to verify policies |

---

## Stripe Integration Rules

```typescript
// CORRECT webhook handler pattern
export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature')!;
  
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    return new Response('Invalid signature', { status: 400 });
  }
  
  // Idempotency check
  const { data: existing } = await supabase
    .from('processed_webhooks')
    .select('stripe_event_id')
    .eq('stripe_event_id', event.id)
    .single();
  
  if (existing) return new Response('Already processed', { status: 200 });
  
  // Process event...
  
  // Mark processed
  await supabase.from('processed_webhooks').insert({ stripe_event_id: event.id });
  return new Response('OK', { status: 200 });
}
```

---

## Digital Product Delivery Flow

```
User clicks "Download"
  → Verify user is authenticated
  → Verify order exists (buyer_id = current user)
  → Verify order status = 'completed'
  → Verify download_count < max_downloads
  → Verify access_expires_at > NOW() (if applicable)
  → Generate signed R2/Supabase URL (15-min TTL)
  → Increment download_count
  → Log to downloads table (audit trail)
  → Return signed URL to client
```

---

## Migration Execution Order

When applying new schema, run in this order to respect foreign keys:
```
1. membership_tiers
2. users
3. profiles
4. memberships
5. courses
6. modules
7. lessons
8. enrollments
9. products
10. orders
11. order_items
12. downloads
13. reviews
14. community_posts
15. community_votes
16. certifications
17. consulting_inquiries
18. processed_webhooks
19. analytics_events (partitioned)
```

---

## Code Quality Checklist

Before declaring ANY task complete:
- [ ] `npm run typecheck` passes (zero new TypeScript errors)
- [ ] `npm run lint` passes (zero new lint errors)
- [ ] Feature works in browser (not just compiles)
- [ ] Mobile viewport tested (375px minimum)
- [ ] No console errors or warnings
- [ ] No `SUPABASE_SERVICE_ROLE_KEY` in client code
- [ ] If database change: migration file created + RLS policy added
- [ ] If new page: `generateMetadata()` function defined
- [ ] If new API route: input validated with Zod schema
- [ ] If content: saved as draft (never auto-published)

---

## Infrastructure Cost Estimates

| Phase | Users | Monthly Cost | Key Services |
|-------|-------|-------------|-------------|
| Phase 1 | 0–1K | ~$75/mo | Vercel Hobby/Pro, Supabase Free/Pro |
| Phase 2 | 1K–10K | ~$325/mo | + Upstash Redis, Typesense on Railway, Sanity |
| Phase 3 | 10K+ | ~$3,000+/mo | + Supabase Enterprise, Mux, ClickHouse, multi-region |

---

## Known Technical Debt (Priority Order)

| Issue | Severity | Status |
|-------|---------|--------|
| `sitemap.xml`/`robots.txt` reference vaultxaitools.com | CRITICAL | Not fixed |
| Admin auth RBAC bug + possible service role key exposure | CRITICAL | Not fixed |
| Debug pages still live (`/debug`, `/debug-admin`, etc.) | HIGH | Not removed |
| No Stripe integration | HIGH | Not started |
| Blog author names are fake | MEDIUM | Not fixed |
| Client-side Fuse.js search | LOW | Replace with Typesense (Phase 2) |
| No Redis rate limiting | MEDIUM | Phase 2 |
| No CSP headers | HIGH | Not configured |
| No cookie consent banner | MEDIUM | GDPR risk |
