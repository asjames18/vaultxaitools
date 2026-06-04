# Roadmap — Melanated In Tech

> **North Star:** Melanated In Tech is building the world's most practical ecosystem for AI Agents, MCP Servers, Agent Skills, Automation Systems, and Agent Commerce. Every decision should move the platform closer to becoming the trusted place where people learn, build, deploy, buy, sell, and scale AI-powered systems.

---

> Build order, milestones, and success metrics for every phase.

---

## Guiding Principle

**Build what generates revenue as fast as possible. Everything else waits.**

The build order is:
1. Fix what's broken (security + SEO)
2. Build what earns first (Academy + Stripe)
3. Build what retains (Community + Marketplace)
4. Build what scales (programmatic SEO + creator program)

---

## Current Status (June 3, 2026)

| Item | Status |
|------|--------|
| Brand rebrand (VaultX → Melanated In Tech) | 🔄 In progress |
| Domain live (melanatedintech.com) | ✅ Done |
| Tools directory | ✅ Done (38+ tools) |
| Sitemap/robots.txt domain fix | ❌ **URGENT** |
| Admin auth RBAC fix | ❌ Critical |
| Debug pages removed | ❌ Not done |
| Supabase schema expansion | ❌ Not done |
| Stripe integration | ❌ Not done |
| Academy MVP | ❌ Not done |
| Marketplace MVP | ❌ Not done |
| Community forums | ❌ Not done |
| Certifications | ❌ Not done |
| Public launch | ❌ Not done |

---

## Phase 1: Foundation (Days 1–30)

**Goal:** Clean, secure, branded platform live. First revenue. 100+ members.

### Week 1 — Clean House & Lock Brand (Days 1–7)

| Day | Task | Priority |
|-----|------|---------|
| 1 | Fix sitemap.xml + robots.txt → melanatedintech.com | 🔴 CRITICAL |
| 1–2 | Delete all debug/test pages (`/debug`, `/debug-admin`, etc.) | 🔴 HIGH |
| 1–2 | Audit + fix admin auth RBAC (service role key exposure) | 🔴 CRITICAL |
| 3–4 | Brand shell: update Tailwind config, Header, Footer, About | 🟠 HIGH |
| 3–4 | Full VaultX → Melanated In Tech search-replace in codebase | 🟠 HIGH |
| 5–6 | Draft Supabase migration file for new schema | 🟡 MEDIUM |
| 7 | Environment audit, deploy pipeline verify, smoke test | 🟡 MEDIUM |

### Week 2 — Schema, Auth & Tools (Days 8–14)

| Day | Task |
|-----|------|
| 8–10 | Apply new Supabase tables (see technical-system.md). Add RLS to ALL. Seed sample data. |
| 11–12 | Role middleware: `admin` gates `/admin/*`, auth gates `/dashboard/*` |
| 11–12 | Supabase trigger: new user → auto-create profile row |
| 13–14 | Tools directory: fix branding, add category pages, wire newsletter signup |

### Week 3 — Academy MVP (Days 15–21)

| Day | Task |
|-----|------|
| 15–16 | Course listing + detail pages (`/academy`, `/academy/[slug]`) |
| 15–16 | Lesson player (`/academy/[slug]/learn/[lessonId]`) with video + article support |
| 17–18 | Enrollment flow (`/api/academy/enroll`, progress tracking) |
| 17–18 | Dashboard learning page (`/dashboard/learning`) |
| 19 | Stripe integration — install, create checkout + webhook handlers, test mode |
| 20–21 | Creator CMS (`/creator/courses/new`, `/creator/courses/[id]/edit`) |

### Week 4 — Email, SEO, Polish (Days 22–30)

| Day | Task |
|-----|------|
| 22–23 | Email sequences (Resend): welcome (Day 0, 3, 7), course completion, newsletter |
| 24–25 | `generateMetadata()` on all pages, dynamic sitemap, og:image, fix robots.txt |
| 24–25 | Write + publish 5 real blog posts (replace placeholder content) |
| 26–27 | Vercel Analytics goals, Sentry setup, Suspense boundaries |
| 28–29 | Admin polish: KPI tiles, role management, consulting CRM |
| 30 | Full smoke test, document known bugs, deploy to production |

**Phase 1 Success Metrics:**

| Metric | Target |
|--------|--------|
| Registered users | 50+ (beta) |
| Course enrollments | 20+ |
| Email subscribers | 100+ |
| Blog posts published | 5 |
| MRR | $0 → $1,500 |
| Console errors on core pages | 0 |
| Lighthouse SEO | 85+ |

---

## Phase 2: Launch (Days 31–60)

**Goal:** Full platform live, public launch, $500+ MRR, 250+ members.

### Week 5 — Marketplace MVP (Days 31–37)

| Day | Task |
|-----|------|
| 31–32 | Marketplace pages (`/marketplace`, `/marketplace/[category]/[slug]`), filters |
| 33–34 | Seller upload flow, admin approval queue |
| 35–36 | Purchase + download flow (R2 signed URLs), `/dashboard/purchases` |
| 37 | Search integration, seed 10 MIT products, creator revenue dashboard |

### Week 6 — Community (Days 38–44)

| Day | Task |
|-----|------|
| 38–41 | Forum structure + CRUD API routes + upvote system |
| 42–44 | Public profiles, Supabase Realtime notifications, admin moderation |
| 42–44 | Seed 20 discussion posts |

### Week 7 — Consulting & Content Pipeline (Days 45–51)

