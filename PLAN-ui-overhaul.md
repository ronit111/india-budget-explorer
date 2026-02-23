# UI/UX Overhaul Plan — Indian Data Project

## Current Problems (rated 3-4/10 by user)

1. **Text-heavy**: Every section front-loads explanatory paragraphs before showing data. The scrollytelling reads like a Wikipedia article with a chart attached, not a visual-first experience.
2. **Alignment and spacing**: Inconsistent padding, mixed column widths, sections feel disconnected. No visual rhythm between scroll sections.
3. **2010 aesthetic**: Dark theme with colored text on dark backgrounds, generic card borders, no visual personality. Looks like a Bootstrap admin dashboard, not a data journalism piece.
4. **Visualizations thrown together**: Each chart sits in a generic `ChartContainer` box. No narrative connection between sections. Waffle, treemap, sankey, and choropleth feel like four separate demos.
5. **No visual hierarchy**: Hero text competes with scroll-down cue. Section headers all look the same. Nothing guides the eye.

## Design Direction

**Reference quality**: Pudding.cool, Bloomberg Visual Data, OWID, Stripe.com. Common thread: generous whitespace, typography-driven hierarchy, purposeful animation, and visualizations that *are* the content (not illustrations beside text).

**Design principles:**
- **Data as hero**: Visualizations are the primary content; text is annotation
- **Cinematic dark theme done right**: Deep blacks with luminous accents, not gray-on-gray
- **Generous whitespace**: Each section breathes — 100vh or near-100vh per scroll section
- **Purposeful motion**: Entrance animations that reveal data progressively, not decoration
- **Indian design sensibility**: Warm palette (saffron/amber gold), not clinical
- **Mobile-first compositions**: Visualizations that reflow gracefully, not just shrink

---

## 1. REVISED DESIGN SYSTEM

### 1.1 Color Palette

Current palette problems: only 3 surface colors (not enough layering), saffron used for everything (loses meaning), `--color-bg-hover` too close to `--color-bg-raised`.

```css
:root {
  /* ─── Surfaces (warm-tinted dark stack) ─── */
  --color-bg-deepest:    #06080f;     /* deeper than current #0a0e1a — more contrast headroom */
  --color-bg-base:       #0c1018;     /* NEW: page-level background */
  --color-bg-surface:    #121820;     /* warmer tint than current #111827 */
  --color-bg-raised:     #1a2230;     /* more separation from surface */
  --color-bg-overlay:    #222c3c;     /* NEW: modals, popovers, expanded rows */
  --color-bg-hover:      #2a3648;     /* more visible on hover */

  /* ─── Borders ─── */
  --color-border-subtle:  rgba(255, 255, 255, 0.04);
  --color-border-default: rgba(255, 255, 255, 0.08);
  --color-border-strong:  rgba(255, 255, 255, 0.14);
  --color-border-accent:  rgba(255, 107, 53, 0.3);

  /* ─── Text ─── */
  --color-text-primary:   #f0ece6;    /* warm off-white, not blue-white */
  --color-text-secondary: #b8bcc4;    /* slightly muted for contrast */
  --color-text-muted:     #6b7280;    /* much more muted for true de-emphasis */
  --color-text-disabled:  #4b5563;

  /* ─── Saffron (Primary Accent) — full scale ─── */
  --color-saffron-100:    #ffe8d9;
  --color-saffron-200:    #ffcfb3;
  --color-saffron-300:    #ffad80;
  --color-saffron-400:    #ff8c5a;
  --color-saffron:        #FF6B35;    /* keep — it's a good color */
  --color-saffron-600:    #e55a25;
  --color-saffron-glow:   rgba(255, 107, 53, 0.15);

  /* ─── Blue (Secondary Accent) ─── */
  --color-blue-100:       #dbeafe;
  --color-blue-300:       #93c5fd;
  --color-blue:           #3B82F6;
  --color-blue-600:       #2563eb;
  --color-blue-glow:      rgba(59, 130, 246, 0.12);

  /* ─── Semantic ─── */
  --color-positive:       #22c55e;    /* brighter than current #059669 for dark bg */
  --color-positive-muted: rgba(34, 197, 94, 0.12);
  --color-negative:       #f87171;    /* lighter than current #EF4444 for readability */
  --color-negative-muted: rgba(248, 113, 113, 0.12);

  /* ─── Visualization Palette (12 colors, WCAG AA on #121820) ─── */
  --viz-1:  #FF6B35;   --viz-2:  #3B82F6;   --viz-3:  #a78bfa;
  --viz-4:  #34d399;   --viz-5:  #fbbf24;   --viz-6:  #f472b6;
  --viz-7:  #818cf8;   --viz-8:  #2dd4bf;   --viz-9:  #fb923c;
  --viz-10: #22d3ee;   --viz-11: #f87171;   --viz-12: #a3e635;
}
```

