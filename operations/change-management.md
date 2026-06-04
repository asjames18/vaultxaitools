# Change Management — Melanated In Tech

## Overview

Not all changes are equal. MIT distinguishes between routine work (handled within the sprint process) and changes that affect core documents, architecture, pricing, or irreversible system state. The latter require a formal change request. This document defines what triggers a formal process, how to propose changes, and how AI agents participate.

---

## What Requires a Formal Change Request

A formal Request for Change (RFC) is required for any of the following:

| Category | Examples |
|----------|---------|
| **Constitution / Core Docs** | Changes to the MIT Operating Constitution, this ops OS, or foundational strategy docs |
| **Database Schema** | Adding, removing, or renaming tables or columns in production Supabase |
| **Pricing & Business Model** | Changing product prices, commission rates, membership tiers, or payout structures |
| **Authentication & Auth Architecture** | Changes to Clerk configuration, session handling, role definitions, or access control |
| **Third-Party Integrations** | Adding, removing, or fundamentally changing Stripe, Supabase, Clerk, or other core vendors |
| **Public API Contracts** | Breaking changes to any API endpoint consumed by external agents or partners |
| **Agent Permissions & Capabilities** | Expanding what AI agents are authorized to do autonomously |

Routine bug fixes, copy changes, UI tweaks, and non-breaking feature additions do not require an RFC.

---

## RFC Template

```
## RFC: [Title]

**RFC ID:** RFC-[YYYY-MM-DD]-[###]
**Author:** [Human or Agent Name]
**Date Proposed:** [YYYY-MM-DD]
**Category:** [Schema / Pricing / Auth / Constitution / Integration / API / Agent Permissions]
**Status:** Draft | Under Review | Approved | Rejected | Implemented

### Problem Statement
[What problem does this change solve? Why now?]

### Proposed Change
[Precise description of what will change. Include before/after for schema or config changes.]

### Alternatives Considered
[At least one alternative approach and why it was not chosen]

### Impact Assessment
- **Users affected:** [None / Subset / All]
- **Reversibility:** [Reversible / Partially reversible / Irreversible]
- **Downtime required:** [Yes / No / Rolling]
- **Dependencies:** [Other systems, docs, or processes affected]

### Rollback Plan
[How to undo this change if it causes problems]

### Approval Required From
[List approvers based on thresholds below]
```

---

## Approval Thresholds by Change Type

| Change Type | Approvers Required |
|-------------|-------------------|
| Database schema (non-breaking) | Technical Lead |
| Database schema (breaking / data loss risk) | Technical Lead + Antonio James |
| Pricing change | Antonio James |
| Constitution / core docs | Antonio James |
| Auth / access control | Technical Lead + Antonio James |
| Third-party vendor change | Antonio James |
| Agent permissions expansion | Antonio James |
| Public API breaking change | Technical Lead + Antonio James |

All approvals are recorded in the RFC document before implementation begins.

---

## How AI Agents Propose vs. Implement Changes

AI agents are trusted contributors but operate within defined authority boundaries:

**Agents may autonomously:**
- Implement approved RFCs (once a human has approved the RFC)
- Propose RFCs by drafting the full RFC document and flagging it for human review
- Execute reversible changes within an approved sprint scope
- Suggest amendments to existing RFCs

**Agents may NOT autonomously:**
- Approve their own RFCs
- Execute irreversible changes (schema drops, pricing updates, auth changes) without human sign-off
- Expand their own permissions or capabilities
- Modify the change management process itself

The rule: **agents propose, humans approve irreversible changes.** This is non-negotiable regardless of agent confidence level.

---

## Document Version Control Conventions

All core documents (ops OS, strategy docs, architecture docs) follow these conventions:

- **Version format:** `vMAJOR.MINOR` — e.g., `v1.3`
- **Major bump:** Structural changes, new sections, or changes to core policy
- **Minor bump:** Clarifications, additions, or corrections that don't change policy
- Every document includes a version number and last-updated date in its header or footer
- Changes to documents tracked by RFC are committed with the RFC ID in the git commit message: `docs: update pricing tiers per RFC-2026-06-03-001`
- Git history serves as the audit log; no separate change log is maintained for docs
- The `main` branch is always the source of truth; drafts live in feature branches until approved
