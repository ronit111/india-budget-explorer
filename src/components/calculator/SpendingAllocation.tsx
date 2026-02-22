import { motion } from 'framer-motion';
import type { ExpenditureSharesData } from '../../lib/data/schema.ts';
import { formatIndianNumber } from '../../lib/format.ts';

interface SpendingAllocationProps {
  totalTax: number;
  shares: ExpenditureSharesData;
}

const COLORS: Record<string, string> = {
  'transfers-to-states': '#3B82F6',
  'interest-payments': '#6B7280',
  defence: '#EF4444',
  subsidies: '#F59E0B',
  'road-transport': '#8B5CF6',
  railways: '#06B6D4',
  'home-affairs': '#EC4899',
  'rural-development': '#10B981',
  agriculture: '#84CC16',
  education: '#F97316',
  health: '#14B8A6',
  other: '#6366F1',
};

export function SpendingAllocation({ totalTax, shares }: SpendingAllocationProps) {
  if (totalTax === 0) {
    return (
      <div className="rounded-lg p-6 text-center" style={{ background: 'var(--bg-raised)' }}>
        <p style={{ color: 'var(--text-muted)' }}>
          No tax payable at this income level. Increase your income to see allocation.
        </p>
      </div>
    );
  }

  const maxPercent = Math.max(...shares.shares.map((s) => s.percentOfExpenditure));

  return (
    <div className="space-y-3">
      <p className="text-annotation mb-4">
        Your Rs {formatIndianNumber(totalTax)} in taxes funds:
      </p>

      {shares.shares.map((share, i) => {
        const amount = Math.round(totalTax * (share.percentOfExpenditure / 100));
        const color = COLORS[share.id] || '#6B7280';
        const barPct = (share.percentOfExpenditure / maxPercent) * 100;

        return (
          <div key={share.id}>
            <div className="flex items-center justify-between text-sm mb-1.5">
              <span className="font-medium" style={{ color: 'var(--text-secondary)' }}>
                {share.name}
              </span>
              <span className="font-mono text-xs" style={{ color: 'var(--text-primary)' }}>
                Rs {formatIndianNumber(amount)}
              </span>
            </div>

            {/* 32px bar with % inside */}
            <div
              className="relative h-8 rounded-md overflow-hidden"
              style={{ background: 'var(--bg-raised)' }}
            >
              <motion.div
                className="absolute left-0 top-0 h-full rounded-md flex items-center"
                style={{ backgroundColor: color }}
                initial={{ width: 0 }}
                animate={{ width: `${barPct}%` }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: i * 0.04 }}
              >
                <span className="text-xs font-medium text-white ml-3 whitespace-nowrap">
                  {share.percentOfExpenditure}%
                </span>
              </motion.div>
            </div>

            {/* humanContext as annotation chip */}
            {share.humanContext && share.humanContextMultiplier > 0 && amount > 0 && (
              <p
                className="text-xs mt-1 ml-1 inline-block px-2 py-0.5 rounded-full"
                style={{ color: 'var(--text-muted)', background: 'var(--bg-raised)' }}
              >
                ≈{' '}
                {Math.round(
                  (amount / totalTax) * share.humanContextMultiplier * totalTax * 0.00001
                ) || '~'}{' '}
                {share.humanContext}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
