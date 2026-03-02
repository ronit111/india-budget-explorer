import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useScrollTrigger } from '../../hooks/useScrollTrigger.ts';
import { SectionNumber } from '../ui/SectionNumber.tsx';
import { RelatedTopics } from '../ui/RelatedTopics.tsx';
import { LineChart, type LineSeries } from '../viz/LineChart.tsx';
import { HorizontalBarChart, type BarItem } from '../viz/HorizontalBarChart.tsx';
import type { AirQualityData } from '../../lib/data/schema.ts';
import { ChartActionsWrapper } from '../share/ChartActionsWrapper.tsx';

const MIN_POINTS = 3;

interface AirQualitySectionProps {
  data: AirQualityData;
}

export function AirQualitySection({ data }: AirQualitySectionProps) {
  const [ref, isVisible] = useScrollTrigger({ threshold: 0.08 });

  const pm25Series: LineSeries[] = useMemo(() => {
    if (data.pm25TimeSeries.length < MIN_POINTS) return [];
    return [{
      id: 'pm25',
      name: 'PM2.5 (μg/m³)',
      color: 'var(--teal)',
      data: data.pm25TimeSeries,
    }];
  }, [data]);

  const cityBarItems: BarItem[] = useMemo(() => {
    return data.cityAQI
      .slice(0, 20)
      .map((c) => ({
        id: c.city,
        label: c.city,
        value: c.aqi,
        color: c.aqi > 200 ? 'var(--negative)' : c.aqi > 100 ? 'var(--amber)' : 'var(--teal)',
      }));
  }, [data]);

  return (
    <section ref={ref} id="air-quality" className="composition" style={{ background: 'var(--bg-surface)' }}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <SectionNumber number={1} className="mb-6 block" isVisible={isVisible} />

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-composition mb-2"
        >
          The air we breathe
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="text-annotation mb-8 max-w-xl"
        >
          India's average PM2.5 is 10 times the WHO safe limit. The Indo-Gangetic Plain is the worst — Delhi, Patna, and Lucknow rarely see clean air.
        </motion.p>

        {pm25Series.length > 0 && (
          <div className="mb-8">
            <p className="text-xs font-mono uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
              PM2.5 exposure (annual mean, μg/m³)
            </p>
            <ChartActionsWrapper registryKey="environment/air-quality" data={data}>
              <LineChart
                series={pm25Series}
                isVisible={isVisible}
                formatValue={(v) => v.toFixed(1)}
                unit="μg/m³"
              />
            </ChartActionsWrapper>
          </div>
        )}

        {cityBarItems.length > 0 && (
          <div className="mt-10">
            <p className="text-xs font-mono uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
              Most polluted cities — annual average AQI (2023)
            </p>
            <ChartActionsWrapper registryKey="environment/air-quality" data={data}>
              <HorizontalBarChart
                items={cityBarItems}
                isVisible={isVisible}
                formatValue={(v) => v.toFixed(0)}
                unit=""
                labelWidth={120}
                barHeight={22}
              />
            </ChartActionsWrapper>
          </div>
        )}

        <RelatedTopics sectionId="air-quality" domain="environment" />


        <p className="source-attribution">
          Source: {data.source}
        </p>
      </div>
    </section>
  );
}
