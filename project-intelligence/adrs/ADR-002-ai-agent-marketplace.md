> **North Star:** Melanated In Tech is building the world's most practical ecosystem for AI Agents, MCP Servers, Agent Skills, Automation Systems, and Agent Commerce. Every decision should move the platform closer to becoming the trusted place where people learn, build, deploy, buy, sell, and scale AI-powered systems.

---

# ADR-002: Build an AI Agent Marketplace (Not a Generic Digital Product Store)

**Date:** 2026-06
**Status:** Active
**Deciders:** Antonio James (Founder)

---

## Context

The platform's original form was a tools directory — a curated list of third-party AI tools with affiliate links. This generates modest affiliate revenue but creates no community ownership, no network effects, and no wealth for the builders in the MIT community.

The question was: how does MIT create a marketplace that (a) generates platform revenue through commissions, and (b) creates income pathways for community members who are building AI systems?

Two models were considered: a generic digital product marketplace (like Gumroad or Lemon Squeezy) where sellers list anything, or a purpose-built AI agent marketplace where products must be actual AI systems (agents, MCP servers, prompts, skills, blueprints).

---

## Decision

**Build a curated marketplace specifically for AI agents, MCP servers, prompt packs, agent skills, and blueprints.** All products must be functional, tested AI systems — not generic digital downloads.

Product categories:
1. AI Agents ($19–$499)
2. MCP Servers ($29–$299)
3. Prompt Packs ($19–$99)
4. Agent Skills ($9–$79)
5. Agent Blueprints ($49–$499)
6. Bundles ($99–$599)

**The key constraint:** Every product listed must pass a quality review that verifies it works as described, is properly documented, and meets ethical guidelines.

---

## Alternatives Considered

### Alternative A: Generic Digital Product Marketplace
Allow any digital product: ebooks, templates, presets, spreadsheets, etc.

**Why rejected:** Destroys the brand differentiation. If MIT sells prompt packs alongside Excel templates, it becomes "another digital product marketplace" instead of "the marketplace for AI builders." The specificity is the product. Generic marketplaces (Gumroad, Lemon Squeezy, Etsy Digital) dominate the general market and cannot be unseated.

### Alternative B: Pure Affiliate Marketplace (No Community Selling)
Curate third-party tools and earn affiliate commissions, similar to the current tools directory.

**Why rejected:** No network effects. MIT earns a fraction of revenue compared to a commission marketplace. Community members cannot build income through the platform. This is a content business, not a platform business.

### Alternative C: SaaS Subscription Access Model (All Products Unlocked with Membership)
Bundle all marketplace products into membership tiers. Sellers earn based on usage/engagement metrics.

**Why rejected:** Creates complex payout mechanics. Undervalues individual products. Sellers prefer unit-price income (know exactly what a sale earns) over engagement-based income (opaque and variable). Also requires a critical mass of content that doesn't exist on Day 1.

---

## Why Chosen

1. **No competing marketplace exists.** There is no curated marketplace for AI agents and MCP servers built by practitioners, for practitioners. First-mover advantage is available.

2. **The specificity creates trust.** Buyers know that every product in the MIT marketplace is an actual, tested AI system — not digital junk. Quality standards enforce this.

3. **Closes the Academy-to-income loop.** Students learn to build AI agents in the Academy → graduate with certification → list their agent on the marketplace → earn income. This closed loop is MIT's most powerful differentiator.

4. **Creates flywheel dynamics.** More sellers → more products → more buyers → more community members → more Academy students → more certified builders → more sellers. Generic marketplaces have this flywheel; AI-specific ones don't yet.

5. **Community identity reinforcement.** When you sell on the MIT marketplace, you're not just selling a product — you're part of the MIT builder community. Identity and economic incentive aligned.

---

## Tradeoffs

| Accepted Tradeoff | Reasoning |
|------------------|----------|
| Higher operational overhead (quality review) | Cost of maintaining quality = cost of maintaining trust |
| Slower initial inventory growth | Quality > quantity. 10 great products > 100 mediocre ones |
| Commission rate (30%) higher than Gumroad/Lemon Squeezy | MIT provides: audience, trust, community, platform — this justifies the rate |
| Requires Stripe Connect integration complexity | Unavoidable for a commission marketplace with multiple sellers |
| Admin bottleneck on product reviews | Solved by: clear quality rubric + community-sourced co-reviewers in Phase 3 |

---

## Future Impact

**This decision enables:**
- A flywheel between Academy (education) and Marketplace (monetization)
- MIT's most durable competitive moat: a marketplace is a two-sided network that compounds
- A path to "the NPM for AI agents" (see Future Opportunities doc)
- Community member income that creates loyalty no newsletter or course can match
- MIT-owned products sold alongside community products (100% seller-side revenue to MIT)

**This decision constrains:**
- Must maintain quality standards at scale (requires either: admin bandwidth, automated review, or trusted community reviewers)
- Commission rate must be justified by platform value delivered — if MIT can't deliver buyers, sellers will leave
- Marketplace reputation is fragile — one high-profile defective product can damage trust severely

**Metric to watch:**
- Seller satisfaction score (target: 8+/10)
- Dispute rate (target: <3% at Month 12)
- Seller retention (target: >80% of sellers active 6 months after first sale)
