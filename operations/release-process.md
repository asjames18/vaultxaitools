# Release Process — Melanated In Tech

## Overview

MIT ships continuously to production using a structured release process. All releases go through a pre-release checklist, staged deployment, and post-release validation. The goal is fast, safe shipping — not bureaucracy.

---

## Release Types

| Type | Trigger | Example |
|------|---------|---------|
| **Patch** (x.x.N) | Bug fixes, copy changes, minor UI corrections | Fix broken checkout button |
| **Minor** (x.N.0) | New features, non-breaking API changes | Add agent marketplace filters |
| **Major** (N.0.0) | Breaking changes, schema migrations, auth changes | Migrate to new pricing model |

Patch releases can ship same-day. Minor releases require a full pre-release checklist. Major releases require an RFC approval (see `change-management.md`) and a coordinated rollout plan.

---

## Pre-Release Checklist

Before any minor or major release is deployed to production, all of the following must be confirmed:

**Code Quality**
- [ ] All CI checks pass (lint, type check, unit tests, integration tests)
- [ ] No known P0 or P1 bugs in the build
- [ ] AI-authored code has been reviewed by a human for security-sensitive paths

**Documentation**
- [ ] Changelog entry written in `CHANGELOG.md` with date, version, and description
- [ ] Any new user-facing feature documented in the relevant docs page
- [ ] Internal ops docs updated if process changed

**Staging Validation**
- [ ] Feature deployed to staging environment
- [ ] Smoke test completed on critical paths: auth, checkout, marketplace listing, admin panel
- [ ] Supabase migrations tested on staging database before applying to production

**Communication**
- [ ] Release notes drafted for changelog page and email
- [ ] Social post drafted if feature is user-facing

---

## Deployment Steps — Next.js + Supabase

1. **Merge to `main`** — PR approved and merged; CI passes
2. **Run database migrations** — Apply Supabase migrations to production via Supabase CLI: `supabase db push`
3. **Deploy frontend** — Vercel auto-deploys on merge to `main`; confirm deployment in Vercel dashboard
4. **Validate environment variables** — Confirm no new env vars are missing from Vercel project settings
5. **Smoke test production** — Run the critical path checklist against production URL within 15 minutes of deploy
6. **Tag the release** — Create a git tag (`git tag vX.X.X`) and push it; update GitHub release notes

---

## Rollback Procedure

If a production issue is detected after release:

1. **Immediate:** Revert to the previous Vercel deployment via the Vercel dashboard (instant, no redeploy needed)
2. **Database:** If a migration was applied, run the corresponding rollback migration — all migrations must include a `down` script
3. **Communicate:** Post a P1 or P0 incident notice (see `incident-response.md`) within 15 minutes
4. **Root cause:** Do not re-deploy the broken build; fix forward with a patch release

---

## Post-Release Validation

Within 30 minutes of any minor or major release:

- [ ] Core user flows functional: sign up, browse marketplace, purchase, download
- [ ] Stripe webhooks processing correctly (check Stripe dashboard)
- [ ] Supabase error rate normal (check Supabase logs)
- [ ] No spike in Vercel error logs
- [ ] At least one real transaction processed end-to-end (or simulated in production if no real traffic)

---

## Release Communication

| Channel | Patch | Minor | Major |
|---------|-------|-------|-------|
| `CHANGELOG.md` | Yes | Yes | Yes |
| Internal Slack | Yes | Yes | Yes |
| Changelog page (site) | No | Yes | Yes |
| Email to subscribers | No | Yes (optional) | Yes |
| Social media | No | Yes (if notable) | Yes |

Release notes follow this format: **What changed / Why it matters / What to do (if anything)**. AI agents draft the release notes; a human reviews before publishing.
