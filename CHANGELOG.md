# Changelog

## [0.8.0] - 2026-02-28

### Phase 4B: Census & Demographics Domain

**Census & Demographics Scrollytelling** (`/census`)
- Six-section narrative: population growth (national time series from World Bank), age structure (custom 10x10 waffle grid showing young/working/elderly %), vital statistics (birth vs death rate, fertility rate with 2.1 replacement reference line, life expectancy with gender split), health outcomes (IMR time series + state-level IMR with color gradient bars + NFHS-5 state health), literacy gender gap (custom butterfly chart showing male vs female literacy by state, sorted by gap), urbanization trends
- Multi-vintage data sourcing: World Bank API (national time series), Census 2011 (state baseline), NFHS-5 2019-21 (health by state), SRS 2023 (vital statistics), NPC population projections
- Violet (#8B5CF6) accent color for the census domain
- Custom visualizations: AgeWaffle (10x10 grid, each cell = 1% of population), GenderGapChart (bilateral bars with gap percentage), IMR color gradient (saffron worst → gold middle → violet best)

**Census & Demographics Sub-Pages**
- `/census/explore`: indicator explorer with 5 categories (All, Population, Demographics, Literacy, Health), `HorizontalBarChart` per indicator
- `/census/methodology`: 7 sections covering data sources (4-tier explanation), indicator definitions (World Bank codes, NFHS/SRS indicators), data vintage transparency (Census 2021 gap, Census 2027 timeline), data freshness cycles, 5 documented limitations
- `/census/glossary`: demographic terms in plain language

**Hub Integration**
- Census domain card (05 — DATA STORY) with mini horizontal population bars (top 5 states from `summary.json`), stat pills (Population in billions, Literacy Rate, Sex Ratio)
- "Coming Soon" section removed — all planned Phase 4 domains are now live

**SEO**
- 4 census routes added to Puppeteer prerender (22 routes total)
- Sitemap expanded with 4 page URLs + 6 data file URLs (28 data files total)
- JSON-LD Dataset schema for Census data (Google Dataset Search)
- JSON-LD BreadcrumbList updated with 4 census entries (22 total)
- `llms.txt` expanded with Census domain description, key data points, and datasets
- Noscript fallback updated with census content and data download links
- Per-domain OG image: `og-census.png` (violet gradient)
- WebApplication featureList updated with census capabilities

**Navigation**
- Header: `isCensusSection` detection, "Census & Demographics" title, 4 sub-nav tabs
- Mobile bottom nav: census icon (people/users SVG) and tab array
- Footer: census-specific attribution (Census of India, World Bank, NFHS-5)
- Search (Cmd+K): census glossary terms indexed + 4 page entries

**GitHub Actions**
- `census-pipeline.yml`: quarterly runs (Jan/Apr/Jul/Oct 15th) — aligned to World Bank annual update cycle
- `data-freshness-monitor.yml` updated with Census domain (120-day staleness threshold)

**Data Accuracy Fix (truth verification)**
- Fixed `literacyRate` in summary.json: was 72.82 (incorrectly weighted by total population), now 74.04 (Census 2011 national figure for age 7+)
- Corrected 57 NFHS-5 health values across 23 states: fullImmunization (21 states), IMR (16), under-5 mortality (17), wasting (3). Source: NFHS-5 state factsheet CSV (IIPS/DHS Program)
- All 138 NFHS-5 values (23 states x 6 fields) now match authoritative source exactly

---

## [0.7.0] - 2026-02-28

### Phase 4A: State Finances Domain

**State Finances Scrollytelling** (`/states`)
- Five-section narrative: GSDP landscape (top 20 states), growth leaders (constant prices), revenue self-sufficiency (own tax vs central transfers), fiscal health (debt-to-GSDP with FRBM 3% reference line), per capita GSDP
- All data sourced from RBI Handbook of Statistics on Indian States (FY 2022-23) — no mock data
- Emerald (#4ADE80) accent color for the states domain
- Mini bar chart on hub domain card showing top 5 states by GSDP

**State Finances Data Pipeline** (Python)
- Curated extraction from RBI Handbook covering 31 states/UTs (5 small UTs lack complete accounts)
- 4 transform modules: GSDP, revenue composition, fiscal health, cross-sectional indicators
- Pydantic validation schemas for all state data shapes
- 6 verified JSON outputs in `public/data/states/2025-26/`

**State Finances Sub-Pages**
- `/states/explore`: indicator explorer with 4 categories (GSDP, Revenue, Fiscal, Per Capita), `HorizontalBarChart` per indicator
- `/states/methodology`: data sources (RBI Handbook, State Finances report, Finance Commission), indicator definitions, data freshness (FY 2022-23 vintage), limitations
- `/states/glossary`: 12 state finance terms (GSDP, per capita income, own tax revenue, devolution, FRBM Act, etc.)

**Hub Integration**
- States domain card (04 — DATA STORY) with mini bar chart, stat pills (Top GSDP State, Growth Range, # States)
- "Coming Soon" reduced to Census & Demographics only

**SEO**
- 4 states routes added to Puppeteer prerender (18 routes total)
- Sitemap expanded with 4 page URLs + 5 data file URLs
- JSON-LD Dataset schema for State Finances data (Google Dataset Search)
- JSON-LD BreadcrumbList updated with 4 states entries
- `llms.txt` expanded with State Finances domain description and key data points
- Noscript fallback updated with states content and data download links
- Per-domain OG image: `og-states.png` (emerald gradient)

**Navigation**
- Header: `isStatesSection` detection, "State Finances" title, 4 sub-nav tabs (Story, Explore, Methodology, Glossary)
- Mobile bottom nav: states icon and tab array
- Footer: states-specific attribution (RBI Handbook, Finance Commission)
- Search (Cmd+K): 12 states glossary terms indexed with purple TERM badges + 4 page entries

**Bug Fixes**
- Fixed `HorizontalBarChart` double-display bug across all states sections — `formatValue` and `unit` prop both contained unit info, causing "₹20,843 Rs 00 Cr". Set `unit=""` in all sections where `formatValue` returns the complete display string.

---

## [0.6.0] - 2026-02-28

### Phase 3.5: UX & Discoverability

**Per-Domain Glossary Pages** (`/budget/glossary`, `/economy/glossary`, `/rbi/glossary`)
- Shared `GlossaryPage` component parameterized by domain (accent colors, SEO, data loading)
- 40 terms total: 13 budget, 15 economy, 12 RBI — all explained in plain language with "In Simple Terms" callouts
- Each term has: one-liner explanation, detail paragraph, live "In Context" value traced to `summary.json`, related term pills
- Filter input + alphabet jump pills for quick navigation
- Hash-based deep linking from search results (e.g., `/budget/glossary#fiscal-deficit`)
- Header tabs and mobile bottom nav updated for all 3 domains

**Floating Feedback Button**
- Fixed bottom-right corner button on all pages (flag icon, `z-40`)
- Opens GitHub new issue form with pre-filled page context and plain-language prompts ("What looks wrong?", "What should it say instead?")
- Positioned above mobile nav on small screens (`bottom-20 md:bottom-6`)
- Tooltip on hover: "Report incorrect data"

**Cmd+K Search Expansion**
- Glossary terms indexed in search overlay with purple `TERM` badges
- All 40 glossary terms searchable, linking to `/{domain}/glossary#{term-id}`
- Added missing RBI pages (Story, Explore, Methodology) to search index
- Fixed stale routes (`/explore` → `/budget/explore`, `/calculator` → `/budget/calculator`)
- Updated placeholder: "Search terms, ministries, schemes, pages..."

**SEO**
- 3 glossary routes added to Puppeteer prerender (14 routes total)
- Sitemap expanded with 3 glossary URLs
- JSON-LD BreadcrumbList updated with glossary entries
- `llms.txt` expanded with glossary descriptions per domain
- Noscript fallback updated with glossary links

**Note:** Mobile UX audit deferred to post-Phase 4 (after all data domains are built).

---

## [0.5.1] - 2026-02-28

### Phase 3: Polish Existing Domains

**Economy Inflation Chart**
- Sparse series filtering: Food CPI and Core CPI hidden when < 3 data points (World Bank doesn't provide food/core CPI breakdown for India — only 2 curated Economic Survey values existed)
- Annotation text adapts: shows headline-only description when breakdown series are hidden

**Economy GDP Projection**
- Fixed "7.4–7.4%" display in OutlookSection — now shows single "7.4%" when `projectedGrowthLow === projectedGrowthHigh`
- Schema unchanged (supports real ranges when future surveys provide them)

**RBI Credit Section**
- Updated narrative to focus on private sector credit (what's actually rendered) instead of mentioning domestic credit (World Bank `FS.AST.DOMS.GD.ZS` returns no data for India)
- Removed phantom domestic credit series from chart definition — was silently filtered at runtime, now removed at source

**Per-Domain OG Images**
- 4 domain-specific OG cards generated via Puppeteer: hub (`og-logo.png`), budget (`og-budget.png`), economy (`og-economy.png`), rbi (`og-rbi.png`)
- OG generation script (`generate-og.mjs`) rewritten as parametric — add variants to `VARIANTS` array
- `<SEOHead image>` prop wired on all 11 routes (story, explore, calculator, methodology per domain)
- Domain-specific accent color gradients: saffron→gold (budget), cyan→gold (economy), gold→saffron (rbi)

**Documentation**
- Added "Polish Hygiene" section to CLAUDE.md — reusable patterns for narrative↔data alignment, sparse series handling, OG images, and World Bank data gaps
- README roadmap: Phase 3 marked complete

---

## [0.5.0] - 2026-02-28

### RBI Data Domain + Data Accuracy Overhaul + Automation

**RBI Scrollytelling** (`/rbi`)
- Six-section narrative: repo rate hero with stance badge, monetary policy trajectory (decade of rate decisions), inflation targeting vs RBI's 4% mandate, M3 money supply growth, credit expansion (domestic + private sector), forex reserves ($700B+ war chest), INR/USD exchange rate
- All data sourced from RBI DBIE, World Bank API, and curated MPC decision history — no mock data
- Step chart mini-visualization on hub domain card showing last 5 repo rate decisions

**RBI Data Pipeline** (Python)
- Hybrid three-tier data sourcing: World Bank API (historical backbone), curated RBI MPC decisions (hand-verified from official statements), merged at transform time
- 4 transform modules: monetary policy, liquidity, credit, forex
- Pydantic validation schemas for all RBI data shapes
- 6 verified JSON outputs in `public/data/rbi/2025-26/`
- 30 repo rate decisions tracked from 2014 onward

**RBI Sub-Pages**
- `/rbi/explore`: indicator explorer with 4 categories (monetary, liquidity, credit, external), interactive line charts
- `/rbi/methodology`: data sources (DBIE, World Bank, MPC press releases), WB indicator code table, fiscal year mapping

**Data Accuracy Overhaul** (all domains)
- Truth-verified every key figure against authoritative sources (RBI MPC statements, NSO releases, World Bank API, Economic Survey 2025-26)
- RBI corrections: repo rate 6.00% → 5.25%, CRR 4.50% → 3.00%, added 5 MPC decisions (Jun-Dec 2025, Feb 2026)
- Economy corrections: GDP FY2024-25 6.4% → 6.5% (Provisional Estimate), FY2025-26 projection 6.3-6.8% → 7.4% (NSO FAE Jan 2026), CPI 4.2% → 4.0% (Survey revised)
- Fixed economy pipeline schema: `cpiFood` changed to `Optional[float]` (World Bank doesn't provide food-specific CPI breakdown)

**Automated Pipeline Infrastructure** (GitHub Actions)
- `economy-pipeline.yml`: quarterly runs aligned to data releases (Feb 5 post-Survey, Mar 5 post-Second Advance, Jun 1 post-WB update, Dec 1 post-First Revised)
- `rbi-pipeline.yml`: bi-monthly runs on 10th of Feb/Apr/Jun/Aug/Oct/Dec (post-MPC meeting dates)
- `data-freshness-monitor.yml`: monthly staleness checks with auto-created GitHub issues — MPC decision reminders, Economic Survey reminders, Budget readiness reminders
- All workflows: auto-commit-and-push on data changes, failure alerts via GitHub issues

**Hub Integration**
- RBI domain card (03 — DATA STORY) with step chart, stat pills (Repo Rate, Forex Reserves, M3 Growth)
- "Coming Soon" reduced to State Finances and Census & Demographics

**SEO**
- Sitemap expanded: 3 RBI routes + 5 RBI data file URLs (11 pages + 17 data files total)
- JSON-LD Dataset schema for RBI data (Google Dataset Search)
- llms.txt expanded with RBI domain description and key data points
- Noscript fallback with RBI content
- Prerender routes expanded to 11

---

## [0.4.1] - 2026-02-28

### SEO Overhaul + Viz Fixes

**SEO: Duplicate Meta Tag Cleanup**
- Removed static OG/Twitter/description/canonical tags from `index.html` that duplicated per-route tags from react-helmet-async — crawlers were seeing hub meta on every page
- Added `og:image` and `twitter:image` support to SEOHead component
- Fixed JSON-LD breadcrumb paths, added Economy Dataset schema for Google Dataset Search
- Updated sitemap.xml with correct `/budget/*` routes + all economy routes (8 pages + 12 data files)
- Economy routes added to Puppeteer prerender script (8 routes total)
- Expanded `llms.txt` and noscript fallback with economy content
- Fixed `useRef<T>()` TypeScript error for React 19 compatibility

**Visualization Fixes**
- Tooltip scroll persistence: added scroll debounce to `useTooltip` hook preventing phantom re-triggers during scroll (SVG hover rects fire mouseEnter as they pass under cursor)
- Area chart contrast: increased gradient opacity (0.5/0.08) for better export/import distinction on dark backgrounds
- HorizontalBarChart: widened right margin when annotations present to prevent text clipping

**Data Integrity (Codex Review)**
- Treemap rebuilt from expenditure.json (was 43,810 Cr gap between treemap sum and source)
- Scheme allocations synced to expenditure.json (7 mismatches corrected)
- Paise denominator fix: borrowings/earned not borrowings/total (24→32 paise)
- Removed synthetic food/core CPI from inflation data — kept only Economic Survey sourced values
- Pipeline cross-file invariants added: treemap sum, scheme consistency, receipt percentages, statewise totals
- CSV export: proper RFC 4180 quoting for fields containing commas

---

## [0.4.0] - 2026-02-27

### Economic Survey 2025-26 — Second Data Domain

**Economy Scrollytelling** (`/economy`)
- Six-section narrative: GDP growth trends, inflation tracking (CPI/WPI), fiscal deficit position, trade balance, sectoral composition, outlook projections
- All data sourced from World Bank API and Economic Survey 2025-26 — no mock data

**New Visualization Components**
- `LineChart`: time series with dot markers, gradient area fill, responsive axes
- `AreaChart`: stacked/layered areas with configurable gradients, used for trade balance (exports vs imports)
- `HorizontalBarChart`: labeled bars with optional annotations and configurable `labelWidth` prop

**Economy Data Pipeline** (Python)
- World Bank API client with country/indicator fetching
- 5 transform modules: GDP, inflation, fiscal, external trade, sectors
- Pydantic validation schemas for all economy data shapes
- 7 verified JSON outputs in `public/data/economy/2025-26/`

**Economy Sub-Pages**
- `/economy/explore`: searchable indicator table with year-over-year comparisons
- `/economy/methodology`: data sources, indicator definitions, survey methodology, limitations

**Hub Integration**
- Economy domain card on hub with sparkline visualization and stat pills
- Context-aware navigation: header, mobile tabs, and footer adapt for economy routes

**Bug Fixes**
- Tax engine: fixed slab off-by-one boundary + added Section 87A marginal relief
- Schema: economy TypeScript interfaces, `cpiFood` nullable, `note` fields on `ReceiptsData` and `StatewiseData`
- Removed redundant "Indian Data Project" overline from hub hero

---

## [0.3.1] - 2026-02-24

### Navigation Overhaul + i18n Removal

**Navigation UX**
- Context-aware header title: shows "Indian Data Project" on hub, "Budget 2025-26" inside budget section
- Back chevron in header on budget pages, linking to `/#stories` on the hub
- Back-to-hub link in footer on budget pages (`‹ Indian Data Project`)
- Hub header shows no nav links (DomainCard is the sole CTA)
- Budget header shows Story / Explore / Your Share / Methodology tabs
- Search icon (SVG magnifying glass) replaces "Cmd+K" text button; shortcut preserved in tooltip
- `id="stories"` anchor on hub Data Stories section with `scroll-mt-20` and hash-scroll effect

**i18n: Wired Then Deliberately Removed**
- Full react-i18next integration completed across all 13 UI components with Hindi locale files
- Fixed LanguageProvider bug: `useParams()` doesn't work outside `<Routes>` — switched to pathname parsing
- Decision: browser auto-translate covers ~80% of use cases; i18n overhead slows platform expansion
- All `useTranslation()` calls and LanguageSwitcher removed from UI
- Infrastructure preserved for future reactivation: `i18n.ts`, `LanguageSwitcher.tsx`, `LanguageProvider.tsx`, 7 Hindi locale files

**Documentation**
- README roadmap updated: removed i18n phase, added Expand Scope phase (Economic Survey, State Finances, RBI Data, Census)

---

## [0.3.0] - 2026-02-24

### Hub Architecture + New Compositions

**Site Architecture**
- New hub homepage at `/` — visual portal with project mission, data domain cards with live summary stats
- Budget scrollytelling moved from `/` to `/budget` with sub-routes (`/budget/explore`, `/budget/calculator`, `/budget/methodology`)
- Context-aware navigation: header and mobile nav switch between hub links and budget sub-nav based on current route
- Permanent redirects for old routes (`/explore` → `/budget/explore`, etc.) in vercel.json
- Prerender routes updated to match new structure

**New Compositions**
- Deficit section (02): rupee bar visualization showing 69p earned (saffron) / 31p borrowed (dashed cyan), three stat cards (Total Receipts, Fiscal Deficit, % of GDP), all values computed from real data
- Per-capita section (06): horizontal segmented bar of daily per-citizen spending by top 8 ministries, semantic color grouping (warm for sovereign, cool for welfare), 4-column legend grid
- Two new narrative bridges connecting Revenue → Deficit and Map → Per-capita sections
- Section numbering updated: Revenue(01), Deficit(02), Expenditure(03), Flow(04), Map(05), PerCapita(06), CTA(07)

**Documentation**
- Added "Creative License" section to BRAND.md — explicit permission for unconventional design choices
- Added "Data Integrity — Non-Negotiable" section to CLAUDE.md
- Added "Site Architecture — Hub + Data Domains" section to CLAUDE.md
- Updated README with current project structure and roadmap status

**Cleanup**
- Removed dead HomePage.tsx (replaced by HubPage.tsx + BudgetPage.tsx)
- Fixed AnimatedCounter rounding bug in PerCapitaSection (showed "Rs 96" instead of "Rs 95.71")

---

## [0.2.0] - 2026-02-24

### Design Overhaul & Features

**IIB-Inspired Visual Redesign**
- Complete UI/UX overhaul inspired by Information is Beautiful, Visual Cinnamon, and Kasia Siwosz
- New design system: deep navy-black backgrounds, saffron/gold/cyan accent palette
- Numbered narrative sections (01, 02, 03...) with scroll-triggered word reveals
- Glass header with scroll-aware opacity and layoutId nav animation
- Composition dividers and NarrativeBridge components for storytelling flow
- Brand guide documented in BRAND.md

**Old Regime Tax Deductions**
- Full deduction support for Old Regime: 80C, 80D (self + parents), 80CCD(1B), 24(b), HRA, 80TTA
- Accordion UI with collapsible sections, cap enforcement, and progress bars
- Quick presets: "Salaried basics", "With home loan", "Max deductions"
- Deduction breakdown in tax calculation display (gold-colored rows)
- Share card updated with deduction summary

**Data Explorer Fixes**
- Fixed sticky header overlap bug (overflow-x: clip instead of overflow-x: auto)
- Fixed calculator results not visible (scroll trigger threshold issue)

**Infrastructure**
- Domain migration to indiandataproject.org (all SEO, canonical URLs, JSON-LD updated)
- Fixed stale data serving: CDN-only caching (s-maxage) with browser revalidation
- Added README.md with architecture docs, setup guide, and roadmap
- Added AGPL-3.0 license
- Updated llms.txt with deduction details

### Known Issues
- Choropleth map uses approximate hardcoded SVG paths instead of real TopoJSON geometry
- Homepage prerender shows React #418 hydration warnings (cosmetic, doesn't affect end users)

---

## [0.1.0] - 2026-02-22

### Initial Release — MVP

**Data Pipeline (Python)**
- ETL pipeline pulling Union Budget 2025-26 data from Open Budgets India (CKAN API)
- 10 structured JSON output files: summary, receipts, expenditure, sankey, treemap, statewise, schemes, tax slabs, expenditure shares, year index
- Fallback to direct Budget document parsing when CKAN is unavailable
- 21 validation tests covering data integrity
- GitHub Actions workflow for daily data freshness checks + Budget Day polling

**Frontend (React + TypeScript)**
- 4 pages: Home (scrollytelling), Data Explorer, Tax Calculator, Methodology
- Visualizations: Waffle chart (revenue), Treemap (expenditure, drill-down), Sankey diagram (money flow), Choropleth map (state allocations), Animated counters
- Tax calculator: Old/New regime, slab-by-slab breakdown, spending allocation bars with human context, shareable image card
- Data Explorer: Sortable table, expandable scheme rows, CSV export
- Indian number formatting throughout (lakhs/crores)
- Dark cinematic theme with saffron accent
- Cmd+K search overlay (Fuse.js)
- Mobile navigation with safe area support

**SEO & Discoverability**
- Build-time prerendering via Puppeteer (all 4 routes get static HTML)
- Hydration detection (hydrateRoot vs createRoot)
- Per-route meta tags via react-helmet-async (title, description, OG, Twitter, canonical)
- JSON-LD structured data: WebApplication, Dataset (Google Dataset Search), BreadcrumbList
- robots.txt welcoming all bots including AI crawlers (GPTBot, ClaudeBot, PerplexityBot)
- sitemap.xml with all routes + downloadable JSON datasets
- llms.txt for AI model discoverability
- Noscript fallback with real budget content
- vercel.json with cache headers, security headers, CORS for data files

**Performance**
- Vendor chunk splitting: react-vendor (16KB gz), d3-vendor (8KB gz), motion-vendor (41KB gz)
- Self-hosted Inter + JetBrains Mono fonts (eliminated Google Fonts render-blocking)
- Replaced gsap with vanilla requestAnimationFrame (saved 27KB gzip)
- Total JS: ~150KB gzip

### Known Issues
- Choropleth map uses approximate hardcoded SVG paths instead of real TopoJSON geometry
- UI needs significant design polish — layout alignment, visual hierarchy, spacing, and overall cohesion
- Homepage prerender shows React #418 hydration warnings (cosmetic, doesn't affect end users)
