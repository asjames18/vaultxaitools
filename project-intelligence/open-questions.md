# Open Questions — Melanated In Tech

> **North Star:** Melanated In Tech is building the world's most practical ecosystem for AI Agents, MCP Servers, Agent Skills, Automation Systems, and Agent Commerce. Every decision should move the platform closer to becoming the trusted place where people learn, build, deploy, buy, sell, and scale AI-powered systems.

---

> Decisions that have not been made. Assumptions that need validation. Unknowns that block progress.
> Never silently assume. Document here and escalate to founder for resolution.

---

## How to Use This File

1. Add questions as discovered during any work session
2. Include: question, context, who needs to decide, urgency, options
3. When resolved, move to the "Resolved" section with the answer
4. Never delete resolved questions — history is valuable

---

## Unresolved Questions

### Auth: Clerk or Fix Supabase RBAC?

**Question:** Should we migrate to Clerk for authentication, or fix the existing Supabase Auth RBAC implementation?

**Context:**
- Current Supabase Auth has a broken RBAC bug
- Service role key may be exposed client-side (security issue)
- Clerk offers: better RBAC out-of-box, org accounts, SSO, MFA, session management
- Clerk adds: additional cost (~$25/mo at early scale), another service dependency
- Fixing Supabase Auth requires: proper permissions table, middleware rewrite, never exposing service role

**Options:**
- Option A: Migrate to Clerk (recommended by technical strategy doc)
- Option B: Fix Supabase Auth RBAC properly (more control, one fewer dependency)

**Who Decides:** Founder (Antonio James)
**Urgency:** HIGH — blocks Stripe integration
**Estimated effort:** Clerk: 3–4 days migration | Supabase fix: 2–3 days

---

### Community: Build Custom or Use Circle.so?

**Question:** Should the community platform be custom-built on top of Supabase, or use Circle.so as a hosted community layer?

**Context:**
- Custom build: full control, integrated with platform auth + data, no extra cost, but 6–8 weeks to build properly
- Circle.so: fast to launch (1–2 days), proven UX, $99/month, but separate login + less integration
- The community is described as a core product differentiator, which argues for custom

**Options:**
- Option A: Circle.so for Phase 1 (fast to market), migrate to custom in Phase 2
- Option B: Custom Supabase build from Day 1 (slower but more integrated)
- Option C: Circle.so permanently (cheaper and faster, accept tradeoffs)

**Who Decides:** Founder
**Urgency:** MEDIUM — needed by Day 38 (Phase 2)

---

### Content: What Volume Can Be Sustained Long-Term?

**Question:** The strategy calls for 3 articles/week in Phase 1. Is this sustainable without a dedicated content team?

**Context:**
- With AI-assisted content (Tier 2 workflow), this is achievable for 1 person
- But requires: AI drafting, human editing, SEO optimization, publishing — roughly 3–4 hours per piece
- If founder is also building the product, 9–12 hours/week for content is significant

**Options:**
- Option A: Hire freelance editor or content manager at Month 2 ($2–4K/month)
- Option B: Reduce to 2 pieces/week but increase quality bar
- Option C: Hire community member as paid contributor from Day 30

**Who Decides:** Founder
**Urgency:** LOW — first 30 days can be manually managed

---

### Pricing: Should Annual Plans Be Offered at Launch?

**Question:** Should annual membership plans be available at platform launch, or launch monthly first and add annual later?

**Context:**
- Annual plans improve cash flow (front-loaded payment) and reduce churn
- But annual pricing requires Stripe Billing subscription management to be properly set up
- Complexity risk: annual vs. monthly billing logic adds development time

**Options:**
- Option A: Launch monthly only; add annual in Phase 2
- Option B: Launch both simultaneously (more complex but better for cash flow)

**Who Decides:** Founder
**Urgency:** LOW — can be deferred to Stripe integration sprint

---

### Domain: What to Do With vaultxaitools.com?

**Question:** The old domain vaultxaitools.com should be 301-redirected to melanatedintech.com. But should it be kept registered, and for how long?

**Context:**
- Old domain likely has some inbound links and maybe indexed pages
- 301 redirects preserve up to 90–99% of link equity
- Domain cost is minimal (~$10–15/year)

**Options:**
- Option A: Keep registered for 5 years, maintain 301 redirect
- Option B: Keep registered for 2 years, assess
- Option C: Let expire (not recommended — risks someone else buying it)

**Who Decides:** Founder
**Urgency:** LOW — domain is likely registered through at least 2026

---

### Certifications: Expiry or Lifetime?

**Question:** Should MIT certifications have an expiry date, requiring renewal, or be lifetime credentials?

**Context:**
- AI is fast-moving. A certification from 2026 may be outdated by 2028.
- Expiry creates recurring revenue (renewal fees)
- Lifetime creates better initial conversion (perceived higher value)
- Industry standard: most tech certs are either 2–3 year expiry (AWS, Google Cloud) or lifetime

**Options:**
- Option A: Lifetime credential with optional "refresher" course (no forced renewal)
- Option B: 2-year expiry with $49 renewal exam
- Option C: Tiered — core cert is lifetime, advanced specializations expire

**Who Decides:** Founder
**Urgency:** LOW — needed before Certification launch (Month 4–6)

---

### Marketplace: Should MIT Charge a Listing Fee?

**Question:** Should sellers pay a one-time or monthly listing fee, or is commission-only the right model?

**Context:**
- Gumroad and Lemon Squeezy use commission-only (no listing fee)
- A listing fee would reduce low-quality submissions
- But listing fees might discourage early sellers when liquidity is most needed
- Pro/Operator membership already costs $79/$149/month — this effectively is a listing fee

**Options:**
- Option A: Commission-only, no listing fee (Pro/Operator tier membership is implicit barrier)
- Option B: $10 one-time listing fee per product (quality filter)
- Option C: Free for first 3 products, $10/product after

**Who Decides:** Founder
**Urgency:** LOW — needed before Marketplace soft launch

---

## Resolved Questions

| Question | Resolution | Date | Decided By |
|----------|-----------|------|-----------|
| What is the brand name? | Melanated In Tech | Before June 2026 | Founder |
| What is the primary domain? | melanatedintech.com | Before June 2026 | Founder |
| What is the core tech stack? | Next.js 15 + Supabase + Vercel | Before June 2026 | Founder |
| What is the marketplace commission model? | 30/70 standard, 10/90 exclusive | June 2026 | Founder |
| Should MIT seed the marketplace first? | Yes — validate flow before community opens | June 2026 | Strategy |
| What is the standard payout schedule? | Weekly (Mondays), $25 minimum | June 2026 | Strategy |
| What refund policy? | 30 days | June 2026 | Strategy |
