# Melanated In Tech — Codebase Map

**Generated:** 2026-06-03
**Framework:** Next.js 15.5.19 (App Router)
**Auditor:** Repository Architect Agent

---

## 1. Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | Next.js 15.5.19 (App Router) |
| Language | TypeScript 5.3 (strict mode) |
| UI Library | React 18.2 |
| Styling | TailwindCSS 3.4 |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (JWT) |
| Server Auth | @supabase/ssr + @supabase/auth-helpers-nextjs |
| Email | Resend |
| Analytics | Google Analytics 4 + Vercel Analytics |
| Icons | Lucide React + Heroicons |
| Animation | Framer Motion 12.23 |
| Testing | Jest 29.7 + jest-environment-jsdom |
| Hosting | Vercel |

---

## 2. Folder Structure

| Directory | Purpose |
|-----------|---------|
| `/app` | Next.js App Router pages, layouts, API routes |
| `/components` | Reusable React UI components |
| `/lib` | Utilities, hooks, services, database clients |
| `/data` | Static seed data and type definitions |
| `/scripts` | Node.js automation scripts (104 files) |
| `/supabase` | Database schema and migrations |
| `/docs` | Project documentation |
| `/public` | Static assets |

---

## 3. Pages & Routes

### Public Routes

| Route | Purpose |
|-------|---------|
| `/` | Homepage — trending tools, featured, sponsored |
| `/AITools` | Full AI tools directory with category filters |
| `/categories` | Category listing (redirects to /AITools) |
| `/categories/[category]` | Tools filtered by category |
| `/tool/[id]` | Individual tool detail with reviews and alternatives |
| `/blog` | Blog listing with categories |
| `/blog/[slug]` | Individual blog post |
| `/about` | About page |
| `/contact` | Contact form |
| `/privacy` | Privacy policy |
| `/terms` | Terms of service |
| `/cookies` | Cookie policy |
| `/gdpr` | GDPR compliance |
| `/documentation` | User documentation |
| `/status` | System status |
| `/consulting` | Consulting landing page |
| `/getting-started` | Onboarding guide |
| `/news` | News feed |
| `/submit-tool` | Tool submission form |
| `/search` | Search page |
| `/advanced-search` | Advanced search |
| `/sign-in` | Login |
| `/sign-up` | Registration |
| `/auth/callback` | OAuth callback |
| `/reset-password` | Password reset |
| `/compare` | Tool comparison |

### Protected Routes

| Route | Purpose |
|-------|---------|
| `/dashboard` | User dashboard (activity, stats) |
| `/favorites` | Bookmarked tools |
| `/settings` | Account settings |
| `/activity` | Activity log |

### Admin Routes

| Route | Purpose |
|-------|---------|
| `/admin` | Admin dashboard overview |
| `/admin/tools` | Tools management |
| `/admin/blog` | Blog management |
| `/admin/contact` | Contact message management |
| `/admin/analytics` | Analytics dashboard |
| `/admin/automation` | Workflow automation |
| `/admin/content-management` | Centralized content CMS |

### Debug Routes (Dev Only — 404 in Production)

`/debug*`, `/test-*`, `/seed-blog`, `/ui-showcase`

---

## 4. API Routes

### Admin Endpoints

| Endpoint | Methods | Purpose |
|----------|---------|---------|
| `/api/admin/users` | GET, PUT | List/update users |
| `/api/admin/users/[id]` | GET, PUT, DELETE | Individual user management |
| `/api/admin/users/[id]/role` | PUT | Update user role |
| `/api/admin/users/[id]/password` | PUT | Reset password |
| `/api/admin/users/[id]/status` | PUT | Update user status |
| `/api/admin/users/[id]/resend-verification` | POST | Resend verification email |
| `/api/admin/tools` | GET, POST | List/create tools |
| `/api/admin/tools/publish` | POST | Publish tool |
| `/api/admin/tools/enrich` | POST | Enrich tool data |
| `/api/admin/blog` | GET, POST, PUT, DELETE | Blog management |
| `/api/admin/contact` | GET, PUT | Contact message management |
| `/api/admin/workflows` | GET, POST, PUT, DELETE | Automation workflows |
| `/api/admin/workflows/execute` | POST | Execute workflow (mock) |
| `/api/admin/automation-status` | GET | Automation status (stub) |

### User Endpoints

| Endpoint | Methods | Purpose |
|----------|---------|---------|
| `/api/user/account` | GET, PUT | Account info |
| `/api/user/profile` | GET, PUT | Profile |
| `/api/user/export` | GET | Data export |
| `/api/user/achievements` | GET | Achievements/badges |
| `/api/user/points` | GET | Points total |
| `/api/user/streak` | GET | Login streak |
| `/api/user/recommendations` | GET | Personalized recommendations |

### Public Endpoints

| Endpoint | Methods | Purpose |
|----------|---------|---------|
| `/api/search` | GET | Full-text search |
| `/api/search/advanced` | POST | Advanced search |
| `/api/reviews` | GET, POST | Reviews |
| `/api/favorites` | GET, POST, DELETE | Favorites |
| `/api/contact` | POST | Contact form |
| `/api/analytics/track` | POST | Event tracking |
| `/api/news` | GET | AI news feed |
| `/api/health` | GET | Health check |
| `/api/dashboard` | GET | Dashboard data |
| `/api/leaderboard` | GET | Leaderboard |

---

## 5. Key Components

### Layout
`Navigation.tsx`, `Footer.tsx`, `MobileNavigation.tsx`, `ErrorBoundary.tsx`

