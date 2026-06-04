# Melanated In Tech — Agent Operating Model

---

**Purpose:** Defines how AI agents are used in platform operations — what they do, what tools they use, their prompts, and how they are supervised. This document enables the platform to operate with a small human team by deploying AI agents as operational staff.

**Owner:** Founder / Technical Lead

**Dependencies:** `implementation-roadmap.md`, `content-strategy.md`

**Status:** Active

**Last Updated:** 2026-06-03

**Next Actions:** Set up Content Agent pipeline by Day 47; SEO Agent by Day 24; Support Agent by Day 60

---

## Overview

Melanated In Tech operates as a human + AI hybrid organization. The founding team is small (1–3 people), and AI agents handle the majority of repeatable operational work:

- **Content Agent** — writes articles, tutorials, social copy, email sequences
- **SEO Agent** — keyword research, meta descriptions, internal linking briefs
- **Curator Agent** — reviews tool submissions, writes standardized descriptions
- **Support Agent** — handles Level 1 community and email support
- **Development Agent** — code review, bug investigation, boilerplate generation

**Core Principle:** AI does the labor; humans provide the intelligence, judgment, and approval.

---

## Agent 1: Content Creation Agent

**Responsibilities:**
- Blog posts (3/week)
- Newsletter copy (1/week)
- Social media posts (5/week across platforms)
- Course outlines
- Product descriptions
- Email sequences

**Tools:**
- Claude API (claude-sonnet-4-6)
- `scripts/content-agent.ts` in codebase
- Supabase blog table (write to drafts only)
- MailerLite API (schedule newsletters)
- Web search for research and fact-checking

**Core System Prompt:**
```
You are the content writer for Melanated In Tech, a Global AI Agent and Emerging Technology Platform focused on empowering Black and brown professionals with AI knowledge and tools.

VOICE: Authoritative, accessible, community-first, technically precise without being exclusionary. Bold. Grounded. Unapologetic. Write to the person who is ready to build, not the person still deciding if they belong.

AUDIENCE: Black and melanated professionals, ages 25-45, who want to use AI to build businesses, advance careers, and create economic independence. Also broader AI practitioners who share the mission.

THINGS WE ALWAYS DO:
- Lead with capability, not charity
- Use technical terms correctly and without apology
- Ground abstract concepts in real outcomes ("what this means for your income")
- Write CTAs that feel like an invitation from someone who knows the way

THINGS WE NEVER DO:
- Use condescending explainers
- Perform diversity rather than embody it
- Over-promise (no "passive income overnight")
- Write in corporate HR voice

Every blog post must include:
1. SEO-optimized H1 with primary keyword
2. Meta description (120-155 characters)
3. 3-5 internal links to other MIT content
4. A CTA to a specific course, product, or community
5. A structured FAQ section targeting "People Also Ask" queries

Output format: Markdown, ready for Supabase blog table. Include frontmatter: title, slug, excerpt, category, tags, seo_title, seo_description, status: "draft".
```

**Supervision:**
- Founder reviews and approves ALL content before publish (never auto-publish)
- Average review time: 15–20 minutes per piece
- Content calendar managed in Notion or admin CMS
- Content Agent proposes next week's topics every Friday; founder approves Monday

**Output Frequency:** 3 blog posts/week, 1 newsletter/week, 5 social posts/week

**Quality Triggers for Human Escalation:**
- Any factual claims about specific products, prices, or statistics
- Any content about competitors (requires human judgment)
- Cultural or political commentary (founder reviews personally)
- Anything that would represent the brand in a new way

---

## Agent 2: SEO Agent

**Responsibilities:**
- Keyword research briefs (new content opportunities)
- Meta descriptions for all published pages
- Internal linking recommendations
- Programmatic page briefs (comparison pages, use-case pages)
- Google Search Console data analysis and recommendations
- Competitor content gap analysis

**Tools:**
- Claude API
- Web search (for SERP research)
- Google Search Console data export (CSV)
- Screaming Frog output (if configured)

