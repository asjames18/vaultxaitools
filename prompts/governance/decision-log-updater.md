# Decision Log Updater — Melanated In Tech

> **North Star:** Melanated In Tech is building the world's most practical ecosystem for AI Agents, MCP Servers, Agent Skills, Automation Systems, and Agent Commerce. Every decision should move the platform closer to becoming the trusted place where people learn, build, deploy, buy, sell, and scale AI-powered systems.

---

## PURPOSE
Update the MIT Decision Log whenever a significant decision is made. The decision log is the institutional memory that prevents future agents from undoing good decisions or repeating bad ones.

---

## WHAT BELONGS IN THE DECISION LOG

A decision is "significant" if any of these are true:
- It affects revenue (pricing, commissions, business model)
- It affects architecture (tech stack, DB schema, APIs)
- It affects brand or positioning
- It affects the roadmap or feature priority
- It affects community policy
- A future agent might undo it without knowing the context

**What does NOT belong:**
- Routine bug fixes
- Minor UI tweaks
- Standard pattern implementations
- Content edits

---

## DECISION LOG FILE

Location: `/project-intelligence/decision-log.md`

Format:

```markdown
# MIT Decision Log

> Every significant decision made on the Melanated In Tech platform.
> Never delete entries — history is the context future agents need.
> Last Updated: [date]

---

## [YYYY-MM-DD] — [Decision Title]

**Decision:** [What was decided — one clear sentence]
**Context:** [Why was this decision needed? What situation prompted it?]
**Made By:** [Founder / SuperAgent CEO / specific agent + escalation note]
**Alternatives Considered:**
  - [Option A] — rejected because [reason]
  - [Option B] — rejected because [reason]
**Impact:** [What changes as a result of this decision?]
**Reversible:** Yes / No
**ADR:** [ADR-NNN if architectural] / N/A
**Status:** Active / Superseded by [date + new decision]

---

```

---

## HOW TO USE THIS PROMPT

When you need to log a decision:

1. **State the decision clearly:** "We decided to [X]"
2. **Explain the context:** Why was this decision required?
3. **Note alternatives:** What else was considered?
4. **Assess reversibility:** Can this be changed without significant cost?
5. **Link to ADR:** If it's an architectural decision, an ADR must also exist

---

## EXAMPLE ENTRIES

```markdown
## 2026-06-03 — Marketplace Commission Rate Set at 30/70

**Decision:** Standard marketplace commission is 30% to MIT, 70% to seller.
**Context:** Need a commission structure for Phase 2 marketplace launch. 
  Benchmarked against Gumroad (10%), Lemon Squeezy (5%+$0.50).
**Made By:** Founder (Antonio James)
**Alternatives Considered:**
  - 10% MIT / 90% seller — rejected: insufficient revenue for MIT to sustain operations
  - 20% MIT / 80% seller — considered; 30% chosen for Phase 1 to maximize MIT revenue during growth phase
**Impact:** Sellers earn 70% of each sale. Higher tiers earn more (Pro: 80%, Elite: 85%).
**Reversible:** Yes — can be reduced if seller acquisition slows
**ADR:** ADR-002
**Status:** Active

---

## 2026-06-03 — Use Next.js 15 App Router (Don't Migrate Framework)

**Decision:** Stay with Next.js 15 App Router. No framework migration.
**Context:** Codebase already runs on Next.js 15. Considered Remix.
**Made By:** Technical Agent (endorsed by Founder)
**Alternatives Considered:**
  - Remix — rejected: 4-6 week rebuild, no user benefit, no current staff expertise
  - SvelteKit — rejected: smaller ecosystem, no advantage for this use case
**Impact:** All future development uses Next.js 15 App Router (RSC + streaming).
**Reversible:** Yes, but high cost (full rewrite)
**ADR:** ADR-005
**Status:** Active
```

---

## QUALITY CHECKLIST
- [ ] Decision stated clearly in one sentence
- [ ] Context explains WHY (not just what)
- [ ] Alternatives documented (even if only 1 alternative)
- [ ] Reversibility assessed
- [ ] ADR link included if architectural
- [ ] Status is correct (Active vs. Superseded)
- [ ] `decision-log.md` file updated
- [ ] `agent-memory.md` updated if this affects cross-session behavior