### 1.2 Typography Scale (4:5 major third ratio)

Current problem: ad-hoc Tailwind classes with no system. h1/h2/h3 hierarchy is indistinct.

| Element | Size (mobile → desktop) | Weight | Line-height | Tracking |
|---------|------------------------|--------|-------------|----------|
| Display (hero number) | text-4xl → text-6xl (clamp) | 800 | 1.15 | -0.025em |
| H1 (page title) | text-2xl → text-4xl | 700 | 1.15 | -0.025em |
| H2 (section heading) | text-xl → text-3xl | 700 | 1.3 | -0.025em |
| H3 (card/chart title) | text-lg → text-xl | 600 | 1.3 | 0 |
| Overline (section label) | 0.75rem | 600 | normal | 0.1em, uppercase |
| Body large | 1.125rem | 400 | 1.75 | 0 |
| Body | 0.9375rem (15px) | 400 | 1.6 | 0 |
| Caption | 0.75rem | 400 | normal | 0 |
| Mono data | 0.8125rem (JetBrains) | 500 | 1.3 | 0, tabular-nums |

### 1.3 Spacing (4px base grid)

```css
:root {
  --section-gap:     6rem;    /* 96px mobile */
  --section-gap-lg:  8rem;    /* 128px desktop */
  --container-max:   1200px;
  --container-narrow: 768px;
  --container-wide:  1400px;
  --container-px:    1.25rem; /* 20px mobile */
  --container-px-lg: 3rem;   /* 48px desktop */
}
```

Layout constants: Header height 64px, mobile nav 64px + safe area, 8px grid for all vertical spacing.

### 1.4 Border Radius, Shadow, Blur

```css
:root {
  --radius-sm: 6px;  --radius-md: 10px;  --radius-lg: 16px;  --radius-xl: 24px;

  --shadow-sm: 0 1px 2px rgba(0,0,0,0.3);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.4);
  --shadow-lg: 0 8px 24px rgba(0,0,0,0.5);
  --shadow-glow: 0 0 40px rgba(255,107,53,0.1);

  --glass-bg: rgba(18,24,32,0.75);
  --glass-border: rgba(255,255,255,0.06);
  --glass-blur: 16px;
}
```

### 1.5 Motion System

```css
:root {
  /* Easing */
  --ease-default:   cubic-bezier(0.2, 0, 0, 1);        /* hover, color changes */
  --ease-out:       cubic-bezier(0, 0, 0.2, 1);         /* elements entering */
  --ease-out-expo:  cubic-bezier(0.16, 1, 0.3, 1);     /* viz animations */
  --ease-spring:    cubic-bezier(0.34, 1.56, 0.64, 1);  /* toggles, playful */

  /* Duration */
  --duration-micro:     150ms;   /* hover states */
  --duration-fast:      200ms;   /* button feedback */
  --duration-standard:  300ms;   /* dropdowns, cards */
  --duration-slow:      500ms;   /* section reveals */
  --duration-dramatic:  800ms;   /* viz entry */
  --duration-cinematic: 1200ms;  /* hero counter, sankey draw */
}
```

