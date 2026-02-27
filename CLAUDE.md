# Indian Data Project — Claude Instructions

## Project Overview
Open data platform for Indian citizens. V1 of the broader **India Truth Engine** vision — a platform that cross-references Indian government data against primary sources (RBI, World Bank, IMF, NSO, budget documents) and presents evidence in clear, shareable formats. Budget is the starting dataset, not the whole product.

**Stack**: React 19 + TypeScript + Vite 7 + Tailwind v4. Zustand (state), Framer Motion (animation), D3 (visualizations: treemap, sankey, waffle), Canvas API (share card generation). Deployed on Vercel via GitHub push to `main`.

## Site Architecture — Hub + Data Domains
- **`/` (Hub)**: Visual portal showcasing all data domains. Not a dashboard — a curated data story showcase.
- **`/budget` (Budget Domain)**: Union Budget 2025-26 scrollytelling. Sub-routes: `/budget/explore`, `/budget/calculator`, `/budget/methodology`.
- **Future domains** each get their own top-level route (e.g., `/economy`, `/states`) with self-contained sub-pages.
- Header is **context-aware**: hub title + search on `/`, domain title + sub-nav tabs inside a domain.
- **Back links** (header chevron + footer link) point to `/#stories`. New domains should follow this convention.
- Old routes (`/explore`, `/calculator`, `/methodology`) redirect to `/budget/*` equivalents.

## Deliberate Decisions
- **i18n removed**: Infrastructure exists (i18n.ts, LanguageSwitcher, LanguageProvider, Hindi locale files) but is not wired. Browser auto-translate preferred over dev overhead. Don't re-wire without explicit ask.
- **No decorative chrome**: Data IS the design. No card wrappers around visualizations, no unnecessary UI furniture.
- **Hub loads only `summary.json`**. Do NOT use `useBudgetData` (loads 7 files) on the hub page.
- **All derived values computed at runtime** from source data, never hardcoded (e.g., "31 paise borrowed per rupee").

## Data Integrity — Non-Negotiable
- **NEVER create mock, fake, placeholder, or hardcoded data.** Every number must trace to an authoritative source (indiabudget.gov.in, Open Budgets India, RBI, etc.).
- If data doesn't exist for a planned feature, the feature waits. No exceptions.

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

## Common Pitfalls
- **Treemap**: Never use `hierarchy.leaves()`. Show one level at a time via `hierarchy.children`.
- **Sankey**: `nodePadding` below 20 causes label overlap with 12+ nodes. Hide value text for nodes < 20px.
- **AnimatePresence + keyed SVGs**: `mode="wait"` causes double-render. Avoid for chart containers.
- **Sticky headers**: `overflow-x-auto` breaks `position: sticky`. Use `overflow-x: clip`.
- **Mobile nav**: Fixed bottom h-14. Content needs `pb-16 md:pb-0`.
