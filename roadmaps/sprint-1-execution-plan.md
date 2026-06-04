# Sprint 1 Execution Plan — Melanated In Tech

**Start Date:** 2026-06-03
**Duration:** 2 weeks
**Objective:** Launch the first revenue-generating version of Melanated In Tech
**Definition of Done:** One real paying customer completes a purchase and receives their product

---

## The Only Goal That Matters

> Accept money. Deliver product. Prove demand.

Not: full marketplace. Not: creator accounts. Not: subscription tiers.

**Simple flow:**
```
Visitor → Product Page → Stripe Checkout → Success Page → Download
```

---

## Sprint 1 Backlog

### Must Have (Revenue Path)

| ID | Feature | Effort | Owner | Dependency |
|----|---------|--------|-------|-----------|
| S1-01 | Stripe checkout API route (`/api/checkout`) | M | Technical | Stripe account live |
| S1-02 | Products table in Supabase (id, name, slug, price, file_url, description, category) | S | Technical | none |
| S1-03 | Orders table in Supabase (id, product_id, customer_email, stripe_session_id, status) | S | Technical | S1-02 |
| S1-04 | Checkout success page (`/checkout/success`) | S | Technical | S1-01 |
| S1-05 | Product page template (`/products/[slug]`) | M | Technical | S1-02 |
| S1-06 | Content Creation Prompt Pack — product page + file | S | Content | S1-05 |
| S1-07 | Brand Kit Template — product page + file | S | Content | S1-05 |
| S1-08 | Homepage email capture above the fold | S | Technical | none |

### Should Have (Authority + Discovery)

| ID | Feature | Effort | Owner | Dependency |
|----|---------|--------|-------|-----------|
| S1-09 | Agent directory page (`/agents`) | M | Technical | none |
| S1-10 | MCP Server directory page (`/mcp-servers`) | M | Technical | none |
| S1-11 | Agent Skills directory page (`/skills`) | S | Technical | S1-09 |
| S1-12 | 10 seeded agents + 5 MCP server entries | S | Content | S1-09 |
| S1-13 | Homepage hero rebuild (mission, authority, CTA) | M | Content + Technical | none |

### Could Have (Nice to Have)

| ID | Feature | Effort | Owner | Dependency |
|----|---------|--------|-------|-----------|
| S1-14 | Agent Academy intro page (`/learn`) | M | Content | none |
| S1-15 | Newsletter welcome email sequence (Resend) | S | Content | none |

### Won't Have This Sprint

- Creator accounts / seller onboarding
- Subscription tiers (Free/Pro/Elite)
- Purchase history dashboard
- License key generation
- Affiliate system
- Community features

---

## Week 1: Infrastructure + Checkout

### Monday — Stripe Setup

**Morning**
- [ ] Create Stripe account at stripe.com
- [ ] Add to `.env.local`: `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`
- [ ] `npm install stripe @stripe/stripe-js`

**Afternoon**
- [ ] Create Supabase migration: `products` and `orders` tables (SQL below)
- [ ] Run migration against Supabase project
- [ ] Verify tables in Supabase dashboard

**SQL Migration — Copy to Supabase:**
```sql
-- products table
create table public.products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text not null unique,
  description text,
  long_description text,
  price integer not null, -- in cents (e.g., 1900 = $19)
  category text not null check (category in ('prompt-pack', 'template', 'blueprint', 'guide', 'course')),
  file_url text, -- Supabase Storage URL
  preview_url text,
  tags text[] default '{}',
  status text not null default 'draft' check (status in ('draft', 'live', 'archived')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- orders table
create table public.orders (
  id uuid default gen_random_uuid() primary key,
  product_id uuid references public.products(id),
  customer_email text not null,
  stripe_session_id text unique,
  amount_paid integer not null, -- in cents
  status text not null default 'pending' check (status in ('pending', 'paid', 'failed', 'refunded')),
  download_count integer default 0,
  created_at timestamptz default now()
);

-- RLS
alter table public.products enable row level security;
alter table public.orders enable row level security;

-- Anyone can read live products
create policy "Public can view live products"
  on public.products for select
  using (status = 'live');

-- Orders: customer can view their own (by email match via session)
-- Admin can view all orders via service role (bypasses RLS)
create policy "No public order reads"
  on public.orders for select
  using (false);
```

---

### Tuesday — Checkout API

Build `/api/checkout/route.ts`:

```typescript
// app/api/checkout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/lib/supabase-server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { productSlug } = await request.json();

    // Fetch product from DB
    const supabase = await createClient();
    const { data: product, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', productSlug)
      .eq('status', 'live')
      .single();

    if (error || !product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: product.name,
            description: product.description,
          },
          unit_amount: product.price,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/products/${product.slug}`,
      metadata: { productId: product.id, productSlug: product.slug },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}
```

---

### Wednesday — Stripe Webhook

Build `/api/webhooks/stripe/route.ts`:

```typescript
// app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature')!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.CheckoutSession;
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    await supabase.from('orders').insert({
      product_id: session.metadata?.productId,
      customer_email: session.customer_details?.email,
      stripe_session_id: session.id,
      amount_paid: session.amount_total,
      status: 'paid',
    });
  }

  return NextResponse.json({ received: true });
}

