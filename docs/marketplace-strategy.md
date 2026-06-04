# Melanated In Tech — Marketplace Strategy

---

**Purpose:** Complete strategy for the MIT Marketplace — architecture, seller programs, buyer experience, commission structure, and launch plan. The marketplace is the platform's most powerful differentiator and highest-leverage revenue engine.

**Owner:** Product Manager / Marketplace Lead

**Dependencies:** `product-catalog.md`, `technical-architecture.md`, `business-strategy.md`

**Status:** Active — Marketplace planned for Phase 3 (Month 6–9) as third-party platform; Phase 2 (Month 3–5) as MIT-owned products

**Last Updated:** 2026-06-03

**Next Actions:** Build marketplace infrastructure per `implementation-roadmap.md` Phase 2

---

## Marketplace Vision

The Melanated In Tech Marketplace is a curated digital marketplace where AI builders list and sell AI agents, MCP servers, agent skills, prompt packs, and automation blueprints. It closes the loop between the Academy (where builders learn) and real income (where builders monetize).

**The core insight:** There are marketplaces for software (App Store), creative assets (Creative Market), and freelance services (Fiverr) — but there is no dedicated, curated marketplace for AI agents, MCP servers, and automation blueprints built by and for the practitioner community. Melanated In Tech is that marketplace.

---

## Product Categories

### Category 1: AI Agents
Complete, deployable AI agents for specific use cases. Delivered as code packages (Python, TypeScript) with documentation and setup instructions.

Examples: ContentFlow Agent, LeadHunter Agent, TaxPrep Agent, SupportBot Builder
Price range: $19–$499

### Category 2: MCP Servers
Model Context Protocol servers that connect Claude and other AI agents to external tools, databases, and APIs. Delivered as installable packages.

Examples: NotionSync MCP, HubSpotCRM MCP, StripeData MCP, GitHubOps MCP
Price range: $29–$299

### Category 3: Prompt Packs
Curated collections of high-quality, tested prompts for specific use cases and audiences. Delivered as formatted documents.

Examples: Black Entrepreneur Starter Pack, AI Agency Sales Playbook, Tech Career Accelerator
Price range: $19–$99

### Category 4: Agent Skills
Individual tools and capabilities that can be added to any agent. Delivered as code modules with integration documentation.

Examples: WebSearch Skill, PDFReader Skill, MemoryStore Skill, LeadEnricher Skill
Price range: $9–$79

### Category 5: Agent Blueprints
Pre-built, documented automation workflows combining multiple tools, agents, and MCP servers. Delivered as workflow files + setup guides.

Examples: Client Onboarding Machine, Sales Prospecting Pipeline, YouTube-to-Content Flywheel
Price range: $49–$499

### Category 6: Bundles
Curated collections combining multiple products at a 30–40% discount vs. individual pricing.

Examples: Agency Launch Kit ($349), Content Creator Kit ($199), Builder Stack ($249)
Price range: $99–$599

---

## Seller Program

### Seller Tiers

| Tier | Eligibility | Commission Split (MIT / Seller) | Perks |
|---|---|---|---|
| Standard | Any verified member | 30% / 70% | Marketplace listing |
| Pro Seller | Pro/Enterprise member + 10 sales | 20% / 80% | Enhanced visibility |
| Elite Seller | Verified + 50+ sales + 4.5+ rating | 15% / 85% | Featured placement, seller badge |
| Exclusive Partner | Custom negotiated, high-volume | 10% / 90% | Dedicated support, co-marketing |

### Seller Onboarding Process

1. **Application** — Any verified MIT member can apply to become a seller via `/seller/apply`
2. **Admin Review** — 48-hour turnaround. Criteria: real MIT member, demonstrated AI skills, no policy violations
3. **Stripe Connect Setup** — Approved sellers connect a Stripe Express account for payouts. Identity verification and bank account required.
4. **First Product Submission** — Seller creates first product listing via `/seller/products/new`
5. **Quality Review** — MIT team reviews for quality, accuracy, and policy compliance before publishing
6. **Live** — Approved products go live on the marketplace

### Seller Tools

- Product listing builder with rich text, media, and file upload
- Analytics dashboard (views, sales, revenue, conversion rate)
- Customer review management
- Payout history and earnings tracking
- Affiliate program with referral links (extra 5% on direct traffic)
- Seller profile page on the marketplace
- Access to the "Builders Only" community channel

### Seller Payout Schedule

- Minimum payout threshold: $25
- Payout frequency: Weekly (every Monday)
- Payout method: Stripe Connect automatic transfer to connected bank account
- 7-day dispute window before payout is released
- 5% dispute rate threshold — sellers exceeding this are flagged for review

---

## Buyer Experience

### Discovery

**Search:** Full-text search with Typesense across all published products. Filters: category, price range, rating, seller type, compatibility (Claude, GPT, etc.), license type.

**Browse by Category:** Category pages show curated listings with featured products, newest, and trending sections.

