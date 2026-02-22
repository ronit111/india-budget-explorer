import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useScrollTrigger } from '../../hooks/useScrollTrigger.ts';
import { ChoroplethMap } from '../viz/ChoroplethMap.tsx';
import { SectionNumber } from '../ui/SectionNumber.tsx';
import type { StatewiseData } from '../../lib/data/schema.ts';
import { formatLakhCrore, formatIndianNumber } from '../../lib/format.ts';

interface MapSectionProps {
  statewise: StatewiseData;
}

export function MapSection({ statewise }: MapSectionProps) {
  const [ref, isVisible] = useScrollTrigger({ threshold: 0.08 });

  const topState = useMemo(
    () => [...statewise.states].sort((a, b) => b.transfer - a.transfer)[0],
    [statewise.states]
  );
  const topPerCapita = useMemo(
    () => [...statewise.states].sort((a, b) => b.perCapita - a.perCapita)[0],
    [statewise.states]
  );

  return (
    <section ref={ref} className="composition" style={{ background: 'var(--bg-surface)' }}>
      <div className="max-w-6xl mx-auto px-4">
        <SectionNumber number={4} className="mb-6 block" />

        <div className="grid md:grid-cols-[1fr_1.8fr] gap-12 items-start">
          {/* Annotation panel */}
          <div className="md:sticky md:top-24">
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-composition mb-4"
            >
              {formatLakhCrore(statewise.totalTransfers)} to states
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="text-annotation mb-8"
            >
              Nearly 1 in 4 rupees of central spending flows directly to state governments.
              Hover over states to see the breakdown.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="space-y-4"
            >
              <div className="rounded-lg p-4" style={{ background: 'var(--bg-raised)', border: 'var(--border-subtle)' }}>
                <p className="text-caption uppercase tracking-wider mb-1">Largest total</p>
                <p className="font-semibold text-sm">{topState.name}</p>
                <p className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
                  Rs {formatIndianNumber(topState.transfer)} Cr
                </p>
              </div>

              <div className="rounded-lg p-4" style={{ background: 'var(--bg-raised)', border: 'var(--border-subtle)' }}>
                <p className="text-caption uppercase tracking-wider mb-1">Highest per capita</p>
                <p className="font-semibold text-sm">{topPerCapita.name}</p>
                <p className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
                  Rs {formatIndianNumber(topPerCapita.perCapita)}/person
                </p>
              </div>
            </motion.div>

            <p className="source-attribution mt-8">
              Source: Union Budget 2025-26, Finance Commission
            </p>
          </div>

          {/* Full-width choropleth */}
          <ChoroplethMap states={statewise.states} isVisible={isVisible} />
        </div>
      </div>
    </section>
  );
}
