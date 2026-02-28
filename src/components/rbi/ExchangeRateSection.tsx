import { motion } from 'framer-motion';
import { useScrollTrigger } from '../../hooks/useScrollTrigger.ts';
import { SectionNumber } from '../ui/SectionNumber.tsx';
import { LineChart } from '../viz/LineChart.tsx';
import type { ForexData } from '../../lib/data/schema.ts';

interface ExchangeRateSectionProps {
  data: ForexData;
}

export function ExchangeRateSection({ data }: ExchangeRateSectionProps) {
  const [ref, isVisible] = useScrollTrigger({ threshold: 0.08 });

  const latestRate = data.exchangeRate.series.length > 0
    ? data.exchangeRate.series[data.exchangeRate.series.length - 1].value.toFixed(2)
    : '—';

  return (
    <section ref={ref} className="composition" style={{ background: 'var(--bg-surface)' }}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <SectionNumber number={6} className="mb-6 block" isVisible={isVisible} />

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-composition mb-2"
        >
          The rupee's managed float
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="text-annotation mb-8 max-w-xl"
        >
          India doesn't peg the rupee, but RBI actively smooths volatility through forex market interventions. The INR/USD exchange rate reflects both market forces and RBI's managed float strategy.
        </motion.p>

        <LineChart
          series={[
            {
              id: 'exchange-rate',
              name: 'INR per USD',
              color: 'var(--gold)',
              data: data.exchangeRate.series,
            },
          ]}
          isVisible={isVisible}
          formatValue={(v) => v.toFixed(1)}
          unit="INR/USD"
        />

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
          className="mt-6 inline-flex items-center gap-3 px-4 py-2 rounded-full"
          style={{
            background: 'var(--bg-raised)',
            border: 'var(--border-subtle)',
          }}
        >
          <span className="text-caption font-mono font-bold" style={{ color: 'var(--text-primary)' }}>
            1 USD = ₹{latestRate}
          </span>
        </motion.div>

        <p className="source-attribution">
          Source: {data.exchangeRate.source}
        </p>
      </div>
    </section>
  );
}
