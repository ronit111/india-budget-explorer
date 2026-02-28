# Indian Data Project — Claude Instructions

## Project Overview
Open data platform for Indian citizens. V1 of the broader **India Truth Engine** vision — a platform that cross-references Indian government data against primary sources (RBI, World Bank, IMF, NSO, budget documents) and presents evidence in clear, shareable formats. Budget is the starting dataset, not the whole product.

**Stack**: React 19 + TypeScript + Vite 7 + Tailwind v4. Zustand (state), Framer Motion (animation), D3 (visualizations: treemap, sankey, waffle), Canvas API (share card generation). Deployed on Vercel via GitHub push to `main`.

## Site Architecture — Hub + Data Domains
- **`/` (Hub)**: Visual portal showcasing all data domains. Not a dashboard — a curated data story showcase.
- **`/budget` (Budget Domain)**: Union Budget 2025-26 scrollytelling. Sub-routes: `/budget/explore`, `/budget/calculator`, `/budget/methodology`, `/budget/glossary`.
- **`/economy` (Economy Domain)**: Economic Survey 2025-26 scrollytelling. Sub-routes: `/economy/explore`, `/economy/methodology`, `/economy/glossary`.
- **`/rbi` (RBI Domain)**: RBI monetary policy and financial data. Sub-routes: `/rbi/explore`, `/rbi/methodology`, `/rbi/glossary`.
- **`/states` (State Finances Domain)**: State-level GSDP, revenue, fiscal health. Sub-routes: `/states/explore`, `/states/methodology`, `/states/glossary`.
- **`/census` (Census & Demographics Domain)**: Population, literacy, health, age structure, urbanization. Sub-routes: `/census/explore`, `/census/methodology`, `/census/glossary`.
- **Future domains** each get their own top-level route (e.g., `/education`) with self-contained sub-pages.
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
Four GitHub Actions workflows keep data fresh without manual intervention:
- **Budget** (`data-pipeline.yml`): Daily cron + Budget Day polling (Feb 1). Source: CKAN API.
- **Economy** (`economy-pipeline.yml`): Quarterly (Feb, Mar, Jun, Dec) aligned to NSO/Survey/WB release cycles. Source: World Bank API + curated Economic Survey figures.
- **RBI** (`rbi-pipeline.yml`): Bi-monthly (10th of Feb/Apr/Jun/Aug/Oct/Dec) aligned to MPC meeting schedule. Source: World Bank API + curated MPC decisions.
- **Census** (`census-pipeline.yml`): Quarterly (15th of Jan/Apr/Jul/Oct). Source: World Bank API + curated Census 2011/NPC 2026/NFHS-5/SRS 2022. Curated data (NFHS-5, SRS, Census 2011) is static until new surveys publish.
- **Freshness Monitor** (`data-freshness-monitor.yml`): Monthly check. Auto-creates GitHub issues for stale data, MPC decision reminders, Survey/Budget prep reminders. Covers all 5 domains.

**Curated data** (MPC decisions in `monetary_policy.py`, fiscal deficit series in `fiscal.py`, Economic Survey headline numbers in `main.py`, NFHS-5/SRS health data in `curated.py`) requires human updates when government publications drop. The freshness monitor creates reminder issues for these.

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

## New Domain Checklist

Every new data domain (State Finances, Census, etc.) must follow this end-to-end checklist. This was learned the hard way during Budget, Economy, and RBI buildout.

