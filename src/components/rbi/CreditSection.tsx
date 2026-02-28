import { motion } from 'framer-motion';
import { useScrollTrigger } from '../../hooks/useScrollTrigger.ts';
import { SectionNumber } from '../ui/SectionNumber.tsx';
import { LineChart } from '../viz/LineChart.tsx';
import type { CreditData } from '../../lib/data/schema.ts';

interface CreditSectionProps {
  data: CreditData;
}

export function CreditSection({ data }: CreditSectionProps) {
  const [ref, isVisible] = useScrollTrigger({ threshold: 0.08 });

  return (
    <section ref={ref} className="composition" style={{ background: 'var(--bg-surface)' }}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <SectionNumber number={4} className="mb-6 block" isVisible={isVisible} />

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-composition mb-2"
        >
          Where bank lending goes
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="text-annotation mb-8 max-w-xl"
        >
          Domestic credit measures total lending by the financial sector. Private sector credit tracks how much flows to businesses and individuals, the engine of economic growth.
        </motion.p>

        <LineChart
          series={[
            {
              id: 'domestic-credit',
              name: 'Domestic Credit (% GDP)',
              color: 'var(--gold)',
              data: data.domesticCreditPctGDP.series,
            },
            {
              id: 'private-credit',
              name: 'Private Sector Credit (% GDP)',
              color: 'var(--cyan)',
              data: data.privateCreditPctGDP.series,
            },
          ]}
          isVisible={isVisible}
          formatValue={(v) => v.toFixed(1)}
          unit="% GDP"
        />

        <p className="source-attribution">
          Source: {data.domesticCreditPctGDP.source}
        </p>
      </div>
    </section>
  );
}
