import { motion } from 'framer-motion';
import { useBudgetStore } from '../store/budgetStore.ts';
import { useBudgetData } from '../hooks/useBudgetData.ts';
import { SEOHead } from '../components/seo/SEOHead.tsx';
import { HeroSection } from '../components/home/HeroSection.tsx';
import { RevenueSection } from '../components/home/RevenueSection.tsx';
import { ExpenditureSection } from '../components/home/ExpenditureSection.tsx';
import { FlowSection } from '../components/home/FlowSection.tsx';
import { MapSection } from '../components/home/MapSection.tsx';
import { CTASection } from '../components/home/CTASection.tsx';
import { NarrativeBridge } from '../components/ui/NarrativeBridge.tsx';
import { SkeletonChart } from '../components/ui/Skeleton.tsx';

export default function HomePage() {
  const year = useBudgetStore((s) => s.selectedYear);
  const { summary, receipts, treemap, sankey, statewise, loading, error } =
    useBudgetData(year);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen px-4 pt-32"
      >
        <div className="max-w-4xl mx-auto space-y-24">
          <SkeletonChart height={200} />
          <SkeletonChart height={400} />
          <SkeletonChart height={400} />
        </div>
      </motion.div>
    );
  }

  if (error || !summary || !receipts || !treemap || !sankey || !statewise) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <p className="text-composition mb-4" style={{ color: 'var(--text-primary)' }}>
            Failed to load data
          </p>
          <p className="text-annotation mb-6">
            {error || 'Budget data could not be fetched. Try refreshing.'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-lg text-sm font-medium cursor-pointer"
            style={{
              background: 'var(--saffron)',
              color: 'white',
              border: 'none',
            }}
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <SEOHead
        title="India Budget Explorer — Where Your Tax Money Goes"
        description="Interactive visualization of India's Union Budget 2025-26. See where Rs 50 lakh crore goes — revenue breakdown, ministry-wise spending, state allocations, and a personal tax calculator."
        path="/"
      />

      <HeroSection summary={summary} />

      <div className="composition-divider" />
      <NarrativeBridge text="The government collects revenue from taxes, borrowings, and non-tax sources. Let's see where each rupee comes from." />
      <div className="composition-divider" />

      <RevenueSection receipts={receipts} />

      <div className="composition-divider" />
      <NarrativeBridge text="Now let's trace where this money goes. Every ministry, every scheme, every crore." />
      <div className="composition-divider" />

      <ExpenditureSection treemap={treemap} />

      <div className="composition-divider" />
      <NarrativeBridge text="Follow the flow from your pocket through the Central Government to the spending that shapes the country." />
      <div className="composition-divider" />

      <FlowSection sankey={sankey} />

      <div className="composition-divider" />
      <NarrativeBridge text="Nearly one in four rupees flows directly to states and union territories. Here's where it lands." />
      <div className="composition-divider" />

      <MapSection statewise={statewise} />

      <div className="composition-divider" />

      <CTASection />
    </motion.div>
  );
}
