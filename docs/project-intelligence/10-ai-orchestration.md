# AI Orchestration

**Last updated:** 2026-05-29  
**Scope:** How AI is used in Melanated In Tech — offline pipelines, automation, and future agent integration.

---

## Current State: AI as Data Pipeline (Not Runtime)

This application does **not** call LLMs at request time. AI-related work happens in **offline scripts** and **admin enrichment tools**.

```
┌──────────────────────────────────────────────────────────────┐
│                    OFFLINE AI PIPELINE                        │
│                                                               │
│  External APIs / Scraping                                     │
│       ↓                                                       │
│  scripts/fetch-real-ai-data.js                                │
│  scripts/fetch-live-ai-data.js                                │
│  scripts/fetch-top-ai-tools.js                                │
│  scripts/real-time-ai-data-fetcher.js                         │
│       ↓                                                       │
│  Data normalization + categorization                          │
│  scripts/improve-ai-detection.js                              │
│       ↓                                                       │
│  Supabase `tools` / `ai_news` tables                          │
│       ↓                                                       │
│  Next.js app serves curated directory                         │
└──────────────────────────────────────────────────────────────┘
```

---

## Script Inventory

### Tool Data Ingestion

| Script | Lines | Purpose |
|--------|-------|---------|
| `fetch-real-ai-data.js` | ~688 | Primary AI tool metadata fetch |
| `fetch-live-ai-data.js` | ~520 | Live API sourcing |
| `fetch-top-ai-tools.js` | ~548 | Popular tools aggregation |
| `real-time-ai-data-fetcher.js` | ~745 | Scheduled real-time refresh |
| `fetch-real-ai-data-offline.js` | ~676 | Offline/cache mode |
| `update-ai-data.js` | — | Batch update runner |

### News Automation

| Script | Lines | Purpose |
|--------|-------|---------|
| `ai-news-automation.js` | ~546 | Populate `ai_news` table |
| `setup-news-database.js` | — | News schema setup |

### Combined Automation

| Script | Purpose |
|--------|---------|
| `ai-tools-automation.js` | Tool ingestion orchestrator |
| `combined-automation.js` | Multi-pipeline runner |
| `scheduler.js` | Cron-like scheduling |
| `periodic-data-refresh.js` | Scheduled refresh |

### Data Quality

| Script | Purpose |
|--------|---------|
| `data-quality-monitor.js` | Validation + optional auto-fix (`npm run monitor-data-quality`) |
| `fix-tool-data-quality.js` | ~707 lines — repair pipeline |
| `aggressive-cleanup.js` | Bulk cleanup |

---

## Environment Variables (AI Scripts)

From `env.example` — used by scripts, **not** Next.js runtime:

| Variable | Usage |
|----------|-------|
| `OPENAI_API_KEY` | Tool categorization/detection scripts |
| `REPLICATE_API_KEY` | Image/media tool scripts |
| `NEXT_PUBLIC_NEWS_API_KEY` | News feed ingestion |
| `NEXT_PUBLIC_SUPABASE_URL` | Write target |
| `SUPABASE_SERVICE_ROLE_KEY` | Bypass RLS for batch writes |

---

## In-App "AI" Features (Non-LLM)

| Feature | Location | Mechanism |
|---------|----------|-----------|
| Tool URL enrichment | `/api/admin/tools/enrich` | HTML OG/meta scrape |
| Trending algorithm | `lib/trending.ts` | Weighted scoring (no ML) |
| Fuzzy search | `/api/search` + Fuse.js | Client-side fuzzy match |
| News fallback | `app/news/fallbackNews.ts` | Hardcoded articles when DB empty |

---

## Workflow Automation System

### Database Tables (via scripts)
- `workflows` — workflow definitions
- `workflow_runs` — execution history
- `workflow_templates` — reusable templates

### API Routes
- `GET/POST/PUT/DELETE /api/admin/workflows`
- `POST /api/admin/workflows/execute`

