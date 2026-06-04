# Melanated In Tech — Project Intelligence System

> **North Star:** Melanated In Tech is building the world's most practical ecosystem for AI Agents, MCP Servers, Agent Skills, Automation Systems, and Agent Commerce. Every decision should move the platform closer to becoming the trusted place where people learn, build, deploy, buy, sell, and scale AI-powered systems.

---

> **For AI agents, developers, designers, marketers, and operators.**
> This directory is the single source of truth for every decision, system, and direction on the Melanated In Tech platform.
> Start here. Stay oriented. Build with confidence.

---

## What This Is

The Project Intelligence System (PIS) is a living knowledge base that allows **any contributor — human or AI — to onboard in under 10 minutes** and work productively without needing to ask the founder for context.

It captures:
- What the project is and why it exists
- Every architectural and strategic decision made (and why)
- The full product, content, marketplace, and technical systems
- Defined agent roles and responsibilities
- Current state, open questions, and future direction

---

## Start Here (Reading Order by Role)

### New AI Agent
1. [`agent-onboarding.md`](./agent-onboarding.md) — **Read this first. Everything you need in 10 minutes.**
2. [`current-state.md`](./current-state.md) — What exists, what's done, what's blocked
3. [`technical-system.md`](./technical-system.md) — Stack, security rules, code standards
4. Your specific agent doc in [`/agents/`](./agents/)

### Developer
1. [`project-context.md`](./project-context.md) — Full platform overview
2. [`technical-system.md`](./technical-system.md) — Stack, architecture, security
3. [`adrs/`](./adrs/) — Why key decisions were made
4. [`roadmap.md`](./roadmap.md) — What to build and in what order

### Designer
1. [`brand-system.md`](./brand-system.md) — Colors, typography, voice, tone
2. [`product-ecosystem.md`](./product-ecosystem.md) — All products and how they connect
3. [`vision.md`](./vision.md) — Platform direction and principles

### Marketer / Content Creator
1. [`vision.md`](./vision.md) — Mission, brand promise, audience
2. [`brand-system.md`](./brand-system.md) — Voice, tone, CTAs, messaging
3. [`content-system.md`](./content-system.md) — Pillars, cadence, channels, repurposing
4. [`seo-system.md`](./seo-system.md) — SEO strategy and keyword priorities

### Strategist / Operator
1. [`business-model.md`](./business-model.md) — Revenue engines, pricing, projections
2. [`marketplace-system.md`](./marketplace-system.md) — Full marketplace architecture
3. [`roadmap.md`](./roadmap.md) — 90-day and long-term milestones
4. [`open-questions.md`](./open-questions.md) — Decisions still to be made

---

## Directory Map

```
/project-intelligence
│
├── README.md                    ← You are here
├── agent-onboarding.md          ← Start for all new agents
├── current-state.md             ← Live platform state (update regularly)
├── future-state.md              ← 3-year vision
├── knowledge-graph.md           ← Entity relationships across the platform
│
├── Core Context
│   ├── project-context.md       ← What this platform is
│   ├── vision.md                ← Mission, values, brand promise
│   ├── business-model.md        ← Revenue, pricing, projections
│   ├── brand-system.md          ← Brand identity and voice
│   ├── roadmap.md               ← Build order and milestones
│   ├── open-questions.md        ← Unresolved decisions
│   └── future-opportunities.md  ← Untapped directions
│
├── Product & Systems
│   ├── product-ecosystem.md     ← All 5 platform pillars
│   ├── marketplace-system.md    ← Marketplace architecture
│   ├── content-system.md        ← Content strategy
│   ├── seo-system.md            ← SEO audit and strategy
│   └── technical-system.md      ← Stack, security, data model
│
├── Architecture
│   ├── architecture-decisions.md ← Summary of all ADRs
│   └── adrs/
│       ├── ADR-001-platform-positioning.md
│       ├── ADR-002-ai-agent-marketplace.md
│       ├── ADR-003-mcp-marketplace.md
│       ├── ADR-004-content-strategy.md
│       └── ADR-005-technical-stack.md
│
└── Agent Intelligence
    ├── agent-roles.md           ← Overview of all agent roles
    ├── agent-memory.md          ← Shared state agents must persist
    └── agents/
        ├── superagent.md
        ├── strategy-agent.md
        ├── product-agent.md
        ├── seo-agent.md
        ├── content-agent.md
        ├── marketplace-agent.md
        ├── technical-agent.md
        └── design-agent.md
```

---

## Maintenance Rules

| Rule | Detail |
|------|--------|
| **Update `current-state.md` after every sprint** | It must always reflect reality, not aspirations |
| **Create a new ADR before making major decisions** | Record context + alternatives + reasoning |
| **Agent memory lives in `agent-memory.md`** | Cross-session state that must not be lost |
| **Open questions belong in `open-questions.md`** | Never silently assume; document unknowns |
| **Never delete ADRs** | Even superseded ones — history matters |

---

## Project Quick Stats

| Item | Value |
|------|-------|
| **Platform Name** | Melanated In Tech |
| **Live Domain** | melanatedintech.com |
| **Codebase Path** | `E:\vaultxaitools` |
| **Founder** | Antonio James — asjames18@gmail.com |
| **Stack** | Next.js 15 + Supabase + Vercel |
| **Current Phase** | Phase 1 — Foundation Build |
| **Year 1 Revenue Target** | $170K ARR |
| **Year 3 Revenue Target** | $1.6M ARR |
| **Last Updated** | 2026-06-03 |

---

> *"We give you everything you need to go from AI curious to AI sovereign."*
