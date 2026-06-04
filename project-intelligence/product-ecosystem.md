# Product Ecosystem — Melanated In Tech

> **North Star:** Melanated In Tech is building the world's most practical ecosystem for AI Agents, MCP Servers, Agent Skills, Automation Systems, and Agent Commerce. Every decision should move the platform closer to becoming the trusted place where people learn, build, deploy, buy, sell, and scale AI-powered systems.

---

> All five platform pillars, how they connect, and how value flows between them.

---

## The Five Pillars

The platform is not five separate products. It is one interconnected system where each pillar feeds the others.

```
    CONTENT
    (Acquisition)
        ↓
    ACADEMY          →    MARKETPLACE
    (Education)           (Monetization)
        ↕                      ↕
    COMMUNITY        →    CONSULTING
    (Retention)           (High-Ticket)
```

**The flywheel:** Content attracts learners → Academy educates them → Community retains and accelerates them → Marketplace lets them monetize → Consulting creates top-tier case studies → Case studies fuel Content → repeat.

---

## Pillar 1: Academy

**Purpose:** Transform someone with zero AI building experience into a production-ready AI engineer with marketable skills and deployed products.

**Products:**

| Product | Price | Description |
|---------|-------|------------|
| Free Intro Courses | $0 | AI Agent 101, Prompt Basics — top of funnel |
| Beginner Courses | $49–$99 | Build Your First AI Agent, Intro to MCP |
| Intermediate Courses | $149–$299 | Advanced Agent Architecture, MCP Server Dev |
| Advanced Courses | $299–$599 | Agent Fleet Management, Enterprise AI |
| Bootcamps | $500–$2,000 | 8–12 week cohorts with live sessions |
| MIT Certified AI Agent Engineer | $499 | Flagship certification — project-based |
| Workshops | $49–$199 | Live 2–3 hour deep dives on specific topics |
| Learning Tracks | Bundled | Curated course sequences (e.g., "MCP Developer Track") |

**Content Areas (8 Pillars):**
1. AI Agents — Build, Deploy, Scale
2. MCP Servers — Agent Infrastructure Layer
3. Prompt Engineering — From Amateur to Architect
4. AI Automation — Workflows That Work While You Sleep
5. Local AI — Run AI on Your Own Hardware
6. Agent Skills & Tools
7. AI Business Solutions
8. Agent Fleets & Enterprise AI

**Key Technical Details:**
- `/academy` — hub page
- `/academy/courses/[slug]` — course detail
- `/academy/courses/[slug]/learn/[lessonId]` — lesson player
- `/academy/certifications/verify/[id]` — public credential verification
- Lesson types: video, article, quiz, code exercise
- Progress tracked in `enrollments` table (progress_pct, completed_lessons[])

---

## Pillar 2: Marketplace

**Purpose:** Give community members a platform to sell what they've built, creating income without needing their own storefront, audience, or payment infrastructure.

**Product Categories:**

| Category | Price Range | Examples |
|----------|------------|---------|
| AI Agents | $19–$499 | Customer support agent, lead generation agent |
| MCP Servers | $29–$299 | Database MCP, Slack MCP, custom API MCP |
| Prompt Packs | $19–$99 | "Cold Outreach Mastery," "Technical Writing Pack" |
| Agent Skills | $9–$79 | Web scraper, email sender, PDF processor |
| Agent Blueprints | $49–$499 | Full automation workflows with docs |
| Bundles | $99–$599 | Curated collections at 30–40% discount |

**Key Technical Details:**
- `/marketplace` — hub page
- `/marketplace/[category]/[slug]` — product detail
- Products delivered via: download link (R2 signed URL), API key, repository access
- Commission: 30/70 (Standard) → 10/90 (Exclusive)
- Payouts via Stripe Connect Express, weekly Mondays

**Quality Standards (enforced before listing goes live):**
- Works as described
- Complete documentation
- No malware / dependency issues
- Accurate screenshots and descriptions
- Seller owns or has licensed all components

---

## Pillar 3: Community

**Purpose:** Create the peer accountability, social proof, and network effects that make MIT irreplaceable. Community is the #1 churn prevention mechanism.

**Products / Features:**

| Feature | Description |
|---------|------------|
| Forums | Threaded discussions (general, showcase, help, tools, career) |
| Member Profiles | Public builder profiles with reputation scores |
| Events | Live workshops, AMAs, hackathons |
| Showcase | Members share what they've built |
| Leaderboard | Points system for engagement + output |
| Challenges | Time-bounded build challenges with prizes |

**Key Technical Details:**
- `/community` — hub
- `/community/forum/[category]/[slug]` — thread view
- `/community/members/[username]` — public profile
- Realtime notifications via Supabase Realtime
- Upvote system on posts

**Community Tiers / Access:**
- Free: Read-only browsing
- Community Builder ($29+): Full posting, events access
- Architect ($79+): Showcase, challenges
- Operator ($149+): VIP events, early access

