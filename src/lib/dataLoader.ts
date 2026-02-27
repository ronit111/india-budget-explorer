import type {
  BudgetSummary,
  ReceiptsData,
  ExpenditureData,
  SankeyData,
  TreemapData,
  StatewiseData,
  SchemesData,
  TaxSlabsData,
  ExpenditureSharesData,
  YearIndex,
  EconomySummary,
  GDPGrowthData,
  InflationData,
  FiscalData,
  ExternalData,
  SectorsData,
  IndicatorsData,
} from './data/schema.ts';

const cache = new Map<string, unknown>();

async function fetchJson<T>(path: string): Promise<T> {
  if (cache.has(path)) return cache.get(path) as T;
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to fetch ${path}: ${res.status}`);
  const data = await res.json();
  cache.set(path, data);
  return data as T;
}

export const loadYears = () => fetchJson<YearIndex>('/data/years.json');

export const loadSummary = (year: string) =>
  fetchJson<BudgetSummary>(`/data/budget/${year}/summary.json`);

export const loadReceipts = (year: string) =>
  fetchJson<ReceiptsData>(`/data/budget/${year}/receipts.json`);

export const loadExpenditure = (year: string) =>
  fetchJson<ExpenditureData>(`/data/budget/${year}/expenditure.json`);

export const loadSankey = (year: string) =>
  fetchJson<SankeyData>(`/data/budget/${year}/sankey.json`);

export const loadTreemap = (year: string) =>
  fetchJson<TreemapData>(`/data/budget/${year}/treemap.json`);

export const loadStatewise = (year: string) =>
  fetchJson<StatewiseData>(`/data/budget/${year}/statewise.json`);

export const loadSchemes = (year: string) =>
  fetchJson<SchemesData>(`/data/budget/${year}/schemes.json`);

export const loadTaxSlabs = () =>
  fetchJson<TaxSlabsData>('/data/tax-calculator/slabs.json');

export const loadExpenditureShares = () =>
  fetchJson<ExpenditureSharesData>('/data/tax-calculator/expenditure-shares.json');

// ─── Economy Domain ──────────────────────────────────────────────
export const loadEconomySummary = (year: string) =>
  fetchJson<EconomySummary>(`/data/economy/${year}/summary.json`);

export const loadGDPGrowth = (year: string) =>
  fetchJson<GDPGrowthData>(`/data/economy/${year}/gdp-growth.json`);

export const loadInflation = (year: string) =>
  fetchJson<InflationData>(`/data/economy/${year}/inflation.json`);

export const loadFiscal = (year: string) =>
  fetchJson<FiscalData>(`/data/economy/${year}/fiscal.json`);

export const loadExternal = (year: string) =>
  fetchJson<ExternalData>(`/data/economy/${year}/external.json`);

export const loadSectors = (year: string) =>
  fetchJson<SectorsData>(`/data/economy/${year}/sectors.json`);

export const loadIndicators = (year: string) =>
  fetchJson<IndicatorsData>(`/data/economy/${year}/indicators.json`);
