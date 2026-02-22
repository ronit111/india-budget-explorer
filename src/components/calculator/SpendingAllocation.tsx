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
      <div className="bg-[var(--color-bg-raised)] rounded-xl p-6 text-center">
        <p className="text-[var(--color-text-muted)]">
          No tax payable at this income level. Increase your income to see allocation.
        </p>
      </div>
    );
  }

  const maxPercent = Math.max(...shares.shares.map((s) => s.percentOfExpenditure));

  return (
    <div className="space-y-3">
      <p className="text-sm text-[var(--color-text-muted)] mb-4">
        Your Rs {formatIndianNumber(totalTax)} in taxes funds:
      </p>

      {shares.shares.map((share) => {
        const amount = Math.round(totalTax * (share.percentOfExpenditure / 100));

        return (
          <div key={share.id} className="group">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-[var(--color-text-secondary)] font-medium">
                {share.name}
              </span>
              <span className="font-mono text-[var(--color-text-primary)]">
                Rs {formatIndianNumber(amount)}
              </span>
            </div>
            <div className="relative h-6 bg-[var(--color-bg-raised)] rounded-full overflow-hidden">
              <motion.div
                className="absolute left-0 top-0 h-full rounded-full"
                style={{ backgroundColor: COLORS[share.id] || '#6B7280' }}
                initial={{ width: 0 }}
                animate={{ width: `${(share.percentOfExpenditure / maxPercent) * 100}%` }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              />
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-white font-medium z-10">
                {share.percentOfExpenditure}%
              </span>
            </div>
            {share.humanContext && share.humanContextMultiplier > 0 && amount > 0 && (
              <p className="text-xs text-[var(--color-text-muted)] mt-0.5 ml-1">
                ={' '}
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
