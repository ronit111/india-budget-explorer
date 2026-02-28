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
  note?: string
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
  note?: string
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

// ─── Economic Survey Summary ──────────────────────────────────────
export interface EconomySummary {
  year: string;
  surveyDate: string;
  realGDPGrowth: number;
  nominalGDP: number;
  projectedGrowthLow: number;
  projectedGrowthHigh: number;
  cpiInflation: number;
  fiscalDeficitPercentGDP: number;
  currentAccountDeficitPercentGDP: number;
  population: number;
  perCapitaGDP: number;
  lastUpdated: string;
  source: string;
}

// ─── Time Series (shared) ─────────────────────────────────────────
export interface TimeSeriesPoint {
  year: string;
  value: number;
  label?: string;
}

// ─── GDP Growth ───────────────────────────────────────────────────
export interface GDPGrowthData {
  year: string;
  indicator: string;
  unit: string;
  series: TimeSeriesPoint[];
  source: string;
}

// ─── Inflation ────────────────────────────────────────────────────
export interface InflationSeries {
  period: string;
  cpiHeadline: number;
  cpiFood: number | null;
  cpiCore: number | null;
}

export interface InflationData {
  year: string;
  targetBand: { lower: number; upper: number };
  series: InflationSeries[];
  source: string;
}

// ─── Fiscal ───────────────────────────────────────────────────────
export interface FiscalYearData {
  year: string;
  fiscalDeficitPctGDP: number;
  revenueDeficitPctGDP: number;
  primaryDeficitPctGDP: number;
}

export interface FiscalData {
  year: string;
  targetFiscalDeficit: number;
  series: FiscalYearData[];
  source: string;
}

// ─── External Sector ──────────────────────────────────────────────
export interface ExternalYearData {
  year: string;
  exports: number;
  imports: number;
  tradeBalance: number;
  cadPctGDP: number;
  forexReserves: number;
}

export interface ExternalData {
  year: string;
  series: ExternalYearData[];
  source: string;
}

// ─── Sectors ──────────────────────────────────────────────────────
export interface SectorGrowth {
  id: string;
  name: string;
  currentGrowth: number;
  fiveYearAvg: number;
  gvaShare: number;
}

export interface SectorsData {
  year: string;
  sectors: SectorGrowth[];
  source: string;
}

// ─── Economic Indicators (Explorer) ──────────────────────────────
export interface EconomicIndicator {
  id: string;
  name: string;
  category: string;
  unit: string;
  series: TimeSeriesPoint[];
  source: string;
}

export interface IndicatorsData {
  year: string;
  indicators: EconomicIndicator[];
}

// ─── RBI Data Domain ────────────────────────────────────────────

export interface RBISummary {
  year: string;
  repoRate: number;
  repoRateDate: string;
  stance: string;
  crr: number;
  slr: number;
  cpiLatest: number | null;
  forexReservesUSD: number | null;
  broadMoneyGrowth: number | null;
  lastUpdated: string;
  source: string;
}

export interface PolicyDecision {
  date: string;
  rate: number;
  change: number;
  stance: string;
}

export interface MonetaryPolicyData {
  year: string;
  currentRate: number;
  currentStance: string;
  decisions: PolicyDecision[];
  crrHistory: TimeSeriesPoint[];
  source: string;
}

export interface RBITimeSeries {
  series: TimeSeriesPoint[];
  unit: string;
  source: string;
}

export interface LiquidityData {
  year: string;
  broadMoneyGrowth: RBITimeSeries;
  broadMoneyPctGDP: RBITimeSeries;
}

export interface CreditData {
  year: string;
  domesticCreditPctGDP: RBITimeSeries;
  privateCreditPctGDP: RBITimeSeries;
  lendingRate: RBITimeSeries;
  depositRate: RBITimeSeries;
}

export interface ForexData {
  year: string;
  reservesUSD: RBITimeSeries;
  exchangeRate: RBITimeSeries;
}

