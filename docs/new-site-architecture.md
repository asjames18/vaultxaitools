# Melanated In Tech — New Site Architecture

---

**Purpose:** Complete sitemap, navigation structure, and information architecture for the future Melanated In Tech platform. This is the blueprint for all URL design, navigation decisions, and page creation.

**Owner:** Technical Lead / UX Lead

**Dependencies:** `project-brief.md`, `product-catalog.md`, `ux-ui-architecture.md` (this document is a summary; see the UX/UI Architecture section of `homepage-wireframe.md` for full wireframe details)

**Status:** Active — v1.0. Some sections (Academy, Marketplace, Community) are forward-looking and require platform features not yet built.

**Last Updated:** 2026-06-03

**Next Actions:** Implement Phase 1 pages (homepage, about, tools, blog, consulting) first; add Academy and Marketplace as those features are built

---

## Primary Navigation (Future State)

**Desktop Nav:** Learn | Build | Explore | Community | Pricing | [Search Icon] | Sign In | Get Started

Each primary nav item opens a mega-menu:

**Learn** → Academy Overview, Learning Tracks, All Courses, Workshops, Certifications, Bootcamps, Free Resources
**Build** → Marketplace, AI Agents, MCP Servers, Prompt Library, Skills, Blueprints, Bundles, Tools Directory
**Explore** → Blog, News, Case Studies, Consulting, Enterprise, Roadmap
**Community** → Feed, Forums, Events, Showcase, Leaderboard, Challenges

**Mobile Nav:** Hamburger → full-screen sheet with accordion sections

---

## Complete Sitemap

### Root / Marketing
```
/                                   → Homepage
/about                              → About Melanated In Tech
/about/mission                      → Mission & Values
/about/team                         → Team
/about/press                        → Press & Media Kit
/careers                            → Careers
/blog                               → Blog / Editorial
/blog/[slug]                        → Individual Blog Post
/contact                            → Contact
/status                             → Platform Status
/roadmap                            → Public Product Roadmap
/pricing                            → Pricing Page (all tiers)
/pricing/compare                    → Feature Comparison Table
```

### Academy (Learning Platform)
```
/academy                            → Academy Homepage / Course Catalog
/academy/tracks                     → Learning Tracks Overview
/academy/tracks/[slug]              → Individual Track (e.g., AI Agent Engineering)
/academy/courses                    → All Courses
/academy/courses/[slug]             → Course Detail Page
/academy/courses/[slug]/learn       → In-Course Learning Interface
/academy/courses/[slug]/learn/[id]  → Individual Lesson
/academy/workshops                  → Live Workshops
/academy/certifications             → Certifications Overview
/academy/certifications/[slug]      → Certification Detail
/academy/certifications/verify/[id] → Public Credential Verification
/academy/instructors                → Instructor Directory
/academy/instructors/[slug]         → Instructor Profile Page
/academy/instructors/apply          → Become an Instructor
/academy/free                       → Free Resources Hub
/academy/bootcamps                  → Intensive Bootcamps
```

### Marketplace
```
/marketplace                        → Marketplace Homepage
/marketplace/agents                 → AI Agents Category
/marketplace/agents/[slug]          → Agent Detail Page
/marketplace/mcp-servers            → MCP Servers Category
/marketplace/mcp-servers/[slug]     → MCP Server Detail
/marketplace/prompts                → Prompt Library Category
/marketplace/prompts/[slug]         → Prompt Pack Detail
/marketplace/skills                 → Agent Skills Category
/marketplace/skills/[slug]          → Skill Detail
/marketplace/blueprints             → Blueprints Category
/marketplace/blueprints/[slug]      → Blueprint Detail
/marketplace/bundles                → Curated Bundles
/marketplace/bundles/[slug]         → Bundle Detail
/marketplace/new                    → Newly Listed Products
/marketplace/trending               → Trending Products
/marketplace/free                   → Free Products
/marketplace/submit                 → Submit a Product
/marketplace/seller/apply           → Become a Seller
/checkout                           → Checkout
/checkout/success                   → Order Confirmation
/checkout/cancel                    → Checkout Cancelled
```

### Tools Directory (Existing — Enhanced)
```
/tools                              → Tools Directory Homepage (was /AITools)
/tools/[category]                   → Category Page (was /categories/[slug])
/tools/[category]/[slug]            → Tool Detail (was /tool/[uuid])
/tools/compare                      → Tool Comparison
/tools/submit                       → Submit a Tool (was /submit-tool)
/tools/trending                     → Trending Tools
/tools/daily                        → Daily Tool Pick
```

### Community
```
/community                          → Community Hub
/community/feed                     → Activity Feed
/community/forum                    → Discussion Forums
/community/forum/[category]         → Forum Category
/community/forum/[category]/[slug]  → Thread
/community/members                  → Member Directory
/community/members/[username]       → Public Member Profile
/community/events                   → Events
/community/events/[slug]            → Event Detail
/community/showcase                 → Project Showcase
/community/leaderboard              → Points & Leaderboard
/community/challenges               → Challenges & Hackathons
/community/challenges/[slug]        → Challenge Detail
```

