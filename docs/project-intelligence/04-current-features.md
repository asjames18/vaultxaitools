# Current Features

**Last updated:** 2026-05-29  
**Inventory of implemented (and partial) product capabilities**

---

## Feature Matrix

| Feature | Route(s) | API | DB Table | Status |
|---------|----------|-----|----------|--------|
| Tool directory | `/AITools`, `/tool/[id]` | `/api/search` | `tools` | ✅ Live (dual data source) |
| Category browse | `/categories/[category]` | — | `categories` | ⚠️ Redirect at `/categories` |
| Advanced search | `/advanced-search` | `/api/search/advanced` | `tools` | ✅ Live |
| Compare tools | `/compare` | — | — | ✅ UI only |
| Reviews & ratings | Tool detail pages | `/api/reviews` | `reviews` | ✅ Live |
| Favorites | `/favorites` | `/api/favorites` | `favorites` | ✅ Live |
| User dashboard | `/dashboard` | `/api/dashboard` | — | ⚠️ Mock data only |
| User settings | `/settings` | `/api/user/profile` | profiles (script) | ⚠️ Partial |
| GDPR export/delete | — | `/api/user/export`, `/api/user/account` | — | ✅ API exists |
| Blog | `/blog`, `/blog/[slug]` | `/api/admin/blog` | `blog_posts` | ✅ Live |
| AI news feed | `/news` | `/api/news` | `ai_news` | ✅ Live + fallback |
| Contact form | `/contact` | `/api/contact` | `contact_messages` | ✅ Live |
| Tool submission | `/submit-tool` | — | — | ✅ Form UI |
| Auth (email/OAuth) | `/sign-in`, `/sign-up` | `/api/auth/session` | Supabase Auth | ✅ Live |
| Admin dashboard | `/admin` | multiple | multiple | ✅ Live (large files) |
| Admin tool CRUD | `/admin/tools` | `/api/admin/tools/*` | `tools` | ✅ Live |
| Admin blog CMS | `/admin/blog` | `/api/admin/blog` | `blog_posts` | ✅ Live |
| Admin user mgmt | `/admin` (UserManagement) | `/api/admin/users/*` | `user_roles` | ✅ Live |
| Admin contact inbox | `/admin/contact` | `/api/admin/contact` | `contact_messages` | ✅ Live |
| Admin content mgmt | `/admin/content-management` | — | — | ✅ UI heavy |
| Workflow automation | `/admin/automation` | `/api/admin/workflows/*` | `workflows` | ⚠️ Partially stubbed |
| Sponsored slots | Admin SponsoredSlots | — | `sponsored_slots` | ✅ Admin UI |
| Affiliate tracking | AffiliateLink component | `/api/analytics/affiliate-click` | — | ❌ API disabled |
| Analytics tracking | Various | `/api/analytics/track` | — | ✅ Basic |
| Trending algorithm | Home, categories | — | `tools` | ✅ `lib/trending.ts` |
| SEO / sitemap | `/sitemap.xml`, `/robots.txt` | — | — | ✅ Live |
| PWA | manifest, sw.js | — | — | ✅ Basic |
| Consulting landing | `/consulting` | — | — | ✅ Marketing |
| Business intelligence | `/business-intelligence` | — | — | ⚠️ Dashboard demo |
| Performance dashboard | `/performance` | — | — | ⚠️ Demo/showcase |
| UI showcase | `/ui-showcase` | — | — | 🔧 Dev/demo |
| Health check | — | `/api/health` | — | ✅ Live |

**Legend:** ✅ Complete · ⚠️ Partial/mock · ❌ Disabled · 🔧 Dev-only

---

## End-to-End Flows

### Flow 1: Tool Discovery (Complete)
```
Home → /AITools → Search/filter → /tool/[id] → Review or Favorite
```
- Auth required only for Favorite/Review submission

### Flow 2: Admin Tool Publish (Complete)
```
/admin/tools → Create/edit → Enrich URL → Publish → ISR revalidate
```
- Uses audit logging on admin mutations

### Flow 3: User Onboarding (Partial)
```
Sign up → Dashboard (mock) → Settings (partial) → Favorites (live)
```
- Dashboard does not reflect real user activity

### Flow 4: Content Pipeline (Partial)
```
scripts/fetch-* → Supabase tools → Public directory
scripts/ai-news-automation → ai_news → /news
```
- npm scripts for data refresh not wired in package.json

### Flow 5: Affiliate Monetization (Incomplete)
```
Sponsored slot config → Display → Click tracking → Analytics
```
- Click tracking API returns "disabled"

---

## Admin Panel Modules

| Module | Primary File | Lines (approx) |
|--------|-------------|----------------|
| Dashboard | `AdminDashboard.tsx` | 1276 |
| User management | `UserManagement.tsx` | 744 |
| Tool management | `ToolsManagementClient.tsx` | — |
| Blog management | `BlogManagementClient.tsx` | 504 |
| Contact management | `ContactManagementClient.tsx` | — |
| Content management | `ContentManagementClient.tsx` | 743 |
| Automation | `AutomationDashboard.tsx` | 500 |
| Sponsored slots | `SponsoredSlots.tsx` | 510 |

---

## Test Coverage

| Area | Tests | Location |
|------|-------|----------|
| Trending algorithm | 1 suite | `lib/__tests__/trending.test.ts` |
| Affiliate URL gen | 1 suite | `lib/__tests__/affiliate.test.ts` |
| Everything else | None | — |

---

## Scripts Ecosystem (104 files)

Key operational scripts (not npm-wired unless noted):

| Script | Purpose |
|--------|---------|
| `data-quality-monitor.js` | `npm run monitor-data-quality` |
| `verify-env.js` | `npm run verify-env` |
| `setup-audit-logs.js` | `npm run setup-audit-logs` |
| `fetch-real-ai-data.js` | AI tool ingestion |
| `ai-news-automation.js` | News pipeline |
| `seedTools.js` / `seedTools.ts` | Duplicate seeders |
| 25+ `test-*.js` / `debug-*.js` | Manual QA |

---

## Pages to Gate or Remove (Dev Surface)

- `app/debug/`, `app/debug-admin/`, `app/debug-admin-blog/`
- `app/debug-supabase/`, `app/debug-blog/`
- `app/test-simple/`, `app/test-admin/`, `app/test-automation/`
- `app/seed-blog/`
- `app/api/debug-env/route.ts`

Some are public in `middleware.ts` — security risk in production.
