# Melanated In Tech — MVP Build Plan

**Version:** 1.0
**Author:** MVP Agent
**Created:** 2026-06-03
**Status:** Active — Pending Founder Approval Before Work Begins

> *Melanated In Tech is building the world's most practical ecosystem for AI Agents, MCP Servers, Agent Skills, Automation Systems, and Agent Commerce — where Black and melanated professionals learn, build, deploy, buy, sell, and scale AI-powered systems.*

---

## What This Document Is

This is the single source of truth for the MVP sprint plan. It covers exactly what to build, in what order, with what success metrics — and nothing else. Every feature here has been scoped to the minimum required to (1) build authority, (2) capture emails, (3) validate demand, and (4) generate first revenue.

**What the MVP is NOT:**
- Community / Discord
- Certifications
- Course platform
- App store / third-party marketplace
- Membership tiers beyond a free email list
- Admin dashboards (existing admin is sufficient)
- Courses

**What the MVP IS:**
- A public-facing site that looks credible and feels culturally specific
- A Learn section with free tutorials and guide content
- A Directory of AI Agents, MCP Servers, and Agent Skills
- A Marketplace with 3–5 MIT-owned paid products (Prompt Packs + Templates + Blueprints)
- Email capture on every high-intent page
- A welcome/drip email sequence

**Definition of "MVP Shipped":**
The site is live at melanatedintech.com with: a homepage that converts visitors to email subscribers, at least 5 free Learn articles published, a browsable Directory with 20+ entries, and at least 2 paid products available for purchase via Stripe Checkout. First paying customer has completed a transaction. First 100 email subscribers captured.

---

## Technology Decisions

| Concern | Decision | Rationale |
|---|---|---|
| Framework | Next.js 15 (already in use) | No change needed |
| Database | Supabase (already in use) | No change needed |
| Email capture + drip | Resend (already a dependency) + a simple subscribers table in Supabase | No new vendor needed; use existing Resend integration |
| Payments | Stripe Checkout (hosted) | Fastest path to PCI-compliant purchases; no Stripe Connect needed for MVP (MIT-only products) |
| File delivery | Supabase Storage + signed URLs (server-side, 15-min expiry) | Secure digital delivery without a third-party service |
| CMS | None — MDX files in `/content/learn/` or Supabase `posts` table (already exists) | Blog/posts infrastructure already in codebase |
| Analytics | Vercel Analytics (already a dependency) | Zero setup |
| Search/filter | Fuse.js (already a dependency) | Client-side fuzzy search for directory; sufficient for MVP scale |
| Deployment | Vercel (assumed, given Next.js + Vercel Analytics) | No change needed |

**Payment architecture note:** For MVP, MIT sells its own products only. Stripe Checkout hosted sessions are sufficient — no Stripe Connect, no marketplace splits. Add Connect in Phase 3 when third-party sellers onboard.

---

## Sprint Overview

| Sprint | Theme | Duration | Goal |
|---|---|---|---|
| Sprint 1 | Foundation | 1 week | Homepage + email capture live; site rebrand complete |
| Sprint 2 | Content + Directory | 1 week | Learn section + Directory browsable |
| Sprint 3 | Marketplace | 1 week | 2+ products purchasable via Stripe |
| Sprint 4 | Polish + Launch | 1 week | Email drip live; launch-ready; first paying customer |

Total MVP timeline: 4 weeks from sprint 1 kick-off.

---

## Feature Specifications

---

### SPRINT 1

---

#### F-01: Homepage — Hero + Value Prop

**User story:** As a first-time visitor, I can immediately understand what Melanated In Tech is and why it exists for me.

**Acceptance criteria:**
- Hero section includes headline, sub-headline, and primary CTA (email capture or "Explore the Directory")
- Value prop section (3 cards or columns) explains Learn / Directory / Marketplace
- Page loads in under 3 seconds on mobile
- Copy is culturally specific — speaks directly to Black and melanated professionals
- No references to "VaultX" or prior branding remain on the page

**Effort:** M

**Dependencies:** None (can build against existing layout.tsx and homepage structure)

**Sprint:** 1

