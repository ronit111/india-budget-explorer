import { useIntersection } from '../../hooks/useIntersection.ts';
import { SankeyDiagram } from '../viz/SankeyDiagram.tsx';
import { ChartContainer } from '../ui/ChartContainer.tsx';
import type { SankeyData } from '../../lib/data/schema.ts';

interface FlowSectionProps {
  sankey: SankeyData;
}

export function FlowSection({ sankey }: FlowSectionProps) {
  const { ref, isVisible } = useIntersection({ threshold: 0.1 });

  return (
    <section ref={ref} className="py-20 md:py-32 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <p className="text-sm font-medium text-[var(--color-saffron)] tracking-widest uppercase mb-4">
            Follow the money
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            From your pocket to government spending, in one flow
          </h2>
          <p className="text-[var(--color-text-secondary)] max-w-2xl text-lg">
            Revenue sources on the left flow through the Central Government to
            expenditure heads on the right. Hover over any node to trace its
            connections.
          </p>
        </div>

        <ChartContainer
          title="Budget Flow: revenue sources to spending"
          subtitle="Hover nodes to highlight connections. Wider flows = larger amounts."
        >
          <SankeyDiagram data={sankey} isVisible={isVisible} />
        </ChartContainer>
      </div>
    </section>
  );
}
