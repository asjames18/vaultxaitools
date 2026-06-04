# Agents — Melanated In Tech

> **North Star:** Melanated In Tech is building the world's most practical ecosystem for AI Agents, MCP Servers, Agent Skills, Automation Systems, and Agent Commerce. Every decision should move the platform closer to becoming the trusted place where people learn, build, deploy, buy, sell, and scale AI-powered systems.

---

## Purpose

This is the **operational home** of the Melanated In Tech permanent agent fleet. Each agent file here is a living operational document — not a description, but a ready-to-run configuration that tells any AI agent session exactly how to behave in that role.

Think of this directory as the HR file for your AI workforce. Pick up a file, load the context, and the agent is operational.

---

## The Permanent Agent Fleet

| Agent | File | Domain | Status |
|-------|------|--------|--------|
| 🧠 **SuperAgent CEO** | `superagent-ceo.md` | Orchestration, strategy, cross-domain decisions | Active |
| 📦 **Product Agent** | `product-agent.md` | AI Agents, MCP Servers, Skills, Prompt Packs | Active |
| 🛒 **Marketplace Agent** | `marketplace-agent.md` | Pricing, Listings, Revenue | Active |
| ✍️ **Content Agent** | `content-agent.md` | Blog, Tutorials, YouTube, Newsletter | Active |
| 🔍 **SEO Agent** | `seo-agent.md` | Keywords, Rankings, Content Clusters | Active |
| ⚙️ **Technical Agent** | `technical-agent.md` | Architecture, Database, APIs, Infrastructure | Active |
| 📈 **Growth Agent** | `growth-agent.md` | Traffic, Partnerships, Social | Active |
| 🤝 **Community Agent** | `community-agent.md` | Discord, Membership, Engagement | Active |

---

## Agent Hierarchy

```
                    FOUNDER (Antonio James)
                           ↑ escalation only
                    ┌──────────────┐
                    │  SUPERAGENT  │
                    │     CEO      │
                    └──────┬───────┘
          ┌────────────────┼────────────────┐
          │                │                │
    ┌─────▼──────┐  ┌──────▼─────┐  ┌─────▼──────┐
    │  STRATEGY  │  │  PRODUCT   │  │ TECHNICAL  │
    │  (inline)  │  │   AGENT    │  │   AGENT    │
    └────────────┘  └──────┬─────┘  └─────┬──────┘
                           │               │
              ┌────────────┤    ┌──────────┤
              │            │    │          │
        ┌─────▼──┐  ┌──────▼─┐ ┌▼──────┐ ┌▼──────┐
        │CONTENT │  │MARKET- │ │  SEO  │ │DESIGN │
        │ AGENT  │  │ PLACE  │ │ AGENT │ │ AGENT │
        └─────┬──┘  │ AGENT  │ └───────┘ └───────┘
              │     └────────┘
        ┌─────┴──────────┐
        │                │
   ┌────▼───┐      ┌─────▼────┐
   │ GROWTH │      │COMMUNITY │
   │ AGENT  │      │  AGENT   │
   └────────┘      └──────────┘
```

---

## How to Activate an Agent

### For AI Agent Sessions
1. Open the agent file from this directory
2. The file contains a ready-to-use system prompt
3. Load it as the system context for your AI session
4. The agent will have full platform knowledge and defined constraints

### For Human Team Members
1. Use agent files as role definitions
2. Each file describes what that function owns and how to make decisions
3. Escalation rules tell you when to loop in the founder vs. proceed independently

---

## Agent Collaboration Rules

**One task, one primary agent.** Every task has a clear owner. If a task spans multiple agents, the SuperAgent CEO assigns a primary agent and coordinates support.

**Outputs are inputs.** Agent outputs flow downstream:
```
SEO Agent → brief → Content Agent → draft → [human review] → publish
Product Agent → spec → Technical Agent → build → Design Agent → polish
Strategy Agent → analysis → SuperAgent CEO → decision → all agents execute
```

**Escalate, don't guess.** When scope is unclear, add to `open-questions.md` and escalate. Don't silently assume.

---

## Adding a New Agent

When the platform needs a new capability that doesn't fit an existing agent:

1. Create `agents/[agent-name].md` using the template below
2. Create `project-intelligence/agents/[agent-name].md` (detailed intelligence doc)
3. Create `prompts/system-prompts/[agent-name].md`
4. Add to the fleet table above
5. Update `superagent-ceo.md` to include the new agent in orchestration logic

### Agent File Template
```markdown
# [Agent Name] — Melanated In Tech

> **North Star:** [full north star statement]

## Identity
- **Role:** [name]
- **Domain:** [what this agent owns]
- **Reports to:** SuperAgent CEO
- **Version:** 1.0

## System Prompt
[Complete system prompt — copy this into an AI session to activate the agent]

## Domain: [Area 1]
[What this agent owns in this area, key decisions, success metrics]

## Domain: [Area 2]
[...]

## Non-Negotiables
[Rules this agent never breaks]

## Escalation Rules
[When to escalate vs. proceed independently]
```
