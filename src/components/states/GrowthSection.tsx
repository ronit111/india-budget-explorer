import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useScrollTrigger } from '../../hooks/useScrollTrigger.ts';
import { SectionNumber } from '../ui/SectionNumber.tsx';
import { HorizontalBarChart, type BarItem } from '../viz/HorizontalBarChart.tsx';
import type { GSDPData } from '../../lib/data/schema.ts';

interface GrowthSectionProps {
  data: GSDPData;
}

export function GrowthSection({ data }: GrowthSectionProps) {
  const [ref, isVisible] = useScrollTrigger({ threshold: 0.08 });

  const items: BarItem[] = useMemo(() => {
    return data.states
      .filter((s) => s.growthRate > 0)
      .sort((a, b) => b.growthRate - a.growthRate)
      .slice(0, 20)
      .map((s) => ({
        id: s.id,
        label: s.name,
        value: s.growthRate,
        color: 'var(--emerald)',
      }));
  }, [data]);

  return (
    <section ref={ref} className="composition" style={{ background: 'var(--bg-surface)' }}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <SectionNumber number={2} className="mb-6 block" isVisible={isVisible} />

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-composition mb-2"
        >
          Who's catching up?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="text-annotation mb-8 max-w-xl"
        >
          Growth rates reveal a different picture than absolute size. Some smaller states are growing faster than the giants, narrowing the gap year by year.
        </motion.p>

        <HorizontalBarChart
          items={items}
          isVisible={isVisible}
          formatValue={(v) => `${v.toFixed(1)}%`}
          unit=""
          labelWidth={140}
          barHeight={26}
        />

        <p className="source-attribution">
          Source: {data.source} ({data.year})
        </p>
      </div>
    </section>
  );
}
