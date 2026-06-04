# MIT Master Asset Registry
**Melanated In Tech — Monetizable Asset Source of Truth**

---

## Purpose

This document is the single source of truth for all monetizable assets on the Melanated In Tech (MIT) AI tools marketplace. Every product, service, agent, and digital asset that generates revenue must be registered here before it can be scoped, built, priced, or listed.

This registry exists to:
- Prevent duplicate asset development across teams and agents
- Track build status and ownership for every SKU
- Align product releases to roadmap phases
- Support bundling and pricing strategy decisions
- Provide agents and humans a shared reference when making product decisions

---

## How to Update This File

1. **Adding a new asset** — Append a row to the appropriate category table. Assign the next sequential ID for that category. Set Status to `Concept` until scoping is complete.
2. **Updating status** — Change the Status field only. Do not alter the ID, Name, or Category without noting the change in a comment below the table.
3. **Deprecating an asset** — Set Status to `Deprecated` and add a note below the table explaining the reason and date.
4. **Ownership transfers** — Update the Owner field and add a dated note below the relevant table.
5. **Review cadence** — This file should be reviewed at the start of every sprint and after every major product decision. See the footer for the next scheduled review date.

---

## Field Definitions

| Field | Definition |
|---|---|
| **ID** | Unique asset identifier. Format: `[CATEGORY_CODE]-[NNN]`. Codes: AGT, MCP, SKL, PRP, BPR, CRS, TPL, MBR |
| **Name** | Official product name as it appears (or will appear) on the marketplace |
| **Status** | Current build/availability state: `Concept` / `In Development` / `Ready` / `Live` / `Deprecated` |
| **Owner** | Responsible human or agent name. If agent-owned, reference the agent's registered name |
| **Price** | List price or pricing model. Use `Included` for membership-gated items, `Free` for no-cost items |
| **Category** | Product type — one of: AI Agents, MCP Servers, Agent Skills, Prompt Packs, Blueprints, Courses, Templates, Memberships |
| **Dependencies** | Other MIT assets required for this product to function or be used effectively. Use `None` if standalone |
| **Roadmap Phase** | Sprint number (1–7) in which this asset is targeted for delivery or launch |
| **Description** | One sentence describing what this asset does and who it is for |

---

## Registry

---

### 1. AI Agents

| ID | Name | Status | Owner | Price | Category | Dependencies | Roadmap Phase | Description |
|---|---|---|---|---|---|---|---|---|
| AGT-001 | Content Agent | In Development | Antonio James | $49/mo | AI Agents | MCP-003 | Sprint 2 | Researches, drafts, and schedules long-form and short-form content across channels for Black-owned brands and creators |
| AGT-002 | SEO Agent | Concept | Antonio James | $39/mo | AI Agents | MCP-002, SKL-002 | Sprint 3 | Audits site content, identifies keyword gaps, and generates optimized copy recommendations for small business websites |
| AGT-003 | Social Media Agent | In Development | Antonio James | $29/mo | AI Agents | MCP-003, SKL-001 | Sprint 2 | Generates platform-native social content, captions, and hashtag strategies aligned to brand voice and community tone |
| AGT-004 | Research Agent | Concept | Antonio James | $19/mo | AI Agents | MCP-004 | Sprint 4 | Conducts competitive analysis, market research, and trend synthesis to support business strategy and product decisions |
| AGT-005 | Launch Agent | Concept | Antonio James | $59/mo | AI Agents | AGT-001, AGT-003, BPR-001 | Sprint 5 | Orchestrates a full product or business launch sequence including content, outreach, and go-to-market asset generation |

> **Note:** All agent pricing is monthly subscription. Annual billing discount (20%) to be configured at Sprint 4.

---

### 2. MCP Servers

| ID | Name | Status | Owner | Price | Category | Dependencies | Roadmap Phase | Description |
|---|---|---|---|---|---|---|---|---|
| MCP-001 | Supabase MCP | Ready | Antonio James | Included (Pro+) | MCP Servers | None | Sprint 1 | Provides agents and skills direct read/write access to the MIT Supabase database for user data, tool listings, and transactions |
| MCP-002 | Analytics MCP | In Development | Antonio James | Included (Pro+) | MCP Servers | MCP-001 | Sprint 2 | Exposes site analytics, user behavior, and marketplace performance data to authorized agents and dashboards |
| MCP-003 | Content MCP | In Development | Antonio James | Included (Pro+) | MCP Servers | MCP-001 | Sprint 2 | Manages content assets including drafts, published posts, and media files across the MIT content ecosystem |
| MCP-004 | Marketplace MCP | Concept | Antonio James | Included (Elite) | MCP Servers | MCP-001, MCP-002 | Sprint 3 | Provides agents access to marketplace listing data, seller profiles, pricing, and purchase history for research and automation |

> **Note:** MCP Servers are infrastructure-tier products — not sold standalone. Access is gated by membership tier as noted in the Price column.

---

