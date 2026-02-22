import type { TaxBreakdown } from '../../lib/taxEngine.ts';
import { formatIndianNumber, formatPercent } from '../../lib/format.ts';

interface TaxBreakdownDisplayProps {
  breakdown: TaxBreakdown;
}

export function TaxBreakdownDisplay({ breakdown }: TaxBreakdownDisplayProps) {
  return (
    <div className="space-y-4">
      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[var(--color-bg-raised)] rounded-xl p-4">
          <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">
            Total Tax
          </p>
          <p className="text-xl md:text-2xl font-bold font-mono text-[var(--color-saffron)] mt-1">
            Rs {formatIndianNumber(breakdown.totalTax)}
          </p>
        </div>
        <div className="bg-[var(--color-bg-raised)] rounded-xl p-4">
          <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">
            Effective Rate
          </p>
          <p className="text-xl md:text-2xl font-bold font-mono text-[var(--color-blue)] mt-1">
            {formatPercent(breakdown.effectiveRate)}
          </p>
        </div>
      </div>

      {breakdown.rebateApplied && (
        <div className="bg-[rgba(5,150,105,0.1)] border border-[rgba(5,150,105,0.2)] rounded-lg px-4 py-3">
          <p className="text-sm text-[var(--color-green-light)]">
            Section 87A rebate applied. No tax payable.
          </p>
        </div>
      )}

      {/* Slab breakdown */}
      <div className="bg-[var(--color-bg-raised)] rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-[rgba(255,255,255,0.05)]">
          <p className="text-sm font-semibold">Slab-by-slab Breakdown</p>
        </div>
        <div className="divide-y divide-[rgba(255,255,255,0.03)]">
          <div className="px-4 py-2 flex justify-between text-xs text-[var(--color-text-muted)]">
            <span>Standard Deduction</span>
            <span className="font-mono text-[var(--color-green)]">
              - Rs {formatIndianNumber(breakdown.standardDeduction)}
            </span>
          </div>
          <div className="px-4 py-2 flex justify-between text-xs text-[var(--color-text-muted)]">
            <span>Taxable Income</span>
            <span className="font-mono">Rs {formatIndianNumber(breakdown.taxableIncome)}</span>
          </div>
          {breakdown.slabwiseTax.map(({ slab, taxOnSlab }, i) => (
            <div key={i} className="px-4 py-2 flex justify-between text-xs">
              <span className="text-[var(--color-text-muted)]">
                {slab.to
                  ? `Rs ${formatIndianNumber(slab.from)} - ${formatIndianNumber(slab.to)}`
                  : `Above Rs ${formatIndianNumber(slab.from)}`}
                {' '}@ {slab.rate}%
              </span>
              <span className="font-mono text-[var(--color-text-secondary)]">
                Rs {formatIndianNumber(Math.round(taxOnSlab))}
              </span>
            </div>
          ))}
          {breakdown.surcharge > 0 && (
            <div className="px-4 py-2 flex justify-between text-xs">
              <span className="text-[var(--color-text-muted)]">Surcharge</span>
              <span className="font-mono text-[var(--color-text-secondary)]">
                Rs {formatIndianNumber(Math.round(breakdown.surcharge))}
              </span>
            </div>
          )}
          <div className="px-4 py-2 flex justify-between text-xs">
            <span className="text-[var(--color-text-muted)]">Health & Education Cess (4%)</span>
            <span className="font-mono text-[var(--color-text-secondary)]">
              Rs {formatIndianNumber(Math.round(breakdown.cess))}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
