# Conversion Upgrade Plan — Melanated In Tech
**Date:** June 2026

---

## Current State Assessment

**Overall Conversion Score: 4/10**

The site currently has:
- Tool directory (free, drives browsing)
- Basic product pages (Stripe one-time purchase)
- Email capture (generic "AI tools drops" framing)
- Checkout flow (functional but minimal)
- No agent deployment path
- No creator/seller tools
- No subscription or membership tier
- No post-purchase retention mechanism
- Checkout success page is a dead end

---

## Revenue Paths Analysis

### Active Revenue Paths
| Path | Status | Friction |
|---|---|---|
| Product purchase (Stripe) | Active | Missing use-case context, no upsell |
| Email list growth | Active | Weak framing, low conversion expected |

### Missing Revenue Paths
| Path | Priority | What's Needed |
|---|---|---|
| Agent marketplace (buy agents) | P0 | Listing pages, cart, checkout |
| MCP server premium tier | P1 | Licensing model, pricing page |
| Agent skills premium | P1 | Pricing, integration guide |
| Creator rev-share | P1 | Creator dashboard, payout model |
| Subscription/membership | P2 | Define tiers, build paywall logic |
| Affiliate program | P2 | Tracking links, commission model |
| API access | P3 | Developer portal, API key management |

---

## Conversion Funnel Redesign

### Current Funnel (Broken)
```
Homepage
  ↓ "Browse Agents" or "Shop Products"
Agents/Products Directory
  ↓ Click item
Detail Page
  ↓ "Buy" (if product) OR "Learn More" (if agent → external link)
Checkout → Success → ❌ Dead End
```

### Target Funnel (Agent Commerce)
```
Homepage
  ↓ "Browse Marketplace" | "Deploy an Agent" | "Sell Your Agent"
       ↓                         ↓                    ↓
Marketplace Browse         Agent Quickstart      Creator Onboarding
  ↓                              ↓                    ↓
Agent/Product Detail       Deploy Wizard         Upload & Price Agent
  ↓                              ↓                    ↓
Buy / Deploy / Download    Running Agent         Earn Revenue
  ↓
Post-Purchase Onboarding
  ↓
Community + Upsell
  ↓
Repeat Purchase / Subscription
```

---

## Section-by-Section Conversion Fixes

### 1. Homepage Hero — P0

**Problem:** "The AI Hub Built For Us" doesn't communicate commerce or deployment.

**Fix:**
- New primary headline: "The Practical Ecosystem for AI Agent Commerce"
- New sub-headline: "Pre-built agents, MCP servers, and production-ready skills — deploy in minutes, monetize in hours."
- Primary CTA: "Browse Marketplace" (→ `/marketplace` or `/agents`)
- Secondary CTA: "Sell Your Agent" (→ `/creators` or `/submit`)
- Tertiary CTA: "Shop Products" (→ `/products`)

**Stats to show (above fold):**
- X Agents Available
- Y Products Sold
- Z Creators Building
- (Replace generic "10K Users" with commerce metrics)

---

### 2. Email Capture — P0

**Problem:** "Get weekly AI tools drops" doesn't attract builders or buyers.

**Fix:**
- New headline: "Get Weekly Agent Blueprints"
- New sub: "Automation playbooks, MCP server updates, and marketplace drops — straight to your inbox."
- CTA: "Get Agent Blueprints" (not "Join Free")
- Add segmentation: "I'm a [Builder / Buyer / Learner]" optional tag at signup

**Expected impact:** 2–3x improvement in email signup conversion for target audience

---

### 3. Product Pages — P1

**Problem:** No use-case context, no creator credibility, no upsell.

**Additions:**
```
[Existing: Title, Price, Buy Button]

+ "What You'll Build" section (3 bullets)
+ "Ideal For" section (3 use-case profiles)
+ Creator profile card (name, photo, credentials, other products)
+ "You'll Also Need" / "Frequently Bought Together" (2–3 cards)
+ "Related Agents & MCP Servers" cross-sell section
+ Social proof: "X teams have deployed this"
```

---

### 4. Checkout Success Page — P0

**Problem:** Generic thank-you. Dead end. No retention.

**Complete redesign:**

```
Section 1: Confirmation
  - "Payment successful — [Product Name] is ready."
  - Download/access button (prominent)

Section 2: Quick Start Guide
  - "Deploy this in 3 steps" (numbered, visual)
  - Link to full documentation

Section 3: Related Products (3 cards)
  - "Builders who bought this also bought..."

Section 4: Join the Community
  - "See what 500+ builders created with this template"
  - Link to Discord/Slack/community

Section 5: Share
  - "I just deployed [Product Name] with @melanatedintech"
  - Twitter/X share button

Section 6: Support
  - Contact link, docs link
```

---

### 5. Agent Detail Pages — P1

