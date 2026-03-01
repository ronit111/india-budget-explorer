import { registerChart } from '../chartRegistry.ts';
import type { GDPGrowthData, InflationData, FiscalData, ExternalData, SectorsData } from '../data/schema.ts';

const DOMAIN = 'economy';
const ACCENT = '#4AEADC';
const YEAR = '2025-26';
const base = `/data/economy/${YEAR}`;

registerChart({
  domain: DOMAIN,
  sectionId: 'growth',
  title: 'Real GDP Growth',
  source: 'World Bank, NSO',
  accentColor: ACCENT,
  dataFiles: [`${base}/gdp-growth.json`],
  chartType: 'line',
  toTabular: (data) => {
    const d = data as GDPGrowthData;
    return {
      headers: ['Year', 'GDP Growth (%)'],
      rows: d.series.map((p) => [p.year, p.value]),
    };
  },
  heroStat: (data) => {
    const d = data as GDPGrowthData;
    const latest = d.series[d.series.length - 1];
    if (!latest) return null;
    return {
      label: 'GDP Growth Rate',
      value: `${latest.value.toFixed(1)}%`,
      context: `India's real GDP growth in ${latest.year}`,
    };
  },
});

registerChart({
  domain: DOMAIN,
  sectionId: 'inflation',
  title: 'CPI Inflation',
  source: 'World Bank, RBI',
  accentColor: ACCENT,
  dataFiles: [`${base}/inflation.json`],
  chartType: 'line',
  toTabular: (data) => {
    const d = data as InflationData;
    return {
      headers: ['Period', 'CPI Headline (%)', 'Food CPI (%)', 'Core CPI (%)'],
      rows: d.series.map((p) => [p.period, p.cpiHeadline, p.cpiFood ?? '', p.cpiCore ?? '']),
    };
  },
  heroStat: (data) => {
    const d = data as InflationData;
    const latest = d.series[d.series.length - 1];
    if (!latest) return null;
    return {
      label: 'CPI Inflation',
      value: `${latest.cpiHeadline.toFixed(1)}%`,
      context: `Headline CPI inflation as of ${latest.period}. RBI target: ${d.targetBand.lower}-${d.targetBand.upper}%.`,
    };
  },
});

registerChart({
  domain: DOMAIN,
  sectionId: 'fiscal',
  title: 'Fiscal Position',
  source: 'World Bank, NSO',
  accentColor: ACCENT,
  dataFiles: [`${base}/fiscal.json`],
  chartType: 'line',
  toTabular: (data) => {
    const d = data as FiscalData;
    return {
      headers: ['Year', 'Fiscal Deficit (% GDP)', 'Revenue Deficit (% GDP)', 'Primary Deficit (% GDP)'],
      rows: d.series.map((p) => [p.year, p.fiscalDeficitPctGDP, p.revenueDeficitPctGDP, p.primaryDeficitPctGDP]),
    };
  },
});

registerChart({
  domain: DOMAIN,
  sectionId: 'external',
  title: 'External Sector',
  source: 'World Bank, RBI',
  accentColor: ACCENT,
  dataFiles: [`${base}/external.json`],
  chartType: 'area',
  toTabular: (data) => {
    const d = data as ExternalData;
    return {
      headers: ['Year', 'Exports (% GDP)', 'Imports (% GDP)', 'Trade Balance (% GDP)', 'CAD (% GDP)'],
      rows: d.series.map((p) => [p.year, p.exports, p.imports, p.tradeBalance, p.cadPctGDP]),
    };
  },
});

registerChart({
  domain: DOMAIN,
  sectionId: 'sectors',
  title: 'Sectoral Composition',
  source: 'World Bank, NSO',
  accentColor: ACCENT,
  dataFiles: [`${base}/sectors.json`],
  chartType: 'area',
  toTabular: (data) => {
    const d = data as SectorsData;
    return {
      headers: ['Sector', 'Current Growth (%)', '5-Year Avg (%)', 'GVA Share (%)'],
      rows: d.sectors.map((s) => [s.name, s.currentGrowth, s.fiveYearAvg, s.gvaShare]),
    };
  },
});
