import { useState, useEffect, useMemo } from 'react';
import { useCalculatorStore } from '../store/calculatorStore.ts';
import { loadTaxSlabs, loadExpenditureShares } from '../lib/dataLoader.ts';
import { calculateTax } from '../lib/taxEngine.ts';
import type { TaxSlabsData, ExpenditureSharesData } from '../lib/data/schema.ts';
import { SEOHead } from '../components/seo/SEOHead.tsx';
import { IncomeInput } from '../components/calculator/IncomeInput.tsx';
import { TaxBreakdownDisplay } from '../components/calculator/TaxBreakdownDisplay.tsx';
import { SpendingAllocation } from '../components/calculator/SpendingAllocation.tsx';
import { ShareCard } from '../components/calculator/ShareCard.tsx';

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[var(--color-saffron)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
      <SEOHead
        title="Income Tax Calculator FY 2025-26 — Where Your Tax Rupees Go"
        description="Calculate your income tax under Old and New regimes for FY 2025-26. See exactly how your tax money is allocated across Defence, Education, Health, and other ministries."
        path="/calculator"
      />
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Find Your Share</h1>
        <p className="text-[var(--color-text-secondary)] max-w-xl mx-auto">
          Enter your annual income to see exactly how much tax you pay and where
          those rupees are spent.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left: Input + Breakdown */}
        <div className="space-y-8">
          <div className="bg-[var(--color-bg-surface)] border border-[rgba(255,255,255,0.05)] rounded-2xl p-6">
            <IncomeInput />
          </div>

          {breakdown && (
            <div className="bg-[var(--color-bg-surface)] border border-[rgba(255,255,255,0.05)] rounded-2xl p-6">
              <TaxBreakdownDisplay breakdown={breakdown} />
            </div>
          )}
        </div>

        {/* Right: Spending allocation + Share */}
        <div className="space-y-8">
          {breakdown && shares && (
            <div className="bg-[var(--color-bg-surface)] border border-[rgba(255,255,255,0.05)] rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-4">Where Your Tax Goes</h2>
              <SpendingAllocation totalTax={breakdown.totalTax} shares={shares} />
            </div>
          )}

          {breakdown && (
            <div className="bg-[var(--color-bg-surface)] border border-[rgba(255,255,255,0.05)] rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-2">Share Your Breakdown</h2>
              <p className="text-sm text-[var(--color-text-muted)] mb-4">
                Generate a 1200x630 image card to share on social media.
              </p>
              <ShareCard breakdown={breakdown} regime={regime} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
