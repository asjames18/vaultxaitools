# Component Upgrade Plan — Melanated In Tech
**Date:** June 2026

---

## Overview

The component library has 150+ files, many duplicated across desktop/mobile/admin variants. This plan consolidates duplicates, removes 'use client' overuse, adds missing components, and establishes clear patterns for new marketplace UI.

---

## 1. Immediate Consolidations (P0/P1)

### 1.1 Search Components → Unified `<Search>`

**Current state (4 overlapping implementations):**
- `components/EnhancedSearch.tsx` — main search with autocomplete
- `components/AdvancedSearch.tsx` — alternative with filters
- `components/admin/AdvancedSearch.tsx` — admin version
- `components/MobileSearch.tsx` — mobile with voice recognition
- `components/SearchAndFilter.tsx`
- `components/AdminSearchFilter.tsx`

**Action:**
1. Create `lib/hooks/useSearch.ts` — shared search logic (query, suggestions, trending, history)
2. Create `components/Search/SearchInput.tsx` — base input with autocomplete
3. Create `components/Search/SearchFilters.tsx` — filter panel
4. Delete `AdvancedSearch.tsx`, `SearchAndFilter.tsx`, `AdminSearchFilter.tsx`
5. Pass `variant="admin" | "mobile" | "default"` prop for differences

**Benefit:** Single source of search behavior; ~40% code reduction

---

### 1.2 Hero Components → Unified `<HeroSection>`

**Current state (3 variants):**
- `components/HomeHeroSection.tsx` — original with rotating headlines, testimonials
- `components/HeroSection.tsx` — similar, memoized
- `components/MITHero.tsx` — new brand design (keeper)

**Action:**
1. **Keep** `components/MITHero.tsx` — this is the new brand hero
2. **Deprecate** `HomeHeroSection.tsx` — migrate testimonials/trust-stats to separate components
3. **Delete** `HeroSection.tsx` if not used elsewhere
4. Extract `components/TrustStats.tsx` from HomeHeroSection (standalone reusable)
5. Extract `components/TestimonialsRow.tsx` from HomeHeroSection (standalone reusable)

---

### 1.3 Loading Components → Unified `<LoadingState>`

**Current state (3 overlapping):**
- `components/LoadingStates.tsx` — exports LoadingSpinner, LoadingDots
- `components/AdminLoadingStates.tsx` — near-identical spinner
- `components/ui/Skeleton.tsx` — skeleton loader
- `app/admin/content-management/components/ContentLoadingState.tsx` — custom

**Action:**
1. Keep `components/LoadingStates.tsx` as canonical — add `size`, `label`, `variant` props
2. Delete `AdminLoadingStates.tsx` — replace imports with LoadingStates
3. Keep `Skeleton.tsx` — it serves a different purpose (placeholder shimmer)
4. Delete `ContentLoadingState.tsx` — replace with `<Skeleton>` or `<LoadingState>`

---

### 1.4 Error Boundaries → Unified `<ErrorBoundary>`

**Current state:**
- `components/ErrorBoundary.tsx` — general purpose
- `components/AdminErrorBoundary.tsx` — admin-specific with logging
- `components/AdminErrorDisplay.tsx` — display component

**Action:**
1. Merge admin logging into `ErrorBoundary` via `onError` callback prop
2. Delete `AdminErrorBoundary.tsx`
3. Keep `AdminErrorDisplay.tsx` as the admin-specific error UI (use inside unified boundary)

---

### 1.5 Newsletter/Email Signup → Single `<EmailCapture>`

**Current state:**
- `components/EmailCapture.tsx` — basic form
- `components/EmailSignupForm.tsx` — another variant
- `components/EnhancedNewsletter.tsx` — most complete version
- `components/MailerLiteSignup.tsx` — MailerLite-specific

**Action:**
1. Keep `EmailCapture.tsx` as base — add content variant props (`variant="hero" | "footer" | "inline"`)
2. Merge `EnhancedNewsletter.tsx` features (benefit list, stats) into EmailCapture variants
3. Delete `EmailSignupForm.tsx`
4. Keep `MailerLiteSignup.tsx` only if MailerLite integration is active — otherwise delete

---

### 1.6 Tool Cards → Single `<ToolCard>`

**Current state:**
- `components/ToolCard.tsx` — desktop version
- `components/MobileToolCard.tsx` — mobile variant

**Action:**
1. Merge into single `components/ToolCard.tsx` using responsive Tailwind classes
2. Add `compact` prop for mobile-style rendering if needed
3. Delete `MobileToolCard.tsx`

---

### 1.7 Featured Tool Sections → Clear Hierarchy

**Current state:**
- `components/FeaturedToolsSection.tsx` — grid of featured tools
- `components/RecommendedTools.tsx` — personalized recommendations
- `components/DailyTool.tsx` — single tool spotlight

**Action:**
1. Keep all 3 — they serve different purposes
2. Rename for clarity: `FeaturedTools`, `RecommendedTools`, `ToolOfTheDay`
3. Extract shared `ToolCardGrid` wrapper to avoid duplication

---

## 2. 'use client' Audit (P1)

**Problem:** 150/150 component files are marked `'use client'`, inflating JS bundle by an estimated 20-30%.

### Components to Remove 'use client' from

