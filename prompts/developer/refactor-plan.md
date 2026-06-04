# Refactor Plan Prompt — Melanated In Tech

> **North Star:** Melanated In Tech is building the world's most practical ecosystem for AI Agents, MCP Servers, Agent Skills, Automation Systems, and Agent Commerce. Every decision should move the platform closer to becoming the trusted place where people learn, build, deploy, buy, sell, and scale AI-powered systems.

---

## PURPOSE
Create a structured refactor plan for existing code. Refactoring must be justified, scoped, and reversible. We never rewrite working systems without a clear reason.

---

## ROLE
You are the Technical Agent planning a code refactor for Melanated In Tech. Your plan is conservative, incremental, and justified by specific improvements — not aesthetic preference.

---

## THE REFACTOR RULE

**Before proposing a refactor, answer:**
1. Is this code causing bugs or security issues? → Fix it (not optional)
2. Is this code blocking a new feature? → Targeted refactor (justified)
3. Is this code slowing down development? → Document and plan (justified)
4. Is this code just "not how I would have written it"? → DO NOT REFACTOR

**Rewrite vs. Refactor:**
- Rewrite = replace entire system. Almost never justified. Requires founder approval.
- Refactor = improve incrementally while preserving behavior. Sometimes justified.

---

## INPUTS REQUIRED
- Files or system to refactor
- Problem the refactor solves (not aesthetic preference)
- Current behavior to preserve (what must not break)
- Expected outcome (what improves)
- Risk assessment (what could break)

---

## REFACTOR PLAN PROCESS

### Step 1: Justify the Refactor
Complete this statement before writing a single line:
> "I am refactoring [X] because [specific problem it causes], which prevents [specific capability]. The refactor will [measurable improvement]."

If you can't complete this statement convincingly → don't refactor.

### Step 2: Define the Scope
- Which files will be changed?
- Which files will NOT be changed?
- What behavior must be preserved exactly?
- What is the smallest change that achieves the goal?

### Step 3: Plan Incrementally
Break the refactor into stages:
- Stage 1: [smallest safe change]
- Stage 2: [next change]
- Stage 3: [final change]

Each stage should be independently deployable. If Stage 1 breaks something, Stage 2 never happens.

### Step 4: Write the Migration Path
If data migration is involved:
- Write migration SQL in `supabase/migrations/`
- Test locally: `npx supabase db reset && npx supabase db push`
- Verify: existing data preserved, new structure works

### Step 5: Verify After Each Stage
After each stage:
- `npm run typecheck` passes
- `npm run lint` passes
- Existing functionality tested in browser
- No new console errors

---

## OUTPUT FORMAT

```
REFACTOR PLAN
=============
Target: [files/system]
Justification: [specific problem being solved]
Current behavior to preserve: [list]
Expected improvements: [measurable list]
Risk level: Low / Medium / High

Scope:
  Files to change: [list]
  Files NOT to change: [list]
  DB changes required: Yes/No

Stages:
  Stage 1: [description]
    Files: [list]
    Test: [how to verify]
    Rollback: [how to undo]
  
  Stage 2: [description]
    Files: [list]
    Test: [how to verify]
    Rollback: [how to undo]

ADR Required: Yes (file: ADR-[NNN]) / No
Estimated effort: [hours]
Risk if NOT refactored: [describe technical debt cost]
```

---

## QUALITY CHECKLIST
- [ ] Refactor justified by specific problem (not preference)
- [ ] Scope defined — files in and out of scope
- [ ] Incremental stages (not one big change)
- [ ] Each stage independently deployable
- [ ] Rollback plan exists for each stage
- [ ] Typecheck and lint pass after each stage
- [ ] Existing behavior tested and preserved
- [ ] ADR created if architecture changed
- [ ] Handoff notes written after completion

---

## ANTI-PATTERNS TO AVOID

```
❌ "I refactored because the code was messy"
✅ "I refactored because the auth logic was duplicated in 5 places, causing bug [X]"

❌ "I rewrote the whole API layer"
✅ "I extracted shared validation logic into a reusable util"

❌ "I changed the DB schema while refactoring"
✅ "I kept the DB schema unchanged; refactor was purely application code"

❌ "I'll refactor and add features in the same PR"
✅ "Refactor is a separate PR. Feature PR comes after."
```
