# Agent Governance — Melanated In Tech

> **North Star:** Melanated In Tech is building the world's most practical ecosystem for AI Agents, MCP Servers, Agent Skills, Automation Systems, and Agent Commerce. Every decision should move the platform closer to becoming the trusted place where people learn, build, deploy, buy, sell, and scale AI-powered systems.

---

## PURPOSE
Define the rules, boundaries, and accountability structures that govern every AI agent working on the Melanated In Tech platform. This document is the enforcement layer of the MIT Agent Operating System.

---

## GOVERNANCE PHILOSOPHY

**Every AI agent is a contractor, not an owner.**

Agents execute within defined boundaries. The founder makes decisions. The platform keeps records. No agent has unchecked authority over any production system, any public-facing content, or any financial transaction.

---

## GOVERNANCE STRUCTURE

```
TIER 1: FOUNDER (Antonio James)
  → Final authority on: revenue model, brand, partnerships, security incidents,
    roadmap priority, architecture changes

TIER 2: SUPERAGENT CEO
  → Authority over: agent routing, coordination, documentation
  → Cannot: commit to main, publish content, change pricing, sign anything

TIER 3: SPECIALIZED AGENTS
  → Authority over: domain-specific work within current sprint scope
  → Cannot: override governance rules, exceed domain scope, skip handoffs
```

---

## ABSOLUTE PROHIBITIONS (No Agent, Ever)

```
🔴 NEVER delete /docs/, /project-intelligence/, or /prompts/ directories
🔴 NEVER delete database tables or data without migration + founder approval
🔴 NEVER change Stripe pricing IDs or product configurations without founder approval
🔴 NEVER change roadmap phase priorities without founder approval
🔴 NEVER make architectural changes without a written ADR
🔴 NEVER publish content (auto-publish is disabled always)
🔴 NEVER expose SUPABASE_SERVICE_ROLE_KEY in client code
🔴 NEVER commit directly to main branch
🔴 NEVER send emails to the MIT list without founder review
🔴 NEVER sign, agree to, or commit to any external partnership
🔴 NEVER remove RLS policies from Supabase tables
🔴 NEVER use --no-verify to skip commit hooks
```

---

## REQUIRED PERMISSIONS TABLE

| Action | Who Can Do It | Documentation Required |
|--------|--------------|----------------------|
| Merge PR to main | Any (after review) | PR description |
| Apply DB migration | Technical Agent | Migration file + RLS + founder aware |
| Change prices in Stripe | Founder only | Decision log entry |
| Add new roadmap item | Founder only | Build queue entry |
| Create new ADR | Technical/Product Agent | ADR file |
| Send newsletter | Founder (reviews first) | Draft in Resend |
| Approve marketplace product | Marketplace Agent | Product review log |
| Create new community channel | Community Agent | Community strategy doc update |
| Change commission rates | Founder only | Decision log + business model update |
| Deploy to production | CI/CD (on main merge) | PR + typecheck + lint |

---

## DECISION LOG REQUIREMENTS

Every significant decision must be logged in `/project-intelligence/decision-log.md`.

A decision is "significant" if:
- It affects revenue (any amount)
- It affects architecture (any part of the system)
- It affects brand or positioning
- It affects the roadmap
- It affects community policy
- It cannot easily be reversed

**Decision log format:**

```
## [Date] — [Decision Title]
- Decision: [what was decided]
- Context: [why this was needed]
- Made by: [who decided]
- Alternatives considered: [list]
- Impact: [what changes as a result]
- Reversible: Yes/No
- ADR: [link if applicable]
```

---

## BUILD QUEUE GOVERNANCE

The build queue (`/roadmaps/build-queue.md`) is the single source of truth for what's being built.

**Rules:**
- Only founder adds new items to the current sprint
- Agents can propose items for future sprints (label: "Proposed — awaiting founder review")
- Every item in "In Progress" must have an assigned agent
- Every completed item must have a handoff note before marking "Done"
- No item moves from "Backlog" to "Current Sprint" without founder approval

---

## DOCUMENTATION ENFORCER RULES

The following documentation must be current at all times. If it's outdated, no agent can claim the platform state is understood.

| Document | Update Trigger | Responsible |
|----------|---------------|-------------|
| `current-state.md` | Any feature ships or any state changes | Completing agent |
| `agent-memory.md` | Any cross-session flag or decision | Completing agent |
| `build-queue.md` | Task status changes | Completing agent |
| `decision-log.md` | Any significant decision | Deciding agent |
| `asset-registry.md` | New product created or published | Marketplace Agent |
| ADR files | Any architectural change | Technical/Product Agent |

**If documentation is not updated, the task is not complete.**

---

## INCIDENT RESPONSE

### Security Incident
1. Stop work immediately
2. Do not fix without founder knowledge
3. Notify: asjames18@gmail.com with subject: "SECURITY INCIDENT — [description]"
4. Document: what was found, what is the risk, what was affected
5. Await founder instruction before any remediation

### Production Down
1. Identify: what's broken (Vercel, Supabase, DNS, code?)
2. Check: Vercel status page, Supabase status page
3. If code-related: identify last deployment, consider rollback
4. Notify: founder immediately
5. Fix: minimal change to restore service, not redesign

### Data Breach / Leak
1. Stop all work
2. Notify founder immediately (asjames18@gmail.com)
3. Document: what data, who may be affected, how it happened
4. Do not notify users without founder direction

---

## GOVERNANCE CHECKLIST (End of Every Session)
- [ ] No governance rules violated
- [ ] All required documentation updated
- [ ] Decision log updated for significant decisions
- [ ] Build queue updated with task status
- [ ] Handoff notes written
- [ ] No unreported security issues
- [ ] All code on feature branch (not main)
- [ ] No auto-published content
