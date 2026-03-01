import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useScrollTrigger } from '../../hooks/useScrollTrigger.ts';
import { SectionNumber } from '../ui/SectionNumber.tsx';
import { HorizontalBarChart, type BarItem } from '../viz/HorizontalBarChart.tsx';
import type { WaterData } from '../../lib/data/schema.ts';
import { ChartActionsWrapper } from '../share/ChartActionsWrapper.tsx';

interface WaterStressSectionProps {
  data: WaterData;
}

const STAGE_COLORS: Record<string, string> = {
  'Over-Exploited': 'var(--negative)',
  'Critical': 'var(--amber)',
  'Semi-Critical': 'var(--saffron)',
  'Safe': 'var(--teal)',
};

export function WaterStressSection({ data }: WaterStressSectionProps) {
  const [ref, isVisible] = useScrollTrigger({ threshold: 0.08 });

  // Groundwater stage — sorted by severity (high exploitation first)
  const groundwaterItems: BarItem[] = useMemo(() => {
    return [...data.groundwaterStage]
      .sort((a, b) => b.stagePct - a.stagePct)
      .map((s) => ({
        id: s.id,
        label: s.name,
        value: s.stagePct,
        color: STAGE_COLORS[s.stage] ?? 'var(--text-muted)',
      }));
  }, [data]);

  // Reservoir storage by region
  const reservoirItems: BarItem[] = useMemo(() => {
    return data.reservoirStorage.map((r) => ({
      id: r.region,
      label: r.region,
      value: r.storagePct,
      color: r.storagePct > 50 ? 'var(--teal)' : r.storagePct > 35 ? 'var(--amber)' : 'var(--negative)',
    }));
  }, [data]);

  // Stage summary counts
  const stageCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const s of data.groundwaterStage) {
      counts[s.stage] = (counts[s.stage] ?? 0) + 1;
    }
    return counts;
  }, [data]);

  return (
    <section ref={ref} id="water-stress" className="composition" style={{ background: 'var(--bg-surface)' }}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <SectionNumber number={5} className="mb-6 block" isVisible={isVisible} />

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-composition mb-2"
        >
          Water stress
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="text-annotation mb-8 max-w-xl"
        >
          India is the world's largest groundwater user. Punjab extracts 165% of what recharges — meaning the water table is dropping every year. 21 major cities may run dry by 2030.
        </motion.p>

        {/* Groundwater stage summary pills */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          className="mb-8 flex flex-wrap gap-3"
        >
          {(['Over-Exploited', 'Semi-Critical', 'Safe'] as const).map((stage) => (
            stageCounts[stage] ? (
              <div
                key={stage}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
                style={{ background: 'var(--bg-raised)', border: 'var(--border-subtle)' }}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: STAGE_COLORS[stage] }} />
                <span className="text-caption font-mono font-bold" style={{ color: 'var(--text-primary)' }}>
                  {stageCounts[stage]}
                </span>
                <span className="text-caption" style={{ color: 'var(--text-muted)' }}>{stage}</span>
              </div>
            ) : null
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Groundwater exploitation */}
          <div>
            <p className="text-xs font-mono uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
              Groundwater development stage (% extraction / recharge)
            </p>
            <ChartActionsWrapper registryKey="environment/water-stress" data={data}>
              <HorizontalBarChart
                items={groundwaterItems}
                isVisible={isVisible}
                formatValue={(v) => `${v}%`}
                unit=""
                labelWidth={160}
                barHeight={20}
              />
            </ChartActionsWrapper>
          </div>

          {/* Reservoir storage */}
          <div>
            <p className="text-xs font-mono uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
              Major reservoir storage by region (% of capacity)
            </p>
            <ChartActionsWrapper registryKey="environment/water-stress" data={data}>
              <HorizontalBarChart
                items={reservoirItems}
                isVisible={isVisible}
                formatValue={(v) => `${v}%`}
                unit=""
                labelWidth={80}
                barHeight={32}
              />
            </ChartActionsWrapper>
          </div>
        </div>

        <p className="source-attribution">
          Source: {data.source}
        </p>
      </div>
    </section>
  );
}
