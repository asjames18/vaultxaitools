# Mobile-First Review — Melanated In Tech

> **North Star:** Melanated In Tech is building the world's most practical ecosystem for AI Agents, MCP Servers, Agent Skills, Automation Systems, and Agent Commerce. Every decision should move the platform closer to becoming the trusted place where people learn, build, deploy, buy, sell, and scale AI-powered systems.

---

## PURPOSE
Verify that every new page or component works perfectly on mobile before desktop. MIT's audience is on their phones — every broken mobile experience is a lost community member.

---

## MOBILE REVIEW CHECKLIST

### Test Viewports
- 375px (iPhone SE — minimum supported)
- 390px (iPhone 14)
- 414px (iPhone Plus)
- 768px (iPad)
- 1280px (desktop — verify enhancement, not baseline)

### Critical Mobile Tests

```
NAVIGATION:
□ Mobile nav accessible and usable (hamburger or bottom nav)?
□ Logo visible on mobile?
□ Sign in / Sign up reachable on mobile?

HERO / FIRST SCREEN:
□ H1 readable at 375px (not truncated, not tiny)?
□ Primary CTA visible WITHOUT scrolling on 375px?
□ Primary CTA full-width or minimum 280px wide?
□ CTA at least 44px tall (thumb-friendly)?
□ Subheadline readable (not too small)?

CONTENT:
□ No horizontal scroll at 375px?
□ All text min 16px on body copy?
□ Code blocks: scrollable horizontally (not overflowing)?
□ Tables: scrollable or stacked on mobile?
□ Images: not overflowing container?

FORMS:
□ Input fields full-width on mobile?
□ Labels visible (not just placeholder text)?
□ Keyboard doesn't cover submit button?
□ Auto-complete attributes set (email, name fields)?

SPACING:
□ Adequate tap target spacing (16px min between tappable elements)?
□ Padding keeps content from touching screen edges (min 16px)?
□ Sections have breathing room (not crammed)?

PERFORMANCE:
□ First load fast even on 4G?
□ No heavy images loading on mobile that aren't shown?
□ Lazy loading on below-fold images?
```

---

## TAILWIND RESPONSIVE PATTERN REFERENCE

```typescript
// Mobile-first class order: base (mobile) → sm → md → lg → xl

// Typography
className="text-2xl md:text-4xl lg:text-5xl"  // scales up, mobile first

// Grid
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"

// Padding
className="px-4 md:px-8 lg:px-16"  // mobile gets less padding

// Button (full width on mobile, auto on desktop)
className="w-full md:w-auto"

// CTA primary
className="w-full py-4 px-8 bg-[#00FF41] text-[#0A0A0A] font-bold rounded-lg
           hover:bg-[#00CC33] transition-colors md:w-auto"

// Navigation (hide desktop, show mobile)
className="block md:hidden"  // mobile only
className="hidden md:block"  // desktop only

// Code blocks (prevent overflow)
className="overflow-x-auto"  // on <pre> elements
```

---

## OUTPUT FORMAT

```
MOBILE REVIEW REPORT
====================
Page/Component: [name]
Tested Viewports: 375px, 768px, 1280px
Date: [date]

375px RESULTS:
  ✅ CTA visible above fold
  ✅ No horizontal scroll
  ❌ Code block overflowing — Add overflow-x-auto to <pre> wrapper
  ❌ H1 font-size too small (18px) — Change to text-2xl minimum on mobile

768px RESULTS:
  ✅ Grid switches to 2 columns correctly
  ⚠️  Spacing between sections feels tight — suggest mb-16 instead of mb-8

1280px RESULTS:
  ✅ Desktop layout renders correctly

BLOCKING ISSUES (must fix before ship):
  1. [issue + specific fix]
  2. [issue + specific fix]

NON-BLOCKING (fix in next pass):
  1. [suggestion]
```