### Admin UI
- `app/admin/automation/AutomationDashboard.tsx`
- `components/admin/WorkflowAutomation.tsx` (638 lines)
- `components/admin/EnhancedWorkflowManager.tsx`

### Current Status: Partially Stubbed
- `/api/admin/automation` returns placeholder — "scripts cleaned up"
- UI exists but backend integration incomplete
- **Debt item:** TD-M09

---

## Target Orchestration Architecture

```
orchestration/
  runners/
    tool-ingestion.ts      # wraps fetch-real-ai-data logic
    news-ingestion.ts      # wraps ai-news-automation
    data-quality.ts        # wraps data-quality-monitor
  schedules/
    cron.config.ts         # schedule definitions
  types/
    pipeline-result.ts

ai/
  prompts/                 # future: categorization prompts
  classifiers/             # future: tool category detection
```

Migrate incrementally from `scripts/` — do not delete working scripts until runners are proven.

---

## npm Scripts (Current vs Needed)

| Script | Status |
|--------|--------|
| `monitor-data-quality` | ✅ Wired |
| `monitor-data-quality:auto-fix` | ✅ Wired |
| `setup-audit-logs` | ✅ Wired |
| `verify-env` | ✅ Wired |
| `seed:tools` | ❌ Missing — docs reference it |
| `update:ai-data` | ❌ Missing — docs reference it |
| `run:news-automation` | ❌ Missing |
| `run:tool-ingestion` | ❌ Missing |

**Action:** Add canonical npm scripts pointing to verified script entry points.

---

## Agent / MCP Integration Points

For AI coding agents working **on** this codebase:

| System | Location | Purpose |
|--------|----------|---------|
| Project intelligence | `docs/project-intelligence/` | Agent system memory |
| Agent rules | `05-agent-rules.md` | Coding constraints |
| Supabase MCP | Cursor plugin | Schema inspection, migrations |
| Data quality | `npm run monitor-data-quality` | Post-change validation |

For AI agents working **through** this platform (future):

| Integration | Status |
|-------------|--------|
| In-app agent chat | Not implemented |
| MCP tool directory API | Not implemented |
| Webhook-triggered ingestion | Partial (workflow tables exist) |
| Memory system (Supermemory MCP) | External — not wired to app |

---

## Scheduled Execution Options

| Method | Fit |
|--------|-----|
| **Vercel Cron** | Call `/api/admin/refresh-content` or new cron routes |
| **GitHub Actions** | Run `node scripts/real-time-ai-data-fetcher.js` on schedule |
| **Local scheduler.js** | Dev/manual only |
| **Supabase pg_cron** | Future — edge function triggers |

**Recommendation:** GitHub Actions for ingestion + Vercel cron for lightweight refresh until workflow system is complete.

---

## Safety Rules for AI Pipelines

1. **Never write to production without service role key in CI secrets** — not in code
2. **Idempotent seeds** — scripts must handle re-runs without duplicates
3. **Validate before publish** — run `data-quality-monitor` after ingestion
4. **Audit trail** — log batch runs to `audit_logs` or `workflow_runs`
5. **Rate limit external APIs** — scripts must backoff on 429/5xx
6. **No auto-publish** — ingested tools start as `draft`; admin publishes

---

## Future AI Capabilities (Requires ADR)

| Capability | Prerequisite |
|------------|--------------|
| LLM tool categorization | ADR + OpenAI SDK + cost controls |
| AI review moderation | ADR + content policy |
| Semantic search (embeddings) | pg_vector extension + embedding pipeline |
| In-app recommendation engine | User activity tables wired (TD-H04) |
| Agent-accessible tool API | OpenAPI spec + API keys |

Do not implement without explicit product approval and ADR entry in `07-decision-log.md`.

---

## Documentation Cross-References

- Pipeline details: `docs/ai-data-fetching.md`
- Data quality: `docs/data-quality-system.md`
- Admin automation UI: `docs/admin-features.md`
- Commands: `docs/commands.md`
