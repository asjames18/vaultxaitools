# Member Onboarding — Melanated In Tech

> **North Star:** Melanated In Tech is building the world's most practical ecosystem for AI Agents, MCP Servers, Agent Skills, Automation Systems, and Agent Commerce. Every decision should move the platform closer to becoming the trusted place where people learn, build, deploy, buy, sell, and scale AI-powered systems.

---

## PURPOSE
Design and operate the member onboarding sequence — the critical first 30 days that determine whether a new member becomes an active builder or a silent churner.

---

## ONBOARDING PHILOSOPHY

**The first 10 minutes determine the first 10 months.**

A member who introduces themselves, finds their first relevant thread, and takes their first action within 24 hours is 3× more likely to still be active at 90 days.

Every touchpoint in the first 30 days has one goal: move the member from passive enrollment to active building.

---

## THE 30-DAY ONBOARDING JOURNEY

### Day 0 (Signup)

**Trigger:** User creates account
**Email (Resend):** Welcome + Next Steps

```
Subject: Welcome to MIT — here's where to start

[First name],

You just joined 500+ builders learning to build, deploy, and monetize 
AI agents, MCP servers, and automation systems.

Here's where to start:

1. Introduce yourself → [Community link]
2. Pick your learning path → [Academy link]
3. Download your starter guide → [Lead magnet link]

The most important thing: don't just read. Build something.

See you inside,
Antonio
Melanated In Tech
```

**In-app:** Welcome modal on first login
```
"Welcome to MIT! Your first 3 actions:
□ Introduce yourself in #welcome
□ Tell us: what are you building?
□ Browse the Academy — pick 1 course"
```

---

### Day 1

**Check:** Did they introduce themselves?
- YES → Trigger "Great intro!" celebration post from Community Agent
- NO → Send reminder email

**Email (Resend — if no intro):**
```
Subject: Quick question before you go...

[First name],

What are you building with AI?

Even if you're just getting started — tell us in 1-2 sentences.
Drop it here: [community #welcome link]

The builders in MIT are working on some incredible things.
You should see what's already happening.

— Antonio
```

---

### Day 3

**Email:** Social proof + community highlight

```
Subject: Look what [member name] just shipped

[First name],

[Real member win from this week — with specifics]

This is what MIT builders do. They build real things and share them.

What's yours going to be? [Community link]

— Antonio
```

---

### Day 7

**Email:** Academy CTA

```
Subject: Your learning path starts here

[First name],

You've been with us for a week. Here's the fastest path to building 
your first deployable AI agent:

→ Start here: [Free course or first Academy course]

It takes [X hours]. By the end, you'll have a working [specific output].

[Enroll Free / Enroll Now]

— Antonio
```

---

### Day 14

**Email:** Builder League invite (if engaged) OR re-engagement (if not)

**If engaged (has posted in community or enrolled):**
```
Subject: Want accountability while you build?

The MIT Builder League is small cohorts of 5-8 people working toward
the same goal for 90 days.

Next cohort starts [date]. [Join the waitlist →]
```

**If not engaged (no activity since signup):**
```
Subject: Still there?

[First name], haven't seen you around yet.

What's getting in the way? Hit reply — I read every response.

One question: What's one thing you want to build with AI this month?

— Antonio
```

---

### Day 30

**Email:** Check-in + upgrade offer

```
Subject: 30 days in — how's it going?

[First name],

30 days since you joined MIT.

Quick questions:
1. What have you built?
2. What's your biggest block?
3. What would make MIT more valuable for you?

Reply to this email. I read them all.

[If they're active: offer upgrade to Community Builder tier]
[If they're not: soft re-engagement with specific course recommendation]
```

---

## ONBOARDING METRICS

| Metric | Target | Action if Below |
|--------|--------|----------------|
| Day 0 email open rate | 70%+ | Improve subject line |
| Day 1 intro post rate | 30%+ | Improve welcome modal |
| Day 7 first lesson start | 40%+ | Improve Day 3/7 emails |
| 30-day active retention | 50%+ | Add Day 21 touchpoint |

---

## QUALITY CHECKLIST
- [ ] All 5 emails written and loaded in Resend
- [ ] Trigger conditions configured (signup date + activity check)
- [ ] In-app welcome modal designed and built
- [ ] Community Agent monitors #welcome for introductions
- [ ] Day 1 reminder fires if no intro by 24 hours
- [ ] Engaged vs. non-engaged split at Day 14
- [ ] Metrics tracked per cohort
