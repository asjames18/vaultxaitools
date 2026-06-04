# Templates — Melanated In Tech

> **North Star:** Melanated In Tech is building the world's most practical ecosystem for AI Agents, MCP Servers, Agent Skills, Automation Systems, and Agent Commerce. Every decision should move the platform closer to becoming the trusted place where people learn, build, deploy, buy, sell, and scale AI-powered systems.

---

## Purpose

The `/templates` directory contains **reusable document and prompt templates** that agents copy and fill out. Templates reduce time-to-first-draft and ensure consistent structure.

---

## Available Templates

| Template | File | Used By | Use For |
|----------|------|---------|---------|
| ADR Template | `adr-template.md` | Technical, Product | Architecture Decision Records |
| PRD Template | `prd-template.md` | Product | Feature specs |
| Content Brief | `content-brief-template.md` | SEO | Briefing Content Agent |
| Product Listing | `product-listing-template.md` | Marketplace | New product entries |
| Handoff Report | `handoff-template.md` | All | Session handoffs |
| Decision Log Entry | `decision-log-template.md` | All | Logging decisions |
| Event Brief | `event-brief-template.md` | Community | Planning events |

---

## How Templates Work

Every template uses `[BRACKETED]` placeholders. Replace every placeholder before using:

```
[DATE] → 2026-06-15
[FEATURE NAME] → "Course Enrollment Flow"
[AGENT NAME] → "Technical Agent"
```

Never submit a template with unfilled brackets. Either fill it or delete the field.
