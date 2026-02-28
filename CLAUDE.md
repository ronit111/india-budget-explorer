# Indian Data Project — Claude Instructions

## Project Overview
Open data platform for Indian citizens. V1 of the broader **India Truth Engine** vision — a platform that cross-references Indian government data against primary sources (RBI, World Bank, IMF, NSO, budget documents) and presents evidence in clear, shareable formats. Budget is the starting dataset, not the whole product.

**Stack**: React 19 + TypeScript + Vite 7 + Tailwind v4. Zustand (state), Framer Motion (animation), D3 (visualizations: treemap, sankey, waffle), Canvas API (share card generation). Deployed on Vercel via GitHub push to `main`.

## Site Architecture — Hub + Data Domains
- **`/` (Hub)**: Visual portal showcasing all data domains. Not a dashboard — a curated data story showcase.
- **`/budget` (Budget Domain)**: Union Budget 2025-26 scrollytelling. Sub-routes: `/budget/explore`, `/budget/calculator`, `/budget/methodology`.
- **`/economy` (Economy Domain)**: Economic Survey 2025-26 scrollytelling. Sub-routes: `/economy/explore`, `/economy/methodology`.
- **`/rbi` (RBI Domain)**: RBI monetary policy and financial data. Sub-routes: `/rbi/explore`, `/rbi/methodology`.
- **Future domains** each get their own top-level route (e.g., `/states`, `/census`) with self-contained sub-pages.
- Header is **context-aware**: hub title + search on `/`, domain title + sub-nav tabs inside a domain.
- **Back links** (header chevron + footer link) point to `/#stories`. New domains should follow this convention.
- Old routes (`/explore`, `/calculator`, `/methodology`) redirect to `/budget/*` equivalents.

## Deliberate Decisions
- **i18n removed**: Infrastructure exists (i18n.ts, LanguageSwitcher, LanguageProvider, Hindi locale files) but is not wired. Browser auto-translate preferred over dev overhead. Don't re-wire without explicit ask.
- **No decorative chrome**: Data IS the design. No card wrappers around visualizations, no unnecessary UI furniture.
- **Hub loads only `summary.json`**. Do NOT use `useBudgetData` (loads 7 files) on the hub page.
- **All derived values computed at runtime** from source data, never hardcoded (e.g., "31 paise borrowed per rupee").

## Data Integrity — Non-Negotiable
- **NEVER create mock, fake, placeholder, or hardcoded data.** Every number must trace to an authoritative source (indiabudget.gov.in, Open Budgets India, RBI, World Bank, etc.).
- If data doesn't exist for a planned feature, the feature waits. No exceptions.

## Automated Data Pipelines
Three GitHub Actions workflows keep data fresh without manual intervention:
- **Budget** (`data-pipeline.yml`): Daily cron + Budget Day polling (Feb 1). Source: CKAN API.
- **Economy** (`economy-pipeline.yml`): Quarterly (Feb, Mar, Jun, Dec) aligned to NSO/Survey/WB release cycles. Source: World Bank API + curated Economic Survey figures.
- **RBI** (`rbi-pipeline.yml`): Bi-monthly (10th of Feb/Apr/Jun/Aug/Oct/Dec) aligned to MPC meeting schedule. Source: World Bank API + curated MPC decisions.
- **Freshness Monitor** (`data-freshness-monitor.yml`): Monthly check. Auto-creates GitHub issues for stale data, MPC decision reminders, Survey/Budget prep reminders.

**Curated data** (MPC decisions in `monetary_policy.py`, fiscal deficit series in `fiscal.py`, Economic Survey headline numbers in `main.py`) requires human updates when government publications drop. The freshness monitor creates reminder issues for these.

## Design Identity
- Dark theme: void (#06080f) / raised (#0e1420) / surface (#131b27)
- Accents: saffron (#FF6B35), cyan (#4AEADC), gold (#FFC857)
- Typography: Inter (body), JetBrains Mono (data)
- IIB-inspired minimal, data-forward. Creative latitude encouraged — see BRAND.md.

## QA Protocol — MANDATORY after UI Changes

**"Build passing" is NOT a product check.** After any visual/interaction change:

1. **Browser verify** (use `mcp__claude-in-chrome__*`): open page, navigate to changed section, interact, screenshot
2. **Viz checklist**: Treemap drill-down + breadcrumb, Sankey label overlap, Waffle grouping, Calculator regime toggle + share card
3. **Full sanity** = build passes + grep for stale imports + browser inspection + interaction test + screenshot evidence

Never report a fix as complete based only on build + grep.

## Final QA — Citizen Perspective (when project scope is complete)
When all planned data domains are built and the project is considered "done," run a comprehensive QA pass from the perspective of an average Indian citizen visiting the portal for the first time. Evaluate:
1. **Clarity**: Is every section, label, and number understandable without domain expertise? Would a non-economist understand what "fiscal deficit" or "repo rate" means in context?
2. **Narrative flow**: Does each data story flow smoothly from section to section? Are there gaps where the reader might lose the thread or wonder "so what?"
3. **Data accuracy**: Spot-check key numbers against current authoritative sources. Flag anything that looks stale or inconsistent across domains.
4. **Analogies and comparisons**: Are the analogies practical and relatable? Do comparisons (e.g., per-capita breakdowns, paise-per-rupee) help understanding without creating confusion or prompting more questions?
5. **Completeness**: Are there obvious questions a citizen would have that the portal doesn't answer? Identify gaps worth filling.

This is not a per-change QA. It is a holistic product review to be run once, after all domains are live.

## Common Pitfalls
- **Treemap**: Never use `hierarchy.leaves()`. Show one level at a time via `hierarchy.children`.
- **Sankey**: `nodePadding` below 20 causes label overlap with 12+ nodes. Hide value text for nodes < 20px.
- **AnimatePresence + keyed SVGs**: `mode="wait"` causes double-render. Avoid for chart containers.
- **Sticky headers**: `overflow-x-auto` breaks `position: sticky`. Use `overflow-x: clip`.
- **Mobile nav**: Fixed bottom h-14. Content needs `pb-16 md:pb-0`.
