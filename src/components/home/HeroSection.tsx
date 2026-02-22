import { useIntersection } from '../../hooks/useIntersection.ts';
import { AnimatedCounter } from '../viz/AnimatedCounter.tsx';
import type { BudgetSummary } from '../../lib/data/schema.ts';

interface HeroSectionProps {
  summary: BudgetSummary;
}

export function HeroSection({ summary }: HeroSectionProps) {
  const { ref, isVisible } = useIntersection({ threshold: 0.2 });

  return (
    <section
      ref={ref}
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-bg-deepest)] via-[rgba(255,107,53,0.03)] to-[var(--color-bg-deepest)]" />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <p className="text-sm md:text-base font-medium text-[var(--color-saffron)] tracking-widest uppercase mb-6">
          Union Budget 2025-26
        </p>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-8">
          <span className="text-[var(--color-text-primary)]">The Government spends</span>
          <br />
          <span className="gradient-text-saffron text-5xl md:text-7xl lg:text-8xl">
            Rs{' '}
            <AnimatedCounter
              target={summary.totalExpenditure}
              duration={2.5}
              trigger={isVisible}
              className="gradient-text-saffron"
            />
          </span>
          <br />
          <span className="text-[var(--color-text-primary)]">crore</span>
        </h1>

        <p className="text-lg md:text-2xl text-[var(--color-text-secondary)] max-w-2xl mx-auto mb-4">
          That&apos;s{' '}
          <span className="font-mono font-bold text-[var(--color-text-primary)]">
            Rs {summary.perCapitaDailyExpenditure.toFixed(2)}
          </span>{' '}
          per citizen per day
        </p>

        <p className="text-sm md:text-base text-[var(--color-text-muted)] max-w-xl mx-auto mb-12">
          Where does this money come from? Where does it go?
          <br />
          Scroll to explore.
        </p>

        {/* Scroll indicator */}
        <div className="animate-bounce mt-8">
          <svg
            className="w-6 h-6 mx-auto text-[var(--color-text-muted)]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}
