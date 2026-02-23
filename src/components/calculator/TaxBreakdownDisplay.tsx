import { motion } from 'framer-motion';
import type { TaxBreakdown } from '../../lib/taxEngine.ts';
import { formatIndianNumber, formatPercent } from '../../lib/format.ts';

interface TaxBreakdownDisplayProps {
  breakdown: TaxBreakdown;
}

export function TaxBreakdownDisplay({ breakdown }: TaxBreakdownDisplayProps) {
  return (
    <div className="space-y-5">
      {/* Metric cards with left accent borders */}
      <div className="grid grid-cols-2 gap-4">
        <div
          className="rounded-lg p-4"
          style={{
            background: 'var(--bg-surface)',
            borderLeft: '3px solid var(--saffron)',
          }}
        >
          <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>
            Total Tax
          </p>
          <p className="text-xl md:text-2xl font-bold font-mono" style={{ color: 'var(--saffron)' }}>
            Rs {formatIndianNumber(breakdown.totalTax)}
          </p>
        </div>
        <div
          className="rounded-lg p-4"
          style={{
            background: 'var(--bg-surface)',
            borderLeft: '3px solid var(--cyan)',
          }}
        >
          <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>
            Effective Rate
          </p>
          <p className="text-xl md:text-2xl font-bold font-mono" style={{ color: 'var(--cyan)' }}>
            {formatPercent(breakdown.effectiveRate)}
          </p>
        </div>
      </div>

      {breakdown.rebateApplied && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg px-4 py-3"
          style={{
            background: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
          }}
        >
          <p className="text-sm" style={{ color: '#6ee7b7' }}>
            Section 87A rebate applied. No tax payable.
          </p>
        </motion.div>
      )}

      {/* Slab breakdown */}
      <div className="rounded-lg overflow-hidden" style={{ background: 'var(--bg-surface)' }}>
        <div className="px-4 py-3" style={{ borderBottom: 'var(--border-divider)' }}>
          <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            Slab-by-slab Breakdown
          </p>
        </div>
        <div>
          <SlabRow
            label="Standard Deduction"
            value={`- Rs ${formatIndianNumber(breakdown.standardDeduction)}`}
            valueColor="var(--cyan)"
          />
          <SlabRow
            label="Taxable Income"
            value={`Rs ${formatIndianNumber(breakdown.taxableIncome)}`}
            highlight
          />
          {breakdown.slabwiseTax.map(({ slab, taxOnSlab }, i) => (
            <SlabRow
              key={i}
              label={
                slab.to
                  ? `Rs ${formatIndianNumber(slab.from)} – ${formatIndianNumber(slab.to)} @ ${slab.rate}%`
                  : `Above Rs ${formatIndianNumber(slab.from)} @ ${slab.rate}%`
              }
              value={`Rs ${formatIndianNumber(Math.round(taxOnSlab))}`}
            />
          ))}
          {breakdown.surcharge > 0 && (
            <SlabRow
              label="Surcharge"
              value={`Rs ${formatIndianNumber(Math.round(breakdown.surcharge))}`}
            />
          )}
          <SlabRow
            label="Health & Education Cess (4%)"
            value={`Rs ${formatIndianNumber(Math.round(breakdown.cess))}`}
          />
        </div>
      </div>
    </div>
  );
}

function SlabRow({
  label,
  value,
  valueColor,
  highlight,
}: {
  label: string;
  value: string;
  valueColor?: string;
  highlight?: boolean;
}) {
  return (
    <div
      className="px-4 py-3 flex justify-between items-center text-sm"
      style={{ borderBottom: 'var(--border-divider)' }}
    >
      <span style={{ color: highlight ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
        {label}
      </span>
      <span
        className="font-mono font-medium"
        style={{ color: valueColor || 'var(--text-primary)' }}
      >
        {value}
      </span>
    </div>
  );
}
