import { useBudgetStore } from '../store/budgetStore.ts';
import { useBudgetData } from '../hooks/useBudgetData.ts';
import { SEOHead } from '../components/seo/SEOHead.tsx';
import { DataTable } from '../components/explore/DataTable.tsx';

export default function ExplorePage() {
  const year = useBudgetStore((s) => s.selectedYear);
  const { expenditure, loading, error } = useBudgetData(year);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
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
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Data Explorer</h1>
        <p className="text-[var(--color-text-secondary)] max-w-2xl">
          Every ministry, every major scheme. Click column headers to sort.
          Expand rows with sub-schemes. Export to CSV for your own analysis.
        </p>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-[var(--color-saffron)] border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {error && (
        <p className="text-[var(--color-red)] py-8">Failed to load data. {error}</p>
      )}

      {expenditure && <DataTable data={expenditure} />}
    </div>
  );
}
