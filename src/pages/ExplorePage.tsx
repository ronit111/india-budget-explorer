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
      className="min-h-screen"
    >
      <SEOHead
        title="Budget Data Explorer — Ministry-wise Spending | Indian Data Project"
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

      {/* Page header */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 pt-10 pb-6 md:pt-14 md:pb-8">
        <h1
          className="text-3xl md:text-4xl font-bold mb-3"
          style={{ color: 'var(--text-primary)' }}
        >
          Data Explorer
        </h1>
        <p className="text-base max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
          Every ministry, every major scheme. Click headers to sort. Expand rows. Export to CSV.
        </p>
      </div>

      {/* Summary bar */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {expenditure && (
          <div
            className="flex flex-wrap gap-8 mb-8 px-6 py-4 rounded-xl"
            style={{ background: 'var(--bg-raised)', border: 'var(--border-subtle)' }}
          >
            <div>
              <span className="text-xs uppercase tracking-wider block mb-1" style={{ color: 'var(--text-muted)' }}>Total</span>
              <span className="font-mono text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                {formatLakhCrore(expenditure.total)}
              </span>
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider block mb-1" style={{ color: 'var(--text-muted)' }}>Expenditure Heads</span>
              <span className="font-mono text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                {expenditure.ministries.length}
              </span>
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider block mb-1" style={{ color: 'var(--text-muted)' }}>Year</span>
              <span className="font-mono text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                {expenditure.year}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Table content */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 pb-16">
        {loading && <SkeletonText lines={8} className="mt-4" />}

        {error && (
          <div className="py-8 text-center">
            <p className="text-base mb-4" style={{ color: 'var(--text-secondary)' }}>
              Failed to load data. {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 rounded-lg text-sm font-medium cursor-pointer"
              style={{ background: 'var(--saffron)', color: 'white', border: 'none' }}
            >
              Refresh
            </button>
          </div>
        )}

        {expenditure && <DataTable data={expenditure} />}
      </div>
    </motion.div>
  );
}
