# Melanated In Tech — Implementation Roadmap

---

**Purpose:** The execution bible. Converts all strategy documentation into a concrete, time-bound build sequence. This document is the source of truth for what gets built, in what order, and when.

**Owner:** Founder / Technical Lead

**Dependencies:** All other docs in `/docs/`

**Status:** Active — Starting Day 1

**Last Updated:** 2026-06-03

**Next Actions:** Begin Phase 1, Week 1 tasks immediately

---

## Build Order (Priority Sequence)

| Priority | Item | Why | Time Estimate |
|---|---|---|---|
| 1 | Platform Foundation Cleanup | Remove debug pages, complete rebrand, stabilize base | 3 days |
| 2 | Brand Shell | Lock navigation, colors, typography before building features | 3 days |
| 3 | Supabase Schema Expansion | All features need new tables before UI can be built | 4 days |
| 4 | Auth & Role System | Gate every feature correctly from day one | 2 days |
| 5 | Tools Directory Enhancement | Top-of-funnel traffic driver; already 80% built | 4 days |
| 6 | Academy MVP | Primary monetization; reason people create accounts | 10 days |
| 7 | Email Infrastructure | Every page needs capture; sequences needed for launch | 3 days |
| 8 | Marketplace MVP | Depends on creator accounts and Stripe | 12 days |
| 9 | Community (Forums) | Retention driver; build after people have reason to be here | 8 days |
| 10 | Consulting Intake | High-ticket; simple form + booking + proposal workflow | 4 days |
| 11 | Content/Blog Pipeline | SEO long game; automate with Claude agents | 5 days |
| 12 | Analytics & Instrumentation | Track after users exist | 4 days |

---

## Phase 1: Foundation (Days 1–30)

**Goal:** Clean, branded platform live at production with Academy and first revenue.

**Success Metrics at Day 30:**
- 50+ registered users (beta invites)
- 20+ course enrollments
- 100+ email subscribers
- 5 blog posts published
- Zero console errors on core pages
- 99%+ uptime
- Lighthouse performance 85+

---

### Week 1 — Clean House & Lock Brand (Days 1–7)

**Day 1–2: Codebase Cleanup**
- Delete all debug/test pages: `/debug`, `/debug-admin`, `/debug-blog`, `/debug-supabase`, `/simple-test`, `/test-admin`, `/test-automation`, `/seed-blog`, `/ui-showcase`, `/performance`
- Delete `/api/debug-admin` route
- Run `npm run typecheck` and `npm run lint` to baseline
- Commit: `chore: remove debug pages and test scaffolding`

**Day 3–4: Brand Shell**
- Update `app/layout.tsx` — neon green `#00FF41` on `#0A0A0A` global brand
- Update `tailwind.config.js` — lock brand tokens: `brand-green`, `brand-black`, `brand-gray`
- Rebuild `Header` component with future nav structure
- Rebuild `Footer` with updated links and newsletter widget
- Update `app/about/page.tsx` with founder story and platform mission

**Day 5–6: Supabase Schema Audit**
- Run Supabase `list_tables` to inventory existing schema
- Document current schema
- Draft new tables migration (courses, modules, lessons, enrollments, marketplace_items, purchases, community posts)
- Create migration file: `supabase/migrations/001_platform_expansion.sql`

**Day 7: Environment & Deploy**
- Audit `.env.example` vs actual env vars needed
- Verify Vercel deploy pipeline on clean branch
- Smoke test all existing routes

---

### Week 2 — Schema, Auth & Tools (Days 8–14)

**Day 8–10: Database Migration**
Apply new tables:
```sql
profiles (extends auth.users): id, username, display_name, bio, avatar_url, role, stripe_customer_id
courses: id, title, slug, description, cover_image, price, status, created_by
modules: id, course_id, title, order_index, content_type
lessons: id, module_id, title, content_url, duration_mins, order_index
enrollments: id, user_id, course_id, enrolled_at, progress_pct, completed_at
marketplace_items: id, title, slug, type, price, creator_id, status, delivery_config
purchases: id, user_id, item_id, amount_paid, stripe_payment_id, purchased_at
posts: id, user_id, title, body, category, upvotes
comments: id, post_id, user_id, body
consulting_inquiries: id, name, email, company, budget, description, status
```
Apply RLS policies to all new tables. Seed 3 sample courses for dev.

