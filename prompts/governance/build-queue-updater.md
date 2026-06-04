# Build Queue Updater — Melanated In Tech

> **North Star:** Melanated In Tech is building the world's most practical ecosystem for AI Agents, MCP Servers, Agent Skills, Automation Systems, and Agent Commerce. Every decision should move the platform closer to becoming the trusted place where people learn, build, deploy, buy, sell, and scale AI-powered systems.

---

## PURPOSE
Maintain the MIT build queue — the single source of truth for what's being built, what's done, and what's next. Every agent reads this. Every agent updates this.

---

## BUILD QUEUE FILE

Location: `/roadmaps/build-queue.md`

---

## BUILD QUEUE FORMAT

```markdown
# MIT Build Queue

> Single source of truth for all platform work.
> Updated after every work session.
> Last Updated: [date]
> Current Phase: Phase [N]
> Phase Goal: [one sentence]

---

## 🔴 CRITICAL (Do These Now — Blocking Everything)

| ID | Task | Owner | Status | Notes |
|----|------|-------|--------|-------|
| C001 | Fix sitemap.xml domain (vaultxaitools → melanatedintech) | Technical Agent | Not Started | Blocking SEO |
| C002 | Fix admin RBAC + service role key | Technical Agent | Not Started | Security: CRITICAL |
| C003 | Delete debug pages | Technical Agent | Not Started | Security: HIGH |

---

## 🟠 CURRENT SPRINT (Active Work)

| ID | Task | Owner | Status | PRD | Effort |
|----|------|-------|--------|-----|--------|
| S001 | [task] | [agent] | In Progress | [link] | [S/M/L] |
| S002 | [task] | [agent] | Blocked | [link] | [S/M/L] |

---

## 🟡 NEXT SPRINT (Approved, Not Started)

| ID | Task | Owner | PRD Needed? | Priority |
|----|------|-------|------------|---------|
| N001 | Academy course pages | Technical + Design | Yes | High |
| N002 | Enrollment flow | Technical | Yes | High |
| N003 | Stripe integration | Technical | No | Critical |

---

## 🔵 BACKLOG (Future Work — Not Yet Prioritized)

| ID | Task | Owner | Notes |
|----|------|-------|-------|
| B001 | Marketplace MVP | Technical | After Academy |
| B002 | Community forums | Technical | Phase 2 |
| B003 | Typesense search | Technical | Replace Fuse.js |

---

## ⚪ PROPOSED (Awaiting Founder Review)

| ID | Task | Proposed By | Rationale | Est. Value |
|----|------|------------|-----------|-----------|
| P001 | [task] | [agent] | [why] | [impact] |

---

## ✅ COMPLETED

| ID | Task | Completed | Agent | Notes |
|----|------|-----------|-------|-------|
| DONE001 | Project Intelligence System | 2026-06-03 | SuperAgent | /project-intelligence/ created |
| DONE002 | Prompt Operating System | 2026-06-03 | SuperAgent | /prompts/ created |
```

---

## TASK STATUS DEFINITIONS

| Status | Meaning |
|--------|---------|
| Not Started | In queue, no agent has started |
| In Progress | Active agent working on it |
| Blocked | Cannot proceed — specific blocker identified |
| In Review | Code/content complete, awaiting review |
| Done | Handoff written, docs updated, merged |

---

## HOW TO UPDATE THE BUILD QUEUE

### When starting a task:
1. Find the task in build queue
2. Change status to "In Progress"
3. Add your agent role as Owner
4. Note start date

### When completing a task:
1. Change status to "Done"
2. Add completion date
3. Write handoff in the Notes field
4. Move to ✅ Completed section

### When discovering a blocker:
1. Change status to "Blocked"
2. Add specific blocker in Notes field
3. Flag in handoff notes and agent-memory.md

### When proposing a new task:
1. Add to ⚪ Proposed section
2. Include rationale and estimated value
3. Wait for founder approval before moving to backlog or sprint

---

## TASK SIZING

| Size | Estimate | Description |
|------|---------|-------------|
| XS | 1-2 hours | Config change, simple bug fix |
| S | Half day | Simple feature, focused change |
| M | 1-3 days | Feature with DB + API + UI |
| L | 1-2 weeks | Complex feature (Academy MVP, Marketplace) |
| XL | 2+ weeks | Platform-level feature (full pillar) |

---

## QUALITY CHECKLIST
- [ ] Every completed task moved to ✅ Completed
- [ ] Every in-progress task has an owner
- [ ] Blocked tasks have specific blockers listed
- [ ] Only founder moves items to Current Sprint
- [ ] Last Updated date is today's date
- [ ] Critical items remain visible at top until resolved
