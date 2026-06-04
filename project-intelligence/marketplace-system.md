# Marketplace System — Melanated In Tech

> **North Star:** Melanated In Tech is building the world's most practical ecosystem for AI Agents, MCP Servers, Agent Skills, Automation Systems, and Agent Commerce. Every decision should move the platform closer to becoming the trusted place where people learn, build, deploy, buy, sell, and scale AI-powered systems.

---

> Complete architecture for the AI agent marketplace. The monetization loop that closes the Academy → Income cycle.

---

## Overview

The MIT Marketplace is a **curated digital marketplace** where community builders list and sell AI agents, MCP servers, prompt packs, skills, and blueprints. It is the mechanism that turns education into income — closing the loop the Academy opens.

**What makes it different from every other digital marketplace:**
- Purpose-built for AI builders, not generic digital products
- Seller identity is grounded in community membership and reputation
- Quality reviewed before any product goes live
- Seller success is MIT's success (commission model creates alignment)

---

## Product Categories

| Category | Price Range | What It Is |
|----------|------------|-----------|
| **AI Agents** | $19–$499 | Complete, deployable AI agents for specific business use cases |
| **MCP Servers** | $29–$299 | Model Context Protocol servers connecting agents to tools/APIs |
| **Prompt Packs** | $19–$99 | Curated, tested prompt collections for specific workflows |
| **Agent Skills** | $9–$79 | Individual tools/capabilities (functions) to extend agents |
| **Agent Blueprints** | $49–$499 | Pre-built automation workflows with full documentation |
| **Bundles** | $99–$599 | Curated multi-product collections at 30–40% discount |

---

## Seller Program

### Seller Tiers

| Tier | MIT Cut | Seller Cut | Eligibility |
|------|---------|-----------|-------------|
| Standard | 30% | 70% | Any verified member |
| Pro Seller | 20% | 80% | Pro/Enterprise member + 10+ sales |
| Elite | 15% | 85% | 50+ sales + 4.5+ avg rating + verified |
| Exclusive Partner | 10% | 90% | Custom, high-volume, negotiated |

### Seller Onboarding Flow

```
1. Visit /seller/apply
2. Complete application (bio, portfolio, first product concept)
3. Admin reviews (48-hour SLA)
4. If approved: complete Stripe Connect setup
   - Identity verification (Stripe handles)
   - Bank account or debit card for payouts
5. Submit first product for quality review
6. Admin approves product (quality review)
7. Product goes live on marketplace
8. Seller receives "Verified Seller" badge on profile
```

### Seller Tools (Dashboard)
- Product builder with rich-text description and media upload
- Analytics: views, conversion rate, revenue over time
- Review management (respond to reviews)
- Payout history and upcoming payout dates
- Affiliate link generator (earn 5% on referral sales)
- Seller profile editor

---

## Quality Standards

All products reviewed before going live. **No exceptions.**

### Functional Requirements
- [ ] Product works as described
- [ ] Complete documentation included
- [ ] All dependencies documented
- [ ] Virus/malware free
- [ ] Setup instructions tested

### Content Requirements
- [ ] Description is accurate, not misleading
- [ ] Screenshots are authentic (no fake UI)
- [ ] Demo video or preview available
- [ ] Pricing reflects actual value

### Legal Requirements
- [ ] Seller owns or has properly licensed all components
- [ ] Open-source licenses properly attributed
- [ ] No copyrighted materials (images, code, content) without license
- [ ] No personally identifiable information in product files

### Policy Requirements
- [ ] No tools for illegal activities
- [ ] No surveillance or manipulation tools
- [ ] No harassment-enabling products
- [ ] No misleading capability claims

---

## Buyer Experience

### Discovery Pathways
1. **Search** — Full-text Typesense search with typo tolerance
2. **Browse by Category** — Filtered category pages
3. **Trending** — `/marketplace/trending` — highest velocity products
4. **New Arrivals** — `/marketplace/new` — latest additions
5. **Free** — `/marketplace/free` — zero-cost products (list building)
6. **Collections** — MIT editorial team curates monthly themed collections

### Filters Available
- Category (AI Agent, MCP Server, etc.)
- Price range (slider)
- Rating (4+ stars, 4.5+ stars)
- Seller type (MIT Official, Verified Seller, Community)
- Compatibility (Claude, GPT-4, Ollama, n8n, etc.)
- License type (personal, commercial, extended)

### Purchase Flow
```
Product Detail Page
  → Select license type (Personal Use / Commercial / Extended)
  → Click "Buy Now" → Stripe Checkout (hosted, PCI compliant)
  → Complete payment
  → Webhook received → order created in DB
  → Buyer redirected to /checkout/success
  → Download button unlocked
  → Confirmation email sent (Resend)
  → Access available in /dashboard/purchases
```

### Product Delivery
- **Downloads:** Signed Cloudflare R2 URL (15-minute TTL)
- **Max downloads:** Configurable per product (default: 5)
- **Lifetime access:** Purchases never expire (unless product deprecated)
- **Re-download:** User can re-request signed URL up to max_downloads limit
- **Audit trail:** Every download logged to `downloads` table