**Day 11–12: Auth Role System**
- Add `role` to profiles table: `member | creator | admin`
- Extend middleware to read role from Supabase on each request
- Create `lib/auth/roles.ts` with role constants
- Gate `/admin/*` to admin only, `/dashboard/*` to all authenticated users
- Supabase trigger: on `auth.users` insert → create `profiles` row with default role `member`

**Day 13–14: Tools Directory Enhancement**
- Global search-replace: "VaultX" → "Melanated In Tech" across all components
- Update `/tools` page (was `/AITools`) with improved dark theme UI
- Add "Curated by AI" badge to tool cards
- Wire MailerLite newsletter signup to tool pages
- Confirm affiliate click tracking works

---

### Week 3 — Academy MVP (Days 15–21)

**Day 15–16: Course Listing & Detail Pages**
- `app/academy/page.tsx` — course grid with filters (category, price, difficulty)
- `app/academy/[slug]/page.tsx` — course detail: cover, description, curriculum accordion, enroll CTA
- `app/academy/[slug]/learn/[lessonId]/page.tsx` — lesson player (video + article markdown)
- Components: `CourseCard`, `CurriculumAccordion`, `LessonPlayer`, `ProgressBar`

**Day 17–18: Enrollment & Progress**
- `app/api/academy/enroll/route.ts` — creates enrollment row, validates payment for paid courses
- `app/api/academy/progress/route.ts` — updates progress_pct, marks lessons complete
- Free courses: instant enrollment. Paid courses: Stripe checkout redirect.
- `/dashboard/learning` — enrolled courses with progress display

**Day 19: Stripe Integration**
- Install `stripe` package
- `app/api/payments/checkout/route.ts` — Stripe Checkout Session creation
- `app/api/payments/webhook/route.ts` — handles `checkout.session.completed`, creates enrollment
- Add env vars: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
- Test in Stripe test mode

**Day 20–21: Creator CMS**
- `app/creator/courses/page.tsx` — list my courses
- `app/creator/courses/new/page.tsx` — course creation form
- `app/creator/courses/[id]/edit/page.tsx` — add/reorder modules and lessons
- Gate all `/creator/*` routes to `role = creator`

---

### Week 4 — Email, SEO, Polish (Days 22–30)

**Day 22–23: Email Infrastructure**
- Add server-side email sequences using Resend:
  - Welcome series (Day 0, Day 3, Day 7)
  - Course completion notification
  - Newsletter welcome
- Supabase Edge Function or API route triggers welcome sequence on new user creation

**Day 24–25: SEO Foundation**
- Add `generateMetadata()` to all public pages
- Update `app/sitemap.ts` — dynamic, includes all tools, courses, blog posts
- Add `app/opengraph-image.tsx`
- Fix `robots.txt` to reference melanatedintech.com (not vaultxaitools.com)
- Write 5 seed blog posts targeting high-value keywords (AI Agent Agent assists)

**Day 26–27: Performance & Monitoring**
- Add `Suspense` boundaries to data-heavy pages
- Configure Vercel Analytics conversion goals: signup, course enroll, tool click
- Set up Sentry error tracking

**Day 28–29: Admin Portal Polish**
- Admin dashboard KPI tiles: total users, enrollments, revenue, tool views
- Admin `/admin/users` — role management
- Admin `/admin/blog` — working blog CRUD
- Admin `/admin/consulting` — consulting inquiries CRM

**Day 30: Phase 1 Review**
- Full smoke test on staging
- Document all known bugs in GitHub Issues
- Deploy to production

---

## Phase 2: Launch (Days 31–60)

**Goal:** Full platform live. Public launch. $500+ MRR.

**Success Metrics at Day 60:**
- 250+ registered users
- 50+ paid course enrollments
- 100+ marketplace downloads
- $500+ MRR
- 50+ community posts
- 500+ newsletter subscribers
- 15+ blog posts published
- 5+ consulting inquiries

