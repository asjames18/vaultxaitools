# Product Vision

**Product:** Melanated In Tech  
**Last updated:** 2026-06-02  
**Status:** Active — AI and tech education platform with curated tools directory

---

## Mission

Help learners, builders, and entrepreneurs discover, evaluate, and use the best AI tools, automation platforms, and development resources through a curated, quality-focused directory with practical education content.

## Target Users

| Persona | Need |
|---------|------|
| **Beginner / career changer** | Find beginner-friendly AI and tech tools quickly |
| **Creator / entrepreneur** | Compare tools, read reviews, discover automation resources |
| **Admin/curator** | Manage tool catalog, blog, news, sponsored content, workflows |
| **Consulting prospect** | Learn about Melanated In Tech AI education and consulting services |

## Core Value Propositions

1. **Expert curation** — Tools vetted for ministry use, not generic AI hype
2. **Church/media focus** — Categories aligned to video, graphics, streaming, audio, social
3. **Community trust** — Reviews, ratings, trending signals, transparent affiliate disclosure
4. **Operational CMS** — Admin panel for tools, blog, contact, automation, analytics

## Product Boundaries (What This Is NOT)

- Not a gym/athlete/coach management platform
- Not a billing/subscription SaaS (no Stripe, no paid tiers in-app)
- Not an in-app AI chat assistant (AI is used for offline data ingestion scripts)
- Not a separate Express backend (Next.js API routes + Supabase only)

## Strategic Direction

1. **Single source of truth** — Supabase `tools` table as primary catalog; static `data/` as seed/fallback only
2. **Vertical slices** — Complete end-to-end flows before expanding dashboards
3. **Agent-compatible codebase** — Clear domain language, feature folders, documented decisions
4. **Ministry positioning** — Align categories, copy, and schema with church/media domain

## Success Metrics

- Tool discovery → detail view → favorite/review conversion
- Admin publish workflow reliability (draft → review → published)
- Data quality score (via `scripts/data-quality-monitor.js`)
- Build/lint/test CI green on every change
- Page load and SEO performance for tool/category pages

## Non-Goals (Current Phase)

- Payment processing or subscription billing
- Real-time LLM features in the web app
- Multi-tenant gym/team management
- Full rewrite to feature-based `src/` layout (incremental migration only)
