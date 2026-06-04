# Discord Structure — Melanated In Tech

> **North Star:** Melanated In Tech is building the world's most practical ecosystem for AI Agents, MCP Servers, Agent Skills, Automation Systems, and Agent Commerce. Every decision should move the platform closer to becoming the trusted place where people learn, build, deploy, buy, sell, and scale AI-powered systems.

---

## PURPOSE
Define the structure, roles, channels, and bot configurations for the MIT Discord server — if Discord is chosen as the community platform.

**Note:** Community platform decision (Discord vs. Circle.so vs. custom) is unresolved. See `/project-intelligence/open-questions.md`.

---

## DISCORD SERVER STRUCTURE

### Server Name: Melanated In Tech | Builders Hub

### CATEGORIES AND CHANNELS

```
📌 START HERE
  #welcome          → New member intros + server rules
  #announcements    → MIT updates (moderated, Community Agent only)
  #resources        → Pinned guides, links, starter materials

🏗️ BUILDING
  #general          → Open conversation about AI, building, anything
  #showcase         → Share what you've built (WIP welcome)
  #help             → Technical questions (structured: "Problem / What I tried / Error")

🛠️ TOOLS & TECH
  #ai-agents        → Agent architecture, frameworks, deployment
  #mcp-servers      → MCP development, resources, examples
  #automation       → n8n, Make, Zapier AI, custom workflows
  #local-ai         → Ollama, LM Studio, local models
  #prompt-eng       → Prompt patterns, sharing, critique

💼 INCOME & BUSINESS
  #career-clients   → Job leads, freelance opportunities, client work (Architect+ only)
  #marketplace      → MIT Marketplace discussion, product ideas, selling tips

🏆 BUILDER LEAGUE
  #league-general   → Open discussion for all league members (Operator+ only)
  #cohort-[N]       → Private cohort channels (created per cohort)

📅 EVENTS
  #events           → Upcoming events, recordings, session notes
  #office-hours     → Async Q&A threads

🤝 MIT OFFICIAL
  #mit-updates      → Platform updates (read-only)
  #product-feedback → Suggestions and feedback (Community Agent monitors)
```

---

## ROLES

| Role | Color | Who Has It | Perks |
|------|-------|-----------|-------|
| @MIT Team | 🟢 Green | Founder + staff | Admin access |
| @Explorer | White | Free members | Read-only most channels |
| @Builder | 🔵 Blue | Community ($29) | Full community access |
| @Architect | 🟣 Purple | Architect ($79) | + career/clients channel |
| @Operator | 🟡 Gold | Operator ($149) | + builder league, VIP |
| @Founding Seller | 🟠 Orange | First 10 marketplace sellers | Permanent badge |
| @MIT Certified | 🔵 Teal | Certified graduates | Certification badge |
| @Community Legend | ⭐ Gold | Top contributors (manual) | Special recognition |

---

## BOT AUTOMATIONS

### MEE6 (or equivalent)

**Welcome message (auto):**
```
Welcome to MIT, [user]! 🟢

You're now part of 500+ builders learning to build AI agents,
MCP servers, and automation systems that earn.

Your first 3 steps:
1. Introduce yourself in #welcome
2. Browse #showcase to see what people are building
3. Head to #help when you're stuck

What are you building? Tell us in #welcome ↓
```

**Role assignment:**
- On join → @Explorer
- On membership webhook → assign @Builder, @Architect, @Operator
- On certification → assign @MIT Certified

### Auto-mod rules:
- Flag messages with links in #welcome (prevent spam)
- Mute members with 3+ warns
- Auto-delete messages containing known spam phrases

---

## CHANNEL RULES (pin in each channel)

### #showcase rules:
```
Share what you built (even if it's incomplete).
Include: What it does + Tech stack used + Link or screenshot
Tag @Community Agent if you want to be featured in the newsletter.
```

### #help rules:
```
Format your questions:
**Problem:** [what you're trying to do]
**What I tried:** [what you've attempted]  
**Error:** [exact error message, not paraphrase]
```

---

## ONBOARDING FLOW

```
User joins server
  → Assigned @Explorer role (read-only)
  → Welcome DM from bot
  → Must read #welcome rules and react to unlock full access
  → OR: synced from platform membership (Architect+ gets full access automatically)
```

---

## QUALITY CHECKLIST
- [ ] Server structure matches membership tiers
- [ ] Role sync configured with platform (Supabase webhook → Discord role)
- [ ] Welcome message is personal, not generic
- [ ] Bot automations tested
- [ ] Channel rules pinned
- [ ] Community Agent has moderator role
- [ ] Founder has admin role
- [ ] Spam protection active
