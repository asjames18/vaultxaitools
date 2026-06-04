# UI Upgrade Plan — Melanated In Tech
**Date:** June 2026

---

## Strategic Context

Melanated In Tech is transitioning from an AI **learning/curation hub** to the world's most practical **ecosystem for AI Agents, MCP Servers, Agent Skills, Automation Systems, Prompt Packs, Blueprints, and Agent Commerce**.

The UI upgrade plan must:
1. Reposition the brand without breaking what works
2. Surface marketplace mechanics and revenue paths
3. Fix accessibility failures before launch
4. Maintain the strong dark/green visual identity
5. Incrementally upgrade — not rebuild from scratch

---

## Phase 1: Security-Safe UI Cleanup & Homepage Upgrade
**Timeline: Sprint 1 (Week 1–2)**

### 1.1 Critical Bug Fixes
- [ ] Fix non-functional "How it works" CTA button → link to `/getting-started`
  - File: `components/HomeHeroSection.tsx:96-101`
- [ ] Fix "AI Consulting" Quick Action → redirect to `/contact` or remove
  - File: `components/QuickActions.tsx:35`
- [ ] Delete or auth-gate all 9 debug/test pages
  - Files: `app/debug/`, `app/debug-admin/`, `app/debug-blog/`, `app/debug-supabase/`, `app/simple-test/`, `app/test-simple/`, `app/test-admin/`, `app/test-automation/`, `app/seed-blog/`

### 1.2 Accessibility Baseline Fixes
- [ ] Add `@media (prefers-reduced-motion: reduce)` to `app/globals.css`
- [ ] Add `<label htmlFor="email" className="sr-only">` to `components/EmailCapture.tsx`
- [ ] Add `focus-visible:outline-2 focus-visible:outline-green-500` to all nav links
  - File: `components/Navigation.tsx:135-161`
- [ ] Add `focus-visible` to hero CTA buttons
  - File: `components/MITHero.tsx:26-37`
- [ ] Change FeaturedToolsSection favorite button `title` → `aria-label`
  - File: `components/FeaturedToolsSection.tsx:57`

### 1.3 Homepage Copy Upgrade
- [ ] Rewrite hero headline from "The AI Hub Built For Us" → agent commerce positioning
  - Proposed: "The Practical Ecosystem for AI Agent Commerce"
  - File: `components/MITHero.tsx:15`
- [ ] Rewrite hero sub-headline to mention deploy, monetize, automate
- [ ] Update rotating headlines in `app/HomeClient.tsx:51-57` to reflect agent ecosystem
- [ ] Reframe email capture copy: "Get Weekly Agent Blueprints" instead of "AI tools drops"
  - File: `components/EmailCapture.tsx`
- [ ] Replace "Get Started" and "AI Consulting" Quick Actions with "Marketplace" and "Blueprints"
  - File: `components/QuickActions.tsx`
- [ ] Update testimonials to include at least 2 deployment/revenue outcome stories
  - File: `components/HomeHeroSection.tsx:126-161`

### 1.4 Navigation Parity
- [ ] Add "Favorites" and "Compare" to desktop navigation
  - File: `components/Navigation.tsx`
- [ ] Ensure mobile nav matches desktop nav items (currently mobile has more items)
- [ ] Add "Agents", "MCP Servers", and "Marketplace" to nav
- [ ] Audit footer links to ensure nav consistency

---

## Phase 2: Agent Academy, Agent Directory, MCP Directory
**Timeline: Sprint 2 (Week 3–4)**

### 2.1 Agent Directory Upgrade
- [ ] Add complexity badges (Beginner / Intermediate / Advanced / Production)
- [ ] Add deployment type filter (API, Webhook, Standalone, Integration)
- [ ] Add creator profile card to each agent listing
- [ ] Add "Deploy this Agent" primary CTA per listing
- [ ] Add agent metrics (users, reviews, deployment count)
- [ ] Rewrite agents hero: "Production-ready agents for automation at scale"

### 2.2 MCP Server Directory Upgrade
- [ ] Add security audit badge (Reviewed / Community / Unverified)
- [ ] Add integration difficulty level
- [ ] Show pricing/licensing model (free tier, premium, enterprise)
- [ ] Add "Use in your Agent" CTA
- [ ] Add server uptime / reliability indicator

### 2.3 Skills Directory Upgrade
- [ ] Add "How to integrate" quick-start guide per skill
- [ ] Add compatible agents list
- [ ] Add skill pricing if premium
- [ ] Add skill category filter (SEO, Content, Research, Code Review, etc.)

### 2.4 Blog Integration
- [ ] Add "Related Tools" section to each blog post (min. 3 tool cards)
- [ ] Add "Agents that can automate this" section to blog posts
- [ ] Add email capture at end of every blog post
- [ ] Add "Related Posts" navigation at bottom

