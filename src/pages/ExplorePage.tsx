import { motion } from 'framer-motion';
import { useBudgetStore } from '../store/budgetStore.ts';
import { useBudgetData } from '../hooks/useBudgetData.ts';
import { SEOHead } from '../components/seo/SEOHead.tsx';
import { DataTable } from '../components/explore/DataTable.tsx';
import { SkeletonText } from '../components/ui/Skeleton.tsx';
import { formatLakhCrore } from '../lib/format.ts';

export default function ExplorePage() {
  const year = useBudgetStore((s) => s.selectedYear);
  const { expenditure, loading, error } = useBudgetData(year);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-7xl mx-auto px-4 py-8 md:py-12"
    >
      <SEOHead
        title="Budget Data Explorer — Ministry-wise Spending | India Budget Explorer"
        description="Explore India's Union Budget 2025-26 ministry by ministry. Sortable data table with scheme-level detail for all government expenditure. Export to CSV."
        path="/explore"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Dataset',
          name: 'India Union Budget Expenditure Data 2025-26',
          description: 'Ministry-wise expenditure data from India Union Budget 2025-26, including sub-scheme breakdowns.',
          url: 'https://indiabudgetexplorer.in/explore',
          license: 'https://data.gov.in/government-open-data-license-india',
          creator: { '@type': 'Organization', name: 'Ministry of Finance, Government of India' },
          temporalCoverage: '2025/2026',
          distribution: {
            '@type': 'DataDownload',
            encodingFormat: 'application/json',
            contentUrl: 'https://indiabudgetexplorer.in/data/budget/2025-26/expenditure.json',
          },
        }}
      />

      <div className="mb-8">
        <h1 className="text-composition mb-2">Data Explorer</h1>
        <p className="text-annotation max-w-2xl">
          Every ministry, every major scheme. Click headers to sort. Expand rows. Export to CSV.
        </p>
      </div>

      {/* Summary bar */}
      {expenditure && (
        <div
          className="flex flex-wrap gap-6 mb-6 px-4 py-3 rounded-lg"
          style={{ background: 'var(--bg-raised)', border: 'var(--border-subtle)' }}
        >
          <div>
            <span className="text-caption block">Total</span>
            <span className="font-mono text-sm font-bold">{formatLakhCrore(expenditure.total)}</span>
          </div>
          <div>
            <span className="text-caption block">Ministries</span>
            <span className="font-mono text-sm font-bold">{expenditure.ministries.length}</span>
          </div>
          <div>
            <span className="text-caption block">Year</span>
            <span className="font-mono text-sm font-bold">{expenditure.year}</span>
          </div>
        </div>
      )}

      {loading && <SkeletonText lines={8} className="mt-8" />}

      {error && (
        <div className="py-8 text-center">
          <p className="text-annotation mb-4">Failed to load data. {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-lg text-sm font-medium cursor-pointer"
            style={{ background: 'var(--saffron)', color: 'white', border: 'none' }}
          >
            Refresh
          </button>
        </div>
      )}

      {expenditure && <DataTable data={expenditure} />}
    </motion.div>
  );
}