---

### Week 5 — Marketplace MVP (Days 31–37)

**Day 31–32: Marketplace Listing Pages**
- `app/marketplace/page.tsx` — grid by category
- `app/marketplace/[slug]/page.tsx` — product detail with description, demo, buy/download CTA
- Components: `MarketplaceCard`, `ItemTypeFilter`, `CreatorBadge`

**Day 33–34: Creator Upload Flow**
- `app/creator/marketplace/new/page.tsx` — product submission form
- `app/api/marketplace/upload/route.ts` — file to Cloudflare R2, creates `marketplace_items` row
- Admin approval queue: new items default to `status = pending`
- Admin `/admin/marketplace` — approve/reject submissions

**Day 35–36: Purchase & Download Flow**
- Reuse Stripe checkout for marketplace item purchases
- `app/api/marketplace/download/route.ts` — validates purchase, returns signed R2 URL (1-hour TTL)
- `dashboard/purchases` section showing all bought items with download links

**Day 37: Marketplace Polish**
- Search and filter by type, price, rating
- Seed 10 MIT-owned products (prompt packs + blueprints)
- Creator revenue dashboard: sales, earnings display

---

### Week 6 — Community (Days 38–44)

**Day 38–41: Forum Structure + CRUD**
- `app/community/page.tsx` — category listing
- `app/community/[category]/page.tsx` — post listing
- `app/community/[category]/[postId]/page.tsx` — thread with comments
- API routes for create/read/update/delete posts and comments
- Upvote system

**Day 42–44: Community Features**
- Public profile pages: `/profile/[username]`
- Basic notifications via Supabase Realtime
- Admin moderation tools
- Seed 20 posts via Content Agent

---

### Week 7 — Consulting & Content (Days 45–51)

**Day 45–46: Consulting Module**
- `app/consulting/page.tsx` — services overview (rewrite current consulting page)
- `app/consulting/intake/page.tsx` — inquiry form
- `app/api/consulting/inquire/route.ts` — saves to DB, sends email to founder
- Embed Calendly for discovery calls
- Add "Consulting" to primary navigation

**Day 47–50: AI Content Pipeline + Blog Enhancement**
- `scripts/content-agent.ts` — Claude API script for SEO-optimized blog post generation
- Admin "Generate with AI" button in blog management
- Blog enhancements: related posts, table of contents, social share, newsletter CTA at bottom
- Publish 10 more SEO posts via AI pipeline

**Day 51: Analytics Instrumentation**
- PostHog integration for conversion events
- Custom events: `course_enroll`, `marketplace_purchase`, `consulting_inquiry`, `newsletter_signup`
- Admin analytics dashboard `/admin/analytics`

---

### Week 8 — Pre-Launch & Soft Launch (Days 52–60)

**Day 52–53: End-to-End Testing**
- QA all critical paths: signup → enroll → complete lesson → download → post in community
- Mobile audit (iPhone 14 viewport)
- Fix top 10 bugs

**Day 54–57: Launch Content & Beta Users**
- Write and schedule launch email to existing list
- Create launch posts for LinkedIn, X, Instagram
- Record 60-second product demo video
- Invite 25 beta users from personal network
- Collect feedback via simple form
- Fix critical issues within 24 hours

**Day 58–60: SEO Final Pass & Soft Launch**
- Submit sitemap to Google Search Console
- Run Lighthouse CI — target 90+ performance, 90+ SEO
- Set up uptime monitoring
- Soft launch: post in 5 relevant communities

---

## Phase 3: Growth (Days 61–90)

**Goal:** Pro tier, creator program, SEO acceleration. $2,500+ MRR.

**Success Metrics at Day 90:**
- 1,000+ registered users
- 50+ Pro subscribers
- $2,500+ MRR
- 30+ marketplace items
- 10+ active sellers/creators
- 200+ community posts
- 2,000+ newsletter subscribers
- 25,000+ monthly organic visitors
- 40+ blog posts published
- $5,000+ consulting revenue in pipeline

---

### Week 9 — Pro Tier & Creator Program (Days 61–67)

