# i18n Implementation Plan — Indian Data Project

## Goal

Support major Indian languages starting with Hindi, then expanding to Telugu, Tamil, Kannada, and Malayalam. The system must handle:

- UI text translation (labels, headings, descriptions, CTAs)
- Indian number formatting that stays in Latin digits regardless of language
- Script-specific fonts loaded on demand (not bundled upfront)
- SEO for each language (hreflang, per-language prerendering, localized meta tags)
- Browser auto-translate compatibility (protect numbers/data from mangling)

## Library Choice: react-i18next

**Why react-i18next over alternatives:**
- Battle-tested with React 19 and SSR/hydration scenarios
- JSON namespace support keeps translation files organized
- Language detection plugins (URL path, browser preference, localStorage)
- Interpolation with formatting functions (our `formatIndianNumber` stays intact)
- Tiny runtime (~3KB gzip for i18next + react-i18next)

**Rejected alternatives:**
- `next-intl` — Next.js-specific, we're on Vite + React Router
- `formatjs/react-intl` — heavier, ICU message syntax adds complexity for translators
- Manual `t()` wrapper — no ecosystem, no pluralization, no tooling

## Translation Key Inventory (~270 keys)

| Namespace | Key Count | Examples |
|-----------|-----------|---------|
| `common` | ~30 | nav labels, footer text, loading/error states, Cmd+K placeholder |
| `home` | ~60 | hero section text, section titles, scrollytelling narratives, CTA cards |
| `explore` | ~25 | page title/description, table headers, "Export CSV", "Major Schemes" |
| `calculator` | ~45 | income input labels, regime toggle, spending category names, share card text |
| `methodology` | ~50 | all methodology section prose (data sources, limitations, etc.) |
| `viz` | ~35 | chart titles, subtitles, legends, tooltip templates, axis labels |
| `seo` | ~25 | per-route title/description for all 6 languages |

**Total**: ~270 keys across 7 namespace files per language.

## Namespace JSON Structure

```
public/locales/
├── en/
│   ├── common.json
│   ├── home.json
│   ├── explore.json
│   ├── calculator.json
│   ├── methodology.json
│   ├── viz.json
│   └── seo.json
├── hi/
│   ├── common.json
│   ├── home.json
│   └── ...
├── te/
├── ta/
├── kn/
└── ml/
```

Each namespace loads on demand when its page mounts. The `common` namespace loads globally. This keeps initial payload small — a user viewing only the homepage in Hindi loads `common.json` (~2KB) + `home.json` (~4KB).

## Number Formatting Strategy

**Critical rule: Numbers stay in Latin digits (0-9) regardless of language.**

Indian users universally read Latin digits for financial data, even on Hindi-language websites. The RBI, SEBI, SBI, and every major Indian financial institution does this. Rendering "Rs ५०,२१,५३६ Cr" in Devanagari digits would confuse more than it helps.

**Implementation:**
- `formatIndianNumber()`, `formatRsCrore()`, `formatLakhCrore()` remain language-agnostic
- Wrap numeric displays with `<span translate="no" lang="en">` to prevent browser auto-translate from mangling them
- The `translate="no"` attribute tells Chrome/Safari/Edge auto-translate to skip the element
- Unit labels like "Cr", "lakh crore", "LPA" get translated via i18n keys but stay adjacent to Latin-digit numbers

**Example output in Hindi:**
```
सरकार खर्च करती है Rs 50,65,345 करोड़
```
(Hindi text wrapping Latin-digit numbers with Hindi unit label "करोड़")

## Routing Strategy: Path Prefix

**Pattern**: `/:lang/route` with English as default (no prefix)

| English (default) | Hindi | Telugu |
|---|---|---|
| `/` | `/hi/` | `/te/` |
| `/explore` | `/hi/explore` | `/te/explore` |
| `/calculator` | `/hi/calculator` | `/te/calculator` |
| `/methodology` | `/hi/methodology` | `/te/methodology` |

**Why path prefix over query params or subdomains:**
- Google indexes each language version as a separate URL (critical for Indian-language SEO)
- `hreflang` tags link alternate versions correctly
- Users can share language-specific URLs
- Simpler than subdomains (`hi.indiabudgetexplorer.in` needs DNS config)

**Implementation:**
- Wrap `<Routes>` inside `<Route path="/:lang?">` where `lang` is optional
- `useParams().lang` resolves language; default to English when absent
- `LanguageProvider` component at the top of the tree calls `i18n.changeLanguage(lang)` on mount and route change
- Language switcher component in the header (dropdown with script names: हिन्दी, తెలుగు, தமிழ், etc.)

## Font Loading Strategy

Each Indian script requires its own font family. Loading all upfront would add 500KB+ to the initial bundle. Instead, load per-script fonts on demand.

| Language | Script | Font | Approximate size |
|----------|--------|------|-----------------|
| English | Latin | Inter (already loaded) | 0 KB extra |
| Hindi | Devanagari | Noto Sans Devanagari | ~45 KB woff2 |
| Telugu | Telugu | Noto Sans Telugu | ~40 KB woff2 |
| Tamil | Tamil | Noto Sans Tamil | ~35 KB woff2 |
| Kannada | Kannada | Noto Sans Kannada | ~40 KB woff2 |
| Malayalam | Malayalam | Noto Sans Malayalam | ~45 KB woff2 |

**Implementation:**
- Install `@fontsource-variable/noto-sans-devanagari` etc. as dependencies
- Create a `useScriptFont(lang)` hook that dynamically imports the CSS for the active language
- Add the Noto font family to `--font-body` CSS variable when a non-Latin language is active
- Font stack: `'Noto Sans Devanagari', 'Inter', system-ui, sans-serif` (for Hindi)
- Use `font-display: swap` to prevent FOIT (flash of invisible text)

