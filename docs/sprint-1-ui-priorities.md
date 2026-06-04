# Sprint 1 UI Priorities — Melanated In Tech
**Date:** June 2026 | Goal: Ship a clean, commerce-ready MVP homepage

---

## Sprint 1 Objective

Fix all broken UI, close accessibility failures, and reposition the homepage for agent commerce — without rebuilding what works.

**Principle:** Security → Accessibility → Messaging → Navigation → Revenue

---

## P0 — Must Fix Before Sprint 1 Launch

These block a safe, credible public launch.

### Security Cleanup
| # | Task | File | Effort |
|---|---|---|---|
| S1 | Delete 9 debug/test pages | `app/debug/`, `app/test-*/`, `app/seed-blog/`, `app/simple-test/` | 30 min |
| S2 | Verify debug pages return 404 after deletion | N/A | 15 min |

### Accessibility Baseline
| # | Task | File | Effort |
|---|---|---|---|
| A1 | Add `@media (prefers-reduced-motion: reduce)` block | `app/globals.css` | 15 min |
| A2 | Add `<label htmlFor="email-capture">` to email form | `components/EmailCapture.tsx` | 15 min |
| A3 | Add `focus-visible:outline-2 focus-visible:outline-green-500` to all nav links | `components/Navigation.tsx:135-161` | 30 min |
| A4 | Add focus ring to hero CTA links | `components/MITHero.tsx:26-37` | 15 min |
| A5 | Add `<label>` to search input | `components/EnhancedSearch.tsx` | 15 min |
| A6 | Change `title` to `aria-label` on FeaturedToolsSection favorite button | `components/FeaturedToolsSection.tsx:57` | 10 min |

### Broken CTA Fixes
| # | Task | File | Effort |
|---|---|---|---|
| C1 | Fix "How it works" button — link to `/getting-started` | `components/HomeHeroSection.tsx:96-101` | 10 min |
| C2 | Fix "AI Consulting" Quick Action — redirect to `/contact` | `components/QuickActions.tsx:35` | 10 min |

**P0 Total Estimated Effort: ~2.5 hours**

---

## P1 — Needed for MVP Launch

These items make the site credible for the agent commerce direction.

### Homepage Messaging
| # | Task | File | Effort |
|---|---|---|---|
| M1 | Rewrite hero headline → agent commerce positioning | `components/MITHero.tsx:15` | 30 min |
| M2 | Rewrite hero sub-headline → deploy, monetize, automate | `components/MITHero.tsx:16-22` | 20 min |
| M3 | Update rotating homepage headlines (5 lines) | `app/HomeClient.tsx:51-57` | 20 min |
| M4 | Reframe email capture: "Get Agent Blueprints" | `components/EmailCapture.tsx` | 20 min |
| M5 | Swap QuickActions: Remove "AI Consulting"; add "Marketplace" | `components/QuickActions.tsx` | 30 min |
| M6 | Replace 1–2 learning testimonials with deployment/revenue outcomes | `components/HomeHeroSection.tsx:126-161` | 45 min |
| M7 | Update hero stats: add commerce metrics | `components/MITHero.tsx:48-65` | 20 min |

### Navigation
| # | Task | File | Effort |
|---|---|---|---|
| N1 | Add Favorites and Compare icons to desktop nav | `components/Navigation.tsx` | 45 min |
| N2 | Add "Agents" and "MCP Servers" to desktop nav | `components/Navigation.tsx` | 30 min |
| N3 | Sync mobile nav items to match new desktop nav | `components/MobileNavigation.tsx` | 30 min |

### Admin Layout
| # | Task | File | Effort |
|---|---|---|---|
| AD1 | Create `app/admin/layout.tsx` with shared sidebar shell | New file | 2 hrs |

### Checkout Success Page
| # | Task | File | Effort |
|---|---|---|---|
| CH1 | Add "Quick Start Guide" section (3-step deploy) | `app/checkout/success/SuccessContent.tsx` | 1.5 hrs |
| CH2 | Add "Related Products" (3 cards) to success page | `app/checkout/success/SuccessContent.tsx` | 1 hr |
| CH3 | Add "Join Community" CTA to success page | `app/checkout/success/SuccessContent.tsx` | 30 min |

**P1 Total Estimated Effort: ~9 hours**

---

## P2 — Nice Improvements (If Time Allows)