**Success metric:** Homepage bounce rate below 65%; avg time on page above 60 seconds (measured after 500 sessions)

---

#### F-02: Email Capture — Hero + Inline Forms

**User story:** As a visitor interested in AI tools, I can join the MIT email list in under 10 seconds without leaving the page.

**Acceptance criteria:**
- Email capture form exists in hero section (above fold)
- Email capture form also exists as a standalone section mid-page ("Join 1,000+ Black builders")
- Form submits to a `subscribers` table in Supabase with `email`, `source`, `created_at` fields
- Duplicate email submissions return a success message (no errors shown to user)
- On submit, Resend sends a welcome email (plain text acceptable for Sprint 1)
- RLS policy on `subscribers` table: insert-only for anon, read requires service role

**Effort:** S

**Dependencies:** F-01 (homepage exists), Supabase `subscribers` table migration

**Sprint:** 1

**Success metric:** 50 email subscribers in first 2 weeks post-launch

---

#### F-03: Site Rebrand — Melanated In Tech

**User story:** As a visitor, I see a site that is consistently branded as Melanated In Tech — not VaultX or any other prior identity.

**Acceptance criteria:**
- Site title, meta tags, and OG images updated to "Melanated In Tech"
- Navigation header reflects new brand name and logo (or wordmark if logo not ready)
- Footer updated with correct brand name, copyright year, and links
- Favicon updated
- No "VaultX" strings remain in any user-facing page or meta content

**Effort:** S

**Dependencies:** None

**Sprint:** 1

**Success metric:** Zero brand inconsistencies on any public-facing page (manual QA pass)

---

#### F-04: Navigation Restructure

**User story:** As a visitor, I can navigate to Learn, Directory, and Marketplace from any page without confusion.

**Acceptance criteria:**
- Top navigation includes: Home, Learn, Directory, Marketplace
- Mobile hamburger menu works on all screen sizes
- Active state highlights current section
- "Get Started Free" or email CTA button visible in nav on desktop
- Sign In / Sign Up remain accessible but are secondary

**Effort:** S

**Dependencies:** F-03

**Sprint:** 1

**Success metric:** Navigation click-through rate to Directory or Learn above 20% of homepage sessions

---

### SPRINT 2

---

#### F-05: Learn Section — Article Listing Page

**User story:** As someone new to AI tools, I can browse free tutorials and guides written for people like me.

**Acceptance criteria:**
- `/learn` route renders a grid of article cards
- Each card shows: title, description, category tag, estimated read time, publish date
- Articles are filterable by category (Agents, MCP Servers, Skills, Automation, Getting Started)
- Page is statically generated or ISR — not client-side-only
- Empty state displayed if no articles exist (with CTA to join email list)

**Effort:** M

**Dependencies:** F-04 (navigation), content source decision (MDX files or Supabase posts table — use existing blog infrastructure)

**Sprint:** 2

**Success metric:** 5+ articles published by launch; avg article page session time above 2 minutes

---

#### F-06: Learn Section — Article Detail Page

**User story:** As a reader, I can read a full tutorial article with clean formatting and a CTA to explore related products.

**Acceptance criteria:**
- `/learn/[slug]` renders full article content with proper heading hierarchy, code blocks, and images
- Each article has a "Related Products" section at the bottom linking to marketplace items (even if empty at first)
- Email capture inline CTA appears after the third paragraph
- Social share links (Twitter/X, LinkedIn) at bottom of article
- Article has proper OG meta tags for social sharing

**Effort:** M

**Dependencies:** F-05

**Sprint:** 2

**Success metric:** 15%+ of article readers click through to a marketplace product or directory listing

---

#### F-07: Directory — Browsable Listing Page

**User story:** As someone exploring AI tools, I can browse a curated directory of AI Agents, MCP Servers, and Agent Skills without needing to sign up.

**Acceptance criteria:**
- `/directory` route renders filterable cards for all listed tools
- Filters: Category (AI Agents / MCP Servers / Agent Skills), Free/Paid, Source (MIT / Third-Party)
- Each card shows: name, one-line description, category badge, price/free indicator, external link or detail link
- Search bar filters results client-side (Fuse.js — already in dependencies)
- Directory is publicly accessible — no auth required to browse
- Minimum 20 entries populated at launch (can be seeded from existing AI tools data in Supabase)