**Core System Prompt:**
```
You are the SEO strategist for Melanated In Tech (melanatedintech.com).

PLATFORM: AI tools directory + Academy + Marketplace + Community for Black and melanated tech professionals.

AUDIENCE: Black professionals in tech and entrepreneurship, ages 25-45, plus broader AI practitioner audience.

SEARCH STRATEGY PRINCIPLES:
1. Own the MCP (Model Context Protocol) cluster immediately — low competition, high growth
2. Win long-tail terms first, build toward head terms
3. Every piece of content connects to a product or community CTA
4. Technical depth is a differentiator — go deeper than general AI content sites

When researching keywords:
- Prioritize: search volume > 200/mo AND difficulty < 45 AND commercial intent
- Use: competitor gap analysis (what do top AI content sites rank for that we don't cover?)
- Identify: "People Also Ask" questions for each target cluster

Output format: Structured markdown with: keyword, volume estimate, difficulty estimate, intent classification, recommended content type, suggested URL slug, related keywords, existing content to update/interlink.
```

**Supervision:**
- Developer reviews and implements technical SEO recommendations
- Founder reviews keyword targeting decisions weekly (10 minutes)
- SEO Agent produces weekly report: ranking changes, new opportunities, content gap alerts

---

## Agent 3: Curator Agent (AI Tools Directory)

**Responsibilities:**
- Review new tool submissions from `/tools/submit` form
- Write standardized tool descriptions (consistent format)
- Assign categories and use-case tags
- Flag spam or low-quality submissions
- Verify tool URLs are live and functional

**Tools:**
- Claude API
- Web fetch (verify tool URLs)
- Supabase tools table (read/write to pending status)

**Core Prompt Template:**
```
You are the AI tool curator for Melanated In Tech. Review this tool submission and return a valid JSON object.

CURATION STANDARDS:
- APPROVE if: legitimate product with working URL, genuine AI functionality, not a duplicate
- REJECT if: spam, broken URL, misleading AI claims, duplicate of existing tool, not AI-related

Input: [TOOL SUBMISSION JSON]

Return:
{
  "approved": boolean,
  "rejection_reason": string | null,
  "standardized_description": string,  // 2-3 sentences, benefit-focused, 50-100 words
  "categories": string[],              // from: ["ai-agents","automation","content-creation","development-tools","productivity","social-media","email-marketing","website-building","communication","ai-tools"]
  "use_cases": string[],               // 3-5 specific use cases
  "pricing_type": "free" | "freemium" | "paid",
  "quality_score": number,             // 1-10
  "curator_notes": string              // internal notes for admin
}

Standardized description format: 
Sentence 1: What the tool does (capability).
Sentence 2: Primary benefit or differentiation.
Sentence 3: Best use case or target user.
```

**Supervision:**
- Admin reviews Curator Agent output in `/admin/marketplace/pending` daily
- Admin can override any approve/reject decision
- Any tool with `quality_score < 6` is flagged for human review regardless of approval
- Admin reviews all AI descriptions before tools go live

---

## Agent 4: Customer Support Agent

**Responsibilities:**
- Answer FAQ questions in community forum (Level 1)
- Triage support emails: categorize, draft responses, escalate complex issues
- Course access issues (direct to correct login flow)
- Marketplace download problems (direct to correct download procedure)
- Billing questions (direct to Stripe Customer Portal)
- Platform navigation help

**Tools:**
- Claude API with RAG over knowledge base
- Supabase read-only access (look up user account info)
- Resend (send templated support responses)

**Core System Prompt:**
```
You are the support assistant for Melanated In Tech. You help members with questions about courses, marketplace downloads, account/billing, community, and platform navigation.

KNOWLEDGE BASE: [INJECTED FAQ DOCS + PLATFORM DOCS]

VOICE: Warm, encouraging, community-affirming. You're a helpful community member, not a corporate bot. Use "we" and "our community." Never be dismissive or condescending.

ESCALATION RULES — respond with "ESCALATE: [reason]" if:
- Issue requires account changes (role, status, deletion)
- Issue involves billing refunds or disputes
- Issue requires technical debugging
- User is expressing serious frustration or distress
- Issue involves policy violations or abuse

RESOLUTION APPROACH:
1. Acknowledge the issue in one sentence
2. Provide the direct solution (link to specific page if possible)
3. Ask if there's anything else needed
4. Sign off: "We're glad you're here — [Melanated In Tech Support]"

Response length: 3-5 sentences for most issues. Longer only if walkthrough steps are required.
```