## SEO for Multilingual Content

### hreflang Tags

Every page includes `<link rel="alternate" hreflang="x">` tags for all available languages:

```html
<link rel="alternate" hreflang="en" href="https://indiabudgetexplorer.in/" />
<link rel="alternate" hreflang="hi" href="https://indiabudgetexplorer.in/hi/" />
<link rel="alternate" hreflang="te" href="https://indiabudgetexplorer.in/te/" />
<link rel="alternate" hreflang="x-default" href="https://indiabudgetexplorer.in/" />
```

Added via `SEOHead` component using react-helmet-async.

### Prerender Expansion

Current prerendering: 4 routes = 4 HTML files.
After i18n: 6 languages x 4 routes = 24 HTML files.

Update `scripts/prerender.mjs` to iterate over `['', 'hi', 'te', 'ta', 'kn', 'ml']` and visit each route with each language prefix.

### Sitemap Expansion

`sitemap.xml` grows from 4 URLs to 24 URLs + `xhtml:link` alternates per entry.

### JSON-LD per Language

`inLanguage` field in WebApplication and Dataset schemas changes per language version.

## Translation Workflow

### Phase 1: Machine Translation (launch)

Use a translation API (Google Cloud Translation or DeepL) to generate initial Hindi translations from the English source keys. Machine translation for UI labels and short phrases is good enough for launch.

**Exception — human context strings**: The `humanContext` field in expenditure data (e.g., "= 73 school mid-day meals") contains culturally specific analogies. These need human review at minimum.

### Phase 2: Community Review

Once live, add a small "Suggest better translation" link on each page that opens a GitHub issue template pre-filled with the current translation and the page/key context. Crowdsource corrections from the community.

### Phase 3: Professional Translation (if funded)

For South Indian languages (Telugu, Tamil, Kannada, Malayalam), hire native speakers to review and correct machine translations. Budget-related terminology varies by region.

## File Changes

| File | Change |
|------|--------|
| `package.json` | Add `i18next`, `react-i18next`, `i18next-http-backend`, `i18next-browser-languagedetector`, per-script `@fontsource-variable/noto-sans-*` |
| `src/lib/i18n.ts` | Create — i18next configuration, backend loading, language detection |
| `src/components/i18n/LanguageProvider.tsx` | Create — syncs URL lang param with i18next, manages font loading |
| `src/components/i18n/LanguageSwitcher.tsx` | Create — dropdown in header showing script names |
| `src/hooks/useScriptFont.ts` | Create — dynamic font loading per language |
| `src/main.tsx` | Import i18n config, wrap app in `<Suspense>` for async namespace loading |
| `src/App.tsx` | Add `/:lang?` wrapper route, insert `LanguageProvider` |
| `src/components/layout/Header.tsx` | Add `LanguageSwitcher` component |
| `src/components/seo/SEOHead.tsx` | Add `hreflang` alternates, localized title/description from i18n |
| `src/pages/*.tsx` | Replace hardcoded strings with `t('key')` calls |
| `src/components/**/*.tsx` | Replace hardcoded strings with `t('key')` calls |
| `src/components/viz/*.tsx` | Wrap numeric outputs with `translate="no"` spans |
| `public/locales/en/*.json` | Create — 7 English namespace files (source of truth) |
| `public/locales/hi/*.json` | Create — 7 Hindi namespace files |
| `scripts/prerender.mjs` | Expand to prerender all language × route combinations |
| `public/sitemap.xml` | Expand with hreflang alternates |
| `public/llms.txt` | Add note about multilingual support |
| `index.html` | Add `lang` attribute dynamically (or default `en`) |

## Implementation Phases

### Phase 1: Infrastructure (no visible changes)
1. Install dependencies
2. Create `src/lib/i18n.ts` with i18next config
3. Create `LanguageProvider` and font hook
4. Add `/:lang?` route wrapper
5. Test: English still works identically

### Phase 2: Extract English Strings
1. Extract all hardcoded strings from components into `public/locales/en/*.json`
2. Replace with `useTranslation()` + `t('key')` calls
3. Wrap numeric displays with `translate="no"`
4. Test: Site renders identically with English loaded from JSON

### Phase 3: Hindi Launch
1. Generate Hindi translations (machine + human review for humanContext)
2. Install Noto Sans Devanagari font
3. Add language switcher to header
4. Update SEOHead with hreflang
5. Expand prerendering to 8 pages (4 EN + 4 HI)
6. Test: Full Hindi experience works, numbers stay Latin

### Phase 4: South Indian Languages
1. Telugu, Tamil, Kannada, Malayalam translations
2. Per-script font packages
3. Expand prerendering to 24 pages
4. Full sitemap with alternates

## Open Questions

1. **Human context strings**: "= 73 school mid-day meals" — should these be machine-translated or professionally translated? They're the most culturally loaded strings in the app.
2. **URL slugs**: Should routes be transliterated? (`/hi/khoj` instead of `/hi/explore`) — adds complexity for minimal SEO benefit, not recommended.
3. **RTL support**: Not needed for any of the 5 target languages. Devanagari, Telugu, Tamil, Kannada, and Malayalam are all LTR.
4. **Data file translation**: The JSON data files (expenditure.json, etc.) contain ministry and scheme names in English. Should we maintain parallel translated data files, or translate at render time? Render-time is simpler and the data pipeline stays language-agnostic.
