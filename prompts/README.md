# MIT Prompt Operating System — Melanated In Tech

> **North Star:** Melanated In Tech is building the world's most practical ecosystem for AI Agents, MCP Servers, Agent Skills, Automation Systems, and Agent Commerce. Every decision should move the platform closer to becoming the trusted place where people learn, build, deploy, buy, sell, and scale AI-powered systems.

---

## What This Is

The `/prompts` directory is the **behavioral enforcement layer** of the Melanated In Tech platform. It is not just a prompt library. It is the operating system that ensures every AI agent — coding, marketing, content, product, design, strategy, growth, or community — works from the same mission, standards, governance, documentation rules, and execution framework.

Every prompt here is:
- **Production-ready** — paste into any AI agent and get consistent behavior
- **Reusable** — designed for hundreds of future sessions
- **Compatible** with Claude Code, Codex, Cursor, HyperAgent, Open WebUI, and any future AI agent that reads text
- **Governed** — every prompt enforces the master rules before doing anything else

---

## Folder Structure

```
/prompts
│
├── README.md                          ← You are here
│
├── system/
│   └── mit-os-master-prompt.md        ← LOAD FIRST. Every session. Every agent.
│
├── agents/                            ← Agent-specific system prompts
│   ├── superagent-ceo.md              ← Orchestration and strategy
│   ├── product-agent.md               ← AI Agents, MCP, Skills, Packs
│   ├── technical-agent.md             ← Architecture, DB, APIs, Infrastructure
│   ├── marketplace-agent.md           ← Listings, Pricing, Revenue
│   ├── content-agent.md               ← Blog, Tutorials, YouTube, Newsletter
│   ├── seo-agent.md                   ← Keywords, Rankings, Content Clusters
│   ├── design-agent.md                ← UI/UX, Brand, Components
│   ├── growth-agent.md                ← Traffic, Partnerships, Social
│   └── community-agent.md             ← Discord, Membership, Engagement
│
├── workflows/                         ← Multi-agent workflow coordination
│   └── README.md
│
├── templates/                         ← Reusable document templates
│   └── README.md
│
├── developer/                         ← Technical Agent task prompts
│   ├── developer-startup.md           ← Load at start of every dev session
│   ├── code-review.md                 ← Review code for quality and security
│   ├── refactor-plan.md               ← Plan safe code improvements
│   ├── adr-generator.md               ← Create Architecture Decision Records
│   └── security-review.md             ← Audit for vulnerabilities
│
├── product/                           ← Product Agent task prompts
│   ├── prd-builder.md                 ← Build complete PRDs
│   ├── feature-planning.md            ← Prioritize features for a phase
│   └── product-review.md              ← Verify feature against acceptance criteria
│
├── marketplace/                       ← Marketplace Agent task prompts
│   ├── product-listing-builder.md     ← Write product listings
│   ├── pricing-strategy.md            ← Develop pricing recommendations
│   ├── asset-registry-updater.md      ← Keep MIT product registry current
│   └── seller-program-builder.md      ← Design/improve seller program
│
├── content/                           ← Content Agent task prompts
│   ├── blog-writer.md                 ← Write blog posts and articles
│   ├── tutorial-builder.md            ← Write step-by-step tutorials
│   ├── youtube-script-builder.md      ← Write YouTube video scripts
│   ├── newsletter-builder.md          ← Draft "The Stack" newsletter
│   └── content-repurposer.md          ← Repurpose content across channels
│
├── seo/                               ← SEO Agent task prompts
│   ├── keyword-cluster-builder.md     ← Map keyword clusters for pillars
│   ├── cornerstone-page-builder.md    ← Plan cornerstone content pages
│   ├── internal-linking-builder.md    ← Maintain internal link architecture
│   ├── seo-audit.md                   ← Full technical SEO audit
│   └── metadata-generator.md          ← Generate all page metadata
│
├── design/                            ← Design Agent task prompts
│   ├── homepage-wireframe.md          ← Homepage layout and conversion
│   ├── marketplace-page-wireframe.md  ← Marketplace hub and category pages
│   ├── product-page-wireframe.md      ← Product detail page
│   ├── ui-review.md                   ← Review UI for brand and conversion
│   └── mobile-first-review.md         ← Verify mobile-first design
│
├── growth/                            ← Growth Agent task prompts
│   ├── social-growth-plan.md          ← Monthly social media plan
│   ├── partnership-plan.md            ← Identify and approach partners
│   ├── email-growth-plan.md           ← Build and grow email list
│   └── launch-campaign.md             ← Plan and execute product launches
│
├── community/                         ← Community Agent task prompts
│   ├── community-strategy.md          ← Overall community strategy
│   ├── member-onboarding.md           ← 30-day member onboarding sequence
│   ├── event-planning.md              ← Plan and run community events
│   └── discord-structure.md           ← Discord server architecture
│
└── governance/                        ← Governance and documentation prompts
    ├── agent-governance.md            ← Rules and boundaries for all agents
    ├── agent-handoff.md               ← End-of-session handoff template
    ├── decision-log-updater.md        ← Log significant decisions
    ├── build-queue-updater.md         ← Maintain the build queue
    └── documentation-enforcer.md     ← Verify all docs are updated
```

