# ADR Generator Prompt — Melanated In Tech

> **North Star:** Melanated In Tech is building the world's most practical ecosystem for AI Agents, MCP Servers, Agent Skills, Automation Systems, and Agent Commerce. Every decision should move the platform closer to becoming the trusted place where people learn, build, deploy, buy, sell, and scale AI-powered systems.

---

## PURPOSE
Generate a complete Architecture Decision Record (ADR) for a significant technical, product, or strategic decision. ADRs are permanent. They are never deleted — they build the institutional memory of Melanated In Tech.

---

## WHEN TO CREATE AN ADR
An ADR is required when:
- The decision affects the technical architecture
- The decision affects a data model or schema
- The decision affects a revenue or pricing structure
- The decision will be hard to reverse
- Future agents need to understand WHY something was done this way
- You're choosing between two or more meaningful options

**When NOT to create an ADR:**
- Routine bug fixes
- Minor UI changes
- Copy changes
- Standard pattern implementations

---

## ROLE
You are creating an Architecture Decision Record for Melanated In Tech. This document will be read by future developers, AI agents, and team members who need to understand why this decision was made. Be specific. Be honest about tradeoffs. Future readers will thank you.

---

## INPUTS REQUIRED
- Decision topic (what was decided or needs to be decided)
- Context (what situation prompted this decision?)
- Options considered (what alternatives were evaluated?)
- Decision made (what was chosen?)
- Rationale (why this option over the others?)
- Tradeoffs (what do we accept by making this choice?)
- Future impact (what does this enable or constrain?)

---

## OUTPUT FORMAT

Save to: `/project-intelligence/adrs/ADR-[NNN]-[short-kebab-title].md`

```markdown
# ADR-[NNN]: [Title]

> **North Star:** Melanated In Tech is building the world's most practical ecosystem for AI Agents, MCP Servers, Agent Skills, Automation Systems, and Agent Commerce. Every decision should move the platform closer to becoming the trusted place where people learn, build, deploy, buy, sell, and scale AI-powered systems.

---

**Date:** YYYY-MM-DD
**Status:** Proposed | Active | Superseded by ADR-[NNN]
**Deciders:** [Who made this decision]
**Domain:** Technical | Product | Business | Security | Infrastructure

---

## Context

[What is the situation that requires this decision? 
What problem is being solved? 
What constraints exist?
Be specific — future readers have no context.]

---

## Decision

[What was decided? State it clearly in 1-3 sentences.
This is the most important section — make it unambiguous.]

---

## Alternatives Considered

### Option A: [Name]
[Description]

**Pros:**
- [pro 1]
- [pro 2]

**Cons:**
- [con 1]
- [con 2]

### Option B: [Name]
[Description]

**Pros:**
- [pro 1]

**Cons:**
- [con 1]

### Option C (Chosen): [Name]
[Description — if the chosen option is listed here]

---

## Why Chosen

[Why this option over the alternatives? 
Be specific — reference the pros/cons above.
What evidence or reasoning tips the balance?]

---

## Tradeoffs

| We Accept | Because |
|-----------|---------|
| [tradeoff 1] | [reason it's acceptable] |
| [tradeoff 2] | [reason it's acceptable] |

---

## Future Impact

**This decision enables:**
- [what becomes possible]
- [what becomes easier]

**This decision constrains:**
- [what is now harder]
- [what is now off-limits without reversing this decision]

**When to revisit this ADR:**
- [specific trigger condition that should prompt re-evaluation]

---

## Implementation Notes

[Any specific implementation details future developers need to know.
What files were changed? What schemas were updated?
What documentation needs to stay in sync?]
```

---

## QUALITY CHECKLIST
- [ ] Date and status set
- [ ] Context explains WHY (not just what)
- [ ] At least 2 alternatives considered with honest pros/cons
- [ ] Decision stated clearly and unambiguously
- [ ] Tradeoffs acknowledged honestly (not glossed over)
- [ ] Future impact both positive and negative noted
- [ ] Implementation notes included if technical
- [ ] ADR-001 through ADR-[NNN] checked — correct sequence number used
- [ ] Added to `/project-intelligence/architecture-decisions.md` index
- [ ] Added to session handoff notes

---

## AFTER CREATING THE ADR
1. Add entry to `/project-intelligence/architecture-decisions.md` index table
2. Note in `agent-memory.md` if the decision affects other agents
3. Link to ADR in any code that implements the decision (comment: `// See ADR-NNN`)
4. Add to handoff notes
