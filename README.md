# Indian Data Project

Open Indian government data made accessible, visual, and shareable. Three data domains live: Union Budget 2025-26, Economic Survey 2025-26, and RBI Data. Each gets its own visual story with explorable breakdowns.

**Live:** [indiandataproject.org](https://indiandataproject.org)

---

## What It Does

Indian Data Project turns dense government data into interactive visual experiences. The site is a hub — each data domain gets its own self-contained visual story with explorable breakdowns.

**Hub + data domains:**

| Page | What it shows |
|------|---------------|
| **Hub** (`/`) | Visual portal — project mission, data domain cards with live stats, gateway to all datasets |
| **Budget Story** (`/budget`) | Scrollytelling narrative — 7 compositions: animated headline, revenue waffle chart, deficit rupee bar, expenditure treemap, Sankey money flow, state choropleth, per-capita breakdown |
| **Budget Explorer** (`/budget/explore`) | Sortable ministry-level expenditure table with expandable scheme detail, CSV export |
| **Tax Calculator** (`/budget/calculator`) | Personal tax breakdown for FY 2025-26 — Old/New regime with deductions (80C, 80D, HRA, 24b, NPS), spending allocation per ministry, shareable image card |
| **Budget Methodology** (`/budget/methodology`) | Data sources, computation methods, formatting conventions, limitations |
| **Economy Story** (`/economy`) | Scrollytelling visual breakdown — GDP growth trends, inflation tracking (CPI/WPI), trade balance area chart, fiscal position, sectoral composition |
| **Economy Explorer** (`/economy/explore`) | Searchable table of economic indicators with year-over-year comparisons |
| **Economy Methodology** (`/economy/methodology`) | Data sources, indicator definitions, survey methodology, limitations |
| **RBI Story** (`/rbi`) | Scrollytelling narrative — repo rate hero, monetary policy trajectory, inflation targeting vs 4% mandate, M3 money supply, credit expansion, forex reserves, exchange rate |
| **RBI Explorer** (`/rbi/explore`) | Indicator explorer with 4 categories (monetary, liquidity, credit, external), interactive line charts |
| **RBI Methodology** (`/rbi/methodology`) | Data sources (DBIE, World Bank, MPC press releases), indicator definitions, WB codes |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + TypeScript |
| Build | Vite 7 |
| Styling | Tailwind CSS v4 (CSS Layers) |
| State | Zustand |
| Visualizations | D3.js (layout) + React (rendering) — waffle, treemap, sankey, choropleth, line, area, step charts |
| Animation | Framer Motion |
| Search | Fuse.js (Cmd+K overlay) |
| i18n | react-i18next (infrastructure preserved but unwired — relying on browser auto-translate) |
| SEO | react-helmet-async + Puppeteer prerendering |
| Hosting | Vercel |

---

## Getting Started

```bash
# Clone
git clone https://github.com/RonitChidara/indian-data-project.git
cd indian-data-project

# Install
npm install

# Dev server (http://localhost:5173)
npm run dev

# Production build (includes prerendering)
npm run build

# Preview production build
npm run preview
```

### Scripts

| Command | What it does |
|---------|-------------|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | TypeScript check + Vite build + Puppeteer prerender (all 11 routes) |
| `npm run build:no-prerender` | Build without prerendering (used by Vercel) |
| `npm run lint` | ESLint check |
| `npm run preview` | Preview production build locally |

---

## Project Structure

```
src/
├── pages/                  # Route-level components
│   ├── HubPage.tsx          # Visual portal — data domain showcase
│   ├── BudgetPage.tsx       # Budget scrollytelling with 7 composition sections
│   ├── ExplorePage.tsx      # Ministry-wise data table
│   ├── FindYourSharePage.tsx # Tax calculator
│   ├── MethodologyPage.tsx  # Budget methodology
│   ├── EconomyPage.tsx      # Economy scrollytelling (GDP, inflation, trade, sectors)
│   ├── EconomyExplorePage.tsx # Economy indicators table
│   ├── EconomyMethodologyPage.tsx # Economy methodology
│   ├── RBIPage.tsx          # RBI scrollytelling (monetary policy, forex, credit)
│   ├── RBIExplorePage.tsx   # RBI indicator explorer with category filters
│   └── RBIMethodologyPage.tsx # RBI methodology
├── components/
│   ├── home/               # Budget story compositions (Hero, Revenue, Expenditure, Flow, Map, CTA)
│   ├── budget/             # Budget-specific compositions (DeficitSection, PerCapitaSection)
│   ├── economy/            # Economy compositions (GrowthSection, InflationSection, TradeSection, etc.)
│   ├── rbi/                # RBI compositions (HeroSection, MonetaryPolicySection, ForexSection, etc.)
│   ├── calculator/         # Tax calculator UI (IncomeInput, DeductionsPanel, TaxBreakdown, ShareCard, SpendingAllocation)
│   ├── explore/            # DataTable with expandable rows
│   ├── viz/                # D3 visualizations (TreemapChart, SankeyDiagram, ChoroplethMap, WaffleChart, LineChart, AreaChart, HorizontalBarChart, StepChart, AnimatedCounter)
│   ├── ui/                 # Shared UI (Tooltip, NarrativeBridge, SearchOverlay, Skeleton, etc.)
│   ├── layout/             # Header, Footer, MobileNav, PageShell
│   ├── seo/                # SEOHead (per-route meta tags + OG images + JSON-LD)
│   └── i18n/               # Language provider and switcher
├── lib/
│   ├── data/schema.ts      # TypeScript interfaces for all data shapes (Budget, Economy, RBI)
│   ├── taxEngine.ts        # Tax computation engine (Old/New regime, deductions, slabs)
│   ├── format.ts           # Indian number formatting (lakhs/crores)
│   ├── dataLoader.ts       # Fetch + cache layer for JSON data (all domains)
│   ├── stateMapping.ts     # India state ID → name mapping
│   └── i18n.ts             # i18next configuration
├── hooks/                  # useScrollTrigger, useIntersection, useBudgetData, useEconomyData, useRBIData, etc.
├── store/                  # Zustand stores (budgetStore, economyStore, rbiStore, calculatorStore, uiStore)
└── index.css               # Design tokens, CSS layers, keyframes

public/
├── data/budget/2025-26/    # 7 structured JSON budget datasets
├── data/economy/2025-26/   # 7 structured JSON economy datasets
├── data/rbi/2025-26/       # 6 structured JSON RBI datasets
├── locales/en/             # Translation files
├── sitemap.xml             # All routes + data endpoints (11 pages + 17 data files)
├── robots.txt              # All bots welcomed (including AI crawlers)
└── llms.txt                # AI-readable site summary

pipeline/
├── src/
│   ├── main.py             # Budget pipeline (CKAN API → JSON)
│   ├── economy/            # Economy pipeline (World Bank API → JSON)
│   ├── rbi/                # RBI pipeline (World Bank + curated MPC data → JSON)
│   └── publish/            # Shared JSON writer
└── pyproject.toml          # Python dependencies
```

---

## Data

### Budget Data

Budget data lives in `public/data/budget/2025-26/`:

| File | Contents |
|------|----------|
| `summary.json` | Headline budget numbers (total expenditure, revenue, deficit) |
| `receipts.json` | Revenue breakdown by category |
| `expenditure.json` | Ministry-wise expenditure with sub-scheme detail |
| `sankey.json` | Revenue-to-expenditure flow links |
| `treemap.json` | Hierarchical expenditure for treemap visualization |
| `statewise.json` | State-wise budget allocations with per-capita figures |
| `schemes.json` | Major government scheme details |

### Economy Data

Economy data lives in `public/data/economy/2025-26/`:

| File | Contents |
|------|----------|
| `summary.json` | Headline economic indicators (GDP growth, inflation, deficit) |
| `gdp-growth.json` | Real and nominal GDP growth time series |
| `inflation.json` | CPI and WPI inflation data |
| `fiscal.json` | Fiscal deficit and government finance trends |
| `external.json` | Trade balance, exports, imports |
| `sectors.json` | Sectoral GDP composition (agriculture, industry, services) |
| `indicators.json` | Key economic indicators with year-over-year data |

### RBI Data

RBI data lives in `public/data/rbi/2025-26/`:

| File | Contents |
|------|----------|
| `summary.json` | Headline RBI numbers (repo rate, stance, CRR, forex, M3 growth) |
| `monetary-policy.json` | Repo rate decision history (30 decisions, 2014-2026), CRR time series |
| `liquidity.json` | Broad money (M3) growth and M3 as % of GDP |
| `credit.json` | Domestic and private credit (% of GDP), lending/deposit rates |
| `forex.json` | Forex reserves (US$) and INR/USD exchange rate |
| `indicators.json` | All RBI indicators across 4 categories (monetary, liquidity, credit, external) |

Data sourced from [Open Budgets India](https://openbudgetsindia.org), [indiabudget.gov.in](https://www.indiabudget.gov.in), [Economic Survey](https://www.indiabudget.gov.in/economicsurvey/), [RBI DBIE](https://data.rbi.org.in), [RBI Monetary Policy Statements](https://www.rbi.org.in), and [World Bank Open Data API](https://data.worldbank.org) under the [Government Open Data License — India](https://data.gov.in/government-open-data-license-india).

---

## Design System

See [BRAND.md](./BRAND.md) for the full visual identity guide. Key principles:

- **Data IS the design** — visualizations paint directly onto the background, no card wrappers
- **Restrained craft** — numbered narrative sections, scroll-triggered word reveals, generous whitespace
- **IIB-inspired palettes** — 2-3 intentional colors per composition, not 12 random chart colors
- **Dark cinematic theme** — deep navy-black (`#06080f`) with saffron (`#FF6B35`), gold (`#FFC857`), and cyan (`#4AEADC`) accents

---

## SEO & Discoverability

The site is built for maximum discoverability:

- **Prerendered HTML** for all 11 routes (Puppeteer at build time)
- **JSON-LD** structured data: `WebApplication`, `Dataset` x3 (Budget + Economy + RBI for Google Dataset Search), `BreadcrumbList`
- **Per-route meta tags** via react-helmet-async (title, description, OG image, Twitter card, canonical)
- **sitemap.xml** covering 11 pages + 17 downloadable data endpoints
- **robots.txt** explicitly welcoming AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended)
- **llms.txt** for AI model discoverability (budget + economy + RBI content)
- **Noscript fallback** with real content across all three domains for crawlers that don't execute JS

---

## Roadmap

### Completed

- [x] Scrollytelling budget story with 7 composition sections
- [x] Hub homepage at `/` with data domain portal
- [x] Hub + domain routing (`/` → `/budget` → `/budget/explore`, etc.) with redirects for old URLs
- [x] Context-aware navigation (hub links vs budget sub-nav)
- [x] Deficit visualization (rupee bar: 69p earned / 31p borrowed, stat cards)
- [x] Per-capita breakdown (segmented bar, 8 ministries, daily spending)
- [x] Ministry-wise data explorer with CSV export
- [x] Tax calculator with Old/New regime and deductions (80C, 80D, HRA, 24b, NPS, 80TTA)
- [x] Share card generation for social media
- [x] Full SEO layer (prerendering, structured data, sitemap, OG tags)
- [x] IIB-inspired design system with brand guide
- [x] CDN-friendly caching strategy
- [x] Economic Survey 2025-26 data domain (scrollytelling, explorer, methodology)
- [x] New viz components: LineChart, AreaChart, HorizontalBarChart
- [x] Economy data pipeline (7 structured JSON datasets from Economic Survey)
- [x] RBI Data domain (scrollytelling, indicator explorer, methodology)
- [x] RBI data pipeline (6 structured JSON datasets from World Bank + curated MPC data)
- [x] Automated pipeline infrastructure (GitHub Actions cron jobs for Economy, RBI, data freshness)
- [x] Data accuracy overhaul — truth-verified all figures against authoritative sources
- [x] RBI chart QA fixes — x-axis alignment (fiscal years), liquidity section split, empty series cleanup

### Next Steps

**Phase 3: Polish Existing Domains**
- [ ] Economy inflation chart: Food CPI / Core CPI show as disconnected 1-2 point segments (sparse World Bank data) — either hide when < 3 points or source fuller series
- [ ] Economy GDP projection card shows "7.4–7.4%" — needs proper range or single value display
- [ ] RBI credit section: domestic credit series empty (World Bank `FS.AST.DOMS.GD.ZS` returned no data) — try alternative WB indicator or DBIE source
- [ ] RBI credit section: deposit rate series empty (`FR.INR.DPST`) — same issue
- [ ] Per-domain OG images for social sharing (currently generic)

**Phase 3.5: UX & Discoverability**
- [ ] Per-domain glossary tabs (economic terms in simple language, alongside Methodology in nav)
- [ ] Data feedback strip (persistent ribbon for users to report incorrect data via GitHub issues)
- [ ] Cmd+K search indexing for glossary terms
- [ ] Mobile UX audit across all 3 domains (bottom nav clearance, chart responsiveness, touch targets)

**Phase 4: Expand Scope**
- [ ] New data domain: State Finances (state budget allocations, GSDP, own tax revenue)
- [ ] New data domain: Census & Demographics (population, literacy, urbanization, sex ratio)

**Phase 5: Historical Data (all domains)**
- [ ] Historical budget data (multi-year comparisons, trend lines across union budgets)
- [ ] Historical economy data (GDP, inflation, trade over multiple survey periods)
- [ ] Historical RBI data (extend MPC decision history, fill World Bank data gaps via DBIE)
- [ ] State budget data (starting with major states)
- [ ] RBI DBIE direct API integration (bypass World Bank lag for monetary indicators)

**Phase 6: Community & API**
- [ ] Public REST API for all datasets
- [ ] Embeddable chart widgets
- [ ] Contributor guide for data journalists

---

## Contributing

This is a civic tech project and contributions are welcome. Whether you're a developer, designer, data journalist, or translator — there's room to help.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Make your changes
4. Run `npm run build` to verify everything compiles and prerenders
5. Submit a pull request

For major changes, please open an issue first to discuss the approach.

---

## License

This project is licensed under the **GNU Affero General Public License v3.0 (AGPL-3.0)**.

**What this means:**
- You can freely use, modify, and distribute this code
- If you run a modified version as a web service, you must share your source code
- All derivative works must use the same license

**Why AGPL-3.0:** This is a public-good platform. AGPL ensures the code stays open — if someone builds on it to create a similar service, they must contribute their improvements back to the community. This protects against commercial extraction while encouraging civic participation.

The underlying budget data is published by the Government of India under the [Government Open Data License — India (GODL)](https://data.gov.in/government-open-data-license-india).

---

## Acknowledgments

- Budget data from [Open Budgets India](https://openbudgetsindia.org) and [Union Budget documents](https://www.indiabudget.gov.in)
- Economy data from [Economic Survey](https://www.indiabudget.gov.in/economicsurvey/) and [World Bank Open Data](https://data.worldbank.org)
- RBI data from [RBI DBIE](https://data.rbi.org.in), [RBI Monetary Policy Statements](https://www.rbi.org.in), and [World Bank Open Data](https://data.worldbank.org)
- Design inspired by [Information is Beautiful](https://informationisbeautiful.net), [Visual Cinnamon](https://www.visualcinnamon.com), and [Kasia Siwosz](https://kasiasiwosz.com)
- Built with React, D3, Framer Motion, and Tailwind CSS
