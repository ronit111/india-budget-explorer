import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useScrollTrigger } from '../../hooks/useScrollTrigger.ts';
import { SectionNumber } from '../ui/SectionNumber.tsx';
import { LineChart, type LineSeries } from '../viz/LineChart.tsx';
import { HorizontalBarChart, type BarItem } from '../viz/HorizontalBarChart.tsx';
import type { ForestData } from '../../lib/data/schema.ts';
import { ChartActionsWrapper } from '../share/ChartActionsWrapper.tsx';

const MIN_POINTS = 3;

interface ForestCoverSectionProps {
  data: ForestData;
}

export function ForestCoverSection({ data }: ForestCoverSectionProps) {
  const [ref, isVisible] = useScrollTrigger({ threshold: 0.08 });

  const forestSeries: LineSeries[] = useMemo(() => {
    if (data.forestPctTimeSeries.length < MIN_POINTS) return [];
    return [{
      id: 'forest_pct',
      name: 'Forest Cover (% of land area)',
      color: 'var(--teal)',
      data: data.forestPctTimeSeries,
    }];
  }, [data]);

  // Diverging bar: gainers (+) and losers (-) by forest cover change
  const changeBarItems: BarItem[] = useMemo(() => {
    return [...data.stateForestCover]
      .sort((a, b) => b.changeKm2 - a.changeKm2)
      .filter((s) => Math.abs(s.changeKm2) > 1)
      .map((s) => ({
        id: s.id,
        label: s.name,
        value: s.changeKm2,
        color: s.changeKm2 > 0 ? 'var(--positive)' : 'var(--negative)',
      }));
  }, [data]);

  return (
    <section ref={ref} id="forest-cover" className="composition">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <SectionNumber number={2} className="mb-6 block" isVisible={isVisible} />

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-composition mb-2"
        >
          Forest cover
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="text-annotation mb-8 max-w-xl"
        >
          India has 25.17% forest cover — below the 33% policy target. The northeast is losing forests fastest, while plantation-led gains in central India mask the decline of natural forests.
        </motion.p>

        {forestSeries.length > 0 && (
          <div className="mb-8">
            <p className="text-xs font-mono uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
              Forest cover as % of land area
            </p>
            <ChartActionsWrapper registryKey="environment/forest-cover" data={data}>
              <LineChart
                series={forestSeries}
                isVisible={isVisible}
                formatValue={(v) => `${v.toFixed(1)}%`}
                unit=""
              />
            </ChartActionsWrapper>
          </div>
        )}

        {changeBarItems.length > 0 && (
          <div className="mt-10">
            <p className="text-xs font-mono uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
              Forest cover change (km², ISFR 2021 → 2023) — gainers &amp; losers
            </p>
            <ChartActionsWrapper registryKey="environment/forest-cover" data={data}>
              <HorizontalBarChart
                items={changeBarItems}
                isVisible={isVisible}
                formatValue={(v) => (v > 0 ? `+${v}` : `${v}`)}
                unit=""
                labelWidth={160}
                barHeight={22}
              />
            </ChartActionsWrapper>
          </div>
        )}

        <p className="source-attribution">
          Source: {data.source}
        </p>
      </div>
    </section>
  );
}
