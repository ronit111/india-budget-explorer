# Indian Data Project

Interactive visualization of India's Union Budget 2025-26. Open government data made accessible, searchable, and shareable.

**Live:** [indiandataproject.org](https://indiandataproject.org)

---

## What It Does

Indian Data Project turns dense government budget PDFs into an interactive visual experience. It answers two questions: *where does India's money come from?* and *where does it go?*

**Four pages, one story:**

| Page | What it shows |
|------|---------------|
| **Home** (`/`) | Scrollytelling overview — animated budget headline, revenue waffle chart, expenditure treemap with drill-down, Sankey money flow, state-wise choropleth map |
| **Data Explorer** (`/explore`) | Sortable ministry-level expenditure table with expandable scheme detail, CSV export |
| **Tax Calculator** (`/calculator`) | Personal tax breakdown for FY 2025-26 — Old/New regime with deductions (80C, 80D, HRA, 24b, NPS), spending allocation per ministry, shareable image card |
| **Methodology** (`/methodology`) | Data sources, computation methods, formatting conventions, limitations |

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
| i18n | react-i18next (infrastructure ready, English only for now) |
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
│   ├── HomePage.tsx         # Scrollytelling with 5 visualization sections
│   ├── ExplorePage.tsx      # Ministry-wise data table
│   ├── FindYourSharePage.tsx # Tax calculator
│   └── MethodologyPage.tsx  # Documentation page
├── components/
│   ├── home/               # Homepage compositions (Hero, Revenue, Expenditure, Flow, Map, CTA)
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

- [x] Scrollytelling homepage with 5 visualization sections
- [x] Ministry-wise data explorer with CSV export
- [x] Tax calculator with Old/New regime and deductions (80C, 80D, HRA, 24b, NPS, 80TTA)
- [x] Share card generation for social media
- [x] Full SEO layer (prerendering, structured data, sitemap)
- [x] IIB-inspired design system with brand guide
- [x] CDN-friendly caching strategy

### Next Steps

**Phase 1: Homepage Compositions**
- [ ] New narrative sections for the homepage (budget trends over years, per-capita breakdowns, debt visualization)
- [ ] Scrollytelling refinements and mobile-specific compositions

**Phase 2: Multi-Language Support**
- [ ] Hindi translation (infrastructure already in place via react-i18next)
- [ ] Telugu, Tamil, Kannada, Malayalam
- [ ] Script-specific font loading on demand
- [ ] Per-language prerendering and hreflang tags

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
