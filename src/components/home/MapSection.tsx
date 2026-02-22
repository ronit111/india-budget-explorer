import { useIntersection } from '../../hooks/useIntersection.ts';
import { ChoroplethMap } from '../viz/ChoroplethMap.tsx';
import { ChartContainer } from '../ui/ChartContainer.tsx';
import type { StatewiseData } from '../../lib/data/schema.ts';
import { formatLakhCrore, formatIndianNumber } from '../../lib/format.ts';

interface MapSectionProps {
  statewise: StatewiseData;
}

export function MapSection({ statewise }: MapSectionProps) {
  const { ref, isVisible } = useIntersection({ threshold: 0.1 });

  const topState = [...statewise.states].sort((a, b) => b.transfer - a.transfer)[0];
  const topPerCapita = [...statewise.states].sort((a, b) => b.perCapita - a.perCapita)[0];

  return (
    <section ref={ref} className="py-20 md:py-32 px-4 bg-[var(--color-bg-surface)]">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div>
            <p className="text-sm font-medium text-[var(--color-saffron)] tracking-widest uppercase mb-4">
              State-wise transfers
            </p>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {formatLakhCrore(statewise.totalTransfers)} flows to states and UTs
            </h2>
            <p className="text-[var(--color-text-secondary)] mb-6 text-lg">
              Nearly 1 in 4 rupees of central spending goes directly to state
              governments. Hover over states to see the breakdown.
            </p>

            <div className="space-y-3">
              <div className="bg-[var(--color-bg-raised)] rounded-lg p-4">
                <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">
                  Largest total transfer
                </p>
                <p className="font-semibold mt-1">{topState.name}</p>
                <p className="text-sm text-[var(--color-text-muted)] font-mono">
                  Rs {formatIndianNumber(topState.transfer)} Cr ({topState.percentOfTotal}%)
                </p>
              </div>

              <div className="bg-[var(--color-bg-raised)] rounded-lg p-4">
                <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">
                  Highest per capita
                </p>
                <p className="font-semibold mt-1">{topPerCapita.name}</p>
                <p className="text-sm text-[var(--color-text-muted)] font-mono">
                  Rs {formatIndianNumber(topPerCapita.perCapita)} per person
                </p>
              </div>
            </div>
          </div>

          <ChartContainer
            title="Per-capita central transfers by state"
            subtitle="Darker shading = higher per-capita transfer"
          >
            <ChoroplethMap states={statewise.states} isVisible={isVisible} />
          </ChartContainer>
        </div>
      </div>
    </section>
  );
}
