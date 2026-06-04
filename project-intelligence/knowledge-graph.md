# Knowledge Graph — Melanated In Tech

> **North Star:** Melanated In Tech is building the world's most practical ecosystem for AI Agents, MCP Servers, Agent Skills, Automation Systems, and Agent Commerce. Every decision should move the platform closer to becoming the trusted place where people learn, build, deploy, buy, sell, and scale AI-powered systems.

---

> Relationships between every entity on the platform. How everything connects to everything else.

---

## Entity Map

```
USERS ──────────────────────────────────────────────────────┐
  ├─── have MEMBERSHIPS (tiers: Free/Community/Architect/Operator/Enterprise)
  ├─── enroll in COURSES (Academy)
  ├─── earn CERTIFICATIONS (from completing courses)
  ├─── purchase PRODUCTS (from Marketplace)
  ├─── sell PRODUCTS (as verified sellers)
  ├─── post in COMMUNITY (forums, showcase)
  ├─── write CONTENT (guest contributors)
  ├─── receive CONSULTING (enterprise clients)
  └─── refer other USERS (affiliate program)

PRODUCTS ───────────────────────────────────────────────────┐
  ├─── are listed on MARKETPLACE
  ├─── belong to CATEGORIES (Agents/MCP Servers/Prompts/Skills/Blueprints/Bundles)
  ├─── are created by USERS (sellers)
  ├─── are purchased by USERS (buyers)
  ├─── are tagged with SKILLS (technical capabilities they require or provide)
  ├─── receive REVIEWS (from verified purchasers)
  ├─── are featured in CONTENT (tutorials, blog posts)
  └─── are connected to COURSES (some products are course deliverables)

AGENTS ──────────────────────────────────────────────────────┐
  ├─── SuperAgent orchestrates all other AGENTS
  ├─── each AGENT reads DOCUMENTS from /project-intelligence
  ├─── each AGENT produces OUTPUTS (code, content, analysis, specs)
  ├─── TECHNICAL AGENT manages the CODEBASE
  ├─── CONTENT AGENT produces CONTENT
  ├─── SEO AGENT feeds briefs to CONTENT AGENT
  ├─── PRODUCT AGENT feeds specs to TECHNICAL AGENT and DESIGN AGENT
  ├─── STRATEGY AGENT informs PRODUCT AGENT and MARKETPLACE AGENT
  └─── All AGENTS update AGENT MEMORY (agent-memory.md)

MCP SERVERS ─────────────────────────────────────────────────┐
  ├─── are listed as PRODUCTS on the Marketplace
  ├─── are taught in COURSES (MCP Server Development track)
  ├─── are a core CONTENT PILLAR (Pillar 2)
  ├─── connect AI AGENTS to external TOOLS and APIs
  ├─── are built by USERS (certified MCP developers)
  └─── are discoverable via MIT AGENT REGISTRY (future)

SKILLS ──────────────────────────────────────────────────────┐
  ├─── are a PRODUCT type in the Marketplace
  ├─── are taught in COURSES (Agent Skills & Tools pillar)
  ├─── extend AI AGENTS (functional capabilities)
  ├─── are tagged on USERS (expertise)
  └─── are tagged on PRODUCTS (compatibility/requirement)

PROMPTS ─────────────────────────────────────────────────────┐
  ├─── Prompt Packs are PRODUCTS on Marketplace
  ├─── prompts are taught in COURSES (Prompt Engineering pillar)
  ├─── prompts are used in CONTENT production (Tier 2 workflow)
  └─── prompts are inputs to AI AGENTS

COURSES ─────────────────────────────────────────────────────┐
  ├─── are part of ACADEMY (platform pillar)
  ├─── contain MODULES which contain LESSONS
  ├─── lead to CERTIFICATIONS (on completion)
  ├─── require MEMBERSHIPS (gated by tier in some cases)
  ├─── are purchased via MARKETPLACE (Stripe checkout)
  ├─── generate PRODUCTS (certification projects go to marketplace)
  └─── are created by USERS (instructors) or MIT team

MARKETPLACE ─────────────────────────────────────────────────┐
  ├─── contains all PRODUCT types
  ├─── connects SELLERS (users) with BUYERS (users)
  ├─── generates COMMISSION revenue for MIT
  ├─── is fueled by ACADEMY graduates (who build products)
  ├─── is discoverable via CONTENT (tutorials referencing products)
  ├─── processes payments via STRIPE Connect
  └─── delivers files via CLOUDFLARE R2

CONTENT ──────────────────────────────────────────────────────┐
  ├─── lives on the BLOG and TOOLS DIRECTORY
  ├─── is the primary ACQUISITION channel (organic search)
  ├─── references PRODUCTS (tutorials teaching what's in marketplace)
  ├─── converts readers to USERS (email signup, community join)
  ├─── is distributed via NEWSLETTER ("The Stack")
  ├─── is produced by CONTENT AGENT (Tier 2) or USERS (Tier 3)
  ├─── is briefed by SEO AGENT
  └─── feeds COMMUNITY discussion (members discuss and share content)

COMMUNITY ────────────────────────────────────────────────────┐
  ├─── contains USERS (members)
  ├─── produces CONTENT (discussions, showcases)
  ├─── incubates SELLERS (members become marketplace creators)
  ├─── provides peer support for COURSES (study groups, Q&A)
  ├─── surfaces CONSULTING talent (enterprise engagements)
  ├─── creates SOCIAL PROOF (success stories → marketing content)
  └─── is gated by MEMBERSHIP (Community tier+)
```