**Curated Collections:** MIT editorial team curates themed collections monthly (e.g., "Starter Pack for New Consultants," "Content Creator Stack").

**Recommendations:** Based on purchase history and browsing behavior.

### Purchase Flow

1. Browse and find product
2. Review product detail page (description, demo, documentation, reviews)
3. Select license type if applicable (Personal / Commercial / Team)
4. Add to cart or buy now
5. Stripe Checkout (hosted, PCI compliant)
6. Confirmation page with immediate download links
7. Email confirmation with access instructions
8. Product appears in `/dashboard/purchases`

### Digital Delivery

All paid products are delivered as signed, time-limited download links generated server-side after purchase verification. Links expire after 15 minutes and each download is logged. Download limits apply per product (configurable by seller, default: 5 downloads per purchase).

Purchases are permanent — buyers retain lifetime access to download within their account.

### Buyer Protection

- **30-day refund policy** for products that don't work as described
- **Dispute system** — buyers can file a dispute within 30 days of purchase
- **Review system** — verified purchase reviews only (must have completed a purchase to review)
- **Quality standards** — all products reviewed before listing

---

## Commission & Revenue Model

### Platform Revenue from Marketplace

At Standard commission (30%):
- $50 product → $15 to MIT, $35 to seller
- $199 product → $59.70 to MIT, $139.30 to seller
- $499 product → $149.70 to MIT, $349.30 to seller

### Marketplace GMV Projections

| Period | Listings | Avg Price | Monthly Sales | GMV/Month | MIT Revenue/Month |
|---|---|---|---|---|---|
| Month 6 (launch) | 10 | $75 | 20 | $1,500 | $450 |
| Month 9 | 30 | $85 | 80 | $6,800 | $2,040 |
| Month 12 | 75 | $90 | 200 | $18,000 | $5,400 |
| Month 18 | 200 | $95 | 500 | $47,500 | $11,875 |
| Month 24 | 500 | $100 | 1,200 | $120,000 | $30,000 |

---

## MIT-Owned Products Strategy

Before the third-party marketplace opens (Phase 1–2), MIT publishes its own products:

**Phase 1 Products (Months 1–2):**
- 3 Prompt Packs (~$39 each)
- 2 Beginner Courses ($49, $79)

**Phase 2 Products (Months 3–5):**
- 5 AI Agents ($49–$179)
- 3 Agent Blueprints ($99–$199)
- 2 Additional Courses ($99–$179)

**Phase 3 — Third-Party Marketplace (Months 6+):**
- Open marketplace with vetted sellers
- MIT continues selling proprietary products at same commission structure applied to self (for accounting clarity)

MIT-owned products generate 100% of revenue (no commission split) — this is the highest-margin period. Use Phase 1–2 revenue from MIT products to validate market demand before investing in marketplace infrastructure.

---

## Quality Standards

All marketplace products must meet these standards before approval:

**Functional Requirements:**
- Code products must work as described (tested by MIT review team)
- Documentation must be complete and accurate
- Files must be virus-free and not contain malicious code
- External dependencies must be documented

**Content Requirements:**
- Description must accurately represent the product
- No misleading claims about capabilities
- Demo or preview must be authentic
- Screenshots/videos must be accurate

**Legal Requirements:**
- Seller must own or have rights to all included components
- Open-source dependencies must be properly licensed
- No copyrighted materials without license

**Policy Requirements:**
- No products that enable illegal activities
- No products for harassment, surveillance, or manipulation
- No personally identifiable information in product files

---

## Marketplace Launch Plan

### Pre-Launch (Months 4–5): Founder Program

Identify 5–10 Founding Sellers from within the MIT community. These are builders who have:
1. Completed at least one Academy course
2. Built and tested their product
3. Are willing to provide honest feedback on the seller experience

Offer Founding Sellers: 80/20 split (instead of standard 70/30), "Founding Seller" badge, featured placement at launch.

Goal: 10+ products listed before public marketplace opens. Use this period to test the entire seller + buyer flow end-to-end.

### Soft Launch (Month 6): Community Members Only

Open marketplace to all MIT members (buyer access). Only approved sellers can list. Goal: Validate buyer behavior, test payment flow, collect first reviews.

### Public Launch (Month 7+): Open Access

Any visitor can browse and purchase. Non-members can purchase individual products. Members receive discounts based on tier. Promote via Product Hunt, newsletter, and social.

---

## Success Metrics

| Metric | Month 6 Target | Month 12 Target | Month 24 Target |
|---|---|---|---|
| Active Sellers | 5 | 30 | 200 |
| Active Listings | 10 | 75 | 500 |
| Monthly GMV | $1,500 | $18,000 | $120,000 |
| MIT Commission Revenue | $450 | $5,400 | $30,000 |
| Avg Product Rating | 4.5+ | 4.5+ | 4.5+ |
| Dispute Rate | <5% | <3% | <2% |
| Seller Satisfaction Score | — | 8+ / 10 | 8.5+ / 10 |
