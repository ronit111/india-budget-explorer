# Changelog

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
