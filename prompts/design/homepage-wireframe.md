# Homepage Wireframe — Melanated In Tech

> **North Star:** Melanated In Tech is building the world's most practical ecosystem for AI Agents, MCP Servers, Agent Skills, Automation Systems, and Agent Commerce. Every decision should move the platform closer to becoming the trusted place where people learn, build, deploy, buy, sell, and scale AI-powered systems.

---

## PURPOSE
Design and implement the Melanated In Tech homepage — the primary conversion surface of the entire platform. Every element exists to accomplish one thing: convert a first-time visitor into a signup.

---

## ROLE
You are the Design Agent designing the MIT homepage. The homepage answers one question for every visitor: "Is this for me?" Your design must answer YES instantly — with clarity, authority, and cultural resonance.

---

## CONVERSION GOAL
Visitor → Email signup OR free account creation

**Single primary CTA:** "Start Building Free"
**Secondary CTA:** "Explore the Academy"

---

## SECTION ARCHITECTURE

### Section 1: HERO (Above the Fold — Mobile)
**Goal:** Immediate clarity on who this is for and why it matters.

```
┌────────────────────────────────────┐
│                                    │
│  MELANATED IN TECH                 │
│                                    │
│  ████████████████████████████████  │
│  H1: The AI Agent Platform         │
│      for Black Builders            │
│  ████████████████████████████████  │
│                                    │
│  Subhead: Learn to build AI agents,│
│  MCP servers, and automation       │
│  systems that earn.                │
│                                    │
│  ┌──────────────────────────────┐  │
│  │  🟢 Start Building Free      │  │  ← PRIMARY CTA (#00FF41 bg)
│  └──────────────────────────────┘  │
│                                    │
│  [Explore the Academy →]           │  ← secondary (text link)
│                                    │
│  ── Social proof: 500+ builders ── │
│                                    │
└────────────────────────────────────┘
```

**Copy:**
- H1: "The AI Agent Platform for Black Builders" (or current top tagline)
- Subheadline: "Learn to build AI agents, MCP servers, and automation systems — then sell them in our marketplace."
- Primary CTA: "Start Building Free"
- Secondary CTA: "Explore the Academy →"
- Social proof: "[N] builders already building"

**Design rules:**
- Background: `#0A0A0A`
- H1: Geist, 700-900 weight, 36-48px mobile, 56-72px desktop
- CTA: Full-width on mobile, `bg-[#00FF41] text-[#0A0A0A] font-bold`
- No images needed in hero — typography does the work

---

### Section 2: THE VALUE PROPS (3 pillars)

```
┌─────────────┬─────────────┬─────────────┐
│   LEARN     │    BUILD    │  MONETIZE   │
│             │             │             │
│  Academy:   │  Community: │ Marketplace:│
│  AI Agents, │  Real peer  │  Sell your  │
│  MCP, Prompts│ accountability│ agents and │
│  Automation │  + builds   │ earn income │
│             │             │             │
│  [→ Academy]│  [→ Community]│[→ Marketplace]│
└─────────────┴─────────────┴─────────────┘
```

**Design:** Cards on `#111111` bg, `#00FF41` icon accent

---

### Section 3: SOCIAL PROOF (The Numbers)

```
┌──────────────────────────────────────┐
│                                      │
│   500+         38+          $0      │
│  Builders    AI Tools      to start │
│  Building    Curated                │
│                                      │
└──────────────────────────────────────┘
```

**Note:** Update numbers as platform grows.

---

### Section 4: FEATURED CONTENT (Latest Tutorials)

```
Latest from the MIT Blog

[Tutorial Card 1]  [Tutorial Card 2]  [Tutorial Card 3]
  Title              Title              Title
  Category           Category           Category
  Read time          Read time          Read time

             [→ Browse All Tutorials]
```

---

### Section 5: TOOLS DIRECTORY (Discovery Hook)

```
┌──────────────────────────────────────┐
│  Explore 38+ Curated AI Tools        │
│                                      │
│  [Category 1] [Category 2] [Cat 3]  │
│                                      │
│  [Tool Card] [Tool Card] [Tool Card] │
│                                      │
│         [→ Browse All Tools]         │
└──────────────────────────────────────┘
```

---

### Section 6: NEWSLETTER CTA

```
┌──────────────────────────────────────┐
│  Join 2,000+ builders reading        │
│  The Stack every Tuesday             │
│                                      │
│  [Email input]  [Subscribe Free]     │
│                                      │
│  Weekly AI agent tutorials,          │
│  tools, and community wins.          │
└──────────────────────────────────────┘
```

---

### Section 7: FINAL CTA

```
┌──────────────────────────────────────┐
│                                      │
│  Ready to go from AI curious         │
│  to AI sovereign?                    │
│                                      │
│  ┌────────────────────────────────┐  │
│  │  🟢 Start Building Free        │  │
│  └────────────────────────────────┘  │
│                                      │
│  No credit card required.            │
└──────────────────────────────────────┘
```

---

## COMPONENT LIST

| Component | File | Status |
|-----------|------|--------|
| Hero | `components/marketing/Hero.tsx` | Create |
| ValueProp grid | `components/marketing/ValueProps.tsx` | Create |
| Stats bar | `components/marketing/Stats.tsx` | Create |
| Tutorial cards | `components/content/TutorialCard.tsx` | Create or reuse |
| Tool cards | Reuse existing tool cards | Reuse |
| Newsletter CTA | `components/marketing/NewsletterCTA.tsx` | Create |
| Footer CTA | `components/marketing/FooterCTA.tsx` | Create |

---

## QUALITY CHECKLIST
- [ ] Mobile-first (375px renders correctly)
- [ ] Single primary CTA above fold on mobile
- [ ] H1 includes brand positioning statement
- [ ] Social proof near primary CTA
- [ ] Brand system correct (#0A0A0A bg, #00FF41 CTAs)
- [ ] No competing CTAs (one primary per section)
- [ ] Lighthouse Performance ≥85
- [ ] Lighthouse Accessibility ≥90
- [ ] `generateMetadata()` defined for homepage
