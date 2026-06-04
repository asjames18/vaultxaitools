# Roadmaps — Melanated In Tech

> **North Star:** Melanated In Tech is building the world's most practical ecosystem for AI Agents, MCP Servers, Agent Skills, Automation Systems, and Agent Commerce. Every decision should move the platform closer to becoming the trusted place where people learn, build, deploy, buy, sell, and scale AI-powered systems.

---

## Purpose

This directory contains **all roadmap documents** — phase plans, milestone trackers, sprint plans, and long-range vision documents. Every agent and team member should reference these before starting new work to ensure alignment with current priorities.

The roadmap is the single source of truth for **what to build and in what order**. Scope creep is the #1 project risk. If a task isn't in the roadmap, it requires founder approval before starting.

---

## Directory Structure

```
/roadmaps
├── README.md                          ← You are here
├── master-roadmap.md                  ← Single-page view of all phases
├── phase-1-foundation.md              ← Days 1–30: Clean, launch, first revenue
├── phase-2-launch.md                  ← Days 31–60: Full platform, public launch
├── phase-3-growth.md                  ← Days 61–90: Pro tier, SEO, scale
├── phase-4-depth.md                   ← Months 4–6: Certifications, Bootcamps
├── phase-5-scale.md                   ← Months 7–12: Annual target
├── year-2-roadmap.md                  ← $700K ARR targets
├── year-3-roadmap.md                  ← $1.6M ARR, full team
└── sprints/
    ├── sprint-template.md             ← Standard 2-week sprint template
    ├── sprint-001.md                  ← Sprint 1 plan + outcomes
    └── current-sprint.md             ← Link/copy of active sprint
```

---

## Current Phase: Phase 1 — Foundation

**Status:** Not started
**Target completion:** Day 30
**Goal:** Clean, secure, branded platform live. First revenue. 100+ members.

### Phase 1 Critical Path

```
Day 1:   Fix sitemap + robots.txt (vaultxaitools → melanatedintech) 🔴 URGENT
Day 1-2: Delete debug pages + fix admin auth RBAC
Day 3-4: Brand shell (Tailwind config, Header, Footer, About)
Day 5-6: Draft Supabase schema migration
Day 8-10: Apply full schema migration + RLS policies
Day 11-12: Role middleware + auth gates
Day 15-16: Academy course pages
Day 17-18: Enrollment flow
Day 19:  Stripe integration
Day 20-21: Creator CMS
Day 22-23: Email sequences (Resend)
Day 24-25: SEO metadata + 5 real blog posts
Day 28-29: Admin polish
Day 30:  Smoke test → production deploy
```

---

## Milestone Tracker

| Milestone | Target | Status |
|-----------|--------|--------|
| Sitemap/robots fixed | Day 1 | ❌ |
| Security fixes | Day 7 | ❌ |
| Full schema migration | Day 10 | ❌ |
| Academy MVP | Day 21 | ❌ |
| Stripe integration | Day 19 | ❌ |
| Phase 1 launch | Day 30 | ❌ |
| Marketplace MVP | Day 37 | ❌ |
| Community forums | Day 44 | ❌ |
| Phase 2 soft launch | Day 60 | ❌ |
| Pro membership tier | Day 67 | ❌ |
| Phase 3 targets | Day 90 | ❌ |
| Certifications live | Month 4–6 | ❌ |
| Bootcamp Cohort 1 | Month 5 | ❌ |
| Annual MIT Summit | Year 2 | ❌ |

---

## Revenue Milestones

| Milestone | Target | Status |
|-----------|--------|--------|
| First paid enrollment | Day 20 | ❌ |
| First marketplace sale | Day 40 | ❌ |
| $500 MRR | Day 60 | ❌ |
| $2,500 MRR | Day 90 | ❌ |
| $14,000 MRR ($170K ARR) | Month 12 | ❌ |
| $58,000 MRR ($700K ARR) | Month 24 | ❌ |
| $133,000 MRR ($1.6M ARR) | Month 36 | ❌ |

---

## How to Update Roadmaps

1. **Completions:** Mark milestones ✅ and add actual completion date
2. **Changes:** Document WHY timeline changed, not just what changed
3. **New items:** Require founder approval before adding to Phase 1 or 2
4. **Sprint outcomes:** Log in `sprints/sprint-[NNN].md` after each sprint

**Who controls the roadmap:** Founder only adds to current sprint. Agents execute within sprint scope.