---

## How to Use This Prompt System

### The 5-Step Load Order

For every work session, load prompts in this sequence:

```
1. MIT OS Master Prompt          → /prompts/system/mit-os-master-prompt.md
   (Always first — establishes mission, rules, context)

2. Agent-Specific Prompt         → /prompts/agents/[your-agent].md
   (Establishes your role, domain, responsibilities)

3. Task Workflow (if multi-agent) → /prompts/workflows/[workflow].md
   (Coordinates multiple agents for complex tasks)

4. Task-Specific Template        → /prompts/[domain]/[task].md
   (Specific instructions for the task at hand)

5. Governance Handoff            → /prompts/governance/agent-handoff.md
   (Complete at end of every session — not optional)
```

### Quick Reference: Which Prompt for Which Task?

| Task | Primary Prompt | Supporting Prompts |
|------|----------------|-------------------|
| Starting a dev session | `developer/developer-startup.md` | `agents/technical-agent.md` |
| Writing a blog post | `content/blog-writer.md` | `agents/content-agent.md` |
| Conducting SEO research | `seo/keyword-cluster-builder.md` | `agents/seo-agent.md` |
| Building a PRD | `product/prd-builder.md` | `agents/product-agent.md` |
| Reviewing code | `developer/code-review.md` | `agents/technical-agent.md` |
| Security audit | `developer/security-review.md` | `agents/technical-agent.md` |
| Creating ADR | `developer/adr-generator.md` | `agents/technical-agent.md` |
| Writing a newsletter | `content/newsletter-builder.md` | `agents/content-agent.md` |
| Creating a tutorial | `content/tutorial-builder.md` | `agents/content-agent.md` + `seo/metadata-generator.md` |
| YouTube script | `content/youtube-script-builder.md` | `agents/content-agent.md` |
| Content repurposing | `content/content-repurposer.md` | `agents/growth-agent.md` |
| SEO audit | `seo/seo-audit.md` | `agents/seo-agent.md` |
| Metadata generation | `seo/metadata-generator.md` | `agents/seo-agent.md` |
| Cornerstone page | `seo/cornerstone-page-builder.md` | `agents/seo-agent.md` + `agents/content-agent.md` |
| Adding marketplace product | `marketplace/product-listing-builder.md` | `agents/marketplace-agent.md` |
| Pricing strategy | `marketplace/pricing-strategy.md` | `agents/marketplace-agent.md` |
| Asset registry update | `marketplace/asset-registry-updater.md` | `agents/marketplace-agent.md` |
| Homepage design | `design/homepage-wireframe.md` | `agents/design-agent.md` |
| UI review | `design/ui-review.md` | `agents/design-agent.md` |
| Mobile review | `design/mobile-first-review.md` | `agents/design-agent.md` |
| Social growth | `growth/social-growth-plan.md` | `agents/growth-agent.md` |
| Product launch | `growth/launch-campaign.md` | `agents/growth-agent.md` + all agents |
| Community strategy | `community/community-strategy.md` | `agents/community-agent.md` |
| Member onboarding | `community/member-onboarding.md` | `agents/community-agent.md` |
| Event planning | `community/event-planning.md` | `agents/community-agent.md` |
| Writing a handoff | `governance/agent-handoff.md` | Always |
| Logging a decision | `governance/decision-log-updater.md` | Always when decisions made |
| Updating build queue | `governance/build-queue-updater.md` | After every session |
| Documentation check | `governance/documentation-enforcer.md` | End of every session |
| Governance review | `governance/agent-governance.md` | For governance questions |

