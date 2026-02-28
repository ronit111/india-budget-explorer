import { motion } from 'framer-motion';
import { useScrollTrigger } from '../../hooks/useScrollTrigger.ts';
import { SectionNumber } from '../ui/SectionNumber.tsx';
import { LineChart } from '../viz/LineChart.tsx';
import type { LiquidityData } from '../../lib/data/schema.ts';

interface LiquiditySectionProps {
  data: LiquidityData;
}

export function LiquiditySection({ data }: LiquiditySectionProps) {
  const [ref, isVisible] = useScrollTrigger({ threshold: 0.08 });

  return (
    <section ref={ref} className="composition" style={{ background: 'var(--bg-surface)' }}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <SectionNumber number={3} className="mb-6 block" isVisible={isVisible} />

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-composition mb-2"
        >
          How much money flows through the system
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="text-annotation mb-8 max-w-xl"
        >
          M3 (broad money) captures all currency, deposits, and liquid instruments in the economy. Its growth rate reveals how actively RBI manages liquidity through open market operations and reserve requirements.
        </motion.p>

        <LineChart
          series={[
            {
              id: 'broad-money-growth',
              name: 'Broad Money Growth',
              color: 'var(--gold)',
              data: data.broadMoneyGrowth.series,
            },
            {
              id: 'broad-money-gdp',
              name: 'Broad Money (% GDP)',
              color: 'var(--cyan)',
              data: data.broadMoneyPctGDP.series,
              dashed: true,
            },
          ]}
          isVisible={isVisible}
          formatValue={(v) => v.toFixed(1)}
          unit="%"
        />

        <p className="source-attribution">
          Source: {data.broadMoneyGrowth.source}
        </p>
      </div>
    </section>
  );
}
