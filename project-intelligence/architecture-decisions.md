# Architecture Decisions — Summary

> **North Star:** Melanated In Tech is building the world's most practical ecosystem for AI Agents, MCP Servers, Agent Skills, Automation Systems, and Agent Commerce. Every decision should move the platform closer to becoming the trusted place where people learn, build, deploy, buy, sell, and scale AI-powered systems.

---

> Index of all Architecture Decision Records (ADRs) for the Melanated In Tech platform.
> Full details are in `/project-intelligence/adrs/`.

---

## What Is an ADR?

An Architecture Decision Record captures:
1. **What** decision was made
2. **Why** it was made (context + alternatives considered)
3. **Tradeoffs** accepted
4. **Future impact** expected

ADRs are never deleted. Even superseded decisions are kept as historical context.

---

## Decision Log

| ADR | Title | Status | Date | Summary |
|-----|-------|--------|------|---------|
| [ADR-001](./adrs/ADR-001-platform-positioning.md) | Platform Positioning | Active | 2026-06 | Built for Black/melanated builders; not a generic AI education platform |
| [ADR-002](./adrs/ADR-002-ai-agent-marketplace.md) | AI Agent Marketplace | Active | 2026-06 | MIT builds a curated marketplace for agents/MCP/prompts vs. generic digital products |
| [ADR-003](./adrs/ADR-003-mcp-marketplace.md) | MCP as Core Content Pillar | Active | 2026-06 | MCP Servers are primary content + marketplace focus vs. legacy automation tools |
| [ADR-004](./adrs/ADR-004-content-strategy.md) | AI-Assisted Content Strategy | Active | 2026-06 | Human-reviewed AI-assisted publishing vs. pure human or pure AI generation |
| [ADR-005](./adrs/ADR-005-technical-stack.md) | Technical Stack Selection | Active | 2026-06 | Next.js 15 + Supabase + Vercel vs. alternatives |

---

## How to Create a New ADR

When a significant architectural or strategic decision needs to be made:

1. Create `/project-intelligence/adrs/ADR-[NNN]-[short-title].md`
2. Use the template below
3. Mark status as `Proposed` → `Active` → `Superseded` (never deleted)
4. Add a row to the table above

### ADR Template

```markdown
# ADR-[NNN]: [Title]

**Date:** YYYY-MM-DD
**Status:** Proposed | Active | Superseded by ADR-[NNN]
**Deciders:** [Who made this decision]

## Context
[What is the situation that requires a decision?]

## Decision
[What was decided?]

## Alternatives Considered
[What other options were evaluated?]

## Why Chosen
[Why this option over the alternatives?]

## Tradeoffs
[What do we accept by making this choice?]

## Future Impact
[What does this enable? What does it constrain?]
```

---

## Architectural Principles (Overarching)

These guide all decisions and don't require individual ADRs:

1. **Revenue before polish** — Features that earn money get built before features that look good
2. **Security is non-negotiable** — No service role keys client-side. RLS on every table. Signed webhook verification.
3. **Scalability by phase** — Don't over-engineer for 10K users when you have 10. Phase infrastructure as users grow.
4. **Supabase-native first** — Use Supabase capabilities before reaching for third-party services
5. **Type safety everywhere** — TypeScript strict mode; generated DB types; Zod on all API inputs
6. **AI-augmented, human-approved** — AI agents assist with content, code, and strategy; humans review before production
7. **Platform not product** — Every build decision should create network effects, not just features
