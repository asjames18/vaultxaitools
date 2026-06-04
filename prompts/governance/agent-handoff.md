# Agent Handoff — Melanated In Tech

> **North Star:** Melanated In Tech is building the world's most practical ecosystem for AI Agents, MCP Servers, Agent Skills, Automation Systems, and Agent Commerce. Every decision should move the platform closer to becoming the trusted place where people learn, build, deploy, buy, sell, and scale AI-powered systems.

---

## PURPOSE
The agent handoff is the final required step of every work session. An unhandled session creates invisible context debt that the next agent must pay. A well-written handoff is the difference between a productive next session and 20 minutes of re-orientation.

**A task without a handoff is not a completed task.**

---

## HANDOFF PHILOSOPHY

Write your handoff as if the next person reading it is smart, has zero context about what you just did, and is picking up in 3 days. Because that's exactly what will happen.

---

## MASTER HANDOFF TEMPLATE

```markdown
# Agent Handoff

**Handoff Date:** [YYYY-MM-DD]
**Agent Role:** [SuperAgent CEO / Technical / Content / SEO / etc.]
**Session Goal:** [What this session set out to accomplish]
**Session Status:** ✅ Complete / ⚠️ Partial / 🔴 Blocked

---

## WHAT WAS ACCOMPLISHED

[Specific list — not vague summaries]
  - [Specific thing 1 — with file or URL if applicable]
  - [Specific thing 2]
  - [Specific thing 3]

---

## FILES CHANGED

[Every file touched — created, modified, or deleted]
  Created:
    - [path] — [what it does]
    - [path] — [what it does]
  
  Modified:
    - [path] — [what changed and why]
  
  Deleted (if any):
    - [path] — [why and confirmed safe to delete]

---

## DATABASE CHANGES

[If any DB work was done]
  Migration file: [supabase/migrations/[timestamp]_[description].sql]
  Tables affected: [list]
  RLS policies added: [yes/no — list if yes]
  Types regenerated: [yes/no]

---

## DECISIONS MADE

[List every significant decision made in this session]
  1. [Decision] — Reason: [why]
  2. [Decision] — Reason: [why]
  
  Decision log updated: [yes/no]
  ADR created: [yes/no — ADR-NNN if yes]

---

## CURRENT STATE OF [FEATURE/SYSTEM]

[What state is the thing you worked on in right now?]
[A new agent must be able to pick up without re-reading all your work]

Status: [% complete / specific state]
Next logical step: [exact next action]
Test to verify current state works: [specific test]

---

## WHAT IS IN PROGRESS (NOT DONE)

[If session ended before completion]
  - [Task] — [what's done, what's left, any gotchas]

---

## WHAT IS BLOCKED

[What cannot be completed until something else happens]
  - [Task] — blocked by: [specific blocker]
  - [Task] — needs: [what's required to unblock]
  - [Task] — escalation needed: [yes/no, who]

---

## WHAT THE NEXT AGENT SHOULD DO FIRST

[Specific, actionable — not "continue the work"]

  1. [Specific first action] — [location/file/URL]
  2. [Specific second action]
  3. [Third action if needed]

---

## DOCUMENTATION UPDATED

  - current-state.md: [yes/no — what changed]
  - agent-memory.md: [yes/no — what added]
  - build-queue.md: [yes/no — what changed]
  - decision-log.md: [yes/no — what logged]
  - asset-registry.md: [yes/no — if marketplace work]
  - Other: [list]

---

## OPEN QUESTIONS ADDED

[If any new unresolved questions were discovered]
  - [Question] → Added to open-questions.md: [yes/no]

---

## ESCALATIONS NEEDED

  - [Item] → Needs: [founder / SuperAgent CEO / specific agent]
  - Urgency: [immediate / next session / backlog]

---

## KNOWN RISKS OR GOTCHAS

[Things the next agent should watch out for]
  - [Risk/gotcha 1]
  - [Risk/gotcha 2]

---

*Handoff completed by [Agent Role] on [date]*
```

---

## QUICK HANDOFF (for small tasks)

For tasks under 2 hours with no architecture changes:

```
QUICK HANDOFF — [Agent] — [Date]
Task: [what was done]
Files: [list]
Status: [complete/partial]
Next: [what to do next]
Docs updated: [list]
Escalation: [none / needed for X]
```

---

## HANDOFF QUALITY CHECKLIST
- [ ] What was done is specific (not vague)
- [ ] Every file touched is listed
- [ ] Every decision is documented
- [ ] Current state is described clearly
- [ ] Blocked items have specific blockers named
- [ ] Next action is specific and actionable
- [ ] All documentation is updated (not just "yes" — list what changed)
- [ ] Any security issues noted and escalated
- [ ] No "TODO" left without an owner
