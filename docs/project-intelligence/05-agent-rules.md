# Agent Rules

**Purpose:** Instructions for AI coding agents (Cursor, Claude Code, Codex, etc.) working in this repository.  
**Last updated:** 2026-05-29

---

## Before You Code

1. Read `docs/project-intelligence/01-product-vision.md` through `09-technical-debt.md`
2. Confirm the actual domain — this is a **Melanated In Tech AI and tech education platform**, not gym/athlete software
3. Use terms from `02-domain-language.md` exactly (Tool, Category, Review, Favorite, Admin, etc.)
4. Do not introduce Express, MongoDB, Clerk, or Stripe — they are not part of this stack
5. Prefer extending existing patterns over inventing new abstractions

---

## Stack Constraints

| Use | Do Not Use |
|-----|------------|
| Next.js 15 App Router | Pages Router for new routes |
| Supabase Auth + PostgreSQL | JWT/Express/MongoDB |
| `@supabase/ssr` for server clients | `@supabase/auth-helpers-nextjs` for new code |
| Tailwind CSS | New CSS-in-JS libraries |
| TypeScript | New `.js` files in `app/` or `lib/` |

---

## File Placement Rules

| What | Where |
|------|-------|
| New page | `app/<route>/page.tsx` + optional `*Client.tsx` for client interactivity |
| New API route | `app/api/<domain>/route.ts` |
| Shared UI | `components/` (admin-only → `components/admin/`) |
| Supabase/data access | `lib/` — prefer one client factory |
| Feature-specific logic | Future: `features/<domain>/` (migrate incrementally) |
| Seed/ops scripts | `scripts/` |
| Schema changes | `supabase/migrations/` (numbered SQL files) |
| Agent memory / decisions | `docs/project-intelligence/` |

---

## Supabase Client Rule

**Do not create new Supabase client factories.**

Use existing modules until consolidation is complete:
- Browser: `lib/supabase.ts`
- Server (API/RSC): `lib/supabase-server.ts` → `createClient()`
- Service role (admin): `lib/supabaseAdminClient.ts` or `lib/auth.ts` → `createAdminClient()`

---

## Data Source Rule

**Runtime pages and API routes must read Tools from Supabase**, not `data/tools.ts`.

Static `data/` is for:
- Seed scripts
- Offline fallbacks (explicitly documented)
- Tests

---

## Auth & Security Rules

1. Never hardcode admin emails — use `ADMIN_EMAILS` env var and `user_roles` table
2. Never expose `SUPABASE_SERVICE_ROLE_KEY` to client bundles
3. Gate or delete debug routes before production deploys
4. Remove `app/api/debug-env/route.ts` exposure of config in production
5. Validate all admin API routes check admin role server-side
6. Do not commit `.env` files or secrets

---

## API Route Conventions

```typescript
// Standard error shape
return NextResponse.json({ error: 'Message' }, { status: 4xx });

// Standard success shape
return NextResponse.json({ success: true, data: result });

// Always authenticate before mutations
const { data: { user } } = await supabase.auth.getUser();
if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
```

Extract shared Bearer-token auth into a utility when touching multiple routes (do not copy-paste).

---

## Component Rules

1. Keep client components in `*Client.tsx` files; keep `page.tsx` as server component when possible
2. Files over 400 lines should be split when touched — do not grow monoliths
3. Match existing naming: `ToolCard`, `ReviewForm`, `AdminDashboard`
4. Do not duplicate `AdvancedSearch.tsx` (public vs admin) — extract shared logic

---

## Database Rules

1. New columns: add migration in `supabase/migrations/`
2. Regenerate or hand-write `lib/database.types.ts` after schema changes
3. snake_case in DB, camelCase in TypeScript API responses
4. Always enable RLS on new tables
5. Fix `favorites.tool_id` TEXT vs `tools.id` UUID mismatch when touching favorites

---

## Documentation Rules (Mandatory After Changes)

Update these when making meaningful changes:

| Change Type | Update |
|-------------|--------|
| Architecture | `03-architecture.md` |
| New feature | `04-current-features.md` |
| Technical debt fixed/added | `09-technical-debt.md` |
| Architectural decision | `07-decision-log.md` |
| Next work items | `08-next-tasks.md` |

---

## Validation Checklist (Run Before Declaring Done)

```bash
npm run verify-env        # env sanity
npm run lint                # ESLint (fix config if broken)
npm run build               # production build
npm test -- --ci            # unit tests
```

Also verify:
- No new secrets in code
- Imports resolve
- New routes added to middleware public/protected lists if needed
- RLS policies for new tables

---

## What NOT to Do

- ❌ Mass rename `/AITools` without redirect strategy
- ❌ Big-bang move to `src/features/` — migrate one feature at a time
- ❌ Delete working scripts without confirming no CI/cron dependency
- ❌ Add runtime OpenAI calls without explicit product requirement
- ❌ Create second tool data source
- ❌ Disable RLS "temporarily"
- ❌ Rewrite `AdminDashboard.tsx` in one PR — split incrementally

---

## Commit Message Style

Follow existing repo style — concise, imperative:

```
fix favorites API auth for cookie sessions
add migration for reviews table FK
consolidate supabase server client factory
```

---

## Getting Help

| Topic | File |
|-------|------|
| Commands | `docs/commands.md` |
| Admin setup | `docs/admin-setup.md` |
| AI data scripts | `docs/ai-data-fetching.md` |
| Data quality | `docs/data-quality-system.md` |
| Roadmap | `docs/ROADMAP_REMAINING_TASKS.md` |
