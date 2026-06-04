# Marketplace — Melanated In Tech

> **North Star:** Melanated In Tech is building the world's most practical ecosystem for AI Agents, MCP Servers, Agent Skills, Automation Systems, and Agent Commerce. Every decision should move the platform closer to becoming the trusted place where people learn, build, deploy, buy, sell, and scale AI-powered systems.

---

## Purpose

This directory contains all **operational documentation for the MIT Marketplace** — the curated platform where community builders list and sell AI agents, MCP servers, prompt packs, skills, and blueprints.

The Marketplace is the monetization engine of the platform. It closes the loop between Academy (education) and income (monetization).

---

## Directory Structure

```
/marketplace
├── README.md                        ← You are here
├── pricing/
│   ├── commission-structure.md      ← Seller tier commissions (30/70 → 10/90)
│   ├── product-pricing-guide.md     ← Price ranges by category
│   └── membership-discounts.md      ← Buyer discounts by membership tier
│
├── listings/
│   ├── product-submission-guide.md  ← How sellers prepare a submission
│   ├── quality-standards.md         ← Complete quality review checklist
│   ├── category-definitions.md      ← What qualifies as each product type
│   └── listing-template.md          ← Template for creating a product listing
│
├── revenue/
│   ├── gm-tracking.md               ← GMV targets and actuals
│   ├── commission-reporting.md      ← How MIT commission is calculated
│   ├── payout-schedule.md           ← Weekly payout process and rules
│   └── mit-owned-products.md        ← MIT's own product pipeline
│
├── seller-program/
│   ├── seller-tiers.md              ← Standard → Pro → Elite → Exclusive
│   ├── seller-onboarding.md         ← Step-by-step seller journey
│   ├── seller-tools.md              ← Analytics, reviews, payouts dashboard
│   └── founder-seller-program.md    ← Early seller incentives
│
└── operations/
    ├── dispute-resolution.md        ← How disputes are handled
    ├── refund-policy.md             ← 30-day policy and process
    ├── fraud-prevention.md          ← Anti-fraud controls
    └── launch-plan.md               ← Phase 1→2→3 marketplace launch timeline
```

---

## Current Marketplace Status

| Metric | Current | Month 6 Target | Month 12 Target |
|--------|---------|---------------|----------------|
| Active Sellers | 0 (MIT only) | 10 | 50 |
| Active Listings | 0 | 25 | 100 |
| Monthly GMV | $0 | $3,500 | $25,000 |
| MIT Commission Revenue | $0 | $1,050 | $7,500 |

---

## Product Categories

| Category | Price Range | Launch Phase |
|----------|------------|-------------|
| AI Agents | $19–$499 | Phase 2 (Day 37) |
| MCP Servers | $29–$299 | Phase 2 (Day 37) |
| Prompt Packs | $19–$99 | Phase 1 (Day 20) — MIT seeds first |
| Agent Skills | $9–$79 | Phase 2 |
| Agent Blueprints | $49–$499 | Phase 2 |
| Bundles | $99–$599 | Phase 3 |

---

## Commission Structure Summary

| Seller Tier | MIT Takes | Seller Keeps | How to Qualify |
|-------------|-----------|--------------|----------------|
| Standard | 30% | 70% | Any verified member |
| Pro Seller | 20% | 80% | Pro member + 10 sales |
| Elite | 15% | 85% | 50+ sales + 4.5+ rating |
| Exclusive Partner | 10% | 90% | Custom negotiation |

---

## Marketplace Operator: Marketplace Agent

All marketplace operations are managed by the **Marketplace Agent**.
See: `agents/marketplace-agent.md` for full agent profile.

Key responsibilities:
- Product quality review (48-hour SLA)
- Seller tier management
- Dispute resolution
- MIT product pipeline planning
- Weekly health reporting
