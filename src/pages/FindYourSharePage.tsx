import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useCalculatorStore } from '../store/calculatorStore.ts';
import { loadTaxSlabs, loadExpenditureShares } from '../lib/dataLoader.ts';
import { calculateTax } from '../lib/taxEngine.ts';
import type { TaxSlabsData, ExpenditureSharesData } from '../lib/data/schema.ts';
import { formatIndianNumber, formatPercent } from '../lib/format.ts';
import { SEOHead } from '../components/seo/SEOHead.tsx';
import { IncomeInput } from '../components/calculator/IncomeInput.tsx';
import { TaxBreakdownDisplay } from '../components/calculator/TaxBreakdownDisplay.tsx';
import { SpendingAllocation } from '../components/calculator/SpendingAllocation.tsx';
import { ShareCard } from '../components/calculator/ShareCard.tsx';
import { SkeletonChart, SkeletonText } from '../components/ui/Skeleton.tsx';

export default function FindYourSharePage() {
  const { income, regime } = useCalculatorStore();
  const [slabs, setSlabs] = useState<TaxSlabsData | null>(null);
  const [shares, setShares] = useState<ExpenditureSharesData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([loadTaxSlabs(), loadExpenditureShares()]).then(([s, sh]) => {
      setSlabs(s);
      setShares(sh);
      setLoading(false);
    });
  }, []);

  const breakdown = useMemo(() => {
    if (!slabs) return null;
    return calculateTax(income, regime, slabs);
  }, [income, regime, slabs]);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-5xl mx-auto px-6 sm:px-8 py-10 md:py-14"
      >
        <SkeletonChart height={200} />
        <div className="grid lg:grid-cols-2 gap-8 mt-8">
          <SkeletonText lines={6} />
          <SkeletonText lines={8} />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen"
    >
      <SEOHead
        title="Income Tax Calculator FY 2025-26 — Where Your Tax Rupees Go"
        description="Calculate your income tax under Old and New regimes for FY 2025-26. See exactly how your tax money is allocated across Defence, Education, Health, and other ministries."
        path="/calculator"
      />

      {/* Page header */}
      <div className="max-w-5xl mx-auto px-6 sm:px-8 pt-10 md:pt-14">
        <div className="text-center mb-10">
          <h1
            className="text-3xl md:text-4xl font-bold mb-3"
            style={{ color: 'var(--text-primary)' }}
          >
            Find Your Share
          </h1>
          <p className="text-base max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Enter your annual income. See exactly how much tax you pay and where those rupees go.
          </p>
        </div>
      </div>

      {/* Income input card */}
      <div className="max-w-5xl mx-auto px-6 sm:px-8">
        <div
          className="rounded-xl p-6 md:p-8 mb-8"
          style={{ background: 'var(--bg-raised)', border: 'var(--border-subtle)' }}
        >
          <IncomeInput />
        </div>
      </div>

      {/* Share bar — sticky, compact, always visible when breakdown exists */}
      {breakdown && (
        <div
          className="sticky bottom-0 md:bottom-auto md:relative z-40 md:z-auto"
        >
          <div
            className="max-w-5xl mx-auto px-6 sm:px-8 py-3"
          >
            <div
              className="flex items-center justify-between rounded-xl px-5 py-3"
              style={{
                background: 'var(--bg-surface)',
                border: 'var(--border-subtle)',
                backdropFilter: 'blur(12px)',
              }}
            >
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                  Your tax: <span className="font-mono font-bold" style={{ color: 'var(--text-primary)' }}>Rs {formatIndianNumber(breakdown.totalTax)}</span>
                </span>
                <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
                  {formatPercent(breakdown.effectiveRate)} effective
                </span>
              </div>
              <ShareCard breakdown={breakdown} regime={regime} />
            </div>
          </div>
        </div>
      )}

      {/* Results grid */}
      <div className="max-w-5xl mx-auto px-6 sm:px-8 pb-16">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Tax Breakdown */}
          <div>
            {breakdown && (
              <div
                className="rounded-xl p-6 md:p-8"
                style={{ background: 'var(--bg-raised)', border: 'var(--border-subtle)' }}
              >
                <h2
                  className="text-sm font-semibold uppercase tracking-wider mb-5 flex items-center gap-2"
                  style={{ color: 'var(--text-muted)' }}
                >
                  <span className="w-2 h-2 rounded-full" style={{ background: 'var(--saffron)' }} />
                  Tax Breakdown
                </h2>
                <TaxBreakdownDisplay breakdown={breakdown} />
              </div>
            )}
          </div>

          {/* Right: Spending Allocation */}
          <div>
            {breakdown && shares && (
              <div
                className="rounded-xl p-6 md:p-8"
                style={{ background: 'var(--bg-raised)', border: 'var(--border-subtle)' }}
              >
                <h2
                  className="text-sm font-semibold uppercase tracking-wider mb-5 flex items-center gap-2"
                  style={{ color: 'var(--text-muted)' }}
                >
                  <span className="w-2 h-2 rounded-full" style={{ background: 'var(--cyan)' }} />
                  Where Your Tax Goes
                </h2>
                <SpendingAllocation totalTax={breakdown.totalTax} shares={shares} />
              </div>
            )}
          </div>
        </div>

        <p className="text-xs text-center mt-12" style={{ color: 'var(--text-muted)' }}>
          Source: Income Tax Act slab rates AY 2026-27 (FY 2025-26), Union Budget 2025-26
        </p>
      </div>
    </motion.div>
  );
}
