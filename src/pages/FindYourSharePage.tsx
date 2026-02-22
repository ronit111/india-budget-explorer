import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useCalculatorStore } from '../store/calculatorStore.ts';
import { loadTaxSlabs, loadExpenditureShares } from '../lib/dataLoader.ts';
import { calculateTax } from '../lib/taxEngine.ts';
import type { TaxSlabsData, ExpenditureSharesData } from '../lib/data/schema.ts';
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
        className="max-w-5xl mx-auto px-4 py-8 md:py-12"
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
      className="max-w-5xl mx-auto px-4 py-8 md:py-12"
    >
      <SEOHead
        title="Income Tax Calculator FY 2025-26 — Where Your Tax Rupees Go"
        description="Calculate your income tax under Old and New regimes for FY 2025-26. See exactly how your tax money is allocated across Defence, Education, Health, and other ministries."
        path="/calculator"
      />

      <div className="text-center mb-10">
        <h1 className="text-composition mb-2">Find Your Share</h1>
        <p className="text-annotation max-w-xl mx-auto">
          Enter your annual income. See exactly how much tax you pay and where those rupees go.
        </p>
      </div>

      {/* Income input — full width hero */}
      <div
        className="rounded-xl p-6 md:p-8 mb-8"
        style={{ background: 'var(--bg-surface)', border: 'var(--border-subtle)' }}
      >
        <IncomeInput />
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left: Tax Breakdown */}
        <div className="space-y-8">
          {breakdown && (
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--text-muted)' }}>
                Tax Breakdown
              </h2>
              <TaxBreakdownDisplay breakdown={breakdown} />
            </div>
          )}
        </div>

        {/* Right: Spending + Share */}
        <div className="space-y-8">
          {breakdown && shares && (
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--text-muted)' }}>
                Where Your Tax Goes
              </h2>
              <SpendingAllocation totalTax={breakdown.totalTax} shares={shares} />
            </div>
          )}

          {breakdown && (
            <div
              className="rounded-xl p-6"
              style={{ background: 'var(--bg-surface)', border: 'var(--border-subtle)' }}
            >
              <h2 className="text-sm font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>
                Share Your Breakdown
              </h2>
              <p className="text-caption mb-4">
                Generate an image card for social media.
              </p>
              <ShareCard breakdown={breakdown} regime={regime} />
            </div>
          )}
        </div>
      </div>

      <p className="source-attribution mt-12 text-center">
        Source: Income Tax Act slab rates AY 2026-27 (FY 2025-26), Union Budget 2025-26
      </p>
    </motion.div>
  );
}