---

## Payout System

| Setting | Value |
|---------|-------|
| Payout processor | Stripe Connect Express |
| Payout schedule | Weekly (Mondays) |
| Minimum payout threshold | $25 |
| Dispute window | 7 days post-purchase |
| Dispute rate threshold | 5% (triggers account review) |
| Refund policy | 30 days, platform mediates |
| Currency | USD (default); multi-currency Phase 3 |

**Stripe Connect Flow:**
1. Seller completes Stripe Connect Express onboarding
2. MIT stripe account is the platform
3. On purchase: full amount charged to buyer's card
4. MIT holds full amount, releases seller portion after dispute window
5. Weekly batch payout to seller Stripe Connect accounts
6. Platform fee retained by MIT

---

## Revenue Projections

| Period | Active Sellers | Listings | Monthly GMV | MIT Revenue |
|--------|---------------|---------|-------------|------------|
| Month 3 | 3 (MIT) | 5 | $500 | $500 |
| Month 6 | 10 | 25 | $3,500 | $1,050 |
| Month 9 | 25 | 60 | $10,000 | $3,000 |
| Month 12 | 50 | 100 | $25,000 | $7,500 |
| Month 18 | 100 | 250 | $60,000 | $15,000 |
| Month 24 | 200 | 500 | $120,000 | $30,000 |
| Month 36 | 500 | 1,500 | $400,000 | $80,000–$120,000 |

---

## Marketplace Launch Plan

### Phase 1: MIT Seeds the Marketplace (Months 1–3)
- MIT lists 10 own products (prompt packs, starter agents, blueprints)
- No third-party sellers yet
- Validate purchase flow, payment processing, digital delivery
- Zero-risk environment for testing before opening to community

### Phase 2: Founder Seller Program (Months 4–5)
- 5–10 founding sellers recruited from community
- 80/20 split for founding sellers (incentive for early participation)
- "Founding Seller" badge — permanent social proof
- Featured placement on all category pages
- High-touch support, direct Slack access to founder

### Phase 3: Community Soft Launch (Month 6)
- Marketplace opens to all approved community members
- Community members only (not public) can browse and purchase
- Validate buyer behavior, review system, dispute resolution

### Phase 4: Public Launch (Month 7+)
- Any visitor can browse and purchase
- Members get tier-based discounts (Explorer: 0%, Community: 5%, Architect: 10%, Operator: 15%)
- Full SEO optimization for product pages
- Product Hunt launch coordinated with this milestone

---

## Review System

- **Verified-purchase reviews only** (no gaming)
- Rating: 1–5 stars + title + body
- Minimum purchase + 7 days before review unlocked
- `helpful_count` — community can upvote useful reviews
- Seller can respond to all reviews (one response per review)
- Admin can flag/hide reviews violating policy
- Review manipulation triggers seller account suspension

---

## Success Metrics

| Metric | Month 6 | Month 12 | Month 24 |
|--------|---------|---------|---------|
| Active Sellers | 10 | 50 | 200 |
| Active Listings | 25 | 100 | 500 |
| Monthly GMV | $3,500 | $25,000 | $120,000 |
| MIT Commission Revenue | $1,050 | $7,500 | $30,000 |
| Avg Product Rating | 4.5+ | 4.5+ | 4.5+ |
| Dispute Rate | <5% | <3% | <2% |
| Seller NPS | — | 8+/10 | 8.5+/10 |

---

## URL Structure

```
/marketplace                          → Hub page
/marketplace/agents                   → AI Agents category
/marketplace/agents/[slug]            → Product detail
/marketplace/mcp-servers              → MCP Servers category
/marketplace/mcp-servers/[slug]       → Product detail
/marketplace/prompts                  → Prompt Packs
/marketplace/skills                   → Agent Skills
/marketplace/blueprints               → Blueprints
/marketplace/bundles                  → Bundles
/marketplace/new                      → New arrivals
/marketplace/trending                 → Trending
/marketplace/free                     → Free products
/marketplace/submit                   → Submit a product (redirects to seller flow)
/seller/apply                         → Seller application
/seller/products                      → Seller product management
/seller/products/new                  → Create listing
/seller/analytics                     → Revenue analytics
/seller/payouts                       → Payout history
/checkout                             → Stripe Checkout redirect
/checkout/success                     → Post-purchase confirmation
/dashboard/purchases                  → Buyer's purchased products
```

---

## Anti-Fraud Controls

| Control | Implementation |
|---------|---------------|
| Product quality review | Manual admin approval before going live |
| Verified-purchase reviews | `order_item_id` required on review creation |
| Download abuse prevention | Max download count + IP logging |
| Dispute threshold | 5% rate triggers account review |
| Payout hold | 7-day dispute window before funds release |
| Identity verification | Stripe Connect handles KYC for sellers |
| Rate limiting | API rate limits on purchase and download endpoints |
