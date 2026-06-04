> **North Star:** Melanated In Tech is building the world's most practical ecosystem for AI Agents, MCP Servers, Agent Skills, Automation Systems, and Agent Commerce. Every decision should move the platform closer to becoming the trusted place where people learn, build, deploy, buy, sell, and scale AI-powered systems.

---

# ADR-004: AI-Assisted Content Strategy with Mandatory Human Review

**Date:** 2026-06
**Status:** Active
**Deciders:** Antonio James (Founder)

---

## Context

Achieving the 90-day content target (95–100 published pieces across blog, tutorials, use-case pages, and newsletters) requires a publishing velocity that is unsustainable for a single person writing from scratch. At the same time, the platform's reputation is built on technical accuracy and authentic voice — AI-generated content that sounds generic or contains errors would damage this.

The question was: what role should AI play in content production, and how do we maintain quality and authenticity at scale?

---

## Decision

**Implement a three-tier content authorship model:**

- **Tier 1 (40%):** Core team — pure human writing for flagship cornerstones, thought leadership, and brand-defining content
- **Tier 2 (40%):** AI-assisted — Claude assists with research, outline, and draft; human editor refines voice, verifies technical accuracy, adds original examples and perspective
- **Tier 3 (20%):** Community contributors — guest posts from members who've built real things, edited by MIT team

**Non-negotiable rule:** No AI content goes live without human review. All AI drafts save as unpublished drafts. A human must approve before publication.

**Disclosure stance:** MIT is an AI platform. Using AI to assist in content creation is on-brand and authentic. We don't hide it. The disclosure is: "AI does the labor; humans provide the intelligence, perspective, and accuracy."

---

## Alternatives Considered

### Alternative A: Pure Human Content Only
All content written by humans. No AI assistance. Highest authenticity floor.

**Why rejected:** Physically impossible to produce 95–100 pieces in 90 days as a solo founder also building the platform. The bottleneck would kill the SEO strategy before it compounds. Quality without volume is insufficient for early-stage SEO authority building.

### Alternative B: Pure AI Generation, Auto-Published
AI generates all content. Auto-published without human review. Maximum velocity.

**Why rejected:** Existential risk to brand. AI-generated technical content contains errors. If MIT publishes inaccurate tutorials (e.g., code that doesn't work), the community will discover it instantly and trust collapses. One viral "MIT published broken AI code" post would damage the brand more than slow content growth.

Also: auto-publishing removes the founder's editorial voice from content, which is a core brand differentiator.

### Alternative C: Outsource to Freelance Writers
Hire freelance technical writers to produce content at scale.

**Why rejected:** Cost-prohibitive at Phase 1 ($3–6K/month minimum for quality technical writers). Also: freelancers don't have the deep technical knowledge + cultural context required for MIT content. Building that context takes months.

### Alternative D: Community-Generated Content Only
All content from community contributors. Platform curates and publishes.

**Why rejected:** Community contribution is valuable but unreliable in Phase 1 (community doesn't exist yet). You can't build a content flywheel on content that doesn't exist. Must seed the community with authoritative content first.

---

## Why Chosen

1. **Sustainable without sacrificing quality.** Tier 2 (AI-assisted) reduces writing time by ~60% while maintaining quality because: the human still provides expertise, original perspective, and accuracy verification.

2. **Honest and on-brand.** MIT is an AI tools platform. Using AI to help create AI content is not hypocritical — it's demonstrating the exact workflow being taught in the Academy.

3. **Maintains founder voice.** The human edit step ensures every piece has the MIT brand voice injected, even if the structure was AI-drafted.

4. **Scales as community grows.** Tier 3 (community contributors) grows as the community grows — the content flywheel accelerates over time without proportional cost increases.

5. **Protects technical accuracy.** The mandatory human review step is a quality gate that prevents the most damaging failure mode: published inaccurate technical instructions.

---

## Tradeoffs

| Accepted Tradeoff | Reasoning |
|------------------|----------|
| AI-assisted content is sometimes detectably AI-drafted | Mitigated by aggressive voice injection during human edit |
| Human review creates a bottleneck | Required — the alternative (auto-publish) risks brand damage |
| Tier 2 content may lack the depth of Tier 1 | Tier 2 is primarily tutorials and use-case pages, not cornerstones. Depth is less critical. |
| Community contributors are unpredictable | Accept the variance; editorial gate prevents low quality from going live |

---

## Implementation Requirements

### Content Production Workflow (Tier 2)
```
1. SEO Agent identifies keyword + search intent
2. Content Agent generates: outline + draft (Claude API)
3. Draft saved to CMS as "Pending Review"
4. Human editor:
   a. Verifies all technical claims
   b. Tests all code examples
   c. Injects MIT voice and perspective
   d. Adds original examples from real experience
   e. Confirms internal links
5. Human publishes (manual action required)
```

### What the Content Agent CANNOT Do
- Publish content (no auto-publish permission ever)
- Write on behalf of the founder in first person
- Make claims about MIT's community size, revenue, or achievements without verified data
- Produce tutorials with untested code

---

## Future Impact

**This decision enables:**
- 90-day content velocity targets achievable without hiring
- Content flywheel that compounds as community grows
- Sustainable publishing rhythm that doesn't depend on founder finding time to write every piece

**This decision constrains:**
- Requires founder time for content review daily (30–60 min/day in Phase 1)
- Content agent must always save as draft — any change to this rule requires explicit founder approval
- Technical content requires technical verification — cannot delegate to non-technical reviewers

**Metric to watch:**
- Content accuracy error rate (target: <1 reader-reported error per 20 posts)
- Organic traffic per piece (target: 200+ monthly visits per published post at 6 months)
- Newsletter open rate (target: 30%+)
