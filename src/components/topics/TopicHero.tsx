import { motion } from 'framer-motion';
import type { TopicDef, TopicDataBag } from '../../lib/topicConfig.ts';
import { DomainBadges } from './DomainBadges.tsx';

const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface TopicHeroProps {
  topic: TopicDef;
  bag: TopicDataBag;
}

function resolveValue(v: string | ((bag: TopicDataBag) => string), bag: TopicDataBag): string {
  return typeof v === 'function' ? v(bag) : v;
}

export function TopicHero({ topic, bag }: TopicHeroProps) {
  const heroValue = resolveValue(topic.heroStat.value, bag);

  return (
    <section className="min-h-[70vh] flex flex-col justify-center relative overflow-hidden pt-20 pb-12">
      {/* Accent glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: '900px',
          height: '900px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${topic.accent}12 0%, ${topic.accent}04 40%, transparent 70%)`,
        }}
      />

      <div className="relative z-10 px-6 sm:px-8 max-w-4xl mx-auto w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
        >
          <DomainBadges domains={topic.contributingDomains} size="md" />
        </motion.div>

        <motion.h1
          className="text-3xl sm:text-4xl md:text-5xl font-bold mt-6 mb-4"
          style={{ color: 'var(--text-primary)' }}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: EASE_OUT_EXPO }}
        >
          {topic.title}
        </motion.h1>

        <motion.p
          className="text-base sm:text-lg max-w-2xl mx-auto"
          style={{ color: 'var(--text-secondary)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: EASE_OUT_EXPO }}
        >
          {topic.subtitle}
        </motion.p>

        {/* Hero stat */}
        <motion.div
          className="mt-10 inline-block"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.35, ease: EASE_OUT_EXPO }}
        >
          <div
            className="rounded-xl px-8 py-6"
            style={{
              background: `${topic.accent}08`,
              border: `1px solid ${topic.accent}20`,
            }}
          >
            <span
              className="block font-mono text-4xl sm:text-5xl font-black"
              style={{ color: topic.accent }}
            >
              {heroValue}
            </span>
            <span
              className="block text-sm font-medium mt-2"
              style={{ color: 'var(--text-secondary)' }}
            >
              {topic.heroStat.label}
            </span>
            <span
              className="block text-xs mt-1"
              style={{ color: 'var(--text-muted)' }}
            >
              {topic.heroStat.context}
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
