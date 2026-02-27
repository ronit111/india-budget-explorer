/**
 * Shared data schema — the interface contract between the Python pipeline
 * (System A) and the React frontend (System B).
 *
 * Pipeline produces JSON matching these types → Frontend consumes them.
 * Any change here must be reflected in both systems.
 */

// ─── Budget Summary ────────────────────────────────────────────────
export interface BudgetSummary {
  year: string                    // "2025-26"
  totalExpenditure: number        // in Rs crore
  totalReceipts: number           // in Rs crore
  revenueReceipts: number
  capitalReceipts: number
  fiscalDeficit: number
  fiscalDeficitPercentGDP: number // e.g. 4.4
  population: number              // estimated population for per-capita
  perCapitaExpenditure: number    // Rs per person per year
  perCapitaDailyExpenditure: number
  gdp: number                    // nominal GDP in Rs crore
  lastUpdated: string            // ISO date
  source: string                 // URL to original data
}

// ─── Revenue / Receipts ────────────────────────────────────────────
export interface RevenueCategory {
  id: string                     // e.g. "income-tax", "gst", "borrowings"
  name: string
  amount: number                 // Rs crore
  percentOfTotal: number
  previousYear: number | null    // for YoY comparison
  yoyChange: number | null       // percentage
}

export interface ReceiptsData {
  year: string
  total: number
  categories: RevenueCategory[]
}

// ─── Expenditure (Ministry-wise) ───────────────────────────────────
export interface SchemeAllocation {
  id: string
  name: string
  amount: number                 // Rs crore
}

export interface MinistryExpenditure {
  id: string                     // e.g. "defence", "education", "health"
  name: string                   // "Ministry of Defence"
  budgetEstimate: number
  revisedEstimate: number | null
  actualExpenditure: number | null
  percentOfTotal: number
  yoyChange: number | null
  perCapita: number              // Rs per person
  humanContext: string           // "Enough for X school meals"
  schemes: SchemeAllocation[]
}

export interface ExpenditureData {
  year: string
  total: number
  ministries: MinistryExpenditure[]
}

// ─── Sankey Diagram ────────────────────────────────────────────────
export interface SankeyNode {
  id: string
  name: string
  group: 'revenue' | 'center' | 'expenditure'
  value: number                  // Rs crore
}

export interface SankeyLink {
  source: string                 // node id
  target: string                 // node id
  value: number                  // Rs crore
  verified?: boolean
}

export interface SankeyData {
  year: string
  nodes: SankeyNode[]
  links: SankeyLink[]
}

// ─── Treemap ───────────────────────────────────────────────────────
export interface TreemapNode {
  name: string
  id: string
  value?: number                 // Rs crore (leaf nodes)
  percentOfTotal?: number
  children?: TreemapNode[]
}

export interface TreemapData {
  year: string
  root: TreemapNode
}

// ─── State-wise Transfers ──────────────────────────────────────────
export interface StateTransfer {
  id: string                     // state code e.g. "UP", "MH"
  name: string
  transfer: number               // Rs crore
  perCapita: number
  percentOfTotal: number
  population: number
}

export interface StatewiseData {
  year: string
  totalTransfers: number
  states: StateTransfer[]
}

// ─── Schemes ───────────────────────────────────────────────────────
export interface GovernmentScheme {
  id: string
  name: string
  ministry: string               // ministry id
  ministryName: string
  allocation: number             // Rs crore
  previousYear: number | null
  yoyChange: number | null
  humanContext: string           // plain-language description
}

export interface SchemesData {
  year: string
  schemes: GovernmentScheme[]
}

// ─── Old Regime Deductions ─────────────────────────────────────────
export interface OldRegimeDeductions {
  section80C: number;
  section80D_self: number;
  section80D_parents: number;
  section80CCD1B: number;
  section24b: number;
  hra: number;
  section80TTA: number;
}

// ─── Tax Calculator ────────────────────────────────────────────────
export interface TaxSlab {
  from: number
  to: number | null              // null = no upper limit
  rate: number                   // percentage
}

export interface TaxRegime {
  slabs: TaxSlab[]
  standardDeduction: number
  rebateLimit: number
  surchargeMaxRate?: number
}

export interface TaxSlabsData {
  assessmentYear: string         // "2026-27"
  financialYear: string          // "2025-26"
  regimes: {
    new: TaxRegime
    old: TaxRegime
  }
  cess: number                   // percentage (4%)
  surchargeSlabs: TaxSlab[]
}

export interface ExpenditureShare {
  id: string                     // ministry id
  name: string
  percentOfExpenditure: number
  humanContext: string           // "school mid-day meals", "ISRO launches"
  humanContextMultiplier: number // how many of that thing per Rs 1 of tax
}

export interface ExpenditureSharesData {
  year: string
  shares: ExpenditureShare[]
}

// ─── Available Years ───────────────────────────────────────────────
export interface YearIndex {
  years: string[]                // ["2025-26", "2024-25", ...]
  latest: string
}