### Homepage
`HomeHeroSection.tsx`, `HeroSection.tsx`, `ValueProposition.tsx`, `StatsSection.tsx`, `FeaturedToolsSection.tsx`, `SponsoredContent.tsx`, `TrendingNow.tsx`

### Search & Discovery
`EnhancedSearch.tsx`, `AdvancedSearch.tsx`, `SearchAndFilter.tsx`, `MobileSearch.tsx`, `IntelligentResults.tsx`

### Product Cards & Listing
`ToolCard.tsx`, `MobileToolCard.tsx`, `AlternativesSection.tsx`, `DailyTool.tsx`, `RecommendedTools.tsx`

### User Features
`UserAchievements.tsx`, `StreakTracker.tsx`, `PointsDisplay.tsx`, `Leaderboard.tsx`

### Reviews
`ReviewForm.tsx`, `ReviewList.tsx`, `AccessibleRating.tsx`, `QuickVote.tsx`

### Admin
`AdminDashboard.tsx`, `ToolsManagementClient.tsx`, `BlogManagementClient.tsx`, `UserManagement.tsx`, `ContactManagementClient.tsx`

### Email & Community
`EnhancedNewsletter.tsx`, `EmailSignupForm.tsx`, `MailerLiteSignup.tsx`, `SocialShare.tsx`

### SEO & Analytics
`GoogleAnalytics.tsx`, `SEOContentOptimizer.tsx`, `JsonLd.tsx`, `PerformanceMonitor.tsx`

---

## 6. Library Files (`/lib`)

### Supabase Clients (5 — needs consolidation)
`supabase.ts` (browser), `supabase-server.ts` (server), `supabase-admin.ts` (service role), `supabaseClient.ts` (deprecated), `supabaseAdminClient.ts` (deprecated)

### Auth
`auth.ts` — isAdmin, getUserRole, updateUserRole
`admin-emails.ts` — ADMIN_EMAILS env var allowlist
`api-auth.ts` — API route auth helpers

### Database
`database.ts` — Type-safe CRUD for tools, categories, reviews
`database-client.ts` — Browser-side tool queries
`database.types.ts` — Supabase types (STUB — not generated)

### Services
`blog-service.ts`, `analytics.ts`, `affiliate.ts`, `trending.ts`, `rateLimit.ts`, `resend.ts`, `seo.ts`, `auditLogger.ts`

### Hooks
`useFavorites.ts`, `useAdvancedSearch.ts`, `useDataUpdates.ts`, `useRealTimeTools.ts`, `useOptimizedSubscriptions.ts`

---

## 7. Database Schema

### Core Tables

| Table | Purpose |
|-------|---------|
| `auth.users` | Supabase auth users |
| `user_roles` | Role assignments (admin/user) |
| `tools` | AI tools directory |
| `categories` | Tool categories |
| `blog_posts` | Blog articles |
| `contact_messages` | Contact form submissions |
| `reviews` | Tool reviews and ratings |
| `favorites` | User bookmarked tools |
| `sponsored_slots` | Paid tool placements |
| `profiles` | User profiles (optional) |

### Migrations
- `001_add_favorites_table.sql`
- `002_schema_alignment.sql`
- `003_phase15_gamification.sql` (achievements, points, streaks)

---

## 8. Auth & Authorization

| Level | Routes |
|-------|--------|
| Anonymous | `/`, `/AITools`, `/blog`, `/about`, `/contact`, auth pages |
| Authenticated | `/dashboard`, `/favorites`, `/settings`, `/activity` |
| Admin | `/admin/*` |

**Auth flow:** Supabase Auth (email+password, OAuth) → JWT cookies via @supabase/ssr → middleware validates → admin check via ADMIN_EMAILS env var + `user_roles` table fallback.

---

## 9. External Integrations

| Service | Purpose |
|---------|---------|
| Supabase | PostgreSQL + Auth |
| Resend | Transactional email |
| Google Analytics 4 | User behavior tracking |
| Vercel Analytics | Performance monitoring |
| MailerLite | Newsletter signups |
| Vercel | Hosting + CI/CD |

**Missing for MVP:** Stripe (payments), Redis (rate limiting)

---

## 10. Configuration

**`next.config.ts`:** CSP headers, security headers, image optimization, ISR revalidation, redirects (`/home → /`, `/categories → /AITools`)

**`tailwind.config.ts`:** Dark mode (class-based), custom animations, accessibility utilities (sr-only, high-contrast, reduced-motion)

**`middleware.ts`:** Blocks dev routes in production, validates auth, routes admin/user/public traffic

### Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_GA_MEASUREMENT_ID
RESEND_API_KEY
ADMIN_EMAILS
NODE_ENV
```

---

## 11. Scripts Directory (104 files)

Categories: seeding, data management, CI, testing, monitoring, setup, deployment utilities.

Key scripts: `seedTools.js`, `fetch-real-ai-data.js`, `data-quality-monitor.js`, `smoke-test.js`, `verify-env.js`, `grant-admin.js`

---

## 12. Missing for Marketplace MVP

What does NOT exist in the current codebase:

- Stripe / payment processing
- Multi-product type support (Agents, MCP Servers, Skills, Prompts, Templates, Blueprints)
- User membership tiers (Free/Pro/Elite)
- Creator accounts and dashboards
- Purchase history, orders, licenses
- Email automation sequences
- Content moderation queue
- Marketplace analytics (GMV, earnings)
