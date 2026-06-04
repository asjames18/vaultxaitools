# SEO System — Melanated In Tech

> **North Star:** Melanated In Tech is building the world's most practical ecosystem for AI Agents, MCP Servers, Agent Skills, Automation Systems, and Agent Commerce. Every decision should move the platform closer to becoming the trusted place where people learn, build, deploy, buy, sell, and scale AI-powered systems.

---

> Current SEO status, known issues, keyword strategy, and technical requirements.

---

## Current SEO Health (June 2026)

| Category | Score | Status |
|----------|-------|--------|
| Technical SEO | 2/10 | 🔴 Critical |
| On-Page SEO | 2/10 | 🔴 Critical |
| Content SEO | 1/10 | 🔴 Critical |
| Off-Page / Authority | Unknown | 🟡 Assess |
| Structured Data | 0/10 | 🔴 None |
| Core Web Vitals | Unknown | 🟡 Assess |

**Summary:** The site has essentially zero SEO value in its current state. Every critical issue must be fixed before any content investment compounds. Fixing technical SEO first, then creating content, is the only correct order of operations.

---

## Critical Issues (Fix First)

### Issue 1: Domain/Sitemap Mismatch 🔴 URGENT
**Problem:** `sitemap.xml` and `robots.txt` reference `vaultxaitools.com`. The live domain is `melanatedintech.com`. Google is indexing the wrong domain and link equity is split.
**Fix:**
1. Update `next.config.js` sitemap host to `melanatedintech.com`
2. Update `robots.txt` to reference correct sitemap URL
3. Update all canonical tags in `app/layout.tsx`
4. Set up 301 redirects from `vaultxaitools.com` to `melanatedintech.com`
5. Submit new sitemap to Google Search Console (both properties)
6. Verify redirect chain in GSC coverage report

### Issue 2: Missing Meta Descriptions 🔴 URGENT
**Problem:** Homepage and all major pages are missing meta descriptions. Google writes its own snippets — which are always worse.
**Fix:** Add `generateMetadata()` to every page. Minimum pages:
- `/` (homepage)
- `/tools`
- `/about`
- `/blog`
- `/consulting`
- Every blog post
- Every tool page
- Every course page

### Issue 3: Non-SEO Tool URLs 🔴 HIGH
**Problem:** 38 tools use UUID-based URLs (`/tool/[uuid]`). These have zero keyword value and are opaque to crawlers.
**Fix:**
1. Add `slug` field to tools table
2. Generate slugs from tool names
3. Migrate to `/tools/[category]/[slug]`
4. Add 301 redirects from UUID URLs to slug URLs
5. Update sitemap to slug URLs only

### Issue 4: Blog URLs with Numeric IDs 🔴 HIGH
**Problem:** Sitemap lists `/blog/1`, `/blog/2`. Zero keyword value. Wastes crawl budget.
**Fix:**
1. Ensure all blog posts have slugs
2. Update sitemap generation to use slugs
3. Implement 301 redirects from `/blog/[id]` to `/blog/[slug]`

---

## High Priority Issues

### Issue 5: No Analytics 🟠 HIGH
**Problem:** No confirmed GA4 or GSC data. Losing baseline data every day.
**Fix:**
1. Install GA4 immediately — verify tag fires on all pages
2. Verify Google Search Console for both domains
3. Set up custom events: signup, enroll, tool_click, purchase, newsletter_subscribe
4. Configure GSC → link to GA4

### Issue 6: Missing Open Graph Tags 🟠 HIGH
**Problem:** No control over social appearance. Link sharing looks broken.
**Fix:** Add to all pages:
```html
<meta property="og:title" content="..." />
<meta property="og:description" content="..." />
<meta property="og:image" content="..." />
<meta property="og:url" content="..." />
<meta property="og:type" content="website" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:site" content="@melanatedintech" />
```
**OG Image:** Create a reusable `opengraph-image.tsx` template in Next.js App Router.

### Issue 7: No Structured Data 🟠 HIGH
**Problem:** Missing rich results for ratings, FAQs, courses, products.
**Fix — Implement these schemas:**

```typescript
// Organization schema (layout.tsx)
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Melanated In Tech",
  "url": "https://melanatedintech.com",
  "logo": "https://melanatedintech.com/logo.png",
  "description": "Global AI agent platform for Black and melanated professionals"
}

// Article schema (blog posts)
{
  "@type": "Article",
  "headline": post.title,
  "datePublished": post.published_at,
  "author": { "@type": "Person", "name": post.author_name }
}

// Course schema (academy)
{
  "@type": "Course",
  "name": course.title,
  "description": course.description,
  "provider": { "@type": "Organization", "name": "Melanated In Tech" }
}

// Product schema (marketplace)
{
  "@type": "Product",
  "name": product.title,
  "offers": { "@type": "Offer", "price": product.price_cents / 100 }
}
```

---

## URL Structure & Architecture

### Target URL Patterns

| Page Type | Pattern | SEO Value |
|-----------|---------|----------|
| Tools | `/tools/[category]/[slug]` | Category + tool name keywords |
| Blog | `/blog/[slug]` | Full keyword-rich slug |
| Course | `/academy/courses/[slug]` | Course topic keywords |
| Marketplace | `/marketplace/[category]/[slug]` | Product-specific search |
| Use Case | `/use-cases/ai-agent-for-[industry]` | High-intent landing pages |
| Category | `/tools/[category]` | Broad category search |

### URL Migration Map (Old → New)

| Old URL | New URL | Redirect |
|---------|---------|---------|
| `/AITools` | `/tools` | 301 permanent |
| `/tool/[uuid]` | `/tools/[category]/[slug]` | 301 via middleware lookup |
| `/categories` | `/tools` | 301 permanent |
| `/categories/[slug]` | `/tools/[slug]` | 301 permanent |
| `/blog/1`, `/blog/2` | `/blog/[actual-slug]` | 301 per post |
| `/submit-tool` | `/tools/submit` | 301 permanent |