### 2.5 Admin Layout Shell
- [ ] Create `app/admin/layout.tsx` with sidebar navigation
- [ ] Include user info, role badge, quick links to tools/blog/analytics
- [ ] Add loading states to all admin route pages

---

## Phase 3: Stripe Product Pages & Checkout Flow
**Timeline: Sprint 3 (Week 5–6)**

### 3.1 Product Page Upgrade
- [ ] Add "What you'll build" section to every product page
- [ ] Add "Use cases" section (3 ideal use cases)
- [ ] Add creator profile (name, photo, credentials)
- [ ] Add "Frequently Bought Together" section
- [ ] Add "Related Agents & MCP Servers" cross-sell section

### 3.2 Checkout Flow Improvements
- [ ] Add progress indicator (Step 1: Details → Step 2: Payment → Step 3: Done)
- [ ] Add trust signals on checkout page (secure badge, refund policy)
- [ ] Add order summary sidebar

### 3.3 Checkout Success Page Overhaul
- [ ] Add "Quick Start" section: "Deploy [Product] in 5 steps"
- [ ] Add "You might also like" related products (3 cards)
- [ ] Add "Join the builder community" CTA (Slack/Discord)
- [ ] Add "Share what you built" social prompt
- [ ] Trigger post-purchase email automation sequence

### 3.4 Email Sequence (Post-Purchase)
- Email 1: Confirmation + download link (immediate)
- Email 2: Getting started guide (Day 1)
- Email 3: Tutorial / how others use this (Day 3)
- Email 4: Invite to community (Day 7)
- Email 5: "What did you build?" follow-up (Day 14)

---

## Phase 4: Marketplace UX Expansion
**Timeline: Sprint 4 (Week 7–9)**

### 4.1 Marketplace Discovery
- [ ] Add marketplace landing page with featured agents, top MCP servers, bestselling products
- [ ] Add "New this week" section
- [ ] Add "Top builders" leaderboard
- [ ] Add marketplace search with cross-type results (agents + products + skills)
- [ ] Add "trending tags" (automation, customer-support, research, content-generation)

### 4.2 Creator Dashboard
- [ ] Build creator/seller dashboard (sales, downloads, reviews, revenue)
- [ ] Add agent performance metrics (deployment count, uptime, user ratings)
- [ ] Add "Publish a new agent / skill / MCP server" flow
- [ ] Add revenue history and payout settings

### 4.3 Marketplace Commerce UI
- [ ] Agent/product ratings and reviews system
- [ ] "Featured by MIT" badge for curated top picks
- [ ] Bundle products (Agent + MCP Server + Skill Pack = complete system)
- [ ] Compare two agents side-by-side

### 4.4 Tool Directory Evolution
- [ ] Cross-link tools → agents that use them
- [ ] Add "Build an agent using this tool" CTA on tool detail pages
- [ ] Deprecate pure tool curation in favor of agent ecosystem framing

---

## Phase 5: Community & Account Dashboard
**Timeline: Sprint 5 (Week 10–12)**

### 5.1 Account Dashboard Upgrade
- [ ] Show purchased products, deployed agents, favorited tools
- [ ] Add learning progress tracker (optional for education tier)
- [ ] Add agent deployment history and stats
- [ ] Add referral code and affiliate dashboard

### 5.2 Community Integration
- [ ] Add community feed or forum teaser on homepage
- [ ] Show "what builders are making" social proof section
- [ ] Creator spotlights ("Builder of the Month")
- [ ] "Share your automation" submission form

### 5.3 Membership/Subscription Tier (Optional)
- [ ] Define free vs. pro vs. creator tiers
- [ ] Show locked content with upgrade prompt
- [ ] Add "Pro" badge to creator profiles

---

## Design System Changes Per Phase

| Phase | Design System Change |
|---|---|
| 1 | Focus rings, reduced-motion, label fixes (no visual change) |
| 2 | New agent card component, creator profile card, badge system |
| 3 | Progress indicator, checkout trust signals, product detail sections |
| 4 | Marketplace browse UI, rating stars, leaderboard cards |
| 5 | Community feed component, profile dashboard layout |

---

## What NOT to Change

- Dark-first color scheme (green/black/gray) — strong brand identity, keep it
- Tailwind spacing and component patterns — consistent, don't introduce new system
- Lucide icons — consistent throughout, don't swap
- Card radius pattern (`rounded-xl/2xl`) — cohesive feel
- Geist Sans typography — clean, modern, legible
- `border-gray-700` card borders — consistent definition
- Server component architecture — maintain page.tsx + Client.tsx pattern