### 1. Pipeline & Data
- [ ] Pipeline fetches from authoritative source (government API, World Bank, etc.)
- [ ] Pydantic validation schemas match TypeScript interfaces exactly
- [ ] All JSON files pass validation — run pipeline and verify output
- [ ] Cross-check every key figure against primary source documents (not just API output)
- [ ] World Bank data has ~1 year lag — supplement with curated government source data for the latest year
- [ ] If a series returns empty from the API, mark the field as `Optional` in schema and handle gracefully in UI (filter out empty series, don't show phantom legend entries)
- [ ] GitHub Actions workflow added with cron schedule aligned to data release cadence

### 2. TypeScript Scaffolding
- [ ] Interfaces in `src/lib/data/schema.ts`
- [ ] Loader functions in `src/lib/dataLoader.ts`
- [ ] Zustand store in `src/store/`
- [ ] Data hook in `src/hooks/`

### 3. Routing & Navigation
- [ ] Routes in `App.tsx` (story, explore, methodology)
- [ ] Header: `isDomainSection` detection, title, tabs
- [ ] MobileNav: domain tabs array + icon
- [ ] Footer: domain-specific attribution with source links
- [ ] Back chevron → `/#stories`, footer back link → `/#stories`

### 4. Hub Integration
- [ ] Domain card in `HubPage.tsx` with mini-visualization and stat pills
- [ ] Hub loads only `summary.json` for the domain — never the full dataset
- [ ] Remove domain from "Coming Soon" list
- [ ] Mini-viz must be browser-verified (hub card rendering bugs are invisible to TypeScript)

### 5. Scrollytelling Page
- [ ] Each section: `useScrollTrigger` → `SectionNumber` → title/annotation → viz → source attribution
- [ ] Narrative bridges between sections with storytelling connectors
- [ ] CTA section at bottom with Explore + Methodology glow cards

### 6. Chart Quality (the things that bite you)
- [ ] **X-axis consistency**: When overlaying multiple series, ALL must use the same label format (e.g., all fiscal years "2014-15", never mix calendar years with fiscal years)
- [ ] **Dual-scale avoidance**: Never put metrics of vastly different scales on the same y-axis (e.g., 10% growth + 80% GDP share). Split into separate charts with labeled sub-headings.
- [ ] **Empty series**: Filter with `.filter(s => s.data.length > 0)` before passing to chart components. Otherwise phantom entries appear in legends.
- [ ] **Sparse data**: If a series has < 3 data points, it renders as a disconnected segment. Either hide it or source more data.
- [ ] **Tick density**: LineChart caps at ~8 x-axis labels. For datasets with 30+ points, the thinning is automatic, but verify the selected labels tell a coherent story.
- [ ] **Framer Motion**: Never set animated properties in both `style` and `initial`/`animate`. Use only `initial`/`animate` for animated values.
- [ ] **Flexbox + absolute children**: `items-end` with absolutely-positioned children = 0 content height. Use `h-full` on flex items.

### 7. Sub-Pages
- [ ] Explorer page: category filters, indicator list, interactive chart, data loads correctly
- [ ] Methodology page: data sources, indicator definitions, limitations, source links work
- [ ] Glossary page: create `public/data/{domain}/{year}/glossary.json` with ~12-15 curated terms (follow existing schema: `id`, `term`, `simple`, `detail`, `inContext`, `relatedTerms`)
- [ ] Glossary wrapper page: `src/pages/{Domain}GlossaryPage.tsx` → `<GlossaryPage domain="{domain}" />`
- [ ] Add domain config to `DOMAIN_CONFIG` in `GlossaryPage.tsx` (accent color, title, description, SEO)
- [ ] Route added to `App.tsx`, header tabs, and mobile nav
- [ ] Glossary terms added to `SearchOverlay.tsx` search index (loads via `loadGlossary`)

### 8. SEO
- [ ] Routes added to `scripts/prerender.mjs` (including glossary route)
- [ ] Sitemap updated (`public/sitemap.xml`) with story + explore + methodology + glossary routes + data file URLs
- [ ] `public/llms.txt` expanded with domain description and key data points
- [ ] `index.html` noscript fallback updated with domain content
- [ ] JSON-LD Dataset schema added in SEOHead component
- [ ] Favicon and logo assets present in `public/` (not just local — must be committed to git)

### 9. Browser QA (MANDATORY)
- [ ] Hub: domain card renders with stats and mini-viz (scroll to it, screenshot)
- [ ] Story: scroll through ALL sections — every chart renders, axes are readable, legends are accurate
- [ ] Explorer: filter categories, select indicators, chart renders with correct data
- [ ] Methodology: all sections readable, source links present
- [ ] Glossary: terms render, filter works, related term pills scroll to target, accent colors match domain
- [ ] Navigation: header tabs work (including Glossary tab), back chevron → `/#stories`
- [ ] Mobile: bottom nav tabs visible (including Glossary), charts responsive, no horizontal overflow
- [ ] Search: Cmd+K → type a domain term → glossary result appears with purple TERM badge
- [ ] Build: `npm run build` passes with zero errors

### 10. Documentation
- [ ] CHANGELOG.md entry
- [ ] README.md: pages table, data section, project structure, roadmap updated
- [ ] CLAUDE.md: site architecture section updated with new domain

## Polish Hygiene — Patterns for Every Domain

These are recurring polish tasks that should be checked after every domain buildout. Learned during Phase 3 polish of Budget, Economy, and RBI.

### Narrative ↔ Data Alignment
- **If a series is empty or sparse, update the narrative text** to match what's actually visible. Don't describe data the user can't see. (Example: CreditSection mentioned "domestic credit" but only private sector credit was rendered.)
- **Range vs single value**: When a schema provides `low`/`high` fields but data is a single point estimate (e.g., GDP projection), display conditionally: `low === high ? single : range`. Don't show "7.4–7.4%".

### Sparse & Empty Series
- **MIN_POINTS threshold**: Filter out series with < 3 data points before passing to chart components. Define `const MIN_POINTS = 3` at the component level. This prevents disconnected 1-2 point segments.
- **Conditional annotations**: When sparse series are hidden, switch the annotation text to describe only what's shown. Use a `hasBreakdown` flag derived from the filtered series count.
- **Dead code removal**: If a World Bank indicator consistently returns empty for India (e.g., `FS.AST.DOMS.GD.ZS`, `FR.INR.DPST`), remove it from the chart definition rather than relying solely on runtime filtering. Keep the pipeline fetch for future use, but don't render phantom entries.

### OG Images
- **Per-domain OG images**: Every domain gets its own `og-{domain}.png` (1200×630) generated by `scripts/generate-og.mjs`.
- **SEOHead image prop**: Pass `image="/og-{domain}.png"` to `<SEOHead>` on all pages within a domain (story, explore, methodology). Hub uses default `/og-logo.png`.
- **OG generation script**: Parametric — add new variants to the `VARIANTS` array in `generate-og.mjs` with domain title, tagline, and accent colors. Run `node scripts/generate-og.mjs` to regenerate all.
- **Don't embed data values** in OG images (they go stale). Use domain titles and thematic taglines instead.

### World Bank Data Gaps
- World Bank doesn't provide every indicator for India. When an indicator returns empty, the pipeline handles it gracefully (empty arrays pass validation), but the UI must adapt: hide the series, update narrative text, and note the limitation in the methodology page.
- Track empty indicators in the README roadmap so they're visible for future sourcing (e.g., DBIE integration).

## Common Pitfalls
- **Treemap**: Never use `hierarchy.leaves()`. Show one level at a time via `hierarchy.children`.
- **Sankey**: `nodePadding` below 20 causes label overlap with 12+ nodes. Hide value text for nodes < 20px.
- **AnimatePresence + keyed SVGs**: `mode="wait"` causes double-render. Avoid for chart containers.
- **Sticky headers**: `overflow-x-auto` breaks `position: sticky`. Use `overflow-x: clip`.
- **Mobile nav**: Fixed bottom h-14. Content needs `pb-16 md:pb-0`.
- **HorizontalBarChart formatting**: `formatValue` and `unit` are concatenated in bar labels. If `formatValue` returns a complete string (e.g., `₹35.28L Cr`), set `unit=""` to avoid double-display. Tooltip also uses `unit`, so keep it meaningful or empty.

## Future Phases — Planned Audits

### Creative Visualization Audit
After all data domains are built, conduct a full audit of every visualization across the portal. The goal: ensure the portal doesn't skew toward a monotonous wall of charts. For each section, ask: "Is a standard bar/line chart the best way to tell this story, or would a waffle, cartogram, unit chart, radial, slope chart, or novel approach create more engagement?"

Audit scope:
- [ ] Budget: treemap, sankey, waffle already creative. Check if any sections could benefit from alternatives.
- [ ] Economy: currently line/area charts. GDP composition could use a waffle or stacked waterfall.
- [ ] RBI: monetary policy timeline could be a connected dot plot or decision tree instead of a line chart.
- [ ] States: horizontal bars are functional but repetitive across 5 sections. Consider choropleth maps, slope charts (growth leaders vs. laggards), butterfly charts (revenue: own vs. central), or scatter plots (per capita vs. growth).
- [ ] Census (when built): population cartogram, literacy gender gap butterfly chart, urbanization shift sankey.

This audit should happen as a dedicated phase, not piecemeal. Document findings in a `VISUALIZATION_AUDIT.md` and implement changes domain by domain.

### Cross-Domain Linking Audit
Evaluate opportunities to weave connections between domains so users can naturally navigate related data. Examples:
- Budget state allocation → link to that state's GSDP in State Finances
- Economic Survey GDP figures → link to RBI monetary policy context
- State Finances revenue → link to Budget devolution/transfers
- Census state population → link to State Finances per capita

Implementation approaches to evaluate:
1. **Inline contextual links**: "Goa receives ₹X in budget allocation → [See Goa's fiscal health →](/states)"
2. **Related data cards**: At the bottom of each section, show 1-2 related data points from other domains
3. **Shared state selector**: If viewing Maharashtra data in one domain, offer quick navigation to Maharashtra in another domain
4. **Hub as the crossroads**: The hub page could surface cross-domain insights (e.g., "States that get the most budget allocation vs. their own revenue generation")

This is architecturally complex (requires cross-domain data awareness) and should be a separate phase. Use Codex to audit the codebase for natural connection points.
