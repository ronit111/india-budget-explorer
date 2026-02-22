import { useIntersection } from '../../hooks/useIntersection.ts';
import { WaffleChart } from '../viz/WaffleChart.tsx';
import { ChartContainer } from '../ui/ChartContainer.tsx';
import type { ReceiptsData } from '../../lib/data/schema.ts';
import { formatLakhCrore } from '../../lib/format.ts';

interface RevenueSectionProps {
  receipts: ReceiptsData;
}

export function RevenueSection({ receipts }: RevenueSectionProps) {
  const { ref, isVisible } = useIntersection({ threshold: 0.15 });

  return (
    <section ref={ref} className="py-20 md:py-32 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-sm font-medium text-[var(--color-saffron)] tracking-widest uppercase mb-4">
              Where the money comes from
            </p>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Income Tax and Corporate Tax fund{' '}
              <span className="gradient-text-saffron">65%</span> of receipts
            </h2>
            <p className="text-[var(--color-text-secondary)] mb-4 text-lg">
              The government collects {formatLakhCrore(receipts.total)} in total receipts.
              Each square represents 1% of where the money comes from.
            </p>
            <p className="text-sm text-[var(--color-text-muted)]">
              Borrowings account for nearly a third. That means for every rupee
              earned, the government borrows another 32 paise to cover spending.
            </p>
          </div>

          <ChartContainer
            title="Revenue Rupee: each square = 1%"
            subtitle="Where does each rupee of government revenue come from?"
          >
            <WaffleChart categories={receipts.categories} isVisible={isVisible} />
          </ChartContainer>
        </div>
      </div>
    </section>
  );
}