### 3. Agent Skills

| ID | Name | Status | Owner | Price | Category | Dependencies | Roadmap Phase | Description |
|---|---|---|---|---|---|---|---|---|
| SKL-001 | Brand Voice Skill | In Development | Antonio James | $12 one-time | Agent Skills | None | Sprint 2 | Trains any Claude-based agent to write consistently in a brand's established tone, vocabulary, and style guidelines |
| SKL-002 | SEO Research Skill | Concept | Antonio James | $15 one-time | Agent Skills | MCP-002 | Sprint 3 | Enables agents to perform keyword research, SERP analysis, and content gap identification using live search data |
| SKL-003 | Code Review Skill | Concept | Antonio James | $18 one-time | Agent Skills | None | Sprint 4 | Gives agents the ability to audit, annotate, and suggest improvements for code written by humans or other agents |
| SKL-004 | Market Research Skill | Concept | Antonio James | $15 one-time | Agent Skills | MCP-004 | Sprint 3 | Enables agents to gather competitive intelligence, analyze market positioning, and summarize findings into structured reports |
| SKL-005 | Content Audit Skill | In Development | Antonio James | $12 one-time | Agent Skills | MCP-003 | Sprint 2 | Gives agents the ability to review existing content libraries for gaps, SEO health, tone consistency, and repurposing opportunities |

---

### 4. Prompt Packs

| ID | Name | Status | Owner | Price | Category | Dependencies | Roadmap Phase | Description |
|---|---|---|---|---|---|---|---|---|
| PRP-001 | Business Launch Pack | In Development | Antonio James | $27 one-time | Prompt Packs | None | Sprint 2 | 25+ field-tested prompts for validating, naming, positioning, and launching a new business using AI tools |
| PRP-002 | Content Creation Pack | Ready | Antonio James | $19 one-time | Prompt Packs | None | Sprint 1 | 30+ prompts for generating blog posts, social captions, email sequences, and video scripts optimized for Black creators |
| PRP-003 | SEO Pack | Concept | Antonio James | $22 one-time | Prompt Packs | None | Sprint 3 | 20+ prompts for on-page SEO, meta descriptions, internal linking strategy, and search-intent content planning |
| PRP-004 | AI Strategy Pack | Concept | Antonio James | $29 one-time | Prompt Packs | None | Sprint 4 | 20+ executive-level prompts for building AI roadmaps, evaluating tools, and integrating AI into business operations |

---

### 5. Blueprints

| ID | Name | Status | Owner | Price | Category | Dependencies | Roadmap Phase | Description |
|---|---|---|---|---|---|---|---|---|
| BPR-001 | AI Business Blueprint | In Development | Antonio James | $47 one-time | Blueprints | PRP-001 | Sprint 2 | End-to-end playbook for launching an AI-powered business including toolstack, workflows, and monetization model |
| BPR-002 | Marketing Blueprint | Concept | Antonio James | $37 one-time | Blueprints | PRP-002, SKL-001 | Sprint 3 | Step-by-step marketing system for Black-owned businesses using AI tools for content, SEO, and audience growth |
| BPR-003 | Monetization Blueprint | Concept | Antonio James | $47 one-time | Blueprints | BPR-001 | Sprint 4 | Structured framework for identifying, packaging, and pricing digital products and services built with AI |
| BPR-004 | Technical Architecture Blueprint | Concept | Antonio James | $57 one-time | Blueprints | MCP-001 | Sprint 5 | Developer-facing blueprint for building scalable AI-powered SaaS products using the MIT-recommended stack |

---

### 6. Courses

| ID | Name | Status | Owner | Price | Category | Dependencies | Roadmap Phase | Description |
|---|---|---|---|---|---|---|---|---|
| CRS-001 | AI for Entrepreneurs | In Development | Antonio James | $197 one-time | Courses | None | Sprint 3 | Beginner-to-intermediate course teaching Black entrepreneurs how to use AI tools to launch, grow, and automate their businesses |
| CRS-002 | Build With Claude | Concept | Antonio James | $297 one-time | Courses | CRS-001 | Sprint 4 | Hands-on course for building custom Claude-powered agents and workflows without requiring a computer science background |
| CRS-003 | Monetize Your AI Skills | Concept | Antonio James | $247 one-time | Courses | CRS-001 | Sprint 5 | Practical course on packaging AI expertise into productized services, digital products, and recurring revenue streams |

> **Note:** Course pricing reflects introductory launch pricing. Post-launch pricing may increase by 30–50%. Bundle pricing with membership to be evaluated at Sprint 4 planning.

---

### 7. Templates

