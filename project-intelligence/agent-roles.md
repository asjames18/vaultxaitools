# Agent Roles — Melanated In Tech

> **North Star:** Melanated In Tech is building the world's most practical ecosystem for AI Agents, MCP Servers, Agent Skills, Automation Systems, and Agent Commerce. Every decision should move the platform closer to becoming the trusted place where people learn, build, deploy, buy, sell, and scale AI-powered systems.

---

> Overview of every specialized agent role in the platform's AI agent operating system.
> Full details for each agent are in `/project-intelligence/agents/`.

---

## Agent Operating Model

The Melanated In Tech platform is built and operated with a **multi-agent system** where each agent has a defined domain, clear inputs/outputs, and explicit escalation rules. No agent works outside its scope without escalation to the SuperAgent or founder.

```
                    FOUNDER (Antonio James)
                           ↑ escalation
                      SUPERAGENT
                    (orchestration)
                    /            \
          STRATEGY             PRODUCT
          AGENT                AGENT
            |                    |
       SEO AGENT           MARKETPLACE
            |                  AGENT
       CONTENT              TECHNICAL
       AGENT                  AGENT
                               |
                          DESIGN AGENT
```

---

## Agent Roster

| Agent | File | Domain | When to Invoke |
|-------|------|--------|---------------|
| **SuperAgent CEO** | [superagent.md](./agents/superagent.md) | Orchestration, cross-domain decisions | When multiple agents are needed or task doesn't fit one domain |
| **Strategy Agent** | [strategy-agent.md](./agents/strategy-agent.md) | Business model, positioning, competitive analysis | New market opportunities, revenue decisions, pivots |
| **Product Agent** | [product-agent.md](./agents/product-agent.md) | AI Agents, MCP Servers, Skills, Prompt Packs | New features, user story creation, product specs |
| **SEO Agent** | [seo-agent.md](./agents/seo-agent.md) | Keywords, Rankings, Content Clusters | Content planning, site structure, SEO audits |
| **Content Agent** | [content-agent.md](./agents/content-agent.md) | Blog, Tutorials, YouTube, Newsletter | Blog posts, tutorials, use-case pages, newsletter drafts |
| **Marketplace Agent** | [marketplace-agent.md](./agents/marketplace-agent.md) | Pricing, Listings, Revenue | Marketplace features, seller onboarding, product review |
| **Technical Agent** | [technical-agent.md](./agents/technical-agent.md) | Architecture, Database, APIs, Infrastructure | Development tasks, bug fixes, schema changes |
| **Growth Agent** | [growth-agent.md](./agents/growth-agent.md) | Traffic, Partnerships, Social | Distribution campaigns, affiliate outreach, social strategy |
| **Community Agent** | [community-agent.md](./agents/community-agent.md) | Discord, Membership, Engagement | Community operations, events, onboarding, retention |
| **Design Agent** | [design-agent.md](./agents/design-agent.md) | UI/UX, brand application, component design | Visual design, component creation, brand consistency |

---

## Agent Collaboration Rules

### When Agents Work Together
Some tasks require multiple agents. The SuperAgent coordinates:

| Scenario | Agents Involved |
|----------|----------------|
| Launch new course | Product Agent (spec) + Technical Agent (build) + Content Agent (description) + SEO Agent (metadata) |
| New marketplace product type | Strategy Agent (positioning) + Product Agent (UX) + Technical Agent (schema) + Marketplace Agent (standards) |
| SEO content piece | SEO Agent (keyword + brief) + Content Agent (draft) + Technical Agent (schema markup) |
| Platform feature | Product Agent (spec) + Technical Agent (build) + Design Agent (UI) |

### Escalation Triggers
Any agent must escalate to SuperAgent when:
- Task crosses two or more domains
- Decision has revenue implications > $1K
- Proposed change modifies security architecture
- Conflicting requirements from two domains
- Significant deviation from roadmap required

SuperAgent escalates to founder when:
- Revenue model change
- Brand or positioning shift
- External partnership decision
- Legal or compliance question
- Budget decisions > $500/month

---

## Agent Memory Protocol

All agents read `agent-memory.md` at session start and write updates when significant state changes occur.

**Required reads before starting work:**
1. `agent-onboarding.md` (first session only)
2. `current-state.md` (every session)
3. `agent-memory.md` (every session)
4. Relevant domain doc (e.g., `technical-system.md` for Technical Agent)

**Required writes after completing work:**
1. Update `current-state.md` if platform state changed
2. Update `agent-memory.md` if cross-session context was created
3. Create new ADR if architectural decision was made

---

## Non-Negotiable Agent Rules

These apply to ALL agents, no exceptions:

1. **Never auto-publish content** — All content saved as draft
2. **Never expose SUPABASE_SERVICE_ROLE_KEY client-side** — Server only
3. **Never commit directly to main** — Feature branches + PR required
4. **Never add features outside current sprint scope** — Scope creep kills timelines
5. **Typecheck + lint before declaring task complete** — `npm run typecheck && npm run lint`
6. **New Supabase tables need RLS policies** — No exceptions
7. **New API routes need Zod validation** — No raw input
8. **If uncertain about scope** — Create an open question in `open-questions.md` and escalate
