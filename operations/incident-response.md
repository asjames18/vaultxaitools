# Incident Response — Melanated In Tech

## Overview

When production breaks, MIT responds fast and systematically. This document defines severity levels, roles, communication templates, and post-mortem process. The culture is blameless: incidents are system failures, not personal failures.

---

## Severity Levels & Response SLAs

| Priority | Definition | Response Time | Resolution Target |
|----------|-----------|--------------|-------------------|
| **P0** | Site completely down; no users can access the platform | 15 minutes | 2 hours |
| **P1** | Major feature broken (checkout, auth, marketplace listing) | 30 minutes | 4 hours |
| **P2** | Degraded performance or partial feature failure; workaround exists | 2 hours | 24 hours |
| **P3** | Minor bug, cosmetic issue, or non-critical error | Next business day | Next sprint |

P0 and P1 incidents override all sprint work until resolved.

---

## Roles

**Incident Commander (IC)**
- Owns the incident end-to-end
- Declares severity level
- Coordinates all response activity and makes final decisions
- Writes the post-mortem
- Default: Antonio James (or designated human lead on call)

**Technical Lead**
- Investigates root cause
- Executes fixes and rollbacks
- Reports findings to the IC every 30 minutes during active P0/P1
- Can be a human engineer or an AI agent operating under human supervision

**Communicator**
- Drafts and sends all external and internal communications
- Updates the status page
- Monitors social channels for user-reported issues
- Keeps all stakeholders informed without over-communicating

---

## Communication Templates

### P0 — Site Down (initial, within 15 min)
> **[INCIDENT] Platform Outage — P0**
> We are currently experiencing a platform-wide outage. Our team is actively investigating. We will provide an update within 30 minutes. We apologize for the disruption.

### P1 — Major Feature Broken (initial, within 30 min)
> **[INCIDENT] Service Degradation — P1**
> We are aware of an issue affecting [feature name]. Our team is actively working to resolve it. Estimated impact: [describe]. We will update this notice every hour until resolved.

### Resolution Notice (all severities)
> **[RESOLVED] [Incident Name]**
> The issue affecting [feature] has been resolved as of [time]. Root cause: [brief description]. We will publish a full post-mortem within 5 business days. Thank you for your patience.

### Internal Slack Alert (P0/P1 only)
> @channel P[X] INCIDENT ACTIVE — [short description]. IC: [name]. War room: [link]. Status: Investigating.

---

## Incident Response Steps

1. **Detect** — Alert triggered via Vercel/Supabase monitoring, user report, or internal discovery
2. **Declare** — IC assigns severity within 15 minutes of detection
3. **Assemble** — IC, Technical Lead, and Communicator notified immediately
4. **Communicate** — Initial notice published (template above) within SLA window
5. **Investigate** — Technical Lead pulls logs (Vercel, Supabase, Stripe), identifies blast radius
6. **Mitigate** — Fastest safe action first (rollback, feature flag, DNS change)
7. **Resolve** — Fix deployed, validated, and confirmed stable
8. **Communicate resolution** — Resolution notice sent to all channels
9. **Post-mortem** — Written within 5 business days

---

## Post-Mortem Template

```
## Incident Post-Mortem: [Title]

**Date:** [YYYY-MM-DD]
**Severity:** P[X]
**Duration:** [start time] — [end time] ([total minutes])
**Incident Commander:** [name]

### Summary
[2-3 sentence description of what happened and impact]

### Timeline
- [HH:MM] — [event]
- [HH:MM] — [event]

### Root Cause
[Technical explanation of what failed and why]

### Contributing Factors
- [Factor 1]
- [Factor 2]

### Resolution
[What was done to fix it]

### Action Items
| Action | Owner | Due Date |
|--------|-------|----------|
| [item] | [who] | [date] |

### What Went Well
- [item]

### What We'll Do Differently
- [item]
```

---

## Prevention Tracking

- All post-mortem action items are tracked in Linear under the `Reliability` label
- Action items from P0 and P1 incidents are Must Haves in the next sprint
- A monthly reliability review covers: incident count by severity, mean time to resolution (MTTR), repeat incidents
- AI agents may flag code patterns or configuration drift that correlate with past incidents during code review
- No individual is blamed for incidents; contributing factors are system and process issues