**Effort:** M

**Dependencies:** F-04 (navigation), Supabase `directory_listings` table or reuse existing tools table

**Sprint:** 2

**Success metric:** Directory page visited by 30%+ of all site sessions within first month

---

#### F-08: Directory — Tool Detail Page

**User story:** As a visitor interested in a specific AI tool, I can see full details and decide whether to use it or buy it.

**Acceptance criteria:**
- `/directory/[slug]` renders: name, full description, category, use cases, pricing info, external link
- MIT-owned products in directory link to their marketplace listing
- Third-party tools link externally (opens in new tab)
- "Suggest a Tool" link at bottom of every detail page (routes to simple contact form or email)
- Page has proper OG meta tags

**Effort:** S

**Dependencies:** F-07

**Sprint:** 2

**Success metric:** 10%+ of directory detail page visitors click through to external link or marketplace listing

---

### SPRINT 3

---

#### F-09: Marketplace — Product Listing Page

**User story:** As a visitor, I can browse MIT's paid products and understand what I get before purchasing.

**Acceptance criteria:**
- `/marketplace` route shows product cards for all published MIT products
- Each card shows: name, price, category, one-line description, "Buy Now" CTA
- Products are filterable by category (Prompt Packs, Templates, Blueprints)
- At least 2 products are live and purchasable at launch (PRP-002 Content Creation Pack at $19 and TPL-001 Brand Kit Template at $15 are both marked "Ready" in the asset registry — use these)
- "More coming soon" section shows upcoming products with email capture

**Effort:** M

**Dependencies:** F-04, Stripe product/price configuration, F-10 (Stripe Checkout)

**Sprint:** 3

**Success metric:** 5% of marketplace page visitors initiate checkout within first month

---

#### F-10: Marketplace — Stripe Checkout Purchase Flow

**User story:** As a buyer, I can purchase a digital product and receive it immediately after payment without friction.

**Acceptance criteria:**
- Clicking "Buy Now" initiates a Stripe Checkout hosted session (server-side API route creates session)
- Checkout session includes product name, price, and MIT branding
- On success, buyer lands on `/marketplace/success?session_id=xxx` confirmation page
- Confirmation page shows: product name, download link (signed Supabase Storage URL, 15-min expiry), and instructions
- Confirmation email sent via Resend with same download link and purchase receipt
- Purchase is recorded in Supabase `purchases` table with: `buyer_email`, `product_id`, `stripe_session_id`, `amount`, `created_at`
- Webhook handler validates Stripe signature before processing (`/api/webhooks/stripe`)
- RLS on `purchases` table: insert via service role only (webhook handler uses service role key server-side)

**Effort:** L

**Dependencies:** F-09, Supabase Storage bucket for product files, Stripe account configured with products/prices

**Sprint:** 3

**Success metric:** First completed purchase with successful file delivery; zero failed delivery reports in first 30 days

---

#### F-11: Marketplace — Product Detail Page

**User story:** As a potential buyer, I can read a full product description, see what's included, and decide to buy with confidence.

**Acceptance criteria:**
- `/marketplace/[slug]` renders: title, price, description, what's included list, who it's for, preview (first page or sample)
- "Buy Now" button initiates Stripe Checkout (F-10)
- Social proof section (can be empty at launch with "Be the first to review" placeholder)
- Related products section at bottom
- OG meta tags configured for social sharing

**Effort:** M

**Dependencies:** F-10

**Sprint:** 3

**Success metric:** Product detail page to checkout initiation rate above 8%

---

#### F-12: Product File Storage + Secure Delivery

**User story:** As a buyer, I receive a working download link immediately after purchase that cannot be shared publicly.

**Acceptance criteria:**
- Product files stored in a private Supabase Storage bucket (`marketplace-products`)
- Download links are signed URLs generated server-side with 15-minute expiry
- Download endpoint (`/api/download?token=xxx`) validates the token and logs the download
- Download link in confirmation email also routes through the download endpoint
- Bucket has no public access — all downloads require valid signed URL
- Product files are virus-scanned before upload (manual process for MVP — checklist item for each upload)