### Consulting / Enterprise
```
/consulting                         → Consulting Overview
/consulting/ai-strategy             → AI Strategy Services
/consulting/automation              → Automation & Workflow
/consulting/training                → Corporate Training
/consulting/case-studies            → Case Studies
/consulting/case-studies/[slug]     → Case Study Detail
/enterprise                         → Enterprise Overview
/enterprise/pricing                 → Enterprise Pricing
/enterprise/security                → Security & Compliance
/enterprise/contact                 → Enterprise Inquiry Form
```

### User Account
```
/dashboard                          → Personal Dashboard
/dashboard/learning                 → My Learning (courses in progress)
/dashboard/certifications           → My Certifications
/dashboard/purchases                → Purchase History + Download Links
/dashboard/favorites                → Saved Tools & Products
/dashboard/achievements             → Badges & Points
/dashboard/referrals                → Referral Program
/dashboard/notifications            → Notification Center
/dashboard/settings                 → Account Settings
/dashboard/settings/profile         → Edit Profile
/dashboard/settings/billing         → Billing & Subscription
/dashboard/settings/security        → Password & Security
/profile/[username]                 → Public Profile
```

### Seller / Instructor
```
/seller                             → Seller Dashboard Home
/seller/products                    → My Products
/seller/products/new                → Create Product
/seller/products/[id]/edit          → Edit Product
/seller/analytics                   → Sales Analytics
/seller/payouts                     → Payouts & Earnings
/seller/reviews                     → Customer Reviews
/instructor/courses/new             → Course Builder
```

### Admin
```
/admin                              → Admin Overview
/admin/users                        → User Management
/admin/marketplace                  → Marketplace Management
/admin/marketplace/pending          → Pending Product Submissions
/admin/academy                      → Academy Management
/admin/blog                         → Blog Management
/admin/blog/new                     → New Post
/admin/community                    → Community Moderation
/admin/analytics                    → Platform Analytics
/admin/revenue                      → Revenue & Financials
/admin/settings                     → Platform Settings
/admin/consulting                   → Consulting Inquiries CRM
```

### Auth
```
/sign-in                            → Sign In
/sign-up                            → Sign Up
/reset-password                     → Password Reset
```

### Legal
```
/privacy                            → Privacy Policy
/terms                              → Terms of Service
/cookies                            → Cookie Policy
/gdpr                               → GDPR Rights
/accessibility                      → Accessibility Statement
/dmca                               → DMCA Policy
/refund-policy                      → Refund Policy
```

---

## URL Migration Plan (From Current to Future)

| Old URL | New URL | Action |
|---|---|---|
| `/AITools` | `/tools` | 301 Redirect |
| `/tool/[uuid]` | `/tools/[category]/[slug]` | 301 Redirect |
| `/categories` | `/tools` | 301 Redirect |
| `/categories/[slug]` | `/tools/[slug]` | 301 Redirect |
| `/blog/1` | `/blog/[actual-slug]` | 301 Redirect |
| `/submit-tool` | `/tools/submit` | 301 Redirect |
| `/consulting` | `/consulting` | Keep URL, rewrite content |

---

## Navigation Priority (Phase 1 — Pre-Academy/Marketplace)

**Phase 1 Primary Nav:** Tools | Consulting | Blog | About | Contact | Sign In

**Phase 2 Primary Nav (once Academy launches):** Learn | Tools | Blog | Consulting | About | Sign In

**Phase 3 Primary Nav (once Marketplace launches):** Learn | Build | Explore | Community | Pricing | Sign In | Get Started

---

## Breadcrumb Strategy

Breadcrumbs appear on all pages 3+ levels deep. Implement as `BreadcrumbList` schema.org markup.

Examples:
- `Academy → AI Fundamentals Track → Prompt Engineering 101 → Lesson 3`
- `Marketplace → AI Agents → LeadHunter Agent`
- `Tools → Content Creation → Jasper AI`
- `Blog → AI Agents → How to Build Your First AI Agent`

Mobile: Collapse to show only immediate parent with back arrow.

---

## Redirect Implementation

Implement all 301 redirects in `next.config.js`:

```javascript
async redirects() {
  return [
    { source: '/AITools', destination: '/tools', permanent: true },
    { source: '/categories', destination: '/tools', permanent: true },
    { source: '/categories/:slug', destination: '/tools/:slug', permanent: true },
    { source: '/submit-tool', destination: '/tools/submit', permanent: true },
    // Tool UUIDs require server-side lookup: redirect via middleware
  ]
}
```

UUID tool redirects require a middleware lookup (UUID → slug from database) to generate the correct `/tools/[category]/[slug]` destination.