---

## 2. PAGE-BY-PAGE REDESIGN

### 2.1 Homepage — Scrollytelling Narrative

The homepage should read like a documentary, not a dashboard. Each section answers one question, then transitions to the next.

**Narrative structure:**
1. **HOOK** (Hero): "The government spends Rs 50 lakh crore."
2. **QUESTION 1**: "Where does this money come from?" → Revenue waffle
3. **QUESTION 2**: "Where does it go?" → Expenditure treemap
4. **CONNECTION**: "Here's the complete picture." → Sankey flow
5. **LOCALIZATION**: "How much reaches your state?" → Choropleth
6. **PERSONAL**: "What about your share?" → CTA to calculator

**Between sections, add `NarrativeBridge` components** — scroll-triggered text reveals:
- After Hero: "Let's trace where this money comes from."
- After Revenue: "Now let's see where it goes."
- After Expenditure: "Here's the complete picture — sources to spending, in one flow."
- After Sankey: "How much of this reaches your state?"
- After Map: "Want to know your personal share?"

#### Hero Section (100vh)

**Current**: Big text, animated counter, bouncing arrow. Generic.

**Redesign**:
- Animated counter as the absolute focal point — fills center in display size with saffron→gold gradient
- Subtle radial glow behind the number (replace grid pattern)
- Tagline: "Where every rupee goes" — single line, no multi-line explanation
- Per-capita stat as a pill badge: `Rs 94.28 per citizen per day`
- Scroll indicator: thin line that grows downward, not a bouncing arrow
- Remove: "Where does this money come from? Where does it go?" — visualizations answer that
- Entrance animation: overline → title → counter → subtitle, staggered 0.15s

#### Revenue Section (sticky scrollytelling)

**Current**: Two paragraphs + waffle chart in a card.

**Redesign** — Pudding-style sticky text pattern:
- **Sticky left panel** (40%): annotation text changes at 3 scroll steps:
  - Step 1 (0-33%): "Income Tax and Corporate Tax fund 65% of receipts"
  - Step 2 (33-66%): "Borrowings make up nearly a third" (borrowings cells highlight)
  - Step 3 (66-100%): "GST contributes 17%" (GST cells highlight)
- **Scrolling right** (60%): Waffle chart, no card wrapper, animates cell-by-cell
- Legend integrated into chart (inline labels or annotation arrows)
- Replace paragraph prose with punchy annotations: "32p borrowings · 19p GST · 14p corporate tax"

#### Expenditure Section (full-width treemap)

**Current**: Text header + treemap in a card. Treemap too small.

**Redesign**:
- Full-width treemap filling 70% viewport height, aspect ratio 16:10 (from 800:500)
- Floating annotation overlay (top-left): section title + "45 paisa of every rupee → state transfers + interest"
- Hover: brightness increase + cursor-following tooltip (replace browser `<title>`)
- Drill-down: morph animation (clicked block scales to fill, children appear)
- Breadcrumb trail: "All Spending > Defence > Capital Expenditure"
- Remove `ChartContainer` wrapper

#### Flow Section (Sankey)

**Current**: Text + Sankey in card. Links too faint (0.25 opacity).

**Redesign**:
- Full-width, 80% viewport, 16:9 aspect ratio
- Node width: 14px (from 20px), more margin for labels (80px left, 100px right)
- Default link opacity: 0.18; hover connected: 0.45; non-connected: 0.06
- Two-wave draw animation: revenue links (0-800ms), then expenditure links (800-1600ms)
- Node labels: 13px semibold + value below in mono
- Add gradient along links (source color → target color)
- Remove card wrapper

#### Map Section (TopoJSON upgrade)

**Current**: Hardcoded SVG paths (known issue). Approximate polygon shapes.

