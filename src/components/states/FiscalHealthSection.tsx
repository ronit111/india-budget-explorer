import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useScrollTrigger } from '../../hooks/useScrollTrigger.ts';
import { SectionNumber } from '../ui/SectionNumber.tsx';
import { HorizontalBarChart, type BarItem } from '../viz/HorizontalBarChart.tsx';
import type { FiscalHealthData } from '../../lib/data/schema.ts';

interface FiscalHealthSectionProps {
  data: FiscalHealthData;
}

export function FiscalHealthSection({ data }: FiscalHealthSectionProps) {
  const [ref, isVisible] = useScrollTrigger({ threshold: 0.08 });

  const items: BarItem[] = useMemo(() => {
    return data.states
      .filter((s) => s.debtToGsdp > 0)
      .sort((a, b) => b.debtToGsdp - a.debtToGsdp)
      .slice(0, 20)
      .map((s) => ({
        id: s.id,
        label: s.name,
        value: s.debtToGsdp,
        secondaryValue: Math.abs(s.fiscalDeficitPctGsdp),
        color: 'var(--saffron)',
        secondaryColor: 'var(--emerald)',
        annotation: s.fiscalDeficitPctGsdp < 0 ? 'surplus' : undefined,
      }));
  }, [data]);

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
          The weight of debt
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="text-annotation mb-8 max-w-xl"
        >
          Outstanding debt as a share of GSDP varies wildly. The FRBM Act recommends states keep fiscal deficits below 3% of GSDP, but many exceed this threshold.
        </motion.p>

        <HorizontalBarChart
          items={items}
          isVisible={isVisible}
          showSecondary
          primaryLabel="Debt-to-GSDP"
          secondaryLabel="Fiscal Deficit"
          target={{ value: 3, label: 'FRBM 3% limit', color: 'var(--saffron)' }}
          formatValue={(v) => `${v.toFixed(1)}% of GSDP`}
          unit=""
          labelWidth={140}
          barHeight={24}
        />

        <p className="source-attribution">
          Source: {data.source} ({data.year})
        </p>
      </div>
    </section>
  );
}
