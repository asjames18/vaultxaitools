# Accessibility UI Audit — Melanated In Tech
**Date:** June 2026 | Standard: WCAG 2.1 Level AA

---

## Overall Accessibility Score: 4/10

**WCAG 2.1 Level AA: FAIL**
**WCAG 2.1 Level A: FAIL** (keyboard navigation failures)

The site has a solid structural foundation (skip link, semantic HTML, dark mode) but fails on three critical criteria: keyboard focus visibility, form labeling, and reduced-motion support. These are not cosmetic — they are functional barriers for users with disabilities.

---

## WCAG 2.1 Compliance Table

| Criterion | Level | Status | Details |
|---|---|---|---|
| 1.1.1 Non-text Content | A | ✅ PASS | Logo has alt text; decorative icons unmarked |
| 1.3.1 Info & Relationships | A | ⚠️ PARTIAL | Email form lacks label; some headings skipped |
| 1.3.2 Meaningful Sequence | A | ✅ PASS | DOM order matches visual order |
| 1.4.1 Use of Color | A | ✅ PASS | Not sole means of conveying info |
| 1.4.3 Contrast (Minimum) | AA | ❌ FAIL | Placeholder text likely below 4.5:1 |
| 1.4.4 Resize Text | AA | ✅ PASS | Responsive; no fixed px font sizes on body |
| 1.4.10 Reflow | AA | ✅ PASS | Responsive layout reflows on small screens |
| 1.4.11 Non-text Contrast | AA | ⚠️ PARTIAL | Icon buttons may not meet 3:1 |
| 1.4.12 Text Spacing | AA | ✅ PASS | No CSS overrides that break text spacing |
| 1.4.13 Content on Hover | AA | ✅ PASS | Tooltips dismissable |
| 2.1.1 Keyboard | A | ❌ FAIL | Nav links not keyboard-reachable with visible focus |
| 2.1.2 No Keyboard Trap | A | ✅ PASS | No traps detected |
| 2.4.1 Bypass Blocks | A | ✅ PASS | Skip link present in layout.tsx:115-117 |
| 2.4.3 Focus Order | A | ⚠️ PARTIAL | Order logical; focus visibility missing |
| 2.4.7 Focus Visible | AA | ❌ FAIL | Most interactive elements have no visible focus |
| 2.5.5 Target Size | AAA | ✅ PASS | Most touch targets ≥44×44px |
| 3.1.1 Language of Page | A | ✅ PASS | `lang="en"` on `<html>` |
| 3.3.1 Error Identification | A | ✅ PASS | Form errors displayed |
| 3.3.2 Labels or Instructions | A | ❌ FAIL | Email input has no label |
| 4.1.1 Parsing | A | ✅ PASS | Next.js generates valid HTML |
| 4.1.2 Name, Role, Value | A | ⚠️ PARTIAL | Favorite button inconsistent |
| 4.1.3 Status Messages | AA | ⚠️ PARTIAL | Toast messages; ARIA role not confirmed |

---

## Critical Failures (Must Fix Before Launch)

### Failure 1: No Visible Focus Indicators on Navigation

**WCAG:** 2.4.7 Focus Visible (Level AA) — **FAIL**

**Location:** `components/Navigation.tsx:135-161`

**Current state:**
```tsx
className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors 
  text-gray-300 hover:text-green-400`}
// No focus-visible styling
```

**Fix:**
```tsx
className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors 
  text-gray-300 hover:text-green-400
  focus-visible:outline-2 focus-visible:outline-green-500 focus-visible:outline-offset-2`}
```

Apply to ALL navigation links, buttons, and interactive elements site-wide.

---

### Failure 2: Email Capture Form Has No Label

**WCAG:** 3.3.2 Labels or Instructions (Level A) — **FAIL**
**WCAG:** 1.3.1 Info & Relationships (Level A) — **PARTIAL**

**Location:** `components/EmailCapture.tsx:34-51`

**Current state:**
```tsx
<input
  type="email"
  placeholder="Enter your email"
  // No <label>, no aria-label, no aria-labelledby
/>
```

**Fix:**
```tsx
<label htmlFor="email-capture" className="sr-only">
  Email address
</label>
<input
  id="email-capture"
  type="email"
  placeholder="Enter your email"
  aria-describedby="email-capture-hint"
/>
<span id="email-capture-hint" className="sr-only">
  We'll send you weekly agent blueprints. Unsubscribe anytime.
</span>
```

---

### Failure 3: No `prefers-reduced-motion` Support

**WCAG:** 2.3.3 Animation from Interactions (Level AAA) — but this also affects usability for vestibular disorder users.

**Location:** `app/globals.css` — completely missing

**Current animations running infinitely:**
- `blob` — 7s infinite ease-in-out (background blob)
- `float` — 6s infinite ease-in-out (floating elements)
- `shimmer` — 2s infinite (loading states)
- `pulse-slow` — 3s infinite (badge indicator)

**Fix — add to `app/globals.css`:**
```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

### Failure 4: Hero CTA Buttons Have No Focus Styling

**WCAG:** 2.4.7 Focus Visible (Level AA) — **FAIL**

**Location:** `components/MITHero.tsx:26-37`

**Current state:**
```tsx
<Link href="/agents" className="bg-green-500 text-black ...">
  Browse Agents
</Link>
// No focus-visible class
```

**Fix:**
```tsx
<Link href="/agents" className="bg-green-500 text-black ...
  focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2">
  Browse Agents