| ID | Name | Status | Owner | Price | Category | Dependencies | Roadmap Phase | Description |
|---|---|---|---|---|---|---|---|---|
| TPL-001 | Brand Kit Template | Ready | Antonio James | $15 one-time | Templates | None | Sprint 1 | Figma and doc-based brand kit template pre-structured for AI tools businesses with color, type, and voice sections |
| TPL-002 | Business Plan Template | In Development | Antonio James | $19 one-time | Templates | None | Sprint 2 | AI-fillable business plan template with embedded prompts for each section, optimized for solo founders and small teams |
| TPL-003 | Content Calendar Template | Ready | Antonio James | $12 one-time | Templates | None | Sprint 1 | Notion-based content calendar template with AI prompt columns for weekly content planning across platforms |
| TPL-004 | Agent Prompt Template | In Development | Antonio James | $17 one-time | Templates | None | Sprint 2 | Structured template for writing, testing, and documenting custom agent system prompts with version control fields |

---

### 8. Memberships

| ID | Name | Status | Owner | Price | Category | Dependencies | Roadmap Phase | Description |
|---|---|---|---|---|---|---|---|---|
| MBR-001 | Free Tier | Live | Antonio James | Free | Memberships | None | Sprint 1 | Community access, limited marketplace browsing, and 2 free prompt pack downloads per month with no credit card required |
| MBR-002 | Pro Membership | In Development | Antonio James | $29/mo or $249/yr | Memberships | MCP-001, MCP-002, MCP-003 | Sprint 2 | Full marketplace access, MCP server access (Supabase, Analytics, Content), 20% discount on all one-time purchases, and community Discord access |
| MBR-003 | Elite Membership | Concept | Antonio James | $99/mo or $849/yr | Memberships | MCP-001, MCP-002, MCP-003, MCP-004 | Sprint 3 | Everything in Pro plus Marketplace MCP access, early access to new agents and courses, monthly 1:1 office hours, and white-glove onboarding |

> **Membership Inclusions Summary:**
> - **Free:** Browse marketplace, 2 prompt pack downloads/mo, community access
> - **Pro:** All Free benefits + MCP-001, MCP-002, MCP-003 access + 20% discount on one-time products + Discord
> - **Elite:** All Pro benefits + MCP-004 access + early access + monthly office hours + onboarding support

---

## Monetization Summary

| Category | SKU Count | Pricing Model | Estimated Revenue Range |
|---|---|---|---|
| AI Agents | 5 | Monthly subscription ($19–$59/mo) | $19–$59 per user/mo |
| MCP Servers | 4 | Membership-gated (no standalone sale) | Included in MBR-002 / MBR-003 |
| Agent Skills | 5 | One-time purchase ($12–$18) | $60–$90 per user (full set) |
| Prompt Packs | 4 | One-time purchase ($19–$29) | $87 per user (full set) |
| Blueprints | 4 | One-time purchase ($37–$57) | $188 per user (full set) |
| Courses | 3 | One-time purchase ($197–$297) | $741 per user (full set) |
| Templates | 4 | One-time purchase ($12–$19) | $63 per user (full set) |
| Memberships | 3 tiers | Free / $29/mo / $99/mo | $0–$99 per user/mo |
| **TOTAL** | **32 SKUs** | **Mixed** | **$1,238+ per fully engaged user (excl. subscriptions)** |

---

## Bundling Strategy Notes

**Recommended Bundles (to be priced at Sprint 3 planning):**

1. **Starter Bundle** — Brand Kit Template + Content Calendar Template + Content Creation Pack + Business Launch Pack → Target price: $59 (saves ~$18)
2. **Launch Stack** — AI Business Blueprint + Business Plan Template + Business Launch Pack + Launch Agent (3-mo subscription) → Target price: $149
3. **Creator Bundle** — Social Media Agent (3-mo) + Brand Voice Skill + Content Creation Pack + Content Calendar Template → Target price: $89
4. **Builder Bundle** — Build With Claude (course) + Code Review Skill + Agent Prompt Template + Technical Architecture Blueprint → Target price: $297
5. **All-Access Annual** — Elite Membership (annual) + all Courses + all Blueprints → Target price: $1,497

**Bundling Principles:**
- Bundles should save 15–25% vs. buying components individually
- Every bundle should include at least one recurring-revenue or membership component to build LTV
- Limit active bundle offers to 3–4 at any time to avoid decision paralysis
- Black Friday / launch week bundles can go deeper (30–40% off) for a limited window

---

## Asset Ownership Policy

All assets in this registry are owned by Melanated In Tech / Antonio James unless explicitly noted. Agent-created assets (SKUs where an AI agent contributed substantially to the build) should be noted in the Owner field as `[AgentName] / Antonio James` to distinguish AI-assisted from fully human-built products.

---

## Next Review Date

**Scheduled Review: Sprint 3 Kickoff — estimated July 1, 2026**

Review agenda:
- Update statuses for all Sprint 2 deliverables
- Confirm pricing for memberships before Pro launch
- Evaluate which bundles to activate at launch
- Add any new SKUs identified during Sprint 2 development
- Confirm MCP server access tiers before MBR-002 goes live

---

*Last updated: June 3, 2026 — Antonio James*
*Document owner: Antonio James, Melanated In Tech*