---

## Agent Load Order (By Role)

### Technical Agent Session
```
1. system/mit-os-master-prompt.md
2. agents/technical-agent.md
3. developer/developer-startup.md
4. [task prompt: code-review / adr-generator / security-review / refactor-plan]
5. governance/agent-handoff.md
```

### Content Agent Session
```
1. system/mit-os-master-prompt.md
2. agents/content-agent.md
3. [task prompt: blog-writer / tutorial-builder / newsletter-builder / youtube-script-builder]
4. seo/metadata-generator.md (for any published piece)
5. governance/agent-handoff.md
```

### SEO Agent Session
```
1. system/mit-os-master-prompt.md
2. agents/seo-agent.md
3. [task prompt: keyword-cluster-builder / seo-audit / cornerstone-page-builder / metadata-generator]
4. governance/agent-handoff.md
```

### Marketplace Agent Session
```
1. system/mit-os-master-prompt.md
2. agents/marketplace-agent.md
3. [task prompt: product-listing-builder / pricing-strategy / asset-registry-updater]
4. governance/agent-handoff.md
```

### Growth Agent Session
```
1. system/mit-os-master-prompt.md
2. agents/growth-agent.md
3. [task prompt: social-growth-plan / launch-campaign / partnership-plan / email-growth-plan]
4. governance/agent-handoff.md
```

### Community Agent Session
```
1. system/mit-os-master-prompt.md
2. agents/community-agent.md
3. [task prompt: member-onboarding / event-planning / discord-structure / community-strategy]
4. governance/agent-handoff.md
```

---

## Governance Rules (Summary)

### What Every Agent Must Do
1. Read MIT OS Master Prompt before starting any work
2. Read current-state.md and agent-memory.md for context
3. Check build-queue.md to confirm task is in scope
4. Write a handoff at the end of every session
5. Update documentation after every significant change

### What No Agent Can Ever Do
```
🔴 Delete /docs/, /project-intelligence/, or /prompts/ directories
🔴 Auto-publish any content
🔴 Commit directly to main branch
🔴 Change pricing without founder approval
🔴 Change roadmap priorities without founder approval
🔴 Make architectural changes without an ADR
🔴 Expose SUPABASE_SERVICE_ROLE_KEY in client code
🔴 Sign or agree to any external partnership
🔴 Send emails to MIT's list without founder review
```

### Escalation Hierarchy
```
Security incident → STOP, notify founder immediately
Revenue/pricing change → Escalate to founder before proceeding
Architecture change → Create ADR, then proceed
Cross-domain decision → Escalate to SuperAgent CEO
Scope is unclear → Flag in open-questions.md, await clarification
```

---

## Platform Quick Reference

| Field | Value |
|-------|-------|
| Platform | Melanated In Tech |
| Domain | melanatedintech.com |
| Codebase | `E:\vaultxaitools` |
| Founder | Antonio James — asjames18@gmail.com |
| Stack | Next.js 15 + Supabase + Vercel |
| Current Phase | Phase 1 — Foundation Build |
| Brand | `#0A0A0A` bg + `#00FF41` accent |
| Mission | Close the AI wealth gap |

---

## Recommended Starting Action

New to the project? Do this first:

```
1. Read /prompts/system/mit-os-master-prompt.md (this is your OS)
2. Read /project-intelligence/agent-onboarding.md (10-minute orientation)
3. Read /project-intelligence/current-state.md (what exists today)
4. Load your role prompt from /prompts/agents/[role].md
5. Check /roadmaps/build-queue.md (what needs to be done)
6. Start the highest priority CRITICAL or CURRENT SPRINT task
```

---

*Built by the Melanated In Tech SuperAgent CEO. Updated 2026-06-03.*
*This is the behavioral enforcement layer for every future agent session.*