- Creator application flow with admin approval
- Revenue share tracking: 70/30 split
- Stripe Subscription checkout for Pro membership ($149/month)
- MIT Pro benefits: unlimited courses, discounts, all blueprints
- Affiliate program with referral link tracking

### Week 10 — SEO Acceleration (Days 68–74)

- Programmatic SEO: tool comparison pages, "best AI tools for [category]" pages (100+ pages)
- Weekly content calendar automation (3 posts/week via Content Agent)
- Backlink outreach to 20 AI/Black tech publications
- Lead magnet: "50 Best AI Tools for Entrepreneurs" PDF — gate behind email

### Week 11 — Community Depth (Days 75–81)

- Live events infrastructure (webinar calendar, registration)
- First live event: "AI Tools for Your Business" free webinar
- Leaderboard and gamification (points, badges, monthly prizes)
- Partnership outreach: 3 tool vendors for featured placement

### Week 12 — Scale & 90-Day Review (Days 82–90)

- Redis caching for listing pages (Upstash)
- ISR on all marketplace and course listing pages
- Database query optimization + indexing
- Full 90-day metrics review vs. targets
- Draft Q2 roadmap
- Product Hunt launch campaign
- "90 days of building" transparency blog post

---

## Sprint Template (Standard 2-Week Sprint)

**Sprint Kickoff (Monday, Day 1):**
1. Review previous sprint metrics vs. targets
2. Pull top items from GitHub Issues (labeled `sprint-ready`)
3. Assign each item: Developer | Content Agent | SEO Agent | Founder
4. Set sprint goal (one sentence)

**Daily Rhythm (Async):**
- Developer: Start with GitHub Issues top priority
- Content Agent: Generate drafts from content calendar
- Founder: 30 minutes reviewing + approving AI content in admin

**Mid-Sprint (Friday, Day 5):**
- 30-minute sync: done / blocked / needs scope adjustment
- Merge completed features to staging

**Sprint End (Friday, Day 10):**
- 30-minute demo of all completed items in staging
- 20-minute retrospective
- 10-minute metrics review
- Merge to main, deploy to production
- Monitor error logs 2 hours post-deploy

---

## Key Metrics Dashboard (Track Weekly)

### Traffic
- Weekly unique visitors (Vercel Analytics)
- Top traffic sources
- Organic search sessions (Google Search Console)
- Bounce rate by page

### Conversion
- Visitor → Signup rate (target: 3%+)
- Signup → Enrollment rate (target: 25%+)
- Free → Pro conversion (target: 5%+)
- Blog → Email signup rate (target: 3%+)

### Revenue
- MRR (target: +10% WoW)
- Course revenue
- Marketplace GMV and commission
- Consulting pipeline value

### Engagement
- Weekly active community members (target: 20%+ of total)
- Course completion rate (target: 40%+)
- Email open rate (target: 25%+)
- Community posts per week (target: 20+)

### Technical
- p95 page load time (target: <2 seconds)
- Error rate (target: <0.1%)
- Uptime (target: 99.9%+)
- Lighthouse score (target: 85+)

---

## Risk Register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Single developer bottleneck | 3/5 | 5/5 | Document all decisions; backup contractor on standby |
| Low initial traction | 3/5 | 4/5 | Build email list to 500 before launch; beta users first |
| Stripe/payment issues | 2/5 | 5/5 | Test in test mode fully; manual invoice fallback |
| Supabase RLS misconfiguration | 2/5 | 5/5 | Monthly security audit; never expose service role key client-side |
| AI content quality issues | 3/5 | 3/5 | Human approval required before publish |
| Creator quality control | 3/5 | 3/5 | Admin review before all listings go live |
| Scope creep | 4/5 | 3/5 | Only founder can add items to current sprint |
| SEO slower than expected | 3/5 | 3/5 | Don't depend on SEO for Month 1–2 revenue |
| Founder burnout | 3/5 | 5/5 | Hire community manager Month 2; hard off days weekly |
| Unclear positioning | 3/5 | 4/5 | Homepage leads with one sentence value prop; one CTA |
