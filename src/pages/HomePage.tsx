import { useBudgetStore } from '../store/budgetStore.ts';
import { useBudgetData } from '../hooks/useBudgetData.ts';
import { SEOHead } from '../components/seo/SEOHead.tsx';
import { HeroSection } from '../components/home/HeroSection.tsx';
import { RevenueSection } from '../components/home/RevenueSection.tsx';
import { ExpenditureSection } from '../components/home/ExpenditureSection.tsx';
import { FlowSection } from '../components/home/FlowSection.tsx';
import { MapSection } from '../components/home/MapSection.tsx';
import { CTASection } from '../components/home/CTASection.tsx';

export default function HomePage() {
  const year = useBudgetStore((s) => s.selectedYear);
  const { summary, receipts, treemap, sankey, statewise, loading, error } =
    useBudgetData(year);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[var(--color-saffron)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-[var(--color-text-muted)]">Loading budget data...</p>
        </div>
      </div>
    );
  }

  if (error || !summary || !receipts || !treemap || !sankey || !statewise) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[var(--color-red)]">Failed to load data. {error}</p>
      </div>
    );
  }

  return (
    <div>
      <SEOHead
        title="India Budget Explorer — Where Your Tax Money Goes"
        description="Interactive visualization of India's Union Budget 2025-26. See where Rs 50 lakh crore goes — revenue breakdown, ministry-wise spending, state allocations, and a personal tax calculator."
        path="/"
      />
      <HeroSection summary={summary} />
      <RevenueSection receipts={receipts} />
      <ExpenditureSection treemap={treemap} />
      <FlowSection sankey={sankey} />
      <MapSection statewise={statewise} />
      <CTASection />
    </div>
  );
}