**Redesign — CRITICAL FIX**:
- **Replace hardcoded paths with real TopoJSON geometry** from Natural Earth / DataMeet
  - Load `public/data/india-states.topo.json` (~80KB)
  - Render with `d3-geo` `geoMercator` projection (both packages already installed)
- Full-width map with floating stat overlays
- Color scale: diverging saffron/blue centered on median (orange = gets more, blue = gets less)
- Cursor-following tooltip (not fixed top-right card)
- Legend: continuous gradient bar with value labels
- Hover: 2px white stroke + drop shadow on state

#### CTA Section

- Wider cards, gradient backgrounds (not bordered boxes)
- Hover: lift + shadow + accent glow
- Shorter text: "See where your tax goes" / "Every ministry, every scheme"

### 2.2 Explore Page

**Current**: Title + paragraph + data table. Flat.

**Redesign**:
- Sticky summary bar: total expenditure, ministry count, last updated
- Search/filter input above table
- Table:
  - Sticky header on scroll (position: sticky, top: 64px)
  - Row height: 64px, hover: left saffron border + bg change
  - `% Total` column: full-cell-width horizontal bar (replace tiny 64px bar)
  - YoY: colored badge with arrow (not just text color)
  - Expandable schemes: `framer-motion` height animation, staggered children
  - Remove alternating row colors (dated)
- Mobile (< 768px): card layout per ministry instead of table

### 2.3 Tax Calculator

**Current**: Cramped 2-column layout. Toggle switch. Dense breakdown.

**Redesign**:
- **Income input** (full width, hero-style): massive mono number, custom slider (32px thumb on touch), segmented control for regime (not toggle)
- **Tax breakdown**: 2 metric cards (Total Tax, Effective Rate) with left accent border, then visual slab waterfall chart (horizontal stacked bar showing each slab)
- **Spending allocation** (full width): 32px-tall horizontal bars, human context as annotation chips (`= 73 school mid-day meals`)
- **Share card**: preview inline (not hidden behind button), one-click share buttons
- Mobile: single column, sticky income input, collapsible result sections

### 2.4 Methodology

**Current**: Wall of text. Reads like a legal document.

**Redesign**:
- TOC sidebar (desktop) that highlights on scroll
- Visual section breaks (not just h2 tags)
- Data sources as styled link cards (icon + title + URL)
- Tax calculation as step-by-step flow diagram
- Limitations as callout boxes (amber-tinted background)

---

## 3. VISUALIZATION COMPONENT REDESIGN

### WaffleChart

- Add hover interaction: highlight all cells of hovered category, dim others
- Cursor-following tooltip with name, amount, percentage
- Legend moves to left (desktop) or below (mobile), interactive click-to-highlight
- Animation: category-by-category fill (not individual cells), wave pattern within each
- Replace framer-motion per-cell with CSS `animation-delay` (100 animated rects is expensive)

### TreemapChart

- Aspect ratio 16:10 (1200x750) for more label space
- Cursor-following tooltip replacing browser `<title>`:
  ```
  Ministry of Defence    12.5%
  Rs 6,21,940 Cr
  ──────────────
  ▲ +9.5% vs last year
  Rs 4,290 per citizen
  Click to drill down →
  ```
- Stable color assignment: `colorMap[category.id]` instead of index-based
- Drill-down morph: clicked block scales to fill container, children fade in
- Labels: no label < 60px wide, abbreviated 60-120px, full > 120px

### SankeyDiagram

- Wider margins for labels (80px left, 100px right)
- Node labels: 13px semibold with value below in mono
- Link gradients: source color → target color
- Two-wave animation: revenue links first, then expenditure
- Mobile (< 768px): simplify to top-5 sources → top-5 expenditures

### ChoroplethMap — **Complete Rewrite**

