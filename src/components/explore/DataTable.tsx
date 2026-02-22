import { useState, useMemo, useCallback } from 'react';
import type { MinistryExpenditure, ExpenditureData } from '../../lib/data/schema.ts';
import { formatRsCrore, formatPercent, formatYoYChange, formatPerCapita } from '../../lib/format.ts';

interface DataTableProps {
  data: ExpenditureData;
}

type SortKey = 'name' | 'budgetEstimate' | 'percentOfTotal' | 'yoyChange' | 'perCapita';
type SortDir = 'asc' | 'desc';

export function DataTable({ data }: DataTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('budgetEstimate');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleSort = useCallback(
    (key: SortKey) => {
      if (sortKey === key) {
        setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
      } else {
        setSortKey(key);
        setSortDir('desc');
      }
    },
    [sortKey, sortDir]
  );

  const sorted = useMemo(() => {
    const arr = [...data.ministries];
    arr.sort((a, b) => {
      let av: string | number = 0;
      let bv: string | number = 0;

      switch (sortKey) {
        case 'name':
          av = a.name;
          bv = b.name;
          break;
        case 'budgetEstimate':
          av = a.budgetEstimate;
          bv = b.budgetEstimate;
          break;
        case 'percentOfTotal':
          av = a.percentOfTotal;
          bv = b.percentOfTotal;
          break;
        case 'yoyChange':
          av = a.yoyChange ?? 0;
          bv = b.yoyChange ?? 0;
          break;
        case 'perCapita':
          av = a.perCapita;
          bv = b.perCapita;
          break;
      }

      if (typeof av === 'string' && typeof bv === 'string') {
        return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
      }
      return sortDir === 'asc' ? (av as number) - (bv as number) : (bv as number) - (av as number);
    });
    return arr;
  }, [data.ministries, sortKey, sortDir]);

  const exportCSV = useCallback(() => {
    const headers = ['Ministry', 'Budget Estimate (Rs Cr)', '% of Total', 'YoY Change %', 'Per Capita (Rs)'];
    const rows = sorted.map((m) => [
      m.name,
      m.budgetEstimate,
      m.percentOfTotal,
      m.yoyChange ?? 'N/A',
      m.perCapita,
    ]);

    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `budget-${data.year}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [sorted, data.year]);

  const SortHeader = ({ label, field }: { label: string; field: SortKey }) => (
    <th
      className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider cursor-pointer hover:text-[var(--color-text-primary)] transition-colors select-none"
      onClick={() => handleSort(field)}
    >
      <span className="flex items-center gap-1">
        {label}
        {sortKey === field && (
          <span className="text-[var(--color-saffron)]">
            {sortDir === 'asc' ? '\u2191' : '\u2193'}
          </span>
        )}
      </span>
    </th>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-[var(--color-text-muted)]">
          {sorted.length} ministries / departments
        </p>
        <button
          onClick={exportCSV}
          className="px-4 py-2 rounded-lg text-sm font-medium bg-[var(--color-bg-raised)] text-[var(--color-text-secondary)] border border-[rgba(255,255,255,0.08)] hover:border-[var(--color-saffron)] transition-colors cursor-pointer"
        >
          Export CSV
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-[rgba(255,255,255,0.05)]">
        <table className="w-full">
          <thead className="bg-[var(--color-bg-raised)]">
            <tr>
              <SortHeader label="Ministry" field="name" />
              <SortHeader label="Budget (Rs Cr)" field="budgetEstimate" />
              <SortHeader label="% Total" field="percentOfTotal" />
              <SortHeader label="YoY" field="yoyChange" />
              <SortHeader label="Per Capita" field="perCapita" />
            </tr>
          </thead>
          <tbody className="divide-y divide-[rgba(255,255,255,0.03)]">
            {sorted.map((ministry) => (
              <MinistryRow
                key={ministry.id}
                ministry={ministry}
                total={data.total}
                expanded={expandedId === ministry.id}
                onToggle={() =>
                  setExpandedId(expandedId === ministry.id ? null : ministry.id)
                }
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MinistryRow({
  ministry,
  total,
  expanded,
  onToggle,
}: {
  ministry: MinistryExpenditure;
  total: number;
  expanded: boolean;
  onToggle: () => void;
}) {
  const yoy = formatYoYChange(ministry.yoyChange);
  const hasSchemes = ministry.schemes.length > 0;

  return (
    <>
      <tr
        className={`hover:bg-[var(--color-bg-raised)] transition-colors ${
          hasSchemes ? 'cursor-pointer' : ''
        }`}
        onClick={hasSchemes ? onToggle : undefined}
      >
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            {hasSchemes && (
              <span
                className="text-[var(--color-text-muted)] text-xs transition-transform"
                style={{
                  transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
                }}
              >
                &#9654;
              </span>
            )}
            <div>
              <p className="text-sm font-medium text-[var(--color-text-primary)]">
                {ministry.name}
              </p>
              <p className="text-xs text-[var(--color-text-muted)] mt-0.5 max-w-xs truncate">
                {ministry.humanContext}
              </p>
            </div>
          </div>
        </td>
        <td className="px-4 py-3 font-mono text-sm">{formatRsCrore(ministry.budgetEstimate)}</td>
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="w-16 h-1.5 bg-[var(--color-bg-hover)] rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--color-saffron)] rounded-full"
                style={{ width: `${(ministry.budgetEstimate / total) * 100 * 2}%` }}
              />
            </div>
            <span className="text-sm font-mono">{formatPercent(ministry.percentOfTotal)}</span>
          </div>
        </td>
        <td className="px-4 py-3">
          <span
            className={`text-sm font-mono ${
              yoy.isNeutral
                ? 'text-[var(--color-text-muted)]'
                : yoy.isPositive
                ? 'text-[var(--color-green)]'
                : 'text-[var(--color-red)]'
            }`}
          >
            {yoy.text}
          </span>
        </td>
        <td className="px-4 py-3 font-mono text-sm">{formatPerCapita(ministry.perCapita)}</td>
      </tr>

      {expanded && hasSchemes && (
        <tr>
          <td colSpan={5} className="bg-[rgba(255,107,53,0.02)] px-4 py-2">
            <div className="pl-8 space-y-2">
              <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">
                Major Schemes
              </p>
              {ministry.schemes.map((scheme) => (
                <div
                  key={scheme.id}
                  className="flex items-center justify-between text-sm py-1"
                >
                  <span className="text-[var(--color-text-secondary)]">{scheme.name}</span>
                  <span className="font-mono text-[var(--color-text-muted)]">
                    {formatRsCrore(scheme.amount)}
                  </span>
                </div>
              ))}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