| Day | Task |
|-----|------|
| 45–46 | Consulting module (`/consulting`, intake form, Calendly embed) |
| 47–50 | AI content pipeline: Claude API draft generation, admin review flow |
| 47–50 | Blog enhancements: TOC, related posts, social share, newsletter CTA |
| 47–50 | Publish 10 SEO-optimized posts |
| 51 | PostHog integration, custom event tracking |

### Week 8 — Pre-Launch & Soft Launch (Days 52–60)

| Day | Task |
|-----|------|
| 52–53 | End-to-end QA: signup → enroll → complete → download → post |
| 52–53 | Mobile audit (375px viewport on all core flows) |
| 54–57 | Launch campaign: email list, LinkedIn, X, demo video |
| 54–57 | 25 beta users — feedback loop |
| 58–60 | Final SEO pass: sitemap submission, Lighthouse 90+, uptime monitor |
| 60 | Soft launch in 5 target communities |

**Phase 2 Success Metrics:**

| Metric | Target |
|--------|--------|
| Registered users | 250+ |
| Paid enrollments | 50+ |
| Marketplace downloads | 100+ |
| MRR | $500+ |
| Community posts | 50+ |
| Newsletter subscribers | 500+ |
| Blog posts | 15+ |
| Consulting inquiries | 5+ |

---

## Phase 3: Growth (Days 61–90)

**Goal:** Pro tier live, creator program, SEO compounding, $2.5K+ MRR.

### Week 9 — Pro Tier & Creator Program (Days 61–67)

| Task |
|------|
| Creator application + admin approval flow |
| Revenue split tracking (70/30 → 80/20) |
| Stripe Subscription — Pro tier ($149/mo) |
| Pro member benefits gating |
| Affiliate program (5% referral commission) |
| Creator onboarding email sequence |

### Week 10 — SEO Acceleration (Days 68–74)

| Task |
|------|
| Programmatic SEO: use-case pages (50+), comparison pages (25+) |
| Content calendar automation — 3 posts/week via AI agent |
| Schema markup on all new pages |
| Backlink outreach to 20 relevant publications |
| Submit updated sitemap to GSC |

### Week 11 — Community Depth (Days 75–81)

| Task |
|------|
| Live events: webinar calendar, registration system |
| First free webinar (record → YouTube) |
| Leaderboard + gamification (points, levels, streaks) |
| Tool vendor partnerships (3+) |

### Week 12 — Scale & Review (Days 82–90)

| Task |
|------|
| Upstash Redis caching (ISR on high-traffic pages) |
| DB query optimization (indexes, EXPLAIN ANALYZE) |
| 90-day metrics review + Q2 roadmap |
| Product Hunt launch |
| Transparency blog post: "What we built in 90 days" |

**Phase 3 Success Metrics:**

| Metric | Target |
|--------|--------|
| Registered users | 1,000+ |
| Pro subscribers | 50+ |
| MRR | $2,500+ |
| Marketplace items | 30+ |
| Active sellers/creators | 10+ |
| Community posts | 200+ |
| Newsletter subscribers | 2,000+ |
| Monthly organic visitors | 25,000+ |
| Blog posts | 40+ |
| Consulting pipeline | $5,000+ |

---

## Phase 4: Platform Depth (Months 4–6)

| Milestone | Description |
|-----------|------------|
| Certifications live | MIT Certified AI Agent Engineer exam + certificate issuance |
| Bootcamp Cohort 1 | First paid 8-week bootcamp (30 seats, $1,000/seat) |
| Marketplace public | Open to non-members to browse and purchase |
| Consulting arm active | 3+ active client engagements |
| 500+ newsletter subscribers | "The Stack" established as must-read |
| 5 success stories documented | Case studies used for marketing |

---

## Phase 5: Scale (Months 7–12)

| Milestone | Target |
|-----------|--------|
| ARR | $170K |
| Active members | 1,000+ |
| Marketplace GMV | $25K/month |
| Certifications issued | 100+ |
| Community posts | 1,000+ |
| Organic monthly visitors | 50,000+ |
| Annual MIT Summit | 500+ attendees |
| Enterprise clients | 5+ |

---

## Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Single developer bottleneck | 3/5 | 5/5 | Document decisions, contractor on standby |
| Low initial traction | 3/5 | 4/5 | Build email list to 500 before launch |
| Stripe/payment issues | 2/5 | 5/5 | Full test mode testing first; manual invoice fallback |
| Supabase RLS misconfiguration | 2/5 | 5/5 | Monthly security audit; never expose service role |
| AI content quality issues | 3/5 | 3/5 | Human approval required before publish |
| Creator quality problems | 3/5 | 3/5 | Admin review before any listing goes live |
| Scope creep | 4/5 | 3/5 | Only founder adds to current sprint |
| SEO slower than expected | 3/5 | 3/5 | Don't depend on SEO for Month 1–2 revenue |
| Founder burnout | 3/5 | 5/5 | Community manager by Month 2; hard off days |
| Market saturation in AI education | 2/5 | 4/5 | Cultural specificity + marketplace moat |

---

## Sprint Template

**Standard 2-week sprint:**
- **Kickoff (Monday):** Review metrics vs. targets, pull sprint-ready issues, assign by role
- **Daily rhythm:** Async work — developer on GitHub Issues, content agent generates drafts, founder reviews
- **Mid-sprint (Friday, Day 5):** Done/blocked/scope adjustments. Merge to staging.
- **Sprint end (Friday, Day 10):** Demo, retro, metrics review, merge to main, deploy, monitor 2 hours post-deploy

**Who can add to a sprint:** Founder only. All agent work scoped to sprint tasks.