- Replace hardcoded `STATE_PATHS` with d3-geo projection from real TopoJSON
- Cursor-following tooltip (not fixed-position card)
- Diverging color scale: saffron (above median) / blue (below median)
- Continuous gradient legend bar with value endpoints
- Hover: white stroke + subtle elevation
- Mobile: pinch-zoomable, callout dots for top 5 states

---

## 4. NEW COMPONENTS

| Component | Purpose |
|-----------|---------|
| `src/components/ui/Button.tsx` | Unified variants: Primary, Secondary, Ghost, Danger. Sizes: sm/md/lg |
| `src/components/ui/Badge.tsx` | For labels, YoY changes, filter tags. Variants: default, saffron, positive, negative |
| `src/components/ui/Tooltip.tsx` | Cursor-following, max-width 280px, CSS arrow, 100ms entry |
| `src/components/ui/Skeleton.tsx` | Pulsing shimmer rectangles for loading states |
| `src/components/ui/SegmentedControl.tsx` | Regime toggle replacement (iOS-style tabs) |
| `src/components/ui/NarrativeBridge.tsx` | Scroll-triggered connecting text between homepage sections |
| `src/components/ui/ScrollProgress.tsx` | Thin progress bar under header on homepage |
| `src/components/ui/ErrorState.tsx` | Icon + heading + body + action button (replace bare red text) |
| `src/hooks/useScrollProgress.ts` | framer-motion `useScroll` + `useTransform` for scroll-linked animation |
| `src/hooks/useScrollTrigger.ts` | Multi-threshold intersection observer (replaces binary `useIntersection`) |
| `public/data/india-states.topo.json` | Real India TopoJSON (~80KB) |

---

## 5. RESPONSIVE STRATEGY

| Component | < 480px | 480-768px | 768-1024px | > 1024px |
|-----------|---------|-----------|------------|----------|
| Header | Logo + hamburger | Logo + nav | Full nav | Full nav + search |
| Hero | text-3xl, text-4xl counter | text-4xl, text-5xl | text-5xl, text-6xl | text-6xl, text-7xl |
| Revenue | Stacked vertical | Same | 2-col sticky text + waffle | Same |
| Treemap | Full width, 4:3, no labels | Full width, 3:2 | 16:10, labels > 60px | Full labels |
| Sankey | Simplified top-5 | Horizontal, scroll | Full diagram | Full |
| Choropleth | Full width, pinch-zoom | Same | 2-col text + map | Same |
| DataTable | Card layout | Card layout | Table + scroll | Full table |
| Calculator | Single col, sticky input | Same | 2-col input + results | Same |
| MobileNav | Visible | Visible | Hidden | Hidden |

---

## 6. FILE CHANGES SUMMARY

### Files to Modify

