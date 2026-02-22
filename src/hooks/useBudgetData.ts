import { useState, useEffect } from 'react';
import {
  loadSummary,
  loadReceipts,
  loadExpenditure,
  loadSankey,
  loadTreemap,
  loadStatewise,
  loadSchemes,
} from '../lib/dataLoader.ts';
import type {
  BudgetSummary,
  ReceiptsData,
  ExpenditureData,
  SankeyData,
  TreemapData,
  StatewiseData,
  SchemesData,
} from '../lib/data/schema.ts';

interface BudgetData {
  summary: BudgetSummary | null;
  receipts: ReceiptsData | null;
  expenditure: ExpenditureData | null;
  sankey: SankeyData | null;
  treemap: TreemapData | null;
  statewise: StatewiseData | null;
  schemes: SchemesData | null;
  loading: boolean;
  error: string | null;
}

export function useBudgetData(year: string): BudgetData {
  const [data, setData] = useState<BudgetData>({
    summary: null,
    receipts: null,
    expenditure: null,
    sankey: null,
    treemap: null,
    statewise: null,
    schemes: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;
    setData((d) => ({ ...d, loading: true, error: null }));

    Promise.all([
      loadSummary(year),
      loadReceipts(year),
      loadExpenditure(year),
      loadSankey(year),
      loadTreemap(year),
      loadStatewise(year),
      loadSchemes(year),
    ])
      .then(([summary, receipts, expenditure, sankey, treemap, statewise, schemes]) => {
        if (!cancelled) {
          setData({
            summary,
            receipts,
            expenditure,
            sankey,
            treemap,
            statewise,
            schemes,
            loading: false,
            error: null,
          });
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setData((d) => ({ ...d, loading: false, error: String(err) }));
        }
      });

    return () => {
      cancelled = true;
    };
  }, [year]);

  return data;
}
