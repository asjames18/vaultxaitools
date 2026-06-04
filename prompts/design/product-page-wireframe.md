# Product Page Wireframe — Melanated In Tech

> **North Star:** Melanated In Tech is building the world's most practical ecosystem for AI Agents, MCP Servers, Agent Skills, Automation Systems, and Agent Commerce. Every decision should move the platform closer to becoming the trusted place where people learn, build, deploy, buy, sell, and scale AI-powered systems.

---

## PURPOSE
Design the product detail page pattern that works for all MIT marketplace product types: AI Agents, MCP Servers, Prompt Packs, Agent Skills, Blueprints, and Courses.

---

## CONVERSION GOAL
Visitor → Click "Buy Now" → Complete Stripe Checkout

---

## PAGE LAYOUT (Mobile-First)

### Above the Fold (375px — no scroll)

```
┌────────────────────────────────────┐
│  ← Back to [Category]             │  ← breadcrumb
│                                    │
│  ┌──────────────────────────────┐ │
│  │  [Product thumbnail/preview]  │ │  ← 16:9 or square
│  └──────────────────────────────┘ │
│                                    │
│  🔵 MIT Official  [Category]       │  ← badges
│                                    │
│  [Product Name — H1]               │
│                                    │
│  ⭐ 4.8  (23 reviews)  [N] sales   │
│  by [Seller Name]                  │
│                                    │
│  $149                              │  ← prominent
│                                    │
│  ┌──────────────────────────────┐ │
│  │  🟢 Buy Now                   │ │  ← PRIMARY CTA
│  └──────────────────────────────┘ │
│                                    │
│  [Preview / Live Demo →]           │  ← secondary
│                                    │
│  ✓ Instant download                │
│  ✓ 30-day refund policy            │
│  ✓ Lifetime access                 │
└────────────────────────────────────┘
```

### Below the Fold (scroll area)

```
SECTION: What This Does
──────────────────────
[2-3 paragraphs — specific description, not marketing fluff]

SECTION: What's Included
─────────────────────────
✓ [Specific file 1 — what it is and what it does]
✓ [Specific file 2]
✓ [Documentation: README, setup guide]

SECTION: Technical Requirements
───────────────────────────────
Runtime: Python 3.10+ / Node 18+
API Keys needed: Anthropic API, [others]
Compatible with: Claude 3, n8n
Setup time: ~15 minutes

SECTION: How to Use It
───────────────────────
Step 1: [action]
Step 2: [action]  
Step 3: [action + working result]

SECTION: Reviews
─────────────────
[5 most recent reviews with rating + body]
[Load more button]

SECTION: From the Seller
─────────────────────────
[Seller profile card]
[Other products by this seller]

SECTION: Learn to Build This
──────────────────────────────
[Related tutorial card] → [Blog post about this skill]
[Academy course card] → "Learn to build this yourself"

SECTION: Similar Products
──────────────────────────
[ProductCard × 3]
```

---

## STICKY BUY BAR (Desktop only, appears on scroll past hero)

```
┌──────────────────────────────────────────────────────┐
│ [Product title]     $149     [🟢 Buy Now]            │
└──────────────────────────────────────────────────────┘
```

---

## LICENSE SELECTOR (when multiple tiers)

```
SELECT LICENSE:
  ○ Personal Use     $49    [For personal projects]
  ● Commercial       $149   [For client work and products]  ← selected
  ○ Extended         $299   [For resale / white-label]

[Price updates with selection]
```

---

## COMPONENT LIST

| Component | File | Notes |
|-----------|------|-------|
| Product hero | `components/marketplace/ProductHero.tsx` | Top section |
| Trust signals | `components/marketplace/TrustSignals.tsx` | Badges + guarantees |
| What's included | `components/marketplace/IncludesList.tsx` | Checklist format |
| Review list | `components/marketplace/ReviewList.tsx` | Verified only |
| Related content | `components/marketplace/RelatedContent.tsx` | Tutorial + Course links |
| Seller profile | `components/marketplace/SellerCard.tsx` | Profile card |
| Sticky buy bar | `components/marketplace/StickyBuyBar.tsx` | Desktop scroll behavior |

---

## QUALITY CHECKLIST
- [ ] Price and CTA visible above fold on 375px (no scroll)
- [ ] "Buy Now" CTA: #00FF41 full-width on mobile
- [ ] Trust signals near CTA (✓ Instant download, ✓ 30-day refund)
- [ ] Technical requirements clearly stated (no hidden dependencies)
- [ ] "What's Included" is specific (file names, not vague)
- [ ] Reviews show only verified purchases
- [ ] Related educational content linked
- [ ] License selector if multiple tiers
- [ ] generateMetadata() for Product schema + OpenGraph
- [ ] Sticky buy bar on desktop (scroll reveal)