| File | Changes |
|------|---------|
| `src/index.css` | Complete token overhaul: colors, typography, spacing, radius, shadows, motion, component tokens. New keyframes (shimmer, SVG draw). |
| `src/App.tsx` | Wrap Routes in `AnimatePresence` for page transitions |
| `src/components/layout/Header.tsx` | Scroll-aware glass opacity, bottom-underline active state, logo icon |
| `src/components/layout/MobileNav.tsx` | Active indicator dot, glass bg, 24px icons |
| `src/components/layout/Footer.tsx` | Simplify to single line, gradient top border |
| `src/components/layout/PageShell.tsx` | Add AnimatePresence, scroll progress for homepage |
| `src/pages/HomePage.tsx` | Add NarrativeBridges, skeleton loading, ErrorState |
| `src/pages/ExplorePage.tsx` | Summary stats row, search input, skeleton loading |
| `src/pages/FindYourSharePage.tsx` | Full-width input, 2-col results, skeleton loading |
| `src/pages/MethodologyPage.tsx` | Prose with visual breaks, source cards, callout boxes |
| `src/components/home/HeroSection.tsx` | Radial glow, tighter text hierarchy, staggered entrance |
| `src/components/home/RevenueSection.tsx` | Sticky scrollytelling layout, 3 scroll steps |
| `src/components/home/ExpenditureSection.tsx` | Full-width treemap, floating annotation |
| `src/components/home/FlowSection.tsx` | Full-width Sankey, centered annotation |
| `src/components/home/MapSection.tsx` | Single-column with floating stat overlays |
| `src/components/home/CTASection.tsx` | Gradient cards, hover lift, shorter text |
| `src/components/viz/WaffleChart.tsx` | Category hover, cursor tooltip, CSS animation, left legend |
| `src/components/viz/TreemapChart.tsx` | 16:10 aspect, cursor tooltip, breadcrumb, morph drill, stable colors |
| `src/components/viz/SankeyDiagram.tsx` | 14px nodes, label values, link gradients, two-wave animation |
| `src/components/viz/ChoroplethMap.tsx` | **Complete rewrite**: d3-geo + TopoJSON, cursor tooltip, diverging scale |
| `src/components/viz/AnimatedCounter.tsx` | Comma-separator animation, glow pulse on completion |
| `src/components/ui/ChartContainer.tsx` | Apply new tokens, gradient top border, expand button |
| `src/components/ui/SearchOverlay.tsx` | Glass/blur tokens, keyboard nav, staggered results |
| `src/components/explore/DataTable.tsx` | Sticky header, full-width bars, animated expansion, mobile cards |
| `src/components/calculator/IncomeInput.tsx` | Custom slider, SegmentedControl, larger display |
| `src/components/calculator/TaxBreakdownDisplay.tsx` | Metric cards, slab waterfall chart |
| `src/components/calculator/SpendingAllocation.tsx` | 32px bars, percentage inside, annotation chips |
| `src/components/calculator/ShareCard.tsx` | Inline preview, copy-to-clipboard |

### New Dependencies

None. Framer Motion and d3 already installed. `topojson-client` already installed. Only new static asset: `india-states.topo.json` (~80KB).

---

## 7. IMPLEMENTATION ORDER

### Phase 1: Design System Foundation
1. `src/index.css` — all tokens
2. New UI components: Button, Badge, Tooltip, Skeleton, SegmentedControl
3. New hooks: useScrollProgress, useScrollTrigger
4. Verify existing pages still render with new colors/fonts

### Phase 2: Layout & Navigation
5. Header, MobileNav, Footer, PageShell redesigns
6. Page transitions in App.tsx

### Phase 3: Homepage (biggest visual impact)
7. HeroSection + NarrativeBridge
8. WaffleChart + RevenueSection (sticky scrollytelling)
9. TreemapChart + ExpenditureSection
10. SankeyDiagram + FlowSection
11. ChoroplethMap rewrite + TopoJSON + MapSection
12. CTASection + HomePage orchestration

### Phase 4: Interior Pages
13. DataTable + ExplorePage
14. Calculator components + FindYourSharePage
15. MethodologyPage

### Phase 5: Polish
16. Mobile responsive testing
17. Animation timing refinement
18. Prerender verification
19. Lighthouse audit (performance, accessibility)

---

## What This Achieves

- **Visual identity**: "Generic dark dashboard" → "data journalism publication"
- **Data-first narrative**: Visualizations become the content; text becomes annotation
- **Spatial clarity**: Consistent spacing + generous whitespace = professional feel
- **Engagement**: Purposeful scroll animations encourage exploration
- **Known issue fix**: Real TopoJSON geometry replaces hacky hardcoded SVG paths
- **Performance preserved**: No new heavy dependencies; CSS animations replace expensive per-element framer-motion

## What This Does NOT Change

- Data pipeline (Python ETL, JSON schemas)
- Routing (same 4 routes — i18n plan handles language routing)
- SEO (prerendering, meta tags, JSON-LD, structured data)
- Functionality (sorting, filtering, CSV export, tax calculation, search)
- Build process (Vite + prerender pipeline)
