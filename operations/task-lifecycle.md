# Task Lifecycle — Melanated In Tech Execution OS

Every unit of work at MIT follows a structured lifecycle from raw idea to measured outcome. This document defines each stage, ownership, and how AI agents participate.

---

## Stages Overview

```
Idea → Backlog → PRD → Review → Build → Test → Documentation → Release → Measure
```

---

## Stage 1: Idea

**Entry criteria:** Any team member or AI agent identifies a problem, opportunity, or user request.

**Work:** Capture the idea in Notion with a one-paragraph description, the problem it solves, and rough effort estimate. Tag with category (feature, fix, content, infrastructure).

**Exit criteria:** Idea is logged with enough context for someone else to understand it cold.

**Owner:** Anyone — human or AI agent.

**AI participation:** Agents scan user feedback, support tickets, and usage data weekly to surface ideas automatically. Each agent-submitted idea includes supporting data.

---

## Stage 2: Backlog

**Entry criteria:** Idea has been logged and minimally validated (not a duplicate, aligns with roadmap themes).

**Work:** Product owner scores the item using RICE (Reach, Impact, Confidence, Effort). Item is tagged by quarter target and product area.

**Exit criteria:** Item has a RICE score, owner, and quarter label.

**Owner:** Product agent (AI) drafts scoring; human PO approves.

---

## Stage 3: PRD (Product Requirements Document)

**Entry criteria:** Item is selected for upcoming sprint during planning.

**Work:** A PRD is written covering: problem statement, success metrics, user stories, acceptance criteria, non-goals, and open questions.

**Exit criteria:** PRD reviewed and approved by at least one human and one AI agent reviewer.

**Owner:** Human lead author; AI writing agent drafts initial version from backlog notes.

---

## Stage 4: Review

**Entry criteria:** PRD is complete and shared for async review.

**Work:** Stakeholders (human + AI) leave comments within 48 hours. Conflicts are resolved. Final PRD is locked.

**Exit criteria:** PRD marked "Approved." No open blocking questions.

**Owner:** Product owner facilitates. AI review agent checks for missing acceptance criteria and contradictions.

---

## Stage 5: Build

**Entry criteria:** Approved PRD, task broken into subtasks in Linear, developer/agent assigned.

**Work:** Code written, reviewed via PR, merged to staging branch. Agents handle boilerplate, test scaffolding, and docs stubs.

**Exit criteria:** All subtasks complete. PR merged. Staging deploy green.

**Owner:** Engineering lead (human or AI agent, depending on task type).

---

## Stage 6: Test

**Entry criteria:** Feature deployed to staging.

**Work:** QA checklist executed. Automated test suite runs. Edge cases validated manually. Accessibility checked.

**Exit criteria:** Zero P0/P1 bugs open. QA sign-off recorded.

**Owner:** QA agent runs automated suite; human spot-checks critical paths.

---

## Stage 7: Documentation

**Entry criteria:** Feature passes QA.

**Work:** User-facing docs, API docs, internal runbooks, and changelog entry written or updated.

**Exit criteria:** Docs reviewed and published to staging doc site.

**Owner:** Docs agent drafts; human editor reviews.

---

## Stage 8: Release

**Entry criteria:** Docs complete. Release checklist passed. Release window confirmed.

**Work:** Feature shipped to production per the release process. Announcement drafted and scheduled.

**Exit criteria:** Feature live in production. Zero regressions detected in first 30 minutes.

**Owner:** Release manager (human) executes; deploy agent monitors.

---

## Stage 9: Measure

**Entry criteria:** Feature has been live for 7 days.

**Work:** Analytics agent pulls metrics against success criteria defined in PRD. Report generated and shared.

**Exit criteria:** Metrics report published. Decision made: iterate, scale, or deprecate.

**Owner:** Analytics agent generates report; human PO makes decision.

---

## AI Agent Participation Summary

| Stage | Agent Role |
|---|---|
| Idea | Surface ideas from data |
| Backlog | Draft RICE scores |
| PRD | Write first draft |
| Review | Flag gaps and contradictions |
| Build | Code, tests, scaffolding |
| Test | Run automated suite |
| Documentation | Draft all docs |
| Release | Monitor deploy health |
| Measure | Pull and report metrics |