These improve quality but don't block launch.

### Conversion
| # | Task | File | Effort |
|---|---|---|---|
| CV1 | Add email capture at bottom of every blog post | `app/blog/[slug]/BlogPostClient.tsx` | 1 hr |
| CV2 | Add "Related Tools" section to blog posts | `app/blog/[slug]/BlogPostClient.tsx` | 1.5 hrs |
| CV3 | Add "What you'll build" section to product pages | `app/products/[slug]/page.tsx` | 1 hr |
| CV4 | Add use-cases section to product pages | `app/products/[slug]/page.tsx` | 45 min |

### Accessibility
| # | Task | File | Effort |
|---|---|---|---|
| AC1 | Fix placeholder text contrast (gray-500 → gray-400) | `components/EmailCapture.tsx` | 10 min |
| AC2 | Verify heading h1→h2→h3 order across all pages | Multiple | 1 hr |
| AC3 | Add `role="status"` to toast messages | Toast component | 15 min |

### Component Cleanup
| # | Task | File | Effort |
|---|---|---|---|
| CC1 | Remove `'use client'` from `components/JsonLd.tsx` | `components/JsonLd.tsx` | 10 min |
| CC2 | Remove `'use client'` from `components/TrustBadges.tsx` | `components/TrustBadges.tsx` | 10 min |
| CC3 | Remove `'use client'` from `components/icons/*` | All icon files | 30 min |
| CC4 | Consolidate AdminLoadingStates → LoadingStates | `components/AdminLoadingStates.tsx` | 45 min |

---

## P3 — Future Polish

Do these in Sprint 2+.

- Full component deduplication (search, hero, newsletter variants)
- Creator/seller onboarding flow
- Agent directory deployment badges
- MCP server pricing tier display
- Subscription tier UI
- Screen reader testing (NVDA, VoiceOver)
- Admin mobile optimization
- Dynamic imports for Framer Motion and Chart.js
- React.memo() on ToolCard, FeaturedToolsSection

---

## Sprint 1 Definition of Done

Before Sprint 1 ships, verify:

- [ ] No 404 errors on any CTA button or nav link
- [ ] All debug/test pages return 404
- [ ] Tab through the homepage — every element gets a visible green focus ring
- [ ] Email input has a screen-reader-accessible label
- [ ] Homepage `<h1>` references agent commerce, not just learning
- [ ] Email capture says "Agent Blueprints" or similar, not "AI tools drops"
- [ ] Desktop nav includes Agents, MCP Servers, Favorites, Compare
- [ ] Checkout success page has at least: download, 3-step guide, community CTA
- [ ] Admin pages load inside a consistent layout shell
- [ ] Chrome DevTools Lighthouse Accessibility score ≥ 75

---

## Sprint 1 Story Points Estimate

| Priority | Tasks | Est. Hours |
|---|---|---|
| P0 | 8 tasks | 2.5 hrs |
| P1 | 14 tasks | 9 hrs |
| P2 (selected) | 6 tasks | 3 hrs |
| **Total** | **28 tasks** | **~14.5 hrs** |

Comfortable for 1 developer in a 2-week sprint alongside backend work.

---

## Files Touched in Sprint 1

```
app/globals.css                         ← reduced-motion
app/admin/layout.tsx                    ← new admin shell
app/checkout/success/SuccessContent.tsx ← onboarding overhaul
app/HomeClient.tsx                      ← headline rotation update
components/MITHero.tsx                  ← hero copy rewrite
components/Navigation.tsx               ← focus rings + new nav items
components/MobileNavigation.tsx         ← sync nav items
components/EmailCapture.tsx             ← label + copy update
components/QuickActions.tsx             ← remove broken link; add Marketplace
components/HomeHeroSection.tsx          ← fix "How it works" button
components/FeaturedToolsSection.tsx     ← aria-label on favorite
components/EnhancedSearch.tsx           ← label for input
components/JsonLd.tsx                   ← remove 'use client'
components/TrustBadges.tsx              ← remove 'use client'

DELETE:
app/debug/page.tsx
app/debug-admin/page.tsx
app/debug-admin-blog/page.tsx
app/debug-blog/page.tsx
app/debug-supabase/page.tsx
app/simple-test/page.tsx
app/test-simple/page.tsx
app/test-admin/page.tsx
app/test-automation/page.tsx
app/seed-blog/page.tsx
```
