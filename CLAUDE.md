# Indian Data Project — Claude Instructions

## Project Overview
Open data platform for Indian citizens. React 19 + TypeScript + Vite 7 + Tailwind v4. Deployed on Vercel via GitHub push to `main`.

**Stack**: Zustand (state), Framer Motion (animation), D3 (visualizations: treemap, sankey, waffle), Canvas API (share card generation).

## QA Protocol — MANDATORY after UI/Interaction Changes

**"Build passing" is NOT a product check.** TypeScript compilation verifies types, not behavior. After any change to visual components, interactions, or layouts:

### 1. Browser Verification (use `mcp__claude-in-chrome__*` tools)
- Open the deployed/local page in Chrome
- Navigate to the specific section that changed
- **Interact with it**: click buttons, hover tooltips, drill into charts, scroll, resize
- Screenshot the result and visually verify against intent
- Test on both wide viewport and narrow viewport if layout changed

### 2. Interaction Checklist for Visualizations
- **Treemap**: Click each category. Verify breadcrumb updates correctly. Click breadcrumb to go back. Verify no duplicate entries in drill path.
- **Sankey**: Scroll full diagram. Verify no label overlap at any viewport size. Hover nodes to confirm tooltip positions.
- **Waffle chart**: Verify grouping order and color contrast of all legend items.
- **Calculator**: Toggle regime, adjust slider, check share card generation, test share/download flow.

### 3. What Counts as "Sanity Check"
A real sanity check includes ALL of:
- [ ] `npm run build` passes (compilation)
- [ ] `grep` for stale imports/references from deleted code (linkage)
- [ ] Browser open + visual inspection of changed pages (visual)
- [ ] Click/interact with changed elements (behavioral)
- [ ] Screenshot evidence before reporting "fixed" to user

Never report a fix as complete based only on build + grep.

## Design Identity
- Dark theme: void (#06080f) / raised (#0e1420) / surface (#131b27)
- Accents: saffron (#FF6B35), cyan (#4AEADC), gold (#FFC857)
- Typography: Inter (body), JetBrains Mono (data)
- Pattern: IIB-inspired minimal, data-forward, no decorative clutter

## Architecture Notes
- Tax data is hardcoded in `pipeline/src/main.py` and `src/lib/taxEngine.ts` (not from API)
- Budget data comes from CKAN API via pipeline
- Tax calculator is back-of-the-envelope, not ITR-level. Single "total deductions" input for Old Regime.
- Treemap uses one-level-at-a-time drill-down (`hierarchy.children`, not `hierarchy.leaves()`)

## Common Pitfalls (learned the hard way)
- **Treemap drill-down**: Never use `hierarchy.leaves()` with parent-fallback click logic. Show one level at a time via `hierarchy.children`. Only drill when the clicked node itself has children.
- **Sankey spacing**: With 12+ expenditure nodes, `nodePadding` below 20 causes label overlap. Hide value text for nodes shorter than 20px.
- **AnimatePresence + keyed SVGs**: `mode="wait"` on AnimatePresence with frequently re-keyed SVGs causes double-render. Remove `mode="wait"` or avoid AnimatePresence for chart containers.
- **Sticky positioning**: `overflow-x-auto` breaks `position: sticky`. Use `overflow-x: clip` instead.
- **Mobile nav**: Fixed bottom nav is h-14. Page content needs `pb-16 md:pb-0` to avoid clipping.
