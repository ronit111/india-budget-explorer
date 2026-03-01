import { registerChart } from '../chartRegistry.ts';
import type { MonetaryPolicyData, LiquidityData, CreditData, ForexData } from '../data/schema.ts';

const DOMAIN = 'rbi';
const ACCENT = '#4AEADC';
const YEAR = '2025-26';
const base = `/data/rbi/${YEAR}`;

registerChart({
  domain: DOMAIN,
  sectionId: 'monetary-policy',
  title: 'Repo Rate & Policy History',
  source: 'RBI Monetary Policy Statements',
  accentColor: ACCENT,
  dataFiles: [`${base}/monetary-policy.json`],
  chartType: 'line',
  toTabular: (data) => {
    const d = data as MonetaryPolicyData;
    return {
      headers: ['Date', 'Rate (%)', 'Change (bps)', 'Stance'],
      rows: d.decisions.map((p) => [p.date, p.rate, p.change * 100, p.stance]),
    };
  },
  heroStat: (data) => {
    const d = data as MonetaryPolicyData;
    return {
      label: 'RBI Repo Rate',
      value: `${d.currentRate}%`,
      context: `Current stance: ${d.currentStance}`,
    };
  },
});

registerChart({
  domain: DOMAIN,
  sectionId: 'inflation-target',
  title: 'Inflation Targeting',
  source: 'RBI, World Bank',
  accentColor: ACCENT,
  dataFiles: [`${base}/monetary-policy.json`],
  chartType: 'line',
  toTabular: (data) => {
    const d = data as MonetaryPolicyData;
    return {
      headers: ['Date', 'Repo Rate (%)'],
      rows: d.decisions.map((p) => [p.date, p.rate]),
    };
  },
});

registerChart({
  domain: DOMAIN,
  sectionId: 'liquidity',
  title: 'Money Supply & Liquidity',
  source: 'World Bank, RBI',
  accentColor: ACCENT,
  dataFiles: [`${base}/liquidity.json`],
  chartType: 'line',
  toTabular: (data) => {
    const d = data as LiquidityData;
    return {
      headers: ['Year', 'Broad Money Growth (%)', 'Broad Money (% GDP)'],
      rows: d.broadMoneyGrowth.series.map((p, i) => [
        p.year,
        p.value,
        d.broadMoneyPctGDP.series[i]?.value ?? '',
      ]),
    };
  },
});

registerChart({
  domain: DOMAIN,
  sectionId: 'credit',
  title: 'Credit & Interest Rates',
  source: 'World Bank, RBI',
  accentColor: ACCENT,
  dataFiles: [`${base}/credit.json`],
  chartType: 'line',
  toTabular: (data) => {
    const d = data as CreditData;
    return {
      headers: ['Year', 'Private Credit (% GDP)', 'Lending Rate (%)'],
      rows: d.privateCreditPctGDP.series.map((p, i) => [
        p.year,
        p.value,
        d.lendingRate.series[i]?.value ?? '',
      ]),
    };
  },
});

registerChart({
  domain: DOMAIN,
  sectionId: 'forex',
  title: 'Forex Reserves',
  source: 'World Bank, RBI',
  accentColor: ACCENT,
  dataFiles: [`${base}/forex.json`],
  chartType: 'line',
  toTabular: (data) => {
    const d = data as ForexData;
    return {
      headers: ['Year', 'Reserves (USD Billion)'],
      rows: d.reservesUSD.series.map((p) => [p.year, p.value]),
    };
  },
  heroStat: (data) => {
    const d = data as ForexData;
    const latest = d.reservesUSD.series[d.reservesUSD.series.length - 1];
    if (!latest) return null;
    return {
      label: 'Forex Reserves',
      value: `$${latest.value.toFixed(0)}B`,
      context: `India's foreign exchange reserves as of ${latest.year}`,
    };
  },
});

registerChart({
  domain: DOMAIN,
  sectionId: 'exchange-rate',
  title: 'Exchange Rate (INR/USD)',
  source: 'World Bank, RBI',
  accentColor: ACCENT,
  dataFiles: [`${base}/forex.json`],
  chartType: 'line',
  toTabular: (data) => {
    const d = data as ForexData;
    return {
      headers: ['Year', 'INR per USD'],
      rows: d.exchangeRate.series.map((p) => [p.year, p.value]),
    };
  },
});