**Implementation:** Use `next.config.js` `redirects` array for static redirects. UUID-to-slug redirects require middleware to look up slug from DB.

---

## Keyword Strategy

### Tier 1: Own Immediately (Low Competition, High Intent)

| Keyword | Monthly Volume | Difficulty | Content Type |
|---------|---------------|-----------|-------------|
| how to build an AI agent | 8,000 | Low | Tutorial + Pillar |
| MCP server tutorial | 2,000 | Very Low | Tutorial |
| AI agent for real estate | 1,500 | Very Low | Use Case Page |
| AI agent for customer service | 2,500 | Low | Use Case Page |
| build AI agent Claude | 900 | Very Low | Tutorial |
| local AI setup Ollama | 3,000 | Low | Tutorial |
| how to make money with AI agents | 1,200 | Low | Thought Leadership |
| n8n AI agent workflow | 1,800 | Low | Tutorial |
| prompt engineering advanced | 4,000 | Low | Tutorial |
| AI automation for small business | 2,200 | Low | Use Case Page |

### Tier 2: Target in 3–6 Months (Medium Competition)

| Keyword | Monthly Volume | Difficulty |
|---------|---------------|-----------|
| AI agent platform | 12,000 | Medium |
| prompt engineering course | 8,000 | Medium |
| MCP server examples | 3,000 | Low-Medium |
| AI agent marketplace | 5,000 | Medium |
| automation tools for business | 15,000 | Medium |
| AI certifications online | 6,000 | Medium |

### Tier 3: Earn Into (High Competition, Month 6+)

| Keyword | Monthly Volume | Difficulty |
|---------|---------------|-----------|
| AI tools | 500,000 | Very High |
| AI courses | 100,000 | High |
| best AI tools | 200,000 | High |
| ChatGPT alternatives | 150,000 | High |

**Rule:** Never waste Phase 1 content budget on Tier 3 keywords. The ROI timeline is 18+ months. Tier 1 and 2 can rank in 60–90 days with good content.

---

## Programmatic SEO (Phase 3)

Once foundational SEO is working, generate 100+ pages programmatically:

### Use Case Pages
Pattern: `/use-cases/ai-agent-for-[industry]`
Examples:
- `/use-cases/ai-agent-for-real-estate-agents`
- `/use-cases/ai-agent-for-law-firms`
- `/use-cases/ai-agent-for-e-commerce`
- `/use-cases/ai-agent-for-healthcare`
- (50+ pages)

### Tool Comparison Pages
Pattern: `/compare/[tool-a]-vs-[tool-b]`
Examples:
- `/compare/langchain-vs-langgraph`
- `/compare/n8n-vs-make`
- `/compare/claude-vs-gpt4-for-agents`
- (50+ pages)

### "Best X for Y" Pages
Pattern: `/best/[category]-for-[use-case]`
Examples:
- `/best/ai-agents-for-content-creation`
- `/best/prompt-engineering-courses`
- (25+ pages)

---

## Technical SEO Checklist

### Critical (Fix Before Launch)
- [ ] Fix sitemap.xml — reference melanatedintech.com
- [ ] Fix robots.txt — reference correct sitemap URL
- [ ] Install GA4 and verify all events
- [ ] Verify Google Search Console (both domains)
- [ ] Add meta descriptions to all existing pages
- [ ] Add canonical tags to all pages
- [ ] Migrate tool URLs from UUID to slugs + 301 redirects
- [ ] Fix blog URLs to slug-based

### High Priority (First Sprint Post-Launch)
- [ ] Implement Open Graph meta tags
- [ ] Implement Twitter Card tags
- [ ] Organization JSON-LD schema
- [ ] Article JSON-LD on all blog posts
- [ ] Course JSON-LD on all Academy pages
- [ ] Product JSON-LD on all marketplace listings
- [ ] Remove crawl-delay from robots.txt (unnecessary at current scale)
- [ ] CSP headers (security + SEO signal)

### Medium Priority (Month 2–3)
- [ ] Image alt text audit (all tool screenshots, blog images)
- [ ] Create image sitemap
- [ ] Check HTTPS mixed content
- [ ] Measure Core Web Vitals (aim for Lighthouse 90+)
- [ ] Implement breadcrumb navigation + BreadcrumbList schema
- [ ] FAQPage schema on relevant pages
- [ ] Internal linking strategy — map content to pillar pages

---

## Next.js SEO Implementation

```typescript
// app/blog/[slug]/page.tsx — Example of correct metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost(params.slug);
  return {
    title: `${post.seo_title || post.title} | Melanated In Tech`,
    description: post.seo_description || post.excerpt,
    canonical: `https://melanatedintech.com/blog/${params.slug}`,
    openGraph: {
      title: post.og_title || post.title,
      description: post.og_description || post.excerpt,
      url: `https://melanatedintech.com/blog/${params.slug}`,
      type: 'article',
      images: [{ url: post.og_image_url || '/og-default.png' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
    },
  };
}
```

---

## 90-Day SEO Targets

| Metric | Day 30 | Day 60 | Day 90 |
|--------|--------|--------|--------|
| Indexed pages | 25+ | 55+ | 80+ |
| Keyword rankings (any position) | 30+ | 100+ | 200+ |
| Organic sessions/month | 500 | 2,000 | 10,000 |
| Backlinks | 5 | 15 | 25+ |
| Core Web Vitals (LCP) | <2.5s | <2.5s | <2.5s |
| Lighthouse SEO score | 90+ | 95+ | 95+ |
