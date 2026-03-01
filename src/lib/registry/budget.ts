import { registerChart } from '../chartRegistry.ts';
import type {
  ReceiptsData,
  ExpenditureData,
  SankeyData,
  TreemapData,
  StatewiseData,
  BudgetTrendsData,
  BudgetVsActualData,
  BudgetSummary,
} from '../data/schema.ts';

const DOMAIN = 'budget';
const ACCENT = '#FF6B35';
const YEAR = '2025-26';
const base = `/data/budget/${YEAR}`;

registerChart({
  domain: DOMAIN,
  sectionId: 'revenue',
  title: 'Revenue & Receipts',
  source: 'Union Budget 2025-26, indiabudget.gov.in',
  accentColor: ACCENT,
  dataFiles: [`${base}/receipts.json`],
  chartType: 'waffle',
  toTabular: (data) => {
    const d = data as ReceiptsData;
    return {
      headers: ['Source', 'Amount (Rs Cr)', '% of Total'],
      rows: d.categories.map((c) => [c.name, c.amount, c.percentOfTotal]),
    };
  },
  heroStat: (data) => {
    const d = data as ReceiptsData;
    return {
      label: 'Total Government Receipts',
      value: `Rs ${(d.total / 100000).toFixed(1)} lakh crore`,
      context: `Union Budget ${d.year} total receipts`,
    };
  },
});

registerChart({
  domain: DOMAIN,
  sectionId: 'expenditure',
  title: 'Ministry-wise Expenditure',
  source: 'Union Budget 2025-26, indiabudget.gov.in',
  accentColor: ACCENT,
  dataFiles: [`${base}/treemap.json`],
  chartType: 'treemap',
  toTabular: (data) => {
    const d = data as TreemapData;
    const rows: (string | number)[][] = [];
    function walk(node: TreemapData['root'], depth: number) {
      if (node.value !== undefined) {
        rows.push([node.name, node.value, node.percentOfTotal ?? '']);
      }
      node.children?.forEach((c) => walk(c as TreemapData['root'], depth + 1));
    }
    walk(d.root, 0);
    return { headers: ['Ministry/Scheme', 'Amount (Rs Cr)', '% of Total'], rows };
  },
});

registerChart({
  domain: DOMAIN,
  sectionId: 'deficit',
  title: 'Fiscal Deficit — The Borrowed Rupee',
  source: 'Union Budget 2025-26, Budget at a Glance',
  accentColor: ACCENT,
  dataFiles: [`${base}/summary.json`],
  chartType: 'custom',
  toTabular: (data) => {
    const d = data as BudgetSummary;
    const paisaEarned = Math.round((d.totalReceipts / d.totalExpenditure) * 100);
    return {
      headers: ['Metric', 'Value'],
      rows: [
        ['Total Expenditure (Rs Cr)', d.totalExpenditure],
        ['Total Receipts (Rs Cr)', d.totalReceipts],
        ['Fiscal Deficit (Rs Cr)', d.fiscalDeficit],
        ['Fiscal Deficit (% GDP)', d.fiscalDeficitPercentGDP],
        ['Paise Earned per Rupee', paisaEarned],
        ['Paise Borrowed per Rupee', 100 - paisaEarned],
      ],
    };
  },
  heroStat: (data) => {
    const d = data as BudgetSummary;
    const paisaBorrowed = 100 - Math.round((d.totalReceipts / d.totalExpenditure) * 100);
    return {
      label: 'Borrowed per Rupee',
      value: `${paisaBorrowed} paise`,
      context: `For every rupee the government spends, ${paisaBorrowed} paise is borrowed. Fiscal deficit: ${d.fiscalDeficitPercentGDP}% of GDP.`,
    };
  },
});

registerChart({
  domain: DOMAIN,
  sectionId: 'flow',
  title: 'Revenue to Expenditure Flow',
  source: 'Union Budget 2025-26, indiabudget.gov.in',
  accentColor: ACCENT,
  dataFiles: [`${base}/sankey.json`],
  chartType: 'sankey',
  toTabular: (data) => {
    const d = data as SankeyData;
    return {
      headers: ['From', 'To', 'Amount (Rs Cr)'],
      rows: d.links.map((l) => {
        const fromNode = d.nodes.find((n) => n.id === l.source);
        const toNode = d.nodes.find((n) => n.id === l.target);
        return [fromNode?.name ?? l.source, toNode?.name ?? l.target, l.value];
      }),
    };
  },
});

registerChart({
  domain: DOMAIN,
  sectionId: 'map',
  title: 'State-wise Budget Allocation',
  source: 'Union Budget 2025-26, indiabudget.gov.in',
  accentColor: ACCENT,
  dataFiles: [`${base}/statewise.json`],
  chartType: 'choropleth',
  toTabular: (data) => {
    const d = data as StatewiseData;
    return {
      headers: ['State', 'Allocation (Rs Cr)', 'Per Capita (Rs)'],
      rows: d.states.map((s) => [s.name, s.transfer, s.perCapita]),
    };
  },
});

registerChart({
  domain: DOMAIN,
  sectionId: 'trends',
  title: '20-Year Budget Trends',
  source: 'Budget at a Glance, indiabudget.gov.in',
  accentColor: ACCENT,
  dataFiles: [`${base}/trends.json`],
  chartType: 'line',
  toTabular: (data) => {
    const d = data as BudgetTrendsData;
    return {
      headers: ['Year', 'Expenditure (Rs Cr)', 'Receipts (Rs Cr)', 'Fiscal Deficit (% GDP)', 'Revenue Deficit (% GDP)'],
      rows: d.series.map((p) => [p.year, p.expenditure, p.receipts, p.fiscalDeficitPctGDP, p.revenueDeficitPctGDP]),
    };
  },
  heroStat: (data) => {
    const d = data as BudgetTrendsData;
    const latest = d.series[d.series.length - 1];
    if (!latest) return null;
    return {
      label: 'Fiscal Deficit Target',
      value: `${latest.fiscalDeficitPctGDP}% of GDP`,
      context: `FY ${latest.year} fiscal deficit target`,
    };
  },
});

registerChart({
  domain: DOMAIN,
  sectionId: 'budget-vs-actual',
  title: 'Budget vs Actual Spending',
  source: 'Budget at a Glance, indiabudget.gov.in',
  accentColor: ACCENT,
  dataFiles: [`${base}/budget-vs-actual.json`],
  chartType: 'custom',
  toTabular: (data) => {
    const d = data as BudgetVsActualData;
    const rows: (string | number)[][] = [];
    for (const m of d.ministries) {
      for (const yr of m.history) {
        rows.push([m.name, yr.year, yr.be, yr.re ?? '', yr.actual ?? '']);
      }
    }
    return { headers: ['Ministry', 'Year', 'Budget Estimate', 'Revised Estimate', 'Actual'], rows };
  },
});

registerChart({
  domain: DOMAIN,
  sectionId: 'percapita',
  title: 'Per Capita Budget Breakdown',
  source: 'Union Budget 2025-26, indiabudget.gov.in',
  accentColor: ACCENT,
  dataFiles: [`${base}/expenditure.json`],
  chartType: 'horizontal-bar',
  toTabular: (data) => {
    const d = data as ExpenditureData;
    return {
      headers: ['Ministry', 'Per Capita (Rs)', '% of Total'],
      rows: d.ministries
        .sort((a, b) => b.perCapita - a.perCapita)
        .map((m) => [m.name, m.perCapita, m.percentOfTotal]),
    };
  },
});
