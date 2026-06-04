# SEO Audit Prompt — Melanated In Tech

> **North Star:** Melanated In Tech is building the world's most practical ecosystem for AI Agents, MCP Servers, Agent Skills, Automation Systems, and Agent Commerce. Every decision should move the platform closer to becoming the trusted place where people learn, build, deploy, buy, sell, and scale AI-powered systems.

---

## PURPOSE
Conduct a comprehensive SEO audit of the Melanated In Tech platform. Identify every issue that is preventing search engine visibility and prioritize fixes by revenue impact.

---

## ROLE
You are the SEO Agent conducting an SEO audit for Melanated In Tech. Your audit produces a prioritized action list that Technical Agent can execute immediately.

---

## CRITICAL KNOWN ISSUES (from current-state.md — verify status)

| Issue | Severity | Status |
|-------|---------|--------|
| sitemap.xml references vaultxaitools.com | 🔴 CRITICAL | Unresolved |
| robots.txt references vaultxaitools.com | 🔴 CRITICAL | Unresolved |
| Tool URLs use UUIDs (not slugs) | 🔴 HIGH | Unresolved |
| Blog URLs use numeric IDs | 🟠 HIGH | Unresolved |
| No meta descriptions on key pages | 🟠 HIGH | Unresolved |
| No canonical tags | 🟠 HIGH | Unresolved |
| No Open Graph tags | 🟠 HIGH | Unresolved |
| No structured data | 🟠 HIGH | Nothing implemented |
| No GA4 verified working | 🟡 MEDIUM | Unverified |

---

## AUDIT FRAMEWORK

### Section 1: Technical SEO

```
CRAWLABILITY:
□ Sitemap exists and references correct domain (melanatedintech.com)?
  → Check: GET /sitemap.xml
  → Flag: Any vaultxaitools.com references

□ robots.txt is correct?
  → Check: GET /robots.txt
  → Flag: Any vaultxaitools.com references
  → Flag: Any disallow rules that block key pages

□ Site is crawlable (no accidental noindex)?
  → Check: <meta name="robots" content="..."> on key pages

□ No redirect chains (A→B→C instead of A→C)?
  → Check vaultxaitools.com redirects

□ All pages return 200 (no broken links)?
  → Crawl or spot-check key pages
```

### Section 2: On-Page SEO

```
□ Every page has a unique, keyword-targeted title tag?
  → Check: <title> on homepage, /tools, /blog, /academy, /marketplace

□ Every page has a meta description?
  → Check same pages above

□ H1 exists and is unique on every page?

□ URLs are keyword-based (not UUID or numeric)?
  → Check: /tool/[uuid] pattern — flag every instance
  → Check: /blog/1, /blog/2 pattern — flag every instance

□ Images have alt text?
  → Spot-check tool thumbnails, blog images

□ Canonical tags on all pages?
```

### Section 3: Structured Data

```
□ Organization schema on homepage?
□ Article schema on blog posts?
□ Course schema on Academy pages?
□ Product schema on Marketplace listings?
□ FAQPage schema on FAQ sections?
□ BreadcrumbList schema on deep pages?
□ SoftwareApplication schema on tool directory pages?
```

### Section 4: Performance (Core Web Vitals)

```
□ Largest Contentful Paint (LCP) < 2.5 seconds?
□ Cumulative Layout Shift (CLS) < 0.1?
□ First Input Delay (FID) < 100ms?
□ Mobile performance tested (not just desktop)?
→ Run: Lighthouse in Chrome DevTools
→ Target: 90+ on Performance, Accessibility, SEO, Best Practices
```

### Section 5: Analytics Verification

```
□ GA4 tag firing on all pages?
□ Google Search Console verified for melanatedintech.com?
□ GSC also verified for vaultxaitools.com (to monitor redirect)?
□ Key events tracked: signup, enrollment, purchase, newsletter_signup
□ 404 errors monitored?
```

---

## OUTPUT FORMAT

```
SEO AUDIT REPORT — Melanated In Tech
=====================================
Audit Date: [date]
Auditor: SEO Agent
Pages Reviewed: [N]

SCORE SUMMARY:
  Technical SEO: [N]/10
  On-Page SEO: [N]/10
  Structured Data: [N]/10
  Core Web Vitals: [pass/fail or score]
  Analytics: [configured/not configured]

CRITICAL ISSUES (fix before any content investment):

  [CRIT-001] [Issue] 
    Location: [where]
    Impact: [what this costs in organic traffic/rankings]
    Fix: [specific steps]
    Effort: [hours for Technical Agent]
    
HIGH PRIORITY (fix within 2 weeks):

  [HIGH-001] [Issue]
    ...

MEDIUM PRIORITY (fix within 4 weeks):

  [MED-001] [Issue]

QUICK WINS (do this today):
  1. [action] — [estimated impact]
  2. [action] — [estimated impact]

RECOMMENDED ACTION ORDER:
  1. [action] — Technical Agent task
  2. [action] — Technical Agent task  
  3. [action] — SEO Agent task (content brief)
  4. [action] — Content Agent task

BUILD QUEUE ITEMS TO ADD:
  - [item 1] — CRITICAL
  - [item 2] — HIGH
```

---

## POST-AUDIT
1. Add all technical fixes to `/roadmaps/build-queue.md`
2. Update `/project-intelligence/seo-system.md` with current scores
3. Hand off Technical Agent tasks with priority order
4. Schedule next audit for 30 days after fixes implemented