---

## Pillar 4: Consulting

**Purpose:** Convert community depth and technical expertise into enterprise revenue, while creating income pathways for top community talent.

**Service Tiers:**

| Service | Price | Delivery |
|---------|-------|---------|
| AI Strategy Session | $500 | 2-hour advisory (Calendly) |
| AI Workflow Audit | $2,500–$5,000 | Assessment + recommendations report |
| Custom Agent Build | $5,000–$25,000 | Deployed agent + documentation |
| Automation System | $10,000–$50,000 | Full stack design + build |
| Team Retainer | $5,000–$15,000/mo | Ongoing AI team-as-a-service |
| Enterprise License | Custom | White-label MIT curriculum |

**Target Clients:**
- SMBs wanting AI automation without internal expertise
- Enterprises wanting AI talent with cultural alignment
- HBCUs and workforce development programs
- Corporate DEI departments wanting technical AI training

**Key Technical Details:**
- `/consulting` — services overview
- `/consulting/intake` — discovery form + Calendly embed
- `consulting_inquiries` table in DB
- Admin CRM in `/admin/consulting`
- Budget minimum: $5K (Tier 1), $25K (Enterprise License)

---

## Pillar 5: Content & Tools Directory

**Purpose:** Organic acquisition engine. SEO-anchored content attracts thousands of people in the MIT target audience who don't know the platform exists yet.

**Content Products:**

| Product | Description |
|---------|------------|
| Tools Directory | 38+ curated AI tools, 10 categories — discovery engine |
| Blog / Tutorials | Deep technical content on all 8 content pillars |
| Newsletter ("The Stack") | Weekly, 800–1,200 words, Tuesday delivery |
| Lead Magnet | "MIT AI Agent Starter Guide" — 20-page PDF, gates email signup |
| Use-Case Pages | Conversion-focused landing pages (e.g., "AI agent for real estate") |
| Pillar Pages | 8K–12K word cornerstone content pieces on each pillar topic |
| YouTube | Tutorial walkthroughs — second-largest search engine |

**Key Technical Details:**
- `/tools` — directory hub (migrated from `/AITools`)
- `/tools/[category]/[slug]` — individual tool page
- `/blog/[slug]` — article pages (slug-based, not numeric IDs)
- Dynamic `sitemap.xml` including all tools, posts, and products
- All pages require `generateMetadata()` for SEO

---

## User Journey Across the Ecosystem

### Journey 1: The Learner to Seller
```
Googles "how to build an AI agent"
  → Finds MIT tutorial (Content)
  → Signs up for free newsletter (Content → Email)
  → Enrolls in free course (Academy)
  → Joins community, gets help (Community)
  → Completes certification (Academy)
  → Uploads first MCP server for sale (Marketplace)
  → Earns first $200 (Marketplace)
  → Upgrades to Operator tier (Membership)
```

### Journey 2: The Enterprise Client
```
Googles "AI automation for [industry]"
  → Finds MIT use-case page (Content)
  → Submits consulting inquiry (Consulting)
  → Gets matched with community talent
  → Pays $15K for automation project (Consulting)
  → Enrolls team in MIT Academy (Academy)
  → Becomes Enterprise member (Membership)
```

### Journey 3: The Community Builder
```
Hears about MIT from another builder
  → Joins as Community member ($29/mo)
  → Participates in challenge (Community)
  → Builds something, shares in showcase (Community)
  → Gets client inquiry from MIT consulting arm (Consulting)
  → Earns project income, upgrades to Operator (Membership)
  → Lists product in marketplace (Marketplace)
```

---

## Product Roadmap Timeline

| Phase | Timeline | Products Launching |
|-------|---------|-------------------|
| Phase 1 | Days 1–30 | Academy MVP, 3 MIT Prompt Packs, 2 beginner courses |
| Phase 2 | Days 31–60 | Marketplace MVP, 10 products, Community forums |
| Phase 3 | Days 61–90 | Pro tier, Creator program, programmatic SEO pages |
| Phase 4 | Months 4–6 | Certifications, Bootcamp cohort 1, Consulting arm |
| Phase 5 | Months 7–12 | Marketplace public launch, MIT Annual Summit |

---

## MIT-Owned Products (First to Market)

The platform seeds the marketplace with MIT-owned products before opening to third-party sellers:

**Phase 1 (Months 1–2):**
- "The Complete Prompt Engineering Pack" — $39
- "AI Agent Patterns Pack" — $39
- "MCP Server Starter Templates" — $39
- "Build Your First AI Agent" course — $49
- "AI Automation Foundations" course — $79

**Phase 2 (Months 3–5):**
- "LeadGen Agent Blueprint" — $99
- "Customer Support Agent" — $149
- "Content Production System" — $199
- "Local AI Setup Guide" — $49
- "Agent Memory Systems" course — $149

**Phase 3 (Months 6+):**
- Third-party marketplace opens
- MIT continues selling own products alongside community sellers
