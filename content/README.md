# Content — Melanated In Tech

> **North Star:** Melanated In Tech is building the world's most practical ecosystem for AI Agents, MCP Servers, Agent Skills, Automation Systems, and Agent Commerce. Every decision should move the platform closer to becoming the trusted place where people learn, build, deploy, buy, sell, and scale AI-powered systems.

---

## Purpose

This directory is the **operational home for all content production** at Melanated In Tech. The content engine is the primary organic acquisition channel — every piece of content either ranks on Google, builds the email list, converts visitors to members, or retains existing community.

Content that doesn't do at least one of those things doesn't get published.

---

## Directory Structure

```
/content
├── README.md                        ← You are here
│
├── blog/
│   ├── README.md                    ← Blog publishing standards
│   ├── drafts/                      ← AI-generated drafts awaiting human review
│   ├── queue/                       ← Approved, scheduled to publish
│   └── published/                   ← Archive of published post briefs
│
├── tutorials/
│   ├── README.md                    ← Tutorial format standards
│   ├── templates/
│   │   ├── how-to-tutorial.md       ← Template for step-by-step tutorials
│   │   ├── deep-dive.md             ← Template for technical deep dives
│   │   └── use-case-page.md         ← Template for use-case landing pages
│   └── drafts/
│
├── youtube/
│   ├── README.md                    ← YouTube content strategy
│   ├── scripts/                     ← Video script drafts
│   └── descriptions/                ← YouTube video descriptions + timestamps
│
├── newsletter/
│   ├── README.md                    ← "The Stack" newsletter guide
│   ├── template.md                  ← Weekly issue template
│   └── archive/                     ← Published issue summaries
│
├── social/
│   ├── README.md                    ← Social content guidelines
│   ├── linkedin/                    ← LinkedIn post drafts
│   ├── twitter/                     ← X/Twitter thread scripts
│   └── shorts/                      ← TikTok/Reels scripts
│
└── pillars/
    ├── README.md                    ← The 8 content pillars
    ├── 01-ai-agents.md              ← Pillar 1: AI Agents — Build, Deploy, Scale
    ├── 02-mcp-servers.md            ← Pillar 2: MCP Servers — Agent Infrastructure
    ├── 03-prompt-engineering.md     ← Pillar 3: Prompt Engineering
    ├── 04-ai-automation.md          ← Pillar 4: AI Automation
    ├── 05-local-ai.md               ← Pillar 5: Local AI
    ├── 06-agent-skills.md           ← Pillar 6: Agent Skills & Tools
    ├── 07-ai-business.md            ← Pillar 7: AI Business Solutions
    └── 08-agent-fleets.md           ← Pillar 8: Agent Fleets & Enterprise AI
```

---

## The Eight Content Pillars

| # | Pillar | Primary Keyword Target | Status |
|---|--------|----------------------|--------|
| 1 | AI Agents — Build, Deploy, Scale | "how to build an AI agent" | 🔴 Not started |
| 2 | MCP Servers — Agent Infrastructure | "MCP server tutorial" | 🔴 Not started |
| 3 | Prompt Engineering | "prompt engineering course" | 🔴 Not started |
| 4 | AI Automation | "n8n AI automation" | 🔴 Not started |
| 5 | Local AI | "Ollama setup guide" | 🔴 Not started |
| 6 | Agent Skills & Tools | "Claude Code skills" | 🔴 Not started |
| 7 | AI Business Solutions | "AI agent consulting" | 🔴 Not started |
| 8 | Agent Fleets & Enterprise AI | "multi-agent system" | 🔴 Not started |

---

## Publishing Standards

### The Tiered Authorship Model

| Tier | Who Writes | Volume | Quality Bar |
|------|-----------|--------|-------------|
| Tier 1 | Core team (human) | 40% | Highest — flagship cornerstones, thought leadership |
| Tier 2 | AI-assisted (human reviews) | 40% | High — tutorials, comparisons, use-case pages |
| Tier 3 | Community contributors | 20% | Curated — real projects, real results only |

### The One Absolute Rule
**No AI content goes live without human review and approval.**

All AI drafts save as `DRAFT` status. A human must:
1. Verify technical accuracy
2. Test all code examples
3. Inject MIT brand voice
4. Add original examples
5. Confirm internal links
6. Then and only then: publish

---

## Publishing Cadence

| Phase | Cadence | Monthly Output |
|-------|---------|---------------|
| Phase 1 (Months 1–3) | 3 articles + 1 tutorial/week + 1 newsletter | ~20 pieces |
| Phase 2 (Months 4–6) | 2 articles + 2 tutorials + 1 use-case/week | ~25 pieces |
| Phase 3 (Month 7+) | 1–2 long-form + 1 tutorial/week + monthly cornerstone refresh | ~15 pieces + refresh |

---

## Newsletter: "The Stack"

**Day:** Tuesday
**Length:** 800–1,200 words
**Format:**
1. Editor's Note (founder voice, personal, direct)
2. This Week in AI (3 curated news items)
3. Tutorial/Deep Dive (excerpt from latest content)
4. Tool of the Week
5. Community Spotlight
6. Opportunity Board
7. CTA (rotates: community / enroll / marketplace)

**Subscribers Target:** 500 (Day 30) → 2,000 (Day 90) → 50,000 (Year 3)

---

## Content Operator: Content Agent

All content production is managed by the **Content Agent**.
See: `agents/content-agent.md` for full agent profile.
See: `prompts/content-prompts/` for ready-to-use content prompts.
