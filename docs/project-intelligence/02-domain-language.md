# Domain Language (Ubiquitous Language)

**Rule:** Use these exact terms consistently across frontend, backend, APIs, database, docs, and AI agent prompts.

**Last updated:** 2026-05-29

---

## Core Entities

| Term | Definition | DB / Code Location |
|------|------------|-------------------|
| **Tool** | A curated AI or tech product listed in the directory | `tools` table, `data/tools.ts`, `/tool/[id]` |
| **Category** | Grouping for tools (e.g. AI Tools, Automation, Dev Tools) | `categories` table, `lib/database-client.ts` static list |
| **Review** | User-submitted rating (1–5) and optional text for a Tool | `reviews` table, `/api/reviews` |
| **Favorite** | User bookmark of a Tool | `favorites` table, `/api/favorites`, `/favorites` |
| **Blog Post** | CMS article with slug, SEO fields, draft/published status | `blog_posts` table, `/blog/[slug]` |
| **News Item** | Aggregated AI industry news article | `ai_news` table, `/news` |
| **Sponsored Slot** | Paid/promotional placement for a Tool | `sponsored_slots` table, `SponsoredSlots.tsx` |
| **Affiliate Link** | Tracked outbound URL with UTM parameters | `lib/affiliate.ts`, `AffiliateLink.tsx` |
| **User** | Authenticated Supabase auth user | `auth.users`, profiles scripts |
| **Admin** | User with `admin` role in `user_roles` or allowlisted email | `user_roles`, `lib/auth.ts`, `/admin/*` |
| **Workflow** | Admin-defined automation sequence | `workflows` table, `/api/admin/workflows` |
| **Contact Message** | Inbound form submission | `contact_messages` table, `/api/contact` |
| **Audit Log** | Admin action record | `audit_logs` table, `lib/auditLogger.ts` |

---

## User-Facing Actions (Verbs)

| Action | Meaning | Route / API |
|--------|---------|-------------|
| **Explore** | Browse/search the tool directory | `/AITools`, `/api/search` |
| **Favorite** | Save a tool to user's list | `POST /api/favorites` |
| **Review** | Submit rating/feedback | `POST /api/reviews` |
| **Submit Tool** | Public suggestion for new tool | `/submit-tool` |
| **Publish** | Admin makes tool publicly visible | `POST /api/admin/tools/publish` |
| **Enrich** | Admin scrapes OG/meta from tool URL | `POST /api/admin/tools/enrich` |
| **Revalidate** | ISR cache bust for tool pages | `POST /api/revalidate/tools` |

---

## Status Values

### Tool status (`tools.status` via curation SQL)
- `draft` — not public
- `published` — visible in directory

### Blog post status
- `draft` | `published` | `archived`

### Contact message status
- `unread` | `read` | `replied` | `archived`

### User roles
- `admin` | `user`

---

## Naming Conventions

| Layer | Convention | Example |
|-------|------------|---------|
| React components | PascalCase | `ToolCard.tsx`, `ReviewForm.tsx` |
| API routes | kebab-case path segments | `/api/admin/tools/publish` |
| DB columns | snake_case | `review_count`, `weekly_users` |
| TypeScript types | PascalCase | `Tool`, `BlogPost` |
| Hooks | `use` prefix | `useFavorites`, `useAdvancedSearch` |
| Scripts | kebab-case or camelCase `.js` | `data-quality-monitor.js` |

---

## Terms to Avoid / Deprecate

| Deprecated Term | Use Instead | Reason |
|-----------------|-------------|--------|
| VaultX Tech / VaultX AI Tools | **Melanated In Tech** | Full rebrand June 2026 |
| Church/ministry categories | AI/tech categories (AI Tools, Automation, Dev Tools) | Rebrand repositioning |
| Express API / JWT auth | Next.js API routes + Supabase Auth | Legacy README references |
| MongoDB | Supabase PostgreSQL | Legacy env.example |
| `src/data/` paths | `data/` at repo root | Outdated docs |

---

## Category Canonical List (Target)

Align all sources to these tech-education-focused categories:

1. AI Tools
2. AI Agents
3. Automation
4. Development Tools
5. Productivity
6. Content Creation
7. Social Media
8. Email Marketing
9. Website Building
10. Communication

**Current drift:** `supabase/schema.sql` may still seed old categories — migration needed to align with `data/categories.json` and `lib/database-client.ts`.

---

## Product Name Registry

| Context | Name |
|---------|------|
| npm package | `vaultxaitools` (unchanged pending domain migration) |
| Public product | Melanated In Tech |
| Domain (current) | vaultxaitools.com |
| Domain (target) | melanatedintech.com |
| URL path (tools directory) | `/AITools` (legacy casing — do not rename without redirect plan) |
