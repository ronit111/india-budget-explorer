import { motion } from 'framer-motion';
import { AnimatedCounter } from '../viz/AnimatedCounter.tsx';
import { useScrollTrigger } from '../../hooks/useScrollTrigger.ts';
import type { BudgetSummary } from '../../lib/data/schema.ts';

interface HeroSectionProps {
  summary: BudgetSummary;
}

export function HeroSection({ summary }: HeroSectionProps) {
  const [ref, isVisible] = useScrollTrigger({ threshold: 0.2 });

  return (
    <section
      ref={ref}
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
    >
      {/* Radial glow behind the counter */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(255,107,53,0.08) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Overline */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0 }}
          className="text-section-num tracking-[0.2em] uppercase mb-8"
        >
          Union Budget 2025-26
        </motion.p>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          className="text-lg md:text-xl mb-6"
          style={{ color: 'var(--text-secondary)' }}
        >
          Where every rupee goes
        </motion.p>

        {/* Hero counter — physically enormous */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
        >
          <div className="text-hero gradient-text-saffron">
            <span className="text-[0.5em] font-semibold mr-1">Rs</span>
            <AnimatedCounter
              target={summary.totalExpenditure}
              duration={2.5}
              trigger={isVisible}
              className="gradient-text-saffron"
            />
          </div>
          <p
            className="text-xl md:text-2xl font-medium mt-2"
            style={{ color: 'var(--text-secondary)' }}
          >
            crore
          </p>
        </motion.div>

        {/* Per-capita pill */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.45 }}
          className="mt-8 inline-flex items-center gap-2 px-4 py-2 rounded-full"
          style={{
            background: 'var(--bg-raised)',
            border: 'var(--border-subtle)',
          }}
        >
          <span className="text-caption">That's</span>
          <span className="font-mono font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
            Rs {summary.perCapitaDailyExpenditure.toFixed(2)}
          </span>
          <span className="text-caption">per citizen per day</span>
        </motion.div>

        {/* Growing line scroll indicator */}
        <motion.div
          initial={{ scaleY: 0 }}
          animate={isVisible ? { scaleY: 1 } : {}}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.8 }}
          className="mt-16 mx-auto w-px h-16 origin-top"
          style={{ backgroundColor: 'var(--text-muted)' }}
        />
      </div>
    </section>
  );
}
