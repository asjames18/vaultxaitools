# Melanated In Tech — Technical Architecture

---

**Purpose:** Complete technical architecture documentation — stack decisions, system design, database schema overview, security, and scalability plan. The technical source of truth for all developers and AI agents working on the codebase.

**Owner:** Technical Lead

**Dependencies:** `project-brief.md`, `data-model.md`

**Status:** Active — v1.0

**Last Updated:** 2026-06-03

**Next Actions:** Implement Stripe integration (Priority 1); add Typesense (Priority 2); evaluate Clerk migration for auth RBAC fix

---

## Current Stack (Existing)

| Layer | Technology | Notes |
|---|---|---|
| Framework | Next.js 15 (App Router) | Keep and extend |
| Database | Supabase (PostgreSQL) | Keep and extend |
| Auth | Supabase Auth | Needs RBAC extension; or migrate to Clerk |
| Styling | Tailwind CSS | Keep |
| Animations | Framer Motion | Keep |
| Email (marketing) | MailerLite | Keep |
| Email (transactional) | Resend | Keep |
| Analytics | Vercel Analytics + GA4 | Keep; add PostHog |
| Hosting | Vercel | Keep |
| Icons | Lucide React + Heroicons | Keep |

## Recommended Stack (Future State)

| Layer | Technology | Rationale |
|---|---|---|
| **Frontend** | Next.js 15 App Router | Already in use; RSC + streaming for marketplace/course pages |
| **UI** | Tailwind CSS + Radix UI | Accessible components; add to existing Tailwind setup |
| **Database** | Supabase (PostgreSQL 16) | Add pgvector, pg_cron, pg_net extensions |
| **Auth** | Clerk (recommended upgrade) OR Supabase Auth + RBAC | Clerk handles SSO, MFA, org management out-of-box |
| **Payments** | Stripe + Stripe Connect | Memberships, marketplace purchases, seller payouts |
| **File Storage** | Supabase Storage (public assets) + Cloudflare R2 (paid products) | R2 has zero egress fees for downloads |
| **Search** | Typesense (self-hosted on Railway) | Replaces current Fuse.js; marketplace faceted search |
| **Email** | Resend + MailerLite (keep both) | Resend for transactional; MailerLite for campaigns |
| **CMS** | Sanity.io (Phase 2) | Headless CMS with Next.js Live Preview integration |
| **Analytics** | PostHog + Vercel Analytics | PostHog for product analytics + session replay |
| **Background Jobs** | Supabase Edge Functions + pg_cron | Phase 1; Inngest for Phase 2+ |
| **Error Tracking** | Sentry | Standard; free tier sufficient for Phase 1 |
| **CDN** | Vercel Edge Network | Already included |
| **Caching** | Upstash Redis (Phase 2) | Distributed rate limiting; cache marketplace listings |

---

## System Architecture

```
USERS (Buyers, Sellers, Students, Enterprise, Admins)
         │ HTTPS
VERCEL EDGE NETWORK (CDN, SSL, DDoS protection, Image Optimization)
         │
NEXT.JS 15 APP (melanatedintech.com)
  ├── RSC Pages (/marketplace, /courses, /community, /dashboard, /admin)
  ├── Route Handlers (/api/*)
  └── Middleware (auth check, rate limiting, geo blocking)
         │
         ├── CLERK (Identity Provider)
         │     └── SSO, MFA, Org management, JWT issuance
         │
SUPABASE PLATFORM
  ├── PostgreSQL 16 (core data store)
  │     └── Extensions: pgvector, pg_cron, pg_net
  ├── Edge Functions (Deno runtime)
  │     ├── stripe-webhook handler
  │     ├── email-trigger (enrollment, purchase)
  │     ├── product-deliver (signed R2 URL generation)
  │     └── search-index (Typesense sync on publish)
  ├── Realtime (community feed, notifications)
  └── Storage (avatars, thumbnails, blog images — public)
         │
EXTERNAL SERVICES
  ├── STRIPE (payments, subscriptions, Connect payouts)
  ├── CLOUDFLARE R2 (paid digital product delivery — signed URLs only)
  ├── TYPESENSE (marketplace + course search, faceted filters)
  ├── ANTHROPIC CLAUDE API (AI features, content generation)
  ├── OPENAI EMBEDDINGS (pgvector semantic search)
  ├── POSTHOG (product analytics, funnels, session replay)
  └── SENTRY (error tracking)
```

---

## Auth Architecture

### Current Issue
The codebase has a known admin auth bug (multiple commits attempting to fix canAccessAdmin, service role key used client-side). This is a security vulnerability and must be fixed before the marketplace or any paid features launch.

### Recommended Fix Path

**Option A — Migrate to Clerk (Recommended)**
- Handles RBAC, SSO, MFA, organization accounts out of the box
- Clerk + Supabase is a well-documented integration pattern
- Clerk issues JWTs; Supabase RLS verifies them natively
- Migration: Clerk import API for existing users