| Component | Reason it doesn't need client |
|---|---|
| `components/JsonLd.tsx` | Pure structured data, no interactivity |
| `components/StructuredData.tsx` | Same as above |
| `components/TrustBadges.tsx` | Static display |
| `components/Footer.tsx` | Mostly static links |
| `components/icons/*` (all) | Pure SVG exports |
| `components/SocialShare.tsx` | Mostly static, small JS needed |
| `components/SEOMonitor.tsx` | Analytics, not rendering |
| `components/GoogleAnalytics.tsx` | Script injection, not rendering |
| `components/PerformanceMonitor.tsx` | Analytics, not rendering |

### Strategy
- Default: **No** `'use client'`
- Add `'use client'` only when: `useState`, `useEffect`, `useRef`, event handlers, browser APIs
- Split large components: server shell + client island (e.g., Navigation server wrapper + client menu)

---

## 3. New Components to Build (P1/P2)

### 3.1 Agent Card `<AgentCard>`
```
Props: agent (name, description, creator, complexity, deploymentType, price, rating, deployCount)
Variants: marketplace card | featured | compact
Badges: Beginner | Intermediate | Advanced | Production
CTAs: "Deploy" | "Preview" | "Compare"
```

### 3.2 Creator Profile Card `<CreatorCard>`
```
Props: name, avatar, bio, agentCount, totalDeployments, rating
Usage: agent detail page, marketplace browse
```

### 3.3 Complexity Badge `<ComplexityBadge>`
```
Props: level ("beginner" | "intermediate" | "advanced" | "production")
Colors: green | yellow | orange | red
```

### 3.4 Deployment Type Badge `<DeployTypeBadge>`
```
Props: type ("api" | "webhook" | "standalone" | "integration")
```

### 3.5 Revenue Metric `<RevenueMetric>`
```
Props: label, value, change (positive/negative)
Usage: creator dashboard, marketplace stats
```

### 3.6 Step Progress Indicator `<StepProgress>`
```
Props: steps[], currentStep
Usage: checkout, onboarding, agent deployment wizard
```

### 3.7 Post-Purchase Onboarding `<PurchaseOnboarding>`
```
Props: product, steps[], communityLink, relatedProducts[]
Usage: checkout success page
```

### 3.8 Admin Layout Shell `<AdminShell>`
```
Props: children, currentPage
Includes: sidebar nav, user info, breadcrumb, notification area
File to create: app/admin/layout.tsx
```

---

## 4. TypeScript Type Files to Create (P1)

| File | Types |
|---|---|
| `lib/types/user.ts` | User, Profile, Role |
| `lib/types/blog.ts` | BlogPost, Category, Author |
| `lib/types/admin.ts` | AdminAction, AdminUser, AdminStats |
| `lib/types/agent.ts` | Agent, AgentDeployment, AgentReview |
| `lib/types/product.ts` | Product, Order, OrderItem |
| `lib/types/marketplace.ts` | Listing, Creator, Sale |

Also:
- Remove all `any` types in `components/admin/EnhancedToolForm.tsx:14`
- Remove `session: any` in `components/Navigation.tsx:64`
- Enable stricter TypeScript in `tsconfig.json`

---

## 5. Route Cleanup (P0 Security)

### Delete These Routes Immediately
```
app/debug/page.tsx
app/debug-admin/page.tsx
app/debug-admin-blog/page.tsx
app/debug-blog/page.tsx
app/debug-supabase/page.tsx
app/simple-test/page.tsx      ← returns bare HTML, will cause hydration mismatch
app/test-simple/page.tsx
app/test-admin/page.tsx
app/test-automation/page.tsx
app/seed-blog/page.tsx
```

### Create These Missing Files
```
app/admin/layout.tsx          ← Admin shell layout
app/(auth)/layout.tsx         ← Auth pages layout group
app/(legal)/layout.tsx        ← Legal pages layout group
lib/hooks/useSearch.ts        ← Unified search hook
lib/types/agent.ts
lib/types/user.ts
lib/types/blog.ts
lib/types/admin.ts
lib/types/marketplace.ts
```

---

## 6. Performance Wins (P2)

### Memoization
Add `React.memo()` to:
- `components/ToolCard.tsx` — renders many times in grids
- `components/FeaturedToolsSection.tsx` — heavy tool list
- `components/MobileToolCard.tsx` (until merged)
- `components/AgentCard.tsx` (new component)

### Dynamic Imports
```typescript
// Framer Motion: only load on pages that animate
const AdvancedAnimations = dynamic(() => import('./AdvancedAnimations'), { ssr: false })

// Chart.js: only load in admin analytics
const AnalyticsCharts = dynamic(() => import('./admin/AnalyticsCharts'), { ssr: false })
```

### Loading States
Add `app/[route]/loading.tsx` files for:
- `app/AITools/loading.tsx`
- `app/agents/loading.tsx`
- `app/mcp-servers/loading.tsx`
- `app/products/loading.tsx`
- `app/blog/loading.tsx`

---

## 7. Component Inventory After Cleanup

| Category | Before | After |
|---|---|---|
| Search variants | 6 | 1 (+ hook) |
| Hero variants | 3 | 1 |
| Loading variants | 4 | 2 (LoadingState + Skeleton) |
| Error boundaries | 3 | 1 (+ display) |
| Newsletter variants | 4 | 1 (+ variants prop) |
| Tool card variants | 2 | 1 (responsive) |
| Total `'use client'` files | 150 | ~60 |
| Missing type files | 0 | 5 created |
| Debug/test pages | 9 | 0 (deleted) |