export interface RBIIndicator {
  id: string;
  name: string;
  category: string;
  unit: string;
  series: TimeSeriesPoint[];
  source: string;
}

export interface RBIIndicatorsData {
  year: string;
  indicators: RBIIndicator[];
}

// ─── State Finances Domain ──────────────────────────────────────

export interface StateGSDPEntry {
  id: string;
  name: string;
  gsdp: number;              // Rs crore, current prices
  gsdpConstant: number | null; // Rs crore, constant prices (2011-12 base)
  growthRate: number;         // % annual growth
  perCapitaGsdp: number;      // Rs
  population: number;         // lakhs
}

export interface GSDPData {
  year: string;
  baseYear: string;
  states: StateGSDPEntry[];
  source: string;
}

export interface StateRevenueEntry {
  id: string;
  name: string;
  ownTaxRevenue: number;        // Rs crore
  centralTransfers: number;     // Rs crore
  totalRevenue: number;         // Rs crore
  selfSufficiencyRatio: number; // own/total as %
}

export interface RevenueData {
  year: string;
  states: StateRevenueEntry[];
  source: string;
}

export interface StateFiscalEntry {
  id: string;
  name: string;
  fiscalDeficitPctGsdp: number;
  debtToGsdp: number;
}

export interface FiscalHealthData {
  year: string;
  states: StateFiscalEntry[];
  source: string;
}

export interface StatesSummary {
  year: string;
  topGsdpState: string;
  topGsdpValue: number;       // Rs lakh crore
  nationalGsdpTotal: number;  // Rs lakh crore
  growthRange: string;        // e.g. "3.2% – 14.1%"
  averagePerCapita: number;   // Rs
  stateCount: number;
  lastUpdated: string;
  source: string;
}

export interface StateValue {
  id: string;
  name: string;
  value: number;
}

export interface StatesIndicator {
  id: string;
  name: string;
  category: string;           // 'gsdp' | 'revenue' | 'fiscal' | 'percapita'
  unit: string;
  states: StateValue[];
  source: string;
}

export interface StatesIndicatorsData {
  year: string;
  indicators: StatesIndicator[];
}

// ─── Census & Demographics Domain ──────────────────────────────

export interface CensusSummary {
  year: string;
  totalPopulation: number;
  literacyRate: number;
  urbanizationRate: number;
  sexRatio: number;            // females per 1000 males
  populationGrowthRate: number;
  lastUpdated: string;
  source: string;
}

export interface StatePopulation {
  id: string;
  name: string;
  population: number;
  density: number;             // per sq km
  urbanPercent: number;
  ruralPercent: number;
  decadalGrowth: number;       // %
}

export interface PopulationData {
  year: string;
  states: StatePopulation[];
  source: string;
}

export interface StateLiteracy {
  id: string;
  name: string;
  overallRate: number;
  maleRate: number;
  femaleRate: number;
  genderGap: number;
}

export interface LiteracyData {
  year: string;
  states: StateLiteracy[];
  source: string;
}

export interface StateDemographics {
  id: string;
  name: string;
  sexRatio: number;
  urbanizationRate: number;
  growthRate: number;
}

export interface DemographicsData {
  year: string;
  states: StateDemographics[];
  source: string;
}

export interface HealthData {
  year: string;
  imrNational: TimeSeriesPoint[];
  lifeExpectancy: TimeSeriesPoint[];
  fertilityRate: TimeSeriesPoint[];
  source: string;
}

export interface CensusIndicator {
  id: string;
  name: string;
  category: string;
  unit: string;
  states: StateValue[];
  source: string;
}

export interface CensusIndicatorsData {
  year: string;
  indicators: CensusIndicator[];
}

// ─── Glossary (shared across domains) ──────────────────────────

export interface GlossaryTerm {
  id: string;
  term: string;
  simple: string;
  detail: string;
  inContext?: string;
  relatedTerms?: string[];
}

export interface GlossaryData {
  domain: 'budget' | 'economy' | 'rbi' | 'states' | 'census';
  year: string;
  terms: GlossaryTerm[];
}
