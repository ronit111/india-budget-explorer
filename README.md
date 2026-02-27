# Indian Data Project

Open Indian government data made accessible, visual, and shareable. Starting with the Union Budget, expanding to economic indicators, state finances, and more.

**Live:** [indiandataproject.org](https://indiandataproject.org)

---

## What It Does

Indian Data Project turns dense government data into interactive visual experiences. The site is a hub — each data domain (budget, economic survey, state finances) gets its own self-contained visual story with explorable breakdowns. Budget 2025-26 is the first domain live, answering: *where does India's money come from?* and *where does it go?*

**Hub + data domains:**

| Page | What it shows |
|------|---------------|
| **Hub** (`/`) | Visual portal — project mission, data domain cards with live stats, gateway to all datasets |
| **Budget Story** (`/budget`) | Scrollytelling narrative — 7 compositions: animated headline, revenue waffle chart, deficit rupee bar, expenditure treemap, Sankey money flow, state choropleth, per-capita breakdown |
| **Data Explorer** (`/budget/explore`) | Sortable ministry-level expenditure table with expandable scheme detail, CSV export |
| **Tax Calculator** (`/budget/calculator`) | Personal tax breakdown for FY 2025-26 — Old/New regime with deductions (80C, 80D, HRA, 24b, NPS), spending allocation per ministry, shareable image card |
| **Methodology** (`/budget/methodology`) | Data sources, computation methods, formatting conventions, limitations |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + TypeScript |
| Build | Vite 7 |
| Styling | Tailwind CSS v4 (CSS Layers) |
| State | Zustand |
| Visualizations | D3.js (layout) + React (rendering) — waffle, treemap, sankey, choropleth |
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
| `npm run build` | TypeScript check + Vite build + Puppeteer prerender (all 4 routes) |
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
│   └── MethodologyPage.tsx  # Documentation page
├── components/
│   ├── home/               # Budget story compositions (Hero, Revenue, Expenditure, Flow, Map, CTA)
│   ├── budget/             # Budget-specific compositions (DeficitSection, PerCapitaSection)
│   ├── calculator/         # Tax calculator UI (IncomeInput, DeductionsPanel, TaxBreakdown, ShareCard, SpendingAllocation)
│   ├── explore/            # DataTable with expandable rows
│   ├── viz/                # D3 visualizations (TreemapChart, SankeyDiagram, ChoroplethMap, WaffleChart, AnimatedCounter)
│   ├── ui/                 # Shared UI (Tooltip, NarrativeBridge, SearchOverlay, Skeleton, etc.)
│   ├── layout/             # Header, Footer, MobileNav, PageShell
│   ├── seo/                # SEOHead (per-route meta tags + JSON-LD)
│   └── i18n/               # Language provider and switcher
├── lib/
│   ├── data/schema.ts      # TypeScript interfaces for all data shapes
│   ├── taxEngine.ts        # Tax computation engine (Old/New regime, deductions, slabs)
│   ├── format.ts           # Indian number formatting (lakhs/crores)
│   ├── dataLoader.ts       # Fetch + cache layer for JSON data
│   ├── stateMapping.ts     # India state ID → name mapping
│   └── i18n.ts             # i18next configuration
├── hooks/                  # useScrollTrigger, useIntersection, useBudgetData, etc.
├── store/                  # Zustand stores (budgetStore, calculatorStore, uiStore)
└── index.css               # Design tokens, CSS layers, keyframes

public/
├── data/budget/2025-26/    # 7 structured JSON datasets
├── locales/en/             # Translation files
├── sitemap.xml             # All routes + data endpoints
├── robots.txt              # All bots welcomed (including AI crawlers)
└── llms.txt                # AI-readable site summary
```

---

## Data

All budget data lives in `public/data/budget/2025-26/` as JSON files:

| File | Contents |
|------|----------|
| `summary.json` | Headline budget numbers (total expenditure, revenue, deficit) |
| `receipts.json` | Revenue breakdown by category |
| `expenditure.json` | Ministry-wise expenditure with sub-scheme detail |
| `sankey.json` | Revenue-to-expenditure flow links |
| `treemap.json` | Hierarchical expenditure for treemap visualization |
| `statewise.json` | State-wise budget allocations with per-capita figures |
| `schemes.json` | Major government scheme details |

Data sourced from [Open Budgets India](https://openbudgetsindia.org) and [indiabudget.gov.in](https://www.indiabudget.gov.in) under the [Government Open Data License — India](https://data.gov.in/government-open-data-license-india).

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

- **Prerendered HTML** for all routes (Puppeteer at build time)
- **JSON-LD** structured data: `WebApplication`, `Dataset` (Google Dataset Search), `BreadcrumbList`
- **Per-route meta tags** via react-helmet-async (title, description, OG, Twitter, canonical)
- **sitemap.xml** covering pages + downloadable data endpoints
- **robots.txt** explicitly welcoming AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended)
- **llms.txt** for AI model discoverability
- **Noscript fallback** with real budget content for crawlers that don't execute JS

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
- [x] Full SEO layer (prerendering, structured data, sitemap)
- [x] IIB-inspired design system with brand guide
- [x] CDN-friendly caching strategy

### Next Steps

**Phase 2: Expand Scope** (priority)
- [ ] New data domain: Economic Survey
- [ ] New data domain: State Finances
- [ ] New data domain: RBI Data
- [ ] New data domain: Census & Demographics

**Phase 3: Automated Data Pipeline**
- [ ] Python ETL pipeline for automated budget data extraction
- [ ] GitHub Actions for daily data freshness checks
- [ ] Budget Day rapid-update workflow
- [ ] Change detection and validation suite

**Phase 4: Expanded Datasets**
- [ ] Historical budget data (multi-year comparisons)
- [ ] State budget data (starting with major states)
- [ ] Economic Survey data integration
- [ ] RBI monetary policy data

**Phase 5: Community & API**
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
- Design inspired by [Information is Beautiful](https://informationisbeautiful.net), [Visual Cinnamon](https://www.visualcinnamon.com), and [Kasia Siwosz](https://kasiasiwosz.com)
- Built with React, D3, Framer Motion, and Tailwind CSS