---

## Key Relationships Table

| Entity A | Relationship | Entity B | Direction |
|----------|-------------|----------|-----------|
| Academy | graduates | Marketplace Sellers | A → B |
| Courses | enable | Certifications | A → B |
| Certifications | qualify | Consulting Talent | A → B |
| Content | attracts | Users | A → B |
| Community | retains | Users | A ↔ B |
| Marketplace | monetizes | Builders | A ↔ B |
| MCP Servers | extend | AI Agents | A → B |
| Skills | extend | AI Agents | A → B |
| Prompts | instruct | AI Agents | A → B |
| SuperAgent | orchestrates | All Agents | A → B |
| SEO Agent | briefs | Content Agent | A → B |
| Product Agent | specs | Technical Agent | A → B |
| Strategy Agent | informs | Product Agent | A → B |
| Stripe | processes | Marketplace Revenue | A → B |
| Cloudflare R2 | delivers | Purchased Products | A → B |
| Supabase | stores | All Platform Data | A → B |
| Newsletter | distributes | Content | A → B |
| Community | surfaces | Consulting Talent | A → B |

---

## The Revenue Flow Graph

```
CONTENT (attracts people)
  → USERS sign up (free)
  → ACADEMY enrollments (courses purchased)
  → CERTIFICATIONS earned
  → MARKETPLACE purchases (products bought)
  → MARKETPLACE sales (community sellers earn)
      → COMMISSION to MIT
  → COMMUNITY membership (recurring revenue)
  → CONSULTING inquiries (from content or community reputation)
      → PROJECT REVENUE
  → NEWSLETTER subscriptions (→ converts to memberships)
  → AFFILIATE REFERRALS (community members refer new users)
```

---

## The Flywheel

```
Step 1: CONTENT ranks → brings in USERS
Step 2: USERS enroll in ACADEMY → learn to build
Step 3: BUILDERS graduate → create AI PRODUCTS
Step 4: PRODUCTS listed on MARKETPLACE → earn income
Step 5: SUCCESS STORIES from marketplace → become CONTENT
Step 6: CONTENT attracts more USERS (return to Step 1)
Step 7: COMMUNITY forms around BUILDERS → creates retention
Step 8: COMMUNITY talent → attracts CONSULTING clients
Step 9: CONSULTING success stories → become CONTENT (return to Step 1)
```

Each revolution of the flywheel increases the value of every other element.

---

## Data Relationships (Database)

```
users (1) ──── (many) memberships ──── (1) membership_tiers
users (1) ──── (many) enrollments ──── (1) courses
users (1) ──── (many) certifications ── (1) courses
users (1) ──── (many) orders (buyer)
users (1) ──── (many) products (seller)
users (1) ──── (many) community_posts
users (1) ──── (1) profiles

courses (1) ── (many) modules (1) ── (many) lessons
courses (1) ── (many) enrollments
courses (1) ── (many) certifications

products (1) ─ (many) order_items ──── (1) orders
products (1) ─ (many) reviews
products (1) ─ (many) downloads (via order_items)

community_posts (1) ── (many) community_posts (self-ref: parent_id)
community_posts (1) ── (many) community_votes
```

---

## Integration Map (External Services)

| Service | Used By | Data Flow |
|---------|---------|----------|
| Supabase | Entire platform | All reads/writes |
| Clerk/Auth | All pages | Identity + session |
| Stripe | Marketplace, Academy, Memberships | Checkout → Webhook → DB update |
| Stripe Connect | Marketplace sellers | Payout distribution |
| Cloudflare R2 | Marketplace delivery | Signed URL → file download |
| Resend | Auth, purchase, course completion | Transactional email |
| MailerLite | Newsletter | Campaign email |
| PostHog | All user events | Analytics → insights |
| Sentry | All errors | Error → alert |
| Typesense | Search | Index → query → results |
| Anthropic API | Content generation, AI features | Prompt → completion |
| Vercel | Hosting + CDN | Request → response |