**Effort:** M

**Dependencies:** F-10 (purchase flow), Supabase Storage setup

**Sprint:** 3

**Success metric:** Zero unauthorized downloads (all downloads trace to a valid purchase record)

---

### SPRINT 4

---

#### F-13: Email Welcome + Drip Sequence

**User story:** As a new email subscriber, I receive a welcome email and a short series of emails that introduce MIT and point me toward the marketplace.

**Acceptance criteria:**
- Welcome email sends immediately on subscribe via Resend
- Welcome email includes: brand intro, what MIT is, link to most popular free Learn article, link to marketplace
- Drip sequence: 3 emails over 7 days (Day 1: Welcome, Day 3: Featured free resource, Day 7: Marketplace intro with CTA)
- Emails are plain HTML or simple styled HTML — no complex template builder required for MVP
- Unsubscribe link present in every email (CAN-SPAM compliance)
- Unsubscribe updates `subscribers` table `status` field to `unsubscribed`

**Effort:** M

**Dependencies:** F-02 (email capture), Resend API configured

**Sprint:** 4

**Success metric:** Welcome email open rate above 40%; Day-7 email click-through rate above 10%

---

#### F-14: Email Capture — Exit Intent + Scroll Trigger (Upgrade)

**User story:** As a reader who has not yet subscribed, I see a non-intrusive email capture prompt when I reach the bottom of an article or am about to leave.

**Acceptance criteria:**
- Scroll-triggered email capture appears when user reaches 75% of page scroll on Learn articles
- Prompt includes: headline ("Get free AI tools guides for Black builders"), email field, and submit button
- Dismiss option closes prompt and sets a 7-day cookie so it does not reappear
- Uses same Supabase `subscribers` table as F-02
- No exit-intent required for MVP (scroll trigger is sufficient)

**Effort:** S

**Dependencies:** F-06 (article pages), F-02 (subscriber logic)

**Sprint:** 4

**Success metric:** 5%+ of Learn article readers subscribe via this prompt

---

#### F-15: SEO Foundations

**User story:** As someone searching Google for "AI tools for Black entrepreneurs," I find Melanated In Tech in the results.

**Acceptance criteria:**
- Every public page has a unique `<title>`, `<meta description>`, and OG tags
- `/sitemap.xml` is generated and submitted to Google Search Console
- `/robots.txt` is correct (no critical paths blocked)
- Homepage, `/learn`, `/directory`, and `/marketplace` all have H1 tags with target keywords
- At least 3 Learn articles target long-tail keywords relevant to the ICP (e.g., "best AI tools for Black-owned businesses", "how to use Claude for content creation")
- Core Web Vitals: LCP under 2.5s, CLS under 0.1 on all key pages

**Effort:** M

**Dependencies:** All content pages (F-05, F-06, F-07, F-09) must exist first

**Sprint:** 4

**Success metric:** Site indexed by Google within 2 weeks of launch; first organic search impression within 30 days

---

#### F-16: Launch-Ready QA Pass

**User story:** As the founder, I can ship the MVP with confidence that nothing is broken and nothing embarrasses the brand.

**Acceptance criteria:**
- All pages tested on mobile (375px), tablet (768px), and desktop (1280px)
- All Stripe Checkout flows tested in test mode, then production mode
- All email flows tested end-to-end (subscribe → welcome email → drip)
- All download flows tested (purchase → webhook → signed URL → file download)
- Zero console errors on any public-facing page
- Privacy policy and terms of service pages exist and are linked in footer
- Cookie consent banner present (GDPR-adjacent, since Vercel Analytics sets cookies)
- Admin access confirmed working (existing admin infrastructure)

**Effort:** M

**Dependencies:** All Sprint 1–4 features complete

**Sprint:** 4

**Success metric:** Zero P0 bugs at launch; zero failed purchases in first 48 hours

---

## First Revenue Target

**Target:** $500 in revenue within 30 days of launch.