**Problem:** No "Deploy" CTA; no purchase path for premium agents.

**Additions:**
- Primary CTA: "Deploy This Agent" (prominent, green)
- Secondary CTA: "Preview" (see agent in action)
- Price badge (free / $X one-time / $X/mo)
- "What this agent does" in 3 bullets
- "Requirements" (API keys needed, MCP servers required)
- Creator profile card
- Deployment stats (X teams running this)
- Reviews/ratings section (Phase 4)

---

### 6. Favorites & Compare — P2

**Problem:** These features have no conversion path attached.

**Fixes:**
- Favorites empty state: "Save agents and tools to compare, share, or deploy as a collection"
- Compare page: Add "Deploy All Selected" CTA; add "Buy Bundle" if products
- Allow anonymous favorites (localStorage → sync on login) to remove auth wall

---

### 7. Blog → Conversion — P2

**Problem:** Blog is completely disconnected from revenue.

**Fixes:**
- End every blog post with: "Automate this workflow with [Agent Name]" CTA
- Add "Related Products" sidebar to blog posts
- Add email capture at bottom of every post (inline, not popup)
- Add "Tools mentioned in this post" section (links to tool detail pages)

---

### 8. Trust Signal Upgrades — P1

**Current trust signals:**
- "15+ AI Agents, 5 MCP Servers, 2 Products" (too small)
- 3 testimonials (learning-focused)
- "Rigorous curation process" section

**Upgraded trust signals:**
- Commerce metrics: "X agents deployed", "Y products sold", "$Z in creator revenue"
- Business testimonials: "Saved 20 hours/week", "Generated $2K MRR from one agent"
- Security badge: "Payments secured by Stripe"
- Creator verification badge: "Vetted creator program"
- Community proof: "Join X builders in our Discord"

---

### 9. Creator/Seller Onboarding — P1

**Currently missing entirely.**

**Minimum viable creator path:**
1. Landing page: "Sell Your Agent on MIT Marketplace"
2. Requirements checklist (what we accept, quality bar)
3. Submission form (agent details, pricing, creator profile)
4. Review & approval flow (admin side)
5. Published listing with creator dashboard
6. Revenue reporting (monthly payout)

---

### 10. Subscription/Membership Tier — P2

**Define tiers:**

| Tier | Price | Access |
|---|---|---|
| Free | $0 | Browse all, 3 free agents, community read-only |
| Builder | $19/mo | All agents, priority support, creator tools |
| Pro Creator | $49/mo | All agents + sell agents + analytics + rev-share 80% |
| Team | $99/mo | 5 seats + white-label + priority SLA |

**UI changes needed:**
- Lock icon on premium content
- "Upgrade to Builder" prompt on locked items
- Pricing page (`/pricing`)
- Subscription management in dashboard

---

## Email Funnel Sequences

### Sequence 1: New Subscriber
- Email 1 (immediate): "Here's your first agent blueprint"
- Email 3 (Day 3): "How builders are using MIT agents"
- Email 7 (Day 7): "Your free agent this week: [X]"
- Email 14 (Day 14): "Ready to deploy your first automation?"

### Sequence 2: Post-Purchase
- Email 1 (immediate): Confirmation + download
- Email 2 (Day 1): Getting started guide
- Email 3 (Day 3): "How others built with [Product]"
- Email 7 (Day 7): Community invite
- Email 14 (Day 14): Feedback + review request

### Sequence 3: Browse → No Purchase (Retargeting)
- Email 1 (48h): "You were looking at [Agent Name]"
- Email 2 (5d): "Here's what others built with it"
- Email 3 (10d): Limited-time offer or free resource

---

## Conversion Metrics to Track

| Metric | Target (MVP) | Where to Track |
|---|---|---|
| Homepage → Marketplace CTR | >15% | Analytics |
| Email capture rate | >3% of visitors | Email platform |
| Product page → Add to cart | >8% | Stripe / Analytics |
| Cart → Purchase | >60% | Stripe |
| Post-purchase email open rate | >40% | Email platform |
| Agent detail → Deploy click | >10% | Analytics |
| Blog post → Email signup | >2% | Email platform |
| Creator submissions / month | >5 | Admin dashboard |

---

## Implementation Priority

| Item | Priority | Effort | Impact |
|---|---|---|---|
| Fix checkout success page | P0 | Low | High |
| Rewrite hero for commerce | P0 | Low | High |
| Reframe email capture | P0 | Low | High |
| Product page use-cases/upsell | P1 | Medium | High |
| Agent detail "Deploy" CTA | P1 | Medium | High |
| Creator onboarding MVP | P1 | High | High |
| Trust signal upgrade | P1 | Low | Medium |
| Blog → conversion CTAs | P2 | Low | Medium |
| Subscription tiers | P2 | High | High |
| Affiliate program | P3 | Medium | Medium |
