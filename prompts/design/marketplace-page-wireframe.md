# Marketplace Page Wireframe — Melanated In Tech

> **North Star:** Melanated In Tech is building the world's most practical ecosystem for AI Agents, MCP Servers, Agent Skills, Automation Systems, and Agent Commerce. Every decision should move the platform closer to becoming the trusted place where people learn, build, deploy, buy, sell, and scale AI-powered systems.

---

## PURPOSE
Design the Marketplace hub and category pages. These are the commercial surfaces of the platform. Every element should drive product discovery and purchase.

---

## MARKETPLACE HUB (/marketplace)

### Layout Structure

```
┌────────────────────────────────────────────┐
│  HEADER: "MIT Marketplace"                 │
│  Subhead: "AI agents, MCP servers, and     │
│  tools built by the MIT community"         │
│                                            │
│  [Search bar — full width on mobile]       │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│  CATEGORIES (horizontal scroll on mobile)  │
│  [All] [Agents] [MCP] [Prompts]            │
│  [Skills] [Blueprints] [Bundles]           │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│  FEATURED — "MIT Official Products"        │
│  [Product] [Product] [Product]             │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│  NEW ARRIVALS                              │
│  [Product Card Grid — 2 col mobile, 3 desktop]
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│  TRENDING THIS WEEK                        │
│  [Product Card Grid]                       │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│  SELL ON MIT? [Seller CTA]                 │
│  "Turn your builds into income"            │
│  [Apply to Sell →]                         │
└────────────────────────────────────────────┘
```

---

## PRODUCT CARD COMPONENT

```
┌─────────────────────────────┐
│  [Thumbnail image]          │
│  [Category badge]           │
├─────────────────────────────┤
│  [Product title — 2 lines]  │
│  by [Seller name]           │
├─────────────────────────────┤
│  ⭐ [rating] ([N] reviews)  │
│  $[price]                   │
├─────────────────────────────┤
│  [Buy Now] button           │  ← #00FF41
└─────────────────────────────┘
```

**Component:** `components/marketplace/ProductCard.tsx`

Props:
```typescript
interface ProductCardProps {
  id: string;
  title: string;
  slug: string;
  category: string;
  thumbnail_url: string;
  price_cents: number;
  avg_rating: number;
  review_count: number;
  seller_name: string;
  is_free: boolean;
  is_mit_official: boolean;
}
```

---

## PRODUCT DETAIL PAGE (/marketplace/[category]/[slug])

```
┌────────────────────────────────────────────┐
│  [Breadcrumb: Marketplace > Agents > Name] │
│                                            │
│  [Product thumbnail — left/top]            │
│                                            │
│  [Product title — H1]                      │
│  by [Seller] | Category badge              │
│  ⭐ 4.8 (23 reviews)                       │
│                                            │
│  $149                                      │
│  [Buy Now — #00FF41 full width on mobile]  │
│  [Preview / Demo link]                     │
│                                            │
│  ─────────────────────────────────────    │
│  WHAT THIS DOES                            │
│  [Description — rich text]                 │
│                                            │
│  WHAT'S INCLUDED                           │
│  ✓ [item 1]                                │
│  ✓ [item 2]                                │
│                                            │
│  TECHNICAL REQUIREMENTS                    │
│  [requirements]                            │
│                                            │
│  REVIEWS                                   │
│  [Review cards]                            │
│                                            │
│  RELATED CONTENT                           │
│  [Tutorial that teaches this skill]        │
│  [Academy course link]                     │
└────────────────────────────────────────────┘
```

---

## FILTER SIDEBAR (Desktop) / Filter Sheet (Mobile)

```
Filters:
  Category: [checkboxes]
  Price: [slider: $0 to $500]
  Rating: [4+ stars] [4.5+ stars]
  Seller Type: [MIT Official] [Verified] [Community]
  Compatible with: [Claude] [GPT-4] [Ollama] [n8n]
  License: [Personal] [Commercial]
```

---

## QUALITY CHECKLIST
- [ ] Product cards mobile-first (1 column → 2 → 3)
- [ ] Search bar prominent on mobile
- [ ] Category filters accessible (horizontal scroll on mobile)
- [ ] "Buy Now" CTA on product card
- [ ] Product detail: price + CTA above fold on mobile
- [ ] Trust signals near CTA (ratings, reviews, MIT Official badge)
- [ ] Related educational content linked (tutorial → course)
- [ ] Seller apply CTA on hub page
- [ ] generateMetadata() for hub, category, and product pages