export const config = { api: { bodyParser: false } };
```

---

### Thursday — Success Page + Product Pages

**Success page** (`/checkout/success`):
- Thank you message
- Download button (fetch order by Stripe session_id → get product file_url)
- "Share this product" social links
- Email capture if not already subscribed

**Product page** (`/products/[slug]`):
- Product name, description, price
- "Buy Now" button → calls `/api/checkout` → redirects to Stripe
- What's included list
- Sample preview (image or PDF preview)

---

### Friday — First Two Products

**Product 1: Content Creation Prompt Pack — $19**
- File: PDF with 50 Claude prompts for content creators
- Cover: Branded Melanated In Tech cover
- Upload to Supabase Storage
- Seed into products table with `status: 'live'`

**Product 2: Brand Kit Template — $15**
- File: Notion template or Figma kit
- Upload to Supabase Storage
- Seed into products table with `status: 'live'`

**Seed SQL:**
```sql
insert into public.products (name, slug, description, price, category, status) values
  ('Content Creation Prompt Pack', 'content-creation-prompt-pack', '50 battle-tested Claude prompts for content creators. Blog posts, social media, email newsletters — all covered.', 1900, 'prompt-pack', 'live'),
  ('Brand Kit Template', 'brand-kit-template', 'Complete brand identity template. Colors, fonts, voice guide, social templates — everything you need to launch with confidence.', 1500, 'template', 'live');
```

---

## Week 2: Directories + Homepage

### Monday — Agent Directory

Build `/app/agents/page.tsx`:
- Grid layout (reuse ToolCard component)
- Filter by category (Research, Content, Automation, Development)
- Search within agents
- Each agent card: name, description, category, rating, "View Details" button

Seed 10 AI agents into the database (new `products` records with `category: 'agent-listing'`, or extend the `tools` table with a `type` column).

---

### Tuesday — MCP + Skills Directories

Build `/app/mcp-servers/page.tsx` and `/app/skills/page.tsx` using the same pattern as agents directory. Seed 5 MCP server entries, 5 skill entries.

---

### Wednesday — Homepage Rebuild

Update homepage hero section:
- Headline: "The AI Tools Hub Built for Us"
- Sub: "Discover agents, MCP servers, and resources — built by Black creators, for everyone building with AI"
- CTA 1: "Browse the Directory" → `/agents`
- CTA 2: "Get the Prompt Pack" → `/products/content-creation-prompt-pack`
- Email capture form (below hero)
- Stats: X agents listed, X resources, X community members

---

### Thursday — Email Capture + Connect

Wire email capture to Resend:
- `POST /api/subscribe` → add to Resend audience
- Welcome email: "Thanks for joining Melanated In Tech — here's what's coming"
- Include freebie link (teaser PDF or preview)

---

### Friday — Pre-Launch Checklist

- [ ] Buy one of our own products with a real card end-to-end
- [ ] Verify order appears in Supabase orders table
- [ ] Verify download link works
- [ ] Verify Stripe dashboard shows payment
- [ ] Test on mobile
- [ ] Check all pages load under 3 seconds
- [ ] Announce on social: "We're live"

---

## Milestones

| Milestone | Target Date | Success Signal |
|-----------|-------------|----------------|
| Stripe checkout working (test card) | Week 1, Thursday | Session created, webhook fires, order in DB |
| Two products live | Week 1, Friday | Pages render, buy button works |
| Three directories live | Week 2, Tuesday | /agents, /mcp-servers, /skills render |
| Homepage rebuilt | Week 2, Wednesday | New hero, email capture, directory CTAs |
| First real sale | Week 2, Friday | Real money in Stripe, real email received |
| **$100 revenue** | 2 weeks post-launch | ~6-7 sales |
| **$500 revenue** | 4 weeks post-launch | ~30 sales at ~$17 AOV |

---

## Acceptance Criteria

### Checkout Flow
- [ ] User clicks "Buy Now" on a product page
- [ ] Redirected to Stripe Checkout with correct product name and price
- [ ] After payment, redirected to `/checkout/success`
- [ ] Download button on success page returns the correct file
- [ ] Order record created in Supabase with `status: 'paid'`
- [ ] Works on mobile

### Product Pages
- [ ] `/products/content-creation-prompt-pack` renders
- [ ] `/products/brand-kit-template` renders
- [ ] Each shows: name, price, description, what's included, buy button
- [ ] Pages load in under 2 seconds

### Directories
- [ ] `/agents` renders with at least 5 agent cards
- [ ] `/mcp-servers` renders with at least 3 entries
- [ ] Search and category filter work without page reload
- [ ] Mobile layout correct

### Homepage
- [ ] Mission statement visible above fold
- [ ] Email capture form visible and functional
- [ ] CTA links to directory and product page
- [ ] No broken links

---

## Risks & Mitigations

| Risk | Likelihood | Mitigation |
|------|-----------|-----------|
| Stripe account under review | LOW | Apply Day 1; use test mode until approved |
| File delivery fails (Storage URL expired) | MEDIUM | Use signed URLs with 24hr expiry; regenerate on success page load |
| No sales in first week | MEDIUM | Share in 3 communities on launch day; offer early adopter discount |
| Build fails on Windows | LOW (existing issue) | Deploy to Vercel — Linux build environment |

---

## Dependencies (External Actions Required)

- [ ] **Antonio:** Create Stripe account and add keys to `.env.local`
- [ ] **Antonio:** Create the two product files (PDF/Notion) and upload to Supabase Storage
- [ ] **Antonio:** Set `NEXT_PUBLIC_SITE_URL` in environment
- [ ] **Antonio:** Add `STRIPE_WEBHOOK_SECRET` after setting up webhook in Stripe dashboard

---

## What Comes After Sprint 1

**Sprint 2 (when first $100 hits):**
- Purchase history for logged-in users
- Third product (Agent Blueprint, $49)
- Agent Academy first article
- Resend welcome sequence (3-email drip)

**Sprint 3 (when first $500 hits):**
- Creator account basics
- User submits product → admin review → publish
- Newsletter weekly digest

**The marketplace, subscriptions, and creator payouts don't start until Sprint 3 at the earliest.**