**How to reach it:**
- 2 products live at launch: Content Creation Pack (PRP-002, $19) and Brand Kit Template (TPL-001, $15)
- Average order value: ~$17
- Purchases needed: 30 transactions
- Email list needed to generate 30 purchases: ~300 subscribers at 10% conversion rate
- Realistic path: Launch to existing network → 150 subscribers in week 1 → 15 purchases from warm audience → 15 more from organic/social over 30 days

**Stretch target:** Add AI Business Blueprint (BPR-001, $47) in Sprint 3 even if marked "In Development" — the asset registry shows it is in development, which means content exists. A PDF blueprint can be finalized faster than a course. Adding a $47 product to the mix raises average order value to ~$27 and reduces transaction count needed to 19.

**Do not chase volume before credibility.** The goal is not 1,000 subscribers in week 1. The goal is the first paying customer who gets real value and says so publicly.

---

## What Exists Already (Do Not Rebuild)

The codebase at `E:\vaultxaitools` already has:

| Existing Feature | Status | MVP Action |
|---|---|---|
| Next.js 15 app framework | Live | Keep as-is |
| Supabase integration | Live | Keep; add `subscribers` and `purchases` tables |
| Authentication (sign-in/sign-up) | Live | Keep; auth not required for MVP purchase flow |
| Blog/posts infrastructure | Live | Repurpose as Learn section |
| AI Tools directory (AITools page) | Live | Refactor into `/directory` with new categories |
| Admin portal | Live | Keep; use to manage products and content |
| Resend (email) | In dependencies | Configure for email capture + drip |
| Vercel Analytics | In dependencies | Already tracking — no changes |
| Fuse.js | In dependencies | Use for directory client-side search |
| Categories pages | Live | May repurpose for directory filtering |

**The existing `app/AITools` and `app/blog` infrastructure is the foundation for Directory and Learn. Do not build new pages from scratch — refactor what exists.**

---

## Database Migrations Required (Sprint 1 + 3)

### Sprint 1: `subscribers` table
```sql
CREATE TABLE public.subscribers (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL UNIQUE,
  source text DEFAULT 'homepage',
  status text DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- Anon can insert (subscribe), cannot read
CREATE POLICY "anon_insert_subscribers"
ON public.subscribers FOR INSERT TO anon
WITH CHECK (true);

-- Service role reads all (for Resend drip sending)
-- No additional policy needed — service role bypasses RLS
```

### Sprint 3: `marketplace_products` table
```sql
CREATE TABLE public.marketplace_products (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  description text,
  price_cents integer NOT NULL,
  stripe_price_id text NOT NULL,
  category text NOT NULL CHECK (category IN ('prompt-pack', 'template', 'blueprint', 'agent-skill')),
  file_path text, -- path in Supabase Storage marketplace-products bucket
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.marketplace_products ENABLE ROW LEVEL SECURITY;

-- Public can read published products
CREATE POLICY "public_read_published"
ON public.marketplace_products FOR SELECT TO anon
USING (status = 'published');
```

### Sprint 3: `purchases` table
```sql
CREATE TABLE public.purchases (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  buyer_email text NOT NULL,
  product_id uuid REFERENCES public.marketplace_products(id),
  stripe_session_id text NOT NULL UNIQUE,
  amount_cents integer NOT NULL,
  status text DEFAULT 'completed',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;

-- No public access — all writes via service role in webhook handler
-- Buyers access their purchases via authenticated session if signed in
CREATE POLICY "buyers_read_own"
ON public.purchases FOR SELECT TO authenticated
USING (buyer_email = auth.email());
```

---

## API Routes Required

| Route | Method | Purpose | Sprint |
|---|---|---|---|
| `/api/subscribe` | POST | Add email to subscribers table, trigger Resend welcome email | 1 |
| `/api/checkout` | POST | Create Stripe Checkout session for a product | 3 |
| `/api/webhooks/stripe` | POST | Receive Stripe payment confirmation, record purchase | 3 |
| `/api/download` | GET | Validate purchase, return signed Supabase Storage URL | 3 |

---

## Content Required Before Launch

The following content must be created (by human or AI draft + human review) before MVP launches:

**Learn Articles (minimum 5):**
1. "What Are AI Agents and Why Black Entrepreneurs Need to Know About Them" (Getting Started)
2. "The Best Free AI Tools for Running a Black-Owned Business in 2026" (Tools Guide)
3. "What Is an MCP Server? A Plain-English Explanation" (Education)
4. "How to Use Claude to Write Better Content for Your Business" (Tutorial)
5. "The AI Tools Stack We Actually Use at Melanated In Tech" (Featured Guide)

**Marketplace Product Files (minimum 2):**
1. Content Creation Pack (PRP-002) — 30 prompts formatted as a PDF or Notion template export
2. Brand Kit Template (TPL-001) — Figma or Google Slides brand kit template

**Directory Entries (minimum 20):**
- Seed from existing AI tools data in Supabase (the `app/AITools` page already has this data)
- Add category tagging: AI Agents, MCP Servers, Agent Skills, General Tools

---

## Sprint-by-Sprint Checklist

### Sprint 1 Deliverables
- [ ] Homepage hero redesigned for MIT brand (F-01)
- [ ] Email capture form + Supabase `subscribers` table + Resend welcome email (F-02)
- [ ] All "VaultX" references removed; brand updated to Melanated In Tech (F-03)
- [ ] Navigation restructured: Home, Learn, Directory, Marketplace (F-04)
- [ ] Privacy policy and terms pages updated with correct brand name

### Sprint 2 Deliverables
- [ ] `/learn` article listing page live (F-05)
- [ ] `/learn/[slug]` article detail page with email capture inline (F-06)
- [ ] Minimum 5 Learn articles drafted and published
- [ ] `/directory` listing page with filters and search (F-07)
- [ ] `/directory/[slug]` tool detail page (F-08)
- [ ] Minimum 20 directory entries seeded

### Sprint 3 Deliverables
- [ ] `/marketplace` product listing page (F-09)
- [ ] Stripe account configured with products and prices
- [ ] Product files uploaded to private Supabase Storage bucket
- [ ] Stripe Checkout flow end-to-end (F-10)
- [ ] `/marketplace/[slug]` product detail pages (F-11)
- [ ] Secure download delivery via signed URLs (F-12)
- [ ] At least 2 products live: PRP-002 ($19) and TPL-001 ($15)
- [ ] Stripe webhook handler live and verified

### Sprint 4 Deliverables
- [ ] 3-email welcome + drip sequence configured in Resend (F-13)
- [ ] Scroll-triggered email capture on Learn articles (F-14)
- [ ] Sitemap, robots.txt, OG tags, meta descriptions on all pages (F-15)
- [ ] Full QA pass across mobile, tablet, desktop (F-16)
- [ ] Cookie consent banner
- [ ] Google Search Console verified and sitemap submitted
- [ ] Stripe switched from test mode to production mode
- [ ] **First transaction completed — MVP declared shipped**

---

## Definition of Done: MVP Launched

MVP is shipped when ALL of the following are true simultaneously:

1. melanatedintech.com is live with Melanated In Tech branding throughout
2. Homepage has working email capture that sends a welcome email
3. At least 5 free Learn articles are published and publicly readable
4. Directory has 20+ browsable, filterable entries
5. At least 2 products are live and purchasable via Stripe Checkout
6. At least 1 real purchase has been completed with successful file delivery
7. At least 50 email subscribers captured
8. No P0 bugs open
9. Google Analytics or Vercel Analytics tracking confirmed active
10. Founder has manually completed a test purchase end-to-end

---

## What Comes After MVP (Not In This Plan)

The following are explicitly out of scope for MVP but are the natural next steps:

- Pro / Elite membership tiers (MBR-002, MBR-003) — Sprint 2 of Phase 2
- AI Agents for sale (AGT-001, AGT-003) — require more build time and support infrastructure
- Third-party seller marketplace — only after MIT products validate demand
- Community / Discord
- Certifications and courses
- Affiliate program

Do not let these scope creep into the MVP sprints. Ship first, expand second.

---

*Document owner: Antonio James, Melanated In Tech*
*Last updated: 2026-06-03*
*Next review: Sprint 1 Kickoff*
