import { motion } from 'framer-motion';
import { useBudgetStore } from '../store/budgetStore.ts';
import { useBudgetData } from '../hooks/useBudgetData.ts';
import { SEOHead } from '../components/seo/SEOHead.tsx';
import { HeroSection } from '../components/home/HeroSection.tsx';
import { RevenueSection } from '../components/home/RevenueSection.tsx';
import { DeficitSection } from '../components/budget/DeficitSection.tsx';
import { ExpenditureSection } from '../components/home/ExpenditureSection.tsx';
import { FlowSection } from '../components/home/FlowSection.tsx';
import { MapSection } from '../components/home/MapSection.tsx';
import { PerCapitaSection } from '../components/budget/PerCapitaSection.tsx';
import { CTASection } from '../components/home/CTASection.tsx';
import { NarrativeBridge } from '../components/ui/NarrativeBridge.tsx';
import { SkeletonChart } from '../components/ui/Skeleton.tsx';

export default function BudgetPage() {
  const year = useBudgetStore((s) => s.selectedYear);
  const { summary, receipts, expenditure, treemap, sankey, statewise, loading, error } =
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

  if (error || !summary || !receipts || !expenditure || !treemap || !sankey || !statewise) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <p className="text-composition mb-4" style={{ color: 'var(--text-primary)' }}>
            Failed to load budget data
          </p>
          <p className="text-annotation mb-6">
            {error || 'Try refreshing the page.'}
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
        title="Union Budget 2025-26 — Where Your Tax Money Goes"
        description="Interactive visual breakdown of India's Union Budget 2025-26. Revenue sources, ministry-wise spending, state transfers, and your personal tax share."
        path="/budget"
      />

      {/* Hero — the headline number */}
      <HeroSection summary={summary} />

      {/* 01 Revenue — where money comes from */}
      <div className="composition-divider" />
      <NarrativeBridge
        text="The government raises revenue from taxes, borrowings, and non-tax sources. Let's see where each rupee comes from."
        highlights={{ taxes: 'var(--saffron)', borrowings: 'var(--cyan)', rupee: 'var(--gold)' }}
      />
      <div className="composition-divider" />

      <RevenueSection receipts={receipts} />

      {/* 02 Deficit — the borrowing gap */}
      <div className="composition-divider" />
      <NarrativeBridge
        text="But revenue alone doesn't cover the bill. The government borrows to bridge the gap."
        highlights={{ borrows: 'var(--cyan)', gap: 'var(--saffron)' }}
      />
      <div className="composition-divider" />

      <DeficitSection summary={summary} />

      {/* 03 Expenditure — where money goes */}
      <div className="composition-divider" />
      <NarrativeBridge
        text="Now let's trace where this money goes. Every ministry, every scheme, every crore."
        highlights={{ ministry: 'var(--saffron)', scheme: 'var(--gold)', crore: 'var(--cyan)' }}
      />
      <div className="composition-divider" />

      <ExpenditureSection treemap={treemap} />

      {/* 04 Flow — the complete picture */}
      <div className="composition-divider" />
      <NarrativeBridge
        text="Follow the flow from your pocket through the Central Government to the spending that shapes the country."
        highlights={{ flow: 'var(--cyan)', pocket: 'var(--gold)', spending: 'var(--saffron)' }}
      />
      <div className="composition-divider" />

      <FlowSection sankey={sankey} />

      {/* 05 Map — where it lands geographically */}
      <div className="composition-divider" />
      <NarrativeBridge
        text="Nearly one in four rupees flows directly to states and union territories. Here's where it lands."
        highlights={{ states: 'var(--cyan)', rupees: 'var(--gold)' }}
      />
      <div className="composition-divider" />

      <MapSection statewise={statewise} />

      {/* 06 Per Capita — what it means for you */}
      <div className="composition-divider" />
      <NarrativeBridge
        text="What does all this mean for a single citizen? Here's what the government spends on you every day."
        highlights={{ citizen: 'var(--gold)', spends: 'var(--saffron)' }}
      />
      <div className="composition-divider" />

      <PerCapitaSection summary={summary} expenditure={expenditure} />

      {/* 07 CTA — go deeper */}
      <div className="composition-divider" />

      <CTASection />
    </motion.div>
  );
}
