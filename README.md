# Indian Data Project

Open Indian government data made accessible, visual, and shareable. Eight data domains live: Union Budget 2025-26, Economic Survey 2025-26, RBI Data, State Finances, Census & Demographics, Education, Employment, and Healthcare. Each gets its own visual story with explorable breakdowns.

**Live:** [indiandataproject.org](https://indiandataproject.org)

---

## What It Does

Indian Data Project turns dense government data into interactive visual experiences. The site is a hub — each data domain gets its own self-contained visual story with explorable breakdowns.

**Hub + 8 data domains:**

| Page | What it shows |
|------|---------------|
| **Hub** (`/`) | Visual portal — project mission, data domain cards with live stats, gateway to all datasets |
| **Budget Story** (`/budget`) | Scrollytelling narrative — 9 compositions: animated headline, revenue waffle chart, deficit rupee bar, 20-year trends (expenditure vs receipts + deficit % GDP), budget vs actual deviation chart, expenditure treemap, Sankey money flow, state choropleth, per-capita breakdown |
| **Budget Explorer** (`/budget/explore`) | Sortable ministry-level expenditure table with expandable scheme detail, CSV export |
| **Tax Calculator** (`/budget/calculator`) | Personal tax breakdown for FY 2025-26 — Old/New regime with deductions (80C, 80D, HRA, 24b, NPS), spending allocation per ministry, shareable image card |
| **Budget Methodology** (`/budget/methodology`) | Data sources, computation methods, formatting conventions, limitations |
| **Economy Story** (`/economy`) | Scrollytelling visual breakdown — GDP growth trends, inflation tracking (CPI/WPI), trade balance area chart, fiscal position, sectoral composition |
| **Economy Explorer** (`/economy/explore`) | Searchable table of economic indicators with year-over-year comparisons |
| **Economy Methodology** (`/economy/methodology`) | Data sources, indicator definitions, survey methodology, limitations |
| **RBI Story** (`/rbi`) | Scrollytelling narrative — repo rate hero, monetary policy trajectory, inflation targeting vs 4% mandate, M3 money supply, credit expansion, forex reserves, exchange rate |
| **RBI Explorer** (`/rbi/explore`) | Indicator explorer with 4 categories (monetary, liquidity, credit, external), interactive line charts |
| **RBI Methodology** (`/rbi/methodology`) | Data sources (DBIE, World Bank, MPC press releases), indicator definitions, WB codes |
| **Budget Glossary** (`/budget/glossary`) | 13 budget terms explained in plain language — fiscal deficit, revenue deficit, cess, devolution, crore/lakh, etc. |
| **Economy Glossary** (`/economy/glossary`) | 15 economic terms — GDP, inflation, CPI, trade deficit, FDI, sectoral composition, advance estimates, etc. |
| **RBI Glossary** (`/rbi/glossary`) | 12 monetary policy terms — repo rate, CRR, SLR, MPC, inflation targeting, forex reserves, basis points, etc. |
| **States Story** (`/states`) | Scrollytelling narrative — GSDP landscape, growth leaders, revenue self-sufficiency (own tax vs central transfers), fiscal health (debt-to-GSDP with FRBM 3% line), per capita GSDP |
| **States Explorer** (`/states/explore`) | Indicator explorer with 4 categories (GSDP, Revenue, Fiscal, Per Capita), `HorizontalBarChart` per indicator |
| **States Methodology** (`/states/methodology`) | Data sources (RBI Handbook, Finance Commission), indicator definitions, data freshness, limitations |
| **States Glossary** (`/states/glossary`) | 12 state finance terms — GSDP, per capita income, own tax revenue, central transfers, devolution, FRBM Act, debt-to-GSDP, etc. |
| **Census Story** (`/census`) | Scrollytelling narrative — population growth, age structure waffle, vital statistics (birth/death/fertility/life expectancy), health outcomes (IMR + NFHS-5), literacy gender gap butterfly chart, urbanization |
| **Census Explorer** (`/census/explore`) | Indicator explorer with 5 categories (All, Population, Demographics, Literacy, Health), `HorizontalBarChart` per indicator |
| **Census Methodology** (`/census/methodology`) | Data sources (Census 2011, World Bank, NFHS-5, SRS 2023, NPC), multi-vintage strategy, limitations |
| **Census Glossary** (`/census/glossary`) | Demographic terms — census, decadal growth, sex ratio, dependency ratio, IMR, TFR, literacy rate, urbanization, etc. |
| **Education Story** (`/education`) | Scrollytelling narrative — enrollment triumph (GER trends), gender convergence, dropout cliff, learning quality gap (ASER), teacher challenge (PTR), spending vs global peers |
| **Education Explorer** (`/education/explore`) | Indicator explorer with 5 categories (All, Enrollment, Quality, Infrastructure, Spending), 36 states |
| **Education Methodology** (`/education/methodology`) | Data sources (UDISE+ 2023-24, ASER 2024, World Bank), indicator definitions, limitations |
| **Education Glossary** (`/education/glossary`) | 14 education terms — GER, dropout rate, PTR, ASER, UDISE, NEP 2020, foundational literacy, RTE Act, etc. |
| **Employment Story** (`/employment`) | Scrollytelling narrative — participation puzzle (LFPR trends), structural shift, youth unemployment, gender gap, informality challenge, rural vs urban |
| **Employment Explorer** (`/employment/explore`) | Indicator explorer with 5 categories (All, Unemployment, Participation, Sectoral, Informality), 30 states |
| **Employment Methodology** (`/employment/methodology`) | Data sources (PLFS 2023-24, RBI KLEMS, World Bank), indicator definitions, limitations |
| **Employment Glossary** (`/employment/glossary`) | 15 employment terms — LFPR, PLFS, gig economy, structural transformation, informal sector, etc. |
| **Healthcare Story** (`/healthcare`) | Scrollytelling narrative — infrastructure deficit, spending story, out-of-pocket burden, immunization push, disease burden, doctor gap |
| **Healthcare Explorer** (`/healthcare/explore`) | Indicator explorer with 5 categories (All, Infrastructure, Spending, Immunization, Disease), 30 states |
| **Healthcare Methodology** (`/healthcare/methodology`) | Data sources (NHP 2022, NFHS-5, World Bank), indicator definitions, limitations |
| **Healthcare Glossary** (`/healthcare/glossary`) | 13 healthcare terms — PHC, CHC, out-of-pocket spending, immunization, TB incidence, hospital beds per 1000, etc. |

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
git clone https://github.com/ronit111/indian-data-project.git
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
| `npm run build` | TypeScript check + Vite build + Puppeteer prerender (all 34 routes) |
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
│   ├── RBIMethodologyPage.tsx # RBI methodology
│   ├── StatesPage.tsx        # States scrollytelling (GSDP, revenue, fiscal health)
│   ├── StatesExplorePage.tsx  # States indicator explorer with category filters
│   ├── StatesMethodologyPage.tsx # States methodology
│   ├── CensusPage.tsx          # Census scrollytelling (population, age, health, literacy, urbanization)
│   ├── CensusExplorePage.tsx   # Census indicator explorer with category filters
│   ├── CensusMethodologyPage.tsx # Census methodology
│   ├── EducationPage.tsx        # Education scrollytelling (enrollment, quality, spending)
│   ├── EducationExplorePage.tsx  # Education indicator explorer
│   ├── EducationMethodologyPage.tsx # Education methodology
│   ├── EmploymentPage.tsx       # Employment scrollytelling (LFPR, sectoral, informality)
│   ├── EmploymentExplorePage.tsx # Employment indicator explorer
│   ├── EmploymentMethodologyPage.tsx # Employment methodology
│   ├── HealthcarePage.tsx       # Healthcare scrollytelling (infrastructure, spending, disease)
│   ├── HealthcareExplorePage.tsx # Healthcare indicator explorer
│   ├── HealthcareMethodologyPage.tsx # Healthcare methodology
│   ├── GlossaryPage.tsx      # Shared glossary component (parameterized by domain)
│   ├── BudgetGlossaryPage.tsx # Budget glossary wrapper
│   ├── EconomyGlossaryPage.tsx # Economy glossary wrapper
│   ├── RBIGlossaryPage.tsx   # RBI glossary wrapper
│   ├── StatesGlossaryPage.tsx # States glossary wrapper
│   ├── CensusGlossaryPage.tsx # Census glossary wrapper
│   ├── EducationGlossaryPage.tsx # Education glossary wrapper
│   ├── EmploymentGlossaryPage.tsx # Employment glossary wrapper
│   └── HealthcareGlossaryPage.tsx # Healthcare glossary wrapper
├── components/
│   ├── home/               # Budget story compositions (Hero, Revenue, Expenditure, Flow, Map, CTA)
│   ├── budget/             # Budget-specific compositions (DeficitSection, TrendsSection, BudgetVsActualSection, PerCapitaSection)
│   ├── economy/            # Economy compositions (GrowthSection, InflationSection, TradeSection, etc.)
│   ├── rbi/                # RBI compositions (HeroSection, MonetaryPolicySection, ForexSection, etc.)
│   ├── states/             # States compositions (GSDPSection, GrowthSection, RevenueSection, FiscalHealthSection, PerCapitaSection)
│   ├── census/             # Census compositions (PopulationSection, AgeDemographicsSection, VitalStatsSection, HealthSection, LiteracySection, UrbanizationSection)
│   ├── education/           # Education compositions (EnrollmentSection, GenderSection, DropoutSection, QualitySection, TeacherSection, SpendingSection)
│   ├── employment/          # Employment compositions (ParticipationSection, StructuralSection, YouthSection, GenderGapSection, InformalitySection, RuralUrbanSection)
│   ├── healthcare/          # Healthcare compositions (InfrastructureSection, SpendingSection, OOPSection, ImmunizationSection, DiseaseSection, DoctorGapSection)
│   ├── calculator/         # Tax calculator UI (IncomeInput, DeductionsPanel, TaxBreakdown, ShareCard, SpendingAllocation)
│   ├── explore/            # DataTable with expandable rows
│   ├── viz/                # D3 visualizations (TreemapChart, SankeyDiagram, ChoroplethMap, WaffleChart, LineChart, AreaChart, HorizontalBarChart, StepChart, AnimatedCounter)
│   ├── ui/                 # Shared UI (Tooltip, NarrativeBridge, SearchOverlay, FeedbackButton, Skeleton, etc.)
│   ├── layout/             # Header, Footer, MobileNav, PageShell
│   ├── seo/                # SEOHead (per-route meta tags + OG images + JSON-LD)
│   └── i18n/               # Language provider and switcher
├── lib/
│   ├── data/schema.ts      # TypeScript interfaces for all data shapes (Budget, Economy, RBI, States, Census, Education, Employment, Healthcare)
│   ├── taxEngine.ts        # Tax computation engine (Old/New regime, deductions, slabs)
│   ├── format.ts           # Indian number formatting (lakhs/crores)
│   ├── dataLoader.ts       # Fetch + cache layer for JSON data (all domains)
│   ├── stateMapping.ts     # India state ID → name mapping
│   └── i18n.ts             # i18next configuration
├── hooks/                  # useScrollTrigger, useIntersection, useBudgetData, useEconomyData, useRBIData, useStatesData, useCensusData, useEducationData, useEmploymentData, useHealthcareData, etc.
├── store/                  # Zustand stores (budgetStore, economyStore, rbiStore, statesStore, censusStore, educationStore, employmentStore, healthcareStore, calculatorStore, uiStore)
└── index.css               # Design tokens, CSS layers, keyframes

public/
├── data/budget/2025-26/    # 9 structured JSON budget datasets
├── data/economy/2025-26/   # 7 structured JSON economy datasets
├── data/rbi/2025-26/       # 6 structured JSON RBI datasets
├── data/states/2025-26/    # 6 structured JSON state finance datasets
├── data/census/2025-26/    # 7 structured JSON census & demographics datasets
├── data/education/2025-26/ # 6 structured JSON education datasets
├── data/employment/2025-26/ # 6 structured JSON employment datasets
├── data/healthcare/2025-26/ # 6 structured JSON healthcare datasets
├── locales/en/             # Translation files
├── sitemap.xml             # All routes + data endpoints (34 pages + 43 data files)
├── robots.txt              # All bots welcomed (including AI crawlers)
└── llms.txt                # AI-readable site summary

pipeline/
├── src/
│   ├── main.py             # Budget pipeline (CKAN API → JSON)
│   ├── economy/            # Economy pipeline (World Bank API → JSON)
│   ├── rbi/                # RBI pipeline (World Bank + curated MPC data → JSON)
│   ├── states/             # States pipeline (curated RBI Handbook data → JSON)
│   ├── census/             # Census pipeline (World Bank API + curated Census/NFHS/SRS → JSON)
│   ├── education/          # Education pipeline (World Bank API + curated UDISE+/ASER → JSON)
│   ├── employment/         # Employment pipeline (World Bank API + curated PLFS/KLEMS → JSON)
│   ├── healthcare/         # Healthcare pipeline (World Bank API + curated NHP/NFHS-5 → JSON)
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
| `trends.json` | 20-year historical budget trends (FY 2005-06 to 2025-26) |
| `budget-vs-actual.json` | Ministry-level BE/RE/Actual across 7 fiscal years |
| `glossary.json` | 13 budget terms with plain-language explanations |

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
| `glossary.json` | 15 economy terms with plain-language explanations |

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
| `glossary.json` | 12 RBI terms with plain-language explanations |

### States Data

States data lives in `public/data/states/2025-26/`:

| File | Contents |
|------|----------|
| `summary.json` | Headline state finance numbers (top GSDP state, national total, growth range) |
| `gsdp.json` | 31 state entries: GSDP current/constant prices, growth rate, per capita + 3-year history for top 10 |
| `revenue.json` | 31 state entries: own tax revenue, central transfers, self-sufficiency ratio |
| `fiscal-health.json` | 31 state entries: fiscal deficit %, debt-to-GSDP |
| `indicators.json` | All state indicators across 4 categories |
| `glossary.json` | 12 state finance terms with plain-language explanations |

### Census & Demographics Data

Census data lives in `public/data/census/2025-26/`:

| File | Contents |
|------|----------|
| `summary.json` | Headline census numbers (population, literacy, sex ratio, urbanization) |
| `population.json` | State-wise population, density, urban/rural split, decadal growth, national time series |
| `demographics.json` | Age structure (young/working/elderly %), dependency ratio, vital stats (birth/death/fertility/life expectancy), urbanization trend |
| `literacy.json` | State-wise literacy by gender, national time series |
| `health.json` | IMR time series, state-level IMR, NFHS-5 state health (TFR, IMR, U5MR, stunting, wasting, immunization) |
| `indicators.json` | All census indicators across 4 categories |
| `glossary.json` | Demographic terms with plain-language explanations |

### Education Data

Education data lives in `public/data/education/2025-26/`:

| File | Contents |
|------|----------|
| `summary.json` | Headline education numbers (total students, GER, PTR, spending % GDP) |
| `enrollment.json` | National enrollment time series (primary/secondary/tertiary) + state GER from UDISE+ |
| `quality.json` | Pupil-teacher ratios, ASER learning outcomes, school infrastructure by state |
| `spending.json` | Education expenditure trends (% GDP, % govt spending) |
| `indicators.json` | All education indicators across 4 categories (enrollment, quality, infrastructure, spending) |
| `glossary.json` | 14 education terms with plain-language explanations |

### Employment Data

Employment data lives in `public/data/employment/2025-26/`:

| File | Contents |
|------|----------|
| `summary.json` | Headline employment numbers (unemployment rate, LFPR, female LFPR, youth UR) |
| `unemployment.json` | Unemployment time series (total/youth/gender) + state unemployment rates |
| `participation.json` | LFPR time series (total/male/female) + state LFPR |
| `sectoral.json` | Agriculture/industry/services employment shares + RBI KLEMS breakdown |
| `indicators.json` | All employment indicators across 4 categories (unemployment, participation, sectoral, informality) |
| `glossary.json` | 15 employment terms with plain-language explanations |

### Healthcare Data

Healthcare data lives in `public/data/healthcare/2025-26/`:

| File | Contents |
|------|----------|
| `summary.json` | Headline healthcare numbers (hospital beds/1000, doctors/1000, health spending % GDP, OOP %) |
| `infrastructure.json` | Hospital beds, physicians, nurses time series + state infrastructure from NHP 2022 |
| `spending.json` | Health expenditure trends (% GDP, per capita, out-of-pocket %) |
| `disease.json` | TB incidence, HIV prevalence, immunization coverage trends |
| `indicators.json` | All healthcare indicators across 4 categories (infrastructure, spending, immunization, disease) |
| `glossary.json` | 13 healthcare terms with plain-language explanations |

Data sourced from [Open Budgets India](https://openbudgetsindia.org), [indiabudget.gov.in](https://www.indiabudget.gov.in), [Economic Survey](https://www.indiabudget.gov.in/economicsurvey/), [RBI DBIE](https://data.rbi.org.in), [RBI Monetary Policy Statements](https://www.rbi.org.in), [RBI Handbook of Statistics on Indian States](https://www.rbi.org.in), [Census of India](https://censusindia.gov.in), [NFHS](http://rchiips.org/nfhs/), [UDISE+](https://udiseplus.gov.in), [ASER](https://asercentre.org), [PLFS](https://mospi.gov.in), [NHP/CBHI](https://cbhidghs.mohfw.gov.in), and [World Bank Open Data API](https://data.worldbank.org) under the [Government Open Data License — India](https://data.gov.in/government-open-data-license-india).

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

- **Prerendered HTML** for all 34 routes (Puppeteer at build time)
- **JSON-LD** structured data: `WebApplication`, `Dataset` x8 (Budget + Economy + RBI + States + Census + Education + Employment + Healthcare for Google Dataset Search), `BreadcrumbList`
- **Per-route meta tags** via react-helmet-async (title, description, OG image, Twitter card, canonical)
- **sitemap.xml** covering 34 pages + 45 downloadable data endpoints
- **robots.txt** explicitly welcoming AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended)
- **llms.txt** for AI model discoverability (all 8 domains + glossary terms)
- **Noscript fallback** with real content across all eight domains for crawlers that don't execute JS

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
- [x] Phase 3 polish — sparse series filtering, GDP projection display fix, credit narrative alignment, per-domain OG images
- [x] Per-domain glossary pages (budget, economy, RBI) — 40 terms in plain language with filter, alpha nav, and related terms
- [x] Floating feedback button — GitHub issue form with pre-filled page context
- [x] Cmd+K search expansion — glossary terms indexed with purple badges, RBI pages added, stale routes fixed

### Next Steps

**Phase 3: Polish Existing Domains** ✓
- [x] Economy inflation chart: sparse Food/Core CPI series (< 3 points) hidden with MIN_POINTS threshold; annotation adapts
- [x] Economy GDP projection: single value display when low === high (was "7.4–7.4%", now "7.4%")
- [x] RBI credit section: narrative updated to focus on private sector credit (domestic credit series empty from WB); dead series removed from chart
- [x] RBI credit section: deposit rate empty — noted in methodology; DBIE integration deferred to Phase 5
- [x] Per-domain OG images: 4 variants (hub, budget, economy, rbi) generated via Puppeteer, wired into SEOHead on all 11 routes

**Phase 3.5: UX & Discoverability** ✓
- [x] Per-domain glossary pages (40 terms across 3 domains, plain-language explanations, related term pills, hash deep-linking)
- [x] Floating feedback button (GitHub issue form with pre-filled page context and simple prompts)
- [x] Cmd+K search indexing for glossary terms (40 terms with purple TERM badges, RBI pages added)
- [ ] Mobile UX audit across all 3 domains (deferred to post-Phase 4 — after all data domains are built)

**Phase 4A: State Finances** ✓
- [x] State Finances domain (scrollytelling, indicator explorer, methodology, glossary)
- [x] States data pipeline (curated RBI Handbook data — GSDP, revenue, fiscal health across 31 states/UTs)
- [x] Hub integration with emerald domain card, mini bar chart, stat pills
- [x] Full SEO layer (prerender, sitemap, JSON-LD Dataset, OG image, llms.txt, noscript)

**Phase 4B: Census & Demographics** ✓
- [x] Census & Demographics domain (scrollytelling with 6 sections, indicator explorer, methodology, glossary)
- [x] Multi-vintage pipeline: World Bank API (national time series) + curated Census 2011 (state-level) + NFHS-5 (health) + SRS 2023 (vital stats)
- [x] Custom visualizations: AgeWaffle (10x10 grid), GenderGapChart (butterfly), IMR color gradient bars
- [x] Hub integration with violet domain card, mini population bars, stat pills
- [x] Full SEO layer (prerender, sitemap, JSON-LD Dataset, OG image, llms.txt, noscript)
- [x] GitHub Actions: `census-pipeline.yml` (quarterly) + freshness monitor updated

**Phase 5: New Domains — Education, Employment, Healthcare** ✓
- [x] Education domain (scrollytelling with 6 sections, indicator explorer, methodology, glossary) — UDISE+ 2023-24, ASER 2024, World Bank
- [x] Employment domain (scrollytelling with 6 sections, indicator explorer, methodology, glossary) — PLFS 2023-24, RBI KLEMS, World Bank
- [x] Healthcare domain (scrollytelling with 6 sections, indicator explorer, methodology, glossary) — NHP 2022, NFHS-5, World Bank
- [x] 3 automated pipelines: `education-pipeline.yml`, `employment-pipeline.yml`, `healthcare-pipeline.yml`
- [x] Hub expanded to 8 domain cards with mini-visualizations
- [x] Full SEO layer for all 3 domains (prerender, sitemap, JSON-LD, OG images, llms.txt, noscript)
- [x] 42 new glossary terms across 3 domains (14 education, 15 employment, 13 healthcare)

**Phase 6: Historical Data & Depth** ✓
- [x] Budget 20-year historical trends (FY 2005-06 to 2025-26: expenditure, receipts, fiscal/revenue deficit % GDP)
- [x] Budget vs Actual tracker (10 ministries, 7 fiscal years of BE/RE/Actual, deviation chart)
- [x] World Bank historical extension: Economy + RBI pipelines now fetch from year 2000 (was 2014)
- [x] State GSDP 3-year history for top 10 states (FY 2020-21 through 2022-23)
- [ ] RBI DBIE direct API integration (bypass World Bank lag for monetary indicators) — deferred

**Phase 7: Chart Shareability & Distribution Infrastructure**
- [ ] `<ChartActions>` overlay on every chart (PNG download, CSV export, permalink, embed iframe code)
- [ ] Embed routes (`/embed/{domain}/{section}`) rendering standalone charts for journalist/blogger embedding
- [ ] WhatsApp-optimized share cards (one stat + source, under 100KB) with deep link sharing
- [ ] URL-encoded chart state (filters and selections reflected in shareable URLs)

**Phase 8: "Make It Personal" Engine**
- [ ] Persistent user context (state, household size) in localStorage — transforms numbers across all domains
- [ ] RBI EMI impact calculator (repo rate → monthly payment change on home/car loans)
- [ ] Economy cost-of-living calculator (input expenses, see change vs CPI over time)
- [ ] States "Your state's report card" (per-capita spending vs national average)
- [ ] Census "Your district profile" (population, literacy, health metrics for your area)

**Phase 9: Key Insights & Question-First Search**
- [ ] "Key Takeaways" card at top of each story page (3-5 stat pills with one-line annotations before scrollytelling)
- [ ] Question-first search: curate 100 citizen questions mapped to section anchors + one-sentence answers
- [ ] Add questions to Fuse.js search index ("Why are prices rising?" → Economy/Inflation section)

**Phase 10: New Domains — Environment, Elections**
- [ ] Environment domain (CPCB air quality, MOEFCC forest cover, CEA energy mix, CWC water resources)
- [ ] Elections domain (Election Commission data — constituency results overlaid with development indicators)

**Phase 11: Topic-Based Cross-Domain Views**
- [ ] `/topics` page with 10-15 cross-domain topic cards (Agriculture, Borrowing Costs, Education Spending, etc.)
- [ ] Each topic pulls relevant indicators from multiple domains into a single coherent view
- [ ] Topic tags on individual story sections linking to cross-domain views

**Phase 12: Multiplier Infrastructure**
- [ ] Public REST API for all datasets with OpenAPI documentation
- [ ] "For Journalists" section (citation-ready text, high-res chart downloads, embed snippets)
- [ ] "For Teachers" section (lesson plans, classroom mode with larger fonts and slide-by-slide navigation)
- [ ] Contributor guide for data journalists and civic organizations

**Final: Citizen-Perspective QA**
- [ ] Full product review from the perspective of an average Indian citizen (per CLAUDE.md Final QA protocol)

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
- States data from [RBI Handbook of Statistics on Indian States](https://www.rbi.org.in) and [Finance Commission of India](https://fincomindia.nic.in)
- Census data from [Census of India](https://censusindia.gov.in), [NFHS-5](http://rchiips.org/nfhs/), [Sample Registration System](https://censusindia.gov.in/census.website/data/srs), and [World Bank Open Data](https://data.worldbank.org)
- Education data from [UDISE+ 2023-24](https://udiseplus.gov.in), [ASER 2024](https://asercentre.org), and [World Bank Open Data](https://data.worldbank.org)
- Employment data from [PLFS Quarterly Bulletin](https://mospi.gov.in), [RBI KLEMS Database](https://www.rbi.org.in), and [World Bank Open Data](https://data.worldbank.org)
- Healthcare data from [National Health Profile 2022](https://cbhidghs.mohfw.gov.in), [NFHS-5](http://rchiips.org/nfhs/), and [World Bank Open Data](https://data.worldbank.org)
- Design inspired by [Information is Beautiful](https://informationisbeautiful.net), [Visual Cinnamon](https://www.visualcinnamon.com), and [Kasia Siwosz](https://kasiasiwosz.com)
- Built with React, D3, Framer Motion, and Tailwind CSS
