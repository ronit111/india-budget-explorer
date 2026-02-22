import { useIntersection } from '../../hooks/useIntersection.ts';
import { TreemapChart } from '../viz/TreemapChart.tsx';
import { ChartContainer } from '../ui/ChartContainer.tsx';
import type { TreemapData } from '../../lib/data/schema.ts';

interface ExpenditureSectionProps {
  treemap: TreemapData;
}

export function ExpenditureSection({ treemap }: ExpenditureSectionProps) {
  const { ref, isVisible } = useIntersection({ threshold: 0.1 });

  return (
    <section ref={ref} className="py-20 md:py-32 px-4 bg-[var(--color-bg-surface)]">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <p className="text-sm font-medium text-[var(--color-saffron)] tracking-widest uppercase mb-4">
            Where the money goes
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            State Transfers and Interest eat{' '}
            <span className="gradient-text-saffron">45 paisa</span> of every rupee
          </h2>
          <p className="text-[var(--color-text-secondary)] max-w-2xl text-lg">
            Click any colored block with sub-categories to drill down. For instance,
            click Defence to see the capital vs. revenue split.
          </p>
        </div>

        <ChartContainer
          title="Expenditure Treemap: area = budget size"
          subtitle="Click blocks to drill down into sub-categories"
        >
          <TreemapChart root={treemap.root} isVisible={isVisible} />
        </ChartContainer>
      </div>
    </section>
  );
}