**Option B — Fix Supabase Auth RBAC**
- Add `permissions` table with explicit user → resource → action grants
- Never use service role key client-side — always server-side only
- Create proper middleware that reads role from database, not from client state
- Viable for Phase 1 but will hit SSO limitations when enterprise clients require SAML

**Middleware Pattern (correct approach regardless of auth provider):**
```typescript
// middleware.ts — simplified correct pattern
export default async function middleware(req) {
  const session = await getSession(req) // Clerk or Supabase
  
  const protectedRoutes = ['/dashboard', '/admin', '/seller']
  if (protectedRoutes.some(r => req.nextUrl.pathname.startsWith(r))) {
    if (!session) return redirect('/sign-in')
  }
  
  const adminRoutes = ['/admin']
  if (adminRoutes.some(r => req.nextUrl.pathname.startsWith(r))) {
    if (session.role !== 'admin') return redirect('/dashboard')
  }
}
```

**Critical Rule:** `SUPABASE_SERVICE_ROLE_KEY` is NEVER accessible client-side. It must only be used in Route Handlers and Edge Functions on the server. Any code that passes this key to a client component is a security breach.

---

## Payment Architecture (Stripe)

### Products to Use
- **Stripe Checkout** — hosted checkout for marketplace purchases (reduces PCI scope to SAQ-A)
- **Stripe Billing** — membership subscriptions with automatic renewal
- **Stripe Connect Express** — seller payouts (marketplace commission splits)
- **Stripe Customer Portal** — subscription management for members
- **Stripe Webhooks** — reliable event processing via Supabase Edge Functions

### Critical Stripe Implementation Rules

1. Always verify `Stripe-Signature` header on webhooks before processing
2. Use idempotency keys on all Stripe API calls
3. Process webhook events in an Edge Function, not a Route Handler (timeouts)
4. Store Stripe event IDs in a `processed_webhooks` table to prevent duplicate processing
5. Never store raw card data — use Stripe Elements or Checkout only

### Payment Flow (Marketplace Purchase)
```
Buyer clicks "Buy" 
→ POST /api/checkout (Route Handler verifies auth)
→ Creates Stripe Checkout Session (metadata: product_id, buyer_id)
→ Buyer completes payment on Stripe-hosted page
→ Stripe fires checkout.session.completed webhook
→ Edge Function: creates order + order_items rows
→ Edge Function: generates signed R2 URL (15-min TTL)
→ Email sent to buyer with access link
→ Product appears in /dashboard/purchases
```

---

## Digital Product Delivery

Paid digital products (agents, MCP servers, prompt packs, blueprints) are stored in Cloudflare R2 in a private bucket. Never public. Delivery uses signed URLs with 15-minute TTLs.

### Delivery Security Checklist
Before generating a signed URL, the server must verify:
1. User is authenticated (valid JWT)
2. User has a completed order for this product (`orders.status = 'completed'`)
3. `order_items.download_count < order_items.max_downloads`
4. `order_items.access_expires_at` is null or in the future
5. Order is not under an active dispute

After verification:
1. Increment `order_items.download_count`
2. Insert row in `downloads` audit table
3. Generate R2 signed URL (15 minutes)
4. Redirect client to signed URL

### File Upload (Seller)
```
Seller form submits → POST /api/products/upload-url (Route Handler, seller auth required)
→ Generate R2 pre-signed PUT URL (15-minute TTL)
→ Return URL to client
→ Client uploads file directly to R2 (bypasses server)
→ Client confirms upload → product record saved with r2_key
```

---

## Search Architecture

### Technology: Typesense

Self-hosted on Railway ($5/month). Replaces current Fuse.js client-side search.

**Key Advantages Over Fuse.js:**
- Server-side search (works with any size dataset)
- Typo tolerance
- Faceted filtering (category, price, rating, type)
- Sorting options
- InstantSearch React adapter available

**Collections:**
- `products` — marketplace listings
- `courses` — academy courses
- `tools` — AI tools directory
- `community_posts` — forum posts
- `blog_posts` — editorial content

**Indexing:** Supabase Edge Function triggers on product status change to `published`, calls Typesense Admin API to upsert document. Deletions trigger document removal from index.

**Phase 2 Enhancement:** Enable pgvector semantic search for "describe what you need" style queries. Generate embeddings via OpenAI text-embedding-3-small on product creation, store in `products.embedding` (VECTOR(1536) column), query with cosine similarity.

---

## Database Architecture

See `data-model.md` for full schema. Key tables:

| Table | Purpose |
|---|---|
| `users` | Synced from auth provider; core identity record |
| `profiles` | Public profile + seller status + gamification |
| `membership_tiers` | Tier definitions with Stripe price IDs |
| `memberships` | User-to-tier assignments with Stripe subscription data |
| `products` | All marketplace and MIT-owned products |
| `orders` | Purchase records |
| `order_items` | Individual items within orders + delivery tracking |
| `downloads` | Audit trail for all digital product downloads |
| `reviews` | Verified purchase reviews |
| `community_posts` | Forum posts and replies (threaded) |
| `certifications` | Issued credentials with verifiable IDs |
| `course_progress` | Per-user, per-course progress tracking |
| `analytics_events` | Partitioned event table for product analytics |

---

## Scalability Plan

### Phase 1 — MVP (0–1K users, Months 1–6)

**Infrastructure (~$75/month):**
- Vercel Pro: $20/month
- Supabase Pro: $25/month
- Typesense on Railway: $5/month
- Clerk Free (up to 10K MAU): $0
- PostHog Cloud Free (1M events/month): $0
- Cloudflare R2 Free tier: $0
- Stripe: 2.9% + $0.30/transaction
- Resend Free: $0

**What to defer:**
- Redis/distributed rate limiting (use in-memory for now)
- Semantic/vector search (use Typesense text search)
- Sanity CMS (use Supabase + markdown directly)
- Complex analytics dashboards

### Phase 2 — Growth (1K–10K users, Months 6–18)

**Add (~$250/month):**
- Upstash Redis: distributed rate limiting, session caching
- Supabase read replicas: for analytics queries
- Sanity.io Free: CMS for blog and content
- Vercel Pro: team collaboration features

**Architecture changes:**
- Extract heavy jobs to Supabase Edge Functions
- Add Redis caching layer for marketplace listings (60-second TTL)
- Enable pgvector for semantic search
- Implement seller analytics dashboard

### Phase 3 — Scale (10K+ users, Months 18+)

**Add (~$3,000/month):**
- Supabase Enterprise: dedicated compute, PITR, SLAs
- Mux.io: course video streaming (replaces R2 for video)
- ClickHouse: separate analytics database for event queries
- Inngest: complex seller payout workflows, automation
- Multi-region read replicas

---

## Development Environment Setup

```bash
# Prerequisites
node 20.x (use nvm)
pnpm 9.x

# Install
pnpm install

# Local Supabase stack
npx supabase start
# → Local Postgres at localhost:54321
# → Studio at localhost:54323

# Environment variables (.env.local)
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<from supabase start output>
SUPABASE_SERVICE_ROLE_KEY=<from supabase start output>  # SERVER ONLY
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
TYPESENSE_API_KEY=xyz
ANTHROPIC_API_KEY=sk-ant-...
RESEND_API_KEY=re_...

# Start dev server
pnpm dev

# Forward Stripe webhooks locally
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Apply database migrations
npx supabase db push

# Generate TypeScript types after schema changes
npx supabase gen types typescript --local > lib/database.types.ts
```

---

## Security Checklist

| Item | Status | Priority |
|---|---|---|
| Remove service role key from client-side code | ❌ Known issue (see commit history) | Critical |
| Fix admin auth RBAC | ❌ Known issue | Critical |
| Implement Stripe webhook signature verification | ❌ Not yet integrated | Critical |
| Add input validation (zod) to all Route Handlers | ❓ Unknown | High |
| Implement distributed rate limiting | ❌ Current: in-memory only | High |
| Add Content Security Policy headers | ❌ Not configured | High |
| Ensure all paid product delivery uses signed URLs | ❌ Not yet implemented | High |
| GDPR right-to-deletion endpoint | ❌ Not yet implemented | Medium |
| Data export endpoint | ⚠️ Partially exists | Medium |
| Cookie consent banner | ❌ Not implemented | Medium |
| Supabase RLS on all new tables | ❌ Required for all new tables | High |

---

## Third-Party Integration Map

| Service | Purpose | Phase | Alternative |
|---|---|---|---|
| Stripe | Payments + Connect | Phase 1 | Paddle (simpler VAT handling) |
| Cloudflare R2 | Paid product delivery | Phase 1 | AWS S3 (higher egress costs) |
| Typesense | Search | Phase 1 | Meilisearch |
| Clerk | Auth upgrade | Phase 1-2 | Continue with Supabase Auth |
| Resend | Transactional email | Phase 1 (existing) | Postmark |
| MailerLite | Marketing email | Phase 1 (existing) | ConvertKit |
| PostHog | Product analytics | Phase 1 | Mixpanel (expensive) |
| Sanity.io | CMS | Phase 2 | Contentful, Notion |
| Upstash Redis | Caching + rate limiting | Phase 2 | Redis Cloud |
| Mux.io | Video streaming | Phase 3 | Cloudflare Stream |
| Inngest | Background jobs | Phase 2-3 | Trigger.dev |
| Sentry | Error tracking | Phase 1 | Datadog (expensive) |
| Anthropic Claude API | AI features | Phase 1 | OpenAI |
| OpenAI Embeddings | Semantic search | Phase 2 | Cohere, local models |
