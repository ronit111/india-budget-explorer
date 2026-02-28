import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useScrollTrigger } from '../../hooks/useScrollTrigger.ts';
import { SectionNumber } from '../ui/SectionNumber.tsx';
import { LineChart, type LineSeries } from '../viz/LineChart.tsx';
import type { MonetaryPolicyData } from '../../lib/data/schema.ts';

interface MonetaryPolicySectionProps {
  data: MonetaryPolicyData;
}

export function MonetaryPolicySection({ data }: MonetaryPolicySectionProps) {
  const [ref, isVisible] = useScrollTrigger({ threshold: 0.08 });

  const series: LineSeries[] = useMemo(() => {
    const repoSeries = data.decisions.map((d) => ({
      year: d.date.slice(0, 7),
      value: d.rate,
      label: d.date,
    }));

    const result: LineSeries[] = [
      {
        id: 'repo-rate',
        name: 'Repo Rate',
        color: 'var(--gold)',
        data: repoSeries,
      },
    ];

    if (data.crrHistory.length > 0) {
      result.push({
        id: 'crr',
        name: 'CRR',
        color: 'var(--cyan)',
        data: data.crrHistory,
        dashed: true,
      });
    }

    return result;
  }, [data]);

  return (
    <section ref={ref} className="composition" style={{ background: 'var(--bg-surface)' }}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <SectionNumber number={1} className="mb-6 block" isVisible={isVisible} />

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-composition mb-2"
        >
          A decade of rate decisions
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="text-annotation mb-8 max-w-xl"
        >
          From easing cycles to emergency COVID cuts to post-pandemic tightening, every repo rate move reflects the RBI's reading of growth versus inflation. The CRR sets how much banks must hold in reserve.
        </motion.p>

        <LineChart
          series={series}
          isVisible={isVisible}
          formatValue={(v) => v.toFixed(2)}
          unit="%"
        />

        <p className="source-attribution">
          Source: {data.source}
        </p>
      </div>
    </section>
  );
}
