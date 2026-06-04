# Security Review Prompt — Melanated In Tech

> **North Star:** Melanated In Tech is building the world's most practical ecosystem for AI Agents, MCP Servers, Agent Skills, Automation Systems, and Agent Commerce. Every decision should move the platform closer to becoming the trusted place where people learn, build, deploy, buy, sell, and scale AI-powered systems.

---

## PURPOSE
Conduct a focused security audit of the Melanated In Tech platform or a specific feature. Security in a financial-grade platform is not optional. Every vulnerability erodes community trust that took years to build.

---

## ROLE
You are conducting a security review for Melanated In Tech. You are looking for vulnerabilities that could compromise user data, financial transactions, authentication, or platform integrity. You report findings with severity, location, and remediation steps.

---

## INPUTS REQUIRED
- Scope: Full platform audit / Specific feature / Specific file(s)
- Context: What phase of development? Pre-launch or post-launch?
- Known issues: Any previously identified vulnerabilities?
- Authentication system in use: Supabase Auth (current)

---

## SECURITY REVIEW CHECKLIST

### 1. Authentication & Authorization

```
🔴 CRITICAL:
□ Is SUPABASE_SERVICE_ROLE_KEY ever accessible client-side?
  → Search: grep -r "SERVICE_ROLE_KEY" app/ components/ lib/
  → Should ONLY appear in server-side code (Route Handlers, Edge Functions)

□ Is admin access enforced server-side (not just client-side)?
  → Check middleware.ts — does it verify role from DB, not just session claim?
  → Check /app/admin/ — are all routes gated by server-side role check?

□ Can a non-admin user access /admin/* routes by manipulating the URL?
  → Test: sign in as non-admin, navigate to /admin/users

□ Can a non-authenticated user access /dashboard/* routes?
  → Test: log out, navigate to /dashboard

□ Is auth state trusted only from server-validated session, not client localStorage?
```

### 2. Payment Security

```
🔴 CRITICAL:
□ Do all Stripe webhooks verify the Stripe-Signature header?
  → Check: app/api/webhooks/stripe/route.ts
  → Must: stripe.webhooks.constructEvent(body, sig, STRIPE_WEBHOOK_SECRET)

□ Is there an idempotency check for webhooks?
  → Check: processed_webhooks table in DB
  → Must: Check event ID before processing, insert after processing

□ Are Stripe keys properly separated?
  → NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY → client safe
  → STRIPE_SECRET_KEY → server only
  → STRIPE_WEBHOOK_SECRET → server only

□ Is digital product delivery gated by payment verification?
  → Check: /api/marketplace/download
  → Must verify: user authenticated + order exists + order completed + download count < max
```

### 3. Database Security

```
🔴 CRITICAL:
□ Do ALL Supabase tables have Row Level Security (RLS) enabled?
  → Check each table in Supabase Studio or via SQL:
    SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';

□ Are RLS policies correct for each user role?
  → Users can read their own data only
  → Sellers can read/write their own products
  → Buyers can read products, create orders for themselves
  → Admins can read/write all (via service role server-side only)

□ Is there any SQL injection risk in raw queries?
  → Check: any use of string interpolation in SQL
  → Should: use Supabase's typed query builder or parameterized queries
```

### 4. API Security

```
🟠 HIGH:
□ Do all Route Handlers validate input with Zod?
  → Every POST/PUT/PATCH handler must have Zod schema validation
  → Never trust req.json() without validation

□ Is rate limiting implemented on auth endpoints?
  → /api/auth/* — check for rate limiting
  → Current: in-memory only (insufficient at scale)

□ Are file upload endpoints protected?
  → File type validation (MIME type, not just extension)
  → File size limits
  → Virus scanning (or quarantine before delivery)

□ Are signed URLs used for paid product delivery?
  → TTL: 15 minutes maximum
  → Must require valid session + completed purchase
```

### 5. Environment Variables

```
🔴 CRITICAL:
□ Check .env.local — is it in .gitignore?
  → grep -r "SERVICE_ROLE_KEY" .env*

□ Scan for hardcoded secrets in codebase:
  → grep -r "sk_live" .
  → grep -r "sk_test" .
  → grep -r "sb-" app/ components/ lib/
  → grep -rn "ANTHROPIC" app/ components/

□ Are all NEXT_PUBLIC_ vars genuinely safe to expose?
  → Review every NEXT_PUBLIC_ variable in .env.local
  → None should contain admin credentials or secret keys
```

### 6. Content Security

```
🟠 HIGH:
□ Are CSP (Content-Security-Policy) headers configured?
  → Check next.config.js headers()
  → Should block: inline scripts, unauthorized origins

□ Is user-generated content sanitized before display?
  → Check: community posts, product descriptions, review bodies
  → Should: sanitize HTML, prevent XSS

□ Are GDPR requirements addressed?
  → Right to deletion: can user data be deleted?
  → Data export: can users export their data?
  → Cookie consent: is there a consent banner?
```

---

## OUTPUT FORMAT

```
SECURITY REVIEW REPORT
======================
Scope: [what was reviewed]
Date: [date]
Reviewer: Technical Agent

CRITICAL FINDINGS (immediate action required):
  [CRIT-001] [Location] — [Description]
    Risk: [what attacker can do]
    Fix: [specific remediation steps]
    Estimated effort: [hours]

HIGH FINDINGS (fix before launch):
  [HIGH-001] [Location] — [Description]
    Risk: [impact]
    Fix: [remediation]

MEDIUM FINDINGS (fix in next sprint):
  [MED-001] [Location] — [Description]
    Fix: [remediation]

LOW FINDINGS (backlog):
  [LOW-001] [Description]

SUMMARY:
  Critical: [N]  High: [N]  Medium: [N]  Low: [N]

ESCALATION REQUIRED: [Yes/No]
  If yes → escalate to founder immediately: asjames18@gmail.com
  
RECOMMENDED ACTIONS (ordered by priority):
  1. [action]
  2. [action]
  3. [action]
```

---

## AFTER THE REVIEW
1. CRITICAL findings → escalate to founder immediately
2. HIGH findings → add to build-queue.md as Sprint 1 priority
3. Create ADR if architectural security decision was made
4. Update `/project-intelligence/technical-system.md` security checklist section
5. Add to handoff notes