</Link>
```

---

## High Priority Issues (Fix This Sprint)

### Issue 5: Heading Hierarchy

**WCAG:** 1.3.1 Info & Relationships — **PARTIAL**

**Problem:** The main `<h1>` is inside `MITHero.tsx` but `HomeClient.tsx` has multiple `<h2>` sections. Ensure heading hierarchy is:

```
<h1> "The Practical Ecosystem for AI Agent Commerce" (MITHero)
  <h2> "Featured Agents" (FeaturedToolsSection)
  <h2> "From the Blog" (blog section)
  <h2> "How It Works" (curation section)
  <h2> "Find Your Perfect Agent" (search section)
```

**Check:** Verify no heading levels are skipped in any section.

---

### Issue 6: ARIA Inconsistency on Favorite Button

**WCAG:** 4.1.2 Name, Role, Value — **PARTIAL**

**Problem:**
- `ToolCard.tsx:69` — ✅ has `aria-label="Favorite [tool name]"`
- `FeaturedToolsSection.tsx:57` — ⚠️ only has `title` attribute (not read by all screen readers)

**Fix in FeaturedToolsSection.tsx:**
```tsx
// Change:
<button title="Add to favorites">
// To:
<button aria-label={`${isFavorited ? 'Remove from favorites' : 'Add to favorites'}: ${tool.name}`}>
```

---

### Issue 7: Contrast — Placeholder Text

**WCAG:** 1.4.3 Contrast Minimum — **LIKELY FAIL**

**Location:** `components/EmailCapture.tsx:42`

`placeholder-gray-500` (`#6B7280`) on `bg-white/5` (near-transparent on dark) requires verification.

**Tool:** Run through [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/).

**Likely fix:** Change to `placeholder-gray-400` (`#9CA3AF`) for higher contrast.

---

### Issue 8: Search Input Missing Label

**WCAG:** 3.3.2 Labels or Instructions — **FAIL**

**Location:** `components/EnhancedSearch.tsx`

**Fix:**
```tsx
<label htmlFor="search-input" className="sr-only">Search agents and tools</label>
<input id="search-input" type="text" ... />
```

---

## Medium Priority Issues

### Issue 9: Compare Button `aria-pressed` Usage

**Location:** `components/ToolCard.tsx:105-106`

✅ **Already good** — `aria-pressed` and `aria-label` present. This is a positive example to replicate.

---

### Issue 10: Toast/Status Messages

**WCAG:** 4.1.3 Status Messages — **UNCONFIRMED**

Toast notifications need `role="status"` (or `role="alert"` for errors) so screen readers announce them.

**Check:** Verify toast component includes appropriate ARIA role.

---

### Issue 11: Mobile Navigation Close Button

**Location:** `components/Navigation.tsx:262`

✅ **Already has** `focus-visible:outline-2 focus-visible:outline-green-500` — good example.

Use this pattern as the template for all other interactive elements.

---

### Issue 12: Admin Table Accessibility

**Location:** Admin pages with data tables

**Issues:**
- Tables likely missing `<caption>` elements
- Column headers should use `<th scope="col">`
- Sortable columns need `aria-sort` attribute

---

## What Works Well (Keep These)

| Feature | Location | Status |
|---|---|---|
| Skip link | `app/layout.tsx:115-117` | ✅ Properly implemented |
| `lang="en"` on `<html>` | `app/layout.tsx` | ✅ |
| `<nav>` semantic element | `Navigation.tsx:119` | ✅ |
| `<main id="main-content">` | `app/layout.tsx:120` | ✅ |
| `<footer>` semantic | `components/Footer.tsx` | ✅ |
| `role="status"` on loading | `LoadingStates.tsx:76` | ✅ |
| `aria-pressed` on compare | `ToolCard.tsx:105` | ✅ |
| `aria-label` on favorite | `ToolCard.tsx:69` | ✅ |
| Logo alt text | `Navigation.tsx:124`, `Footer.tsx:48` | ✅ |
| Dark mode toggle | `Navigation.tsx:169-175` | ✅ |
| `suppressHydrationWarning` | `app/layout.tsx:98-102` | ✅ |

---

## Accessibility Implementation Checklist

### P0 — Before Any Public Launch
- [ ] Add `@media (prefers-reduced-motion: reduce)` to `app/globals.css`
- [ ] Add `<label>` to email capture input (`components/EmailCapture.tsx`)
- [ ] Add `focus-visible:outline-2 focus-visible:outline-green-500` to ALL nav links
- [ ] Add focus ring to hero CTA buttons (`components/MITHero.tsx`)
- [ ] Add `<label>` to search input (`components/EnhancedSearch.tsx`)

### P1 — Before MVP Launch
- [ ] Fix heading hierarchy on homepage (verify h1 → h2 → h3 order)
- [ ] Change `title` to `aria-label` on FeaturedToolsSection favorite button
- [ ] Verify and fix placeholder text contrast ratio
- [ ] Add `role="status"` or `role="alert"` to toast messages
- [ ] Add focus ring to all `<Link>` and `<button>` elements throughout site

### P2 — Quality Improvement
- [ ] Add `<caption>` and `<th scope="col">` to admin tables
- [ ] Add `aria-sort` to sortable table columns
- [ ] Add `role="region"` with `aria-label` to major page sections
- [ ] Use `<article>` tag for tool and agent cards
- [ ] Test with NVDA (Windows), JAWS, VoiceOver (Mac) screen readers
- [ ] Run full automated audit with axe-core or Lighthouse

### P3 — Polish
- [ ] Add visible focus color for light mode (currently only dark mode focus ring)
- [ ] Add `aria-live` region for dynamic content updates (search results count)
- [ ] Add keyboard shortcut for search (Ctrl+K pattern)
- [ ] Ensure all modals trap focus while open and restore focus on close