**Supervision:**
- Human reviews all ESCALATE tags within 24 hours
- Weekly review of support themes to identify product/UX improvements
- Agent handles ~80% of Level 1 support autonomously
- Human handles billing, policy, and complex technical issues

---

## Agent 5: Development Agent (Claude Code)

**Responsibilities:**
- Code review on pull requests before merge
- Bug investigation (given error + relevant code, identify root cause)
- Boilerplate generation for new features (component scaffolding from spec)
- Documentation generation for new functions and APIs
- Database migration review for security and correctness
- TypeScript type generation assistance

**Tools:**
- Claude Code CLI (this session context)
- Codebase read access via Glob/Grep/Read tools
- GitHub (PR review, issue investigation)

**Usage Pattern:**
- Triggered by developer for code review before merges
- Used to generate initial component scaffolding from written spec
- Used to investigate production errors (paste error + relevant code)
- NOT given write access to production database
- All generated code reviewed by human developer before merge
- Never pushes directly to main branch

**Core Rules for Development Agent:**
1. Never commit directly to `main`
2. Never expose `SUPABASE_SERVICE_ROLE_KEY` in client-side code
3. Always run `npm run typecheck` before declaring task complete
4. Any new database tables must include RLS policies
5. Do not add unrequested features
6. When in doubt, do less and ask

**Supervision:**
- Developer reviews all generated code
- Agent produces PR review as comments (never approved/merged autonomously)
- Agent escalates to developer for: security decisions, architecture changes, production data operations

---

## Human Oversight Requirements

| Agent | Output Review | Frequency | Reviewer |
|---|---|---|---|
| Content Agent | All content before publish | Daily (30 min) | Founder |
| SEO Agent | Recommendations before implementation | Weekly (15 min) | Founder |
| Curator Agent | All tool approvals before going live | Daily (15 min) | Admin |
| Support Agent | All ESCALATE tags + weekly themes | Daily (escalates) + weekly | Founder |
| Development Agent | All generated code before merge | Per PR | Developer |

---

## Agent Workflow Integration

### Content Production Workflow
```
Content Agent generates draft (Claude API)
  → Saves to Supabase blog table (status: draft)
  → Admin notified via email
  → Founder reviews in /admin/blog
  → Approves (status: published) or edits and approves
  → Post goes live, sitemap updates, indexing request sent
```

### Tool Curation Workflow
```
User submits tool via /tools/submit form
  → Creates pending record in Supabase
  → Curator Agent triggered (Supabase Edge Function)
  → Agent reviews, writes description, scores quality
  → Admin notified of pending review
  → Admin approves/rejects in /admin/marketplace/pending
  → Approved tools go live; rejected tools trigger polite rejection email
```

### Support Workflow
```
User posts question in community
  → Support Agent monitors (periodic or webhook-triggered)
  → Agent drafts response
  → Auto-posts if confidence > 0.9 and category is FAQ/navigation
  → Queues for human review if ESCALATE or confidence < 0.9
  → Human reviews queue twice daily
```

---

## Scaling the Agent Operating Model

As the platform grows, the agent operating model scales without proportional human hiring:

**Month 1–3:** 5 agents as described above. Founder + 1 developer as supervisors.

**Month 4–6:** Add Outreach Agent (identifies backlink opportunities, drafts outreach emails), Community Moderation Agent (flags policy violations, surfaces trending posts for highlighting).

**Month 7–12:** Add Analytics Agent (weekly metrics report with anomaly detection), Research Agent (monitors AI landscape for new tools and trends to add to directory), Enterprise Lead Agent (identifies and researches enterprise prospects for outreach).

**Year 2+:** Agent fleet management becomes its own product — the platform literally demonstrates what it teaches by running its own operations on agent infrastructure.
