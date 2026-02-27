import { useState, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useScrollTrigger } from '../hooks/useScrollTrigger.ts';
import { SEOHead } from '../components/seo/SEOHead.tsx';
import { loadSummary } from '../lib/dataLoader.ts';
import { formatLakhCrore } from '../lib/format.ts';
import type { BudgetSummary } from '../lib/data/schema.ts';

const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

function HubHero() {
  const { scrollY } = useScroll();
  // Parallax: title drifts up slowly as user scrolls
  const titleY = useTransform(scrollY, [0, 600], [0, -60]);
  const subtitleOpacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section className="min-h-screen flex flex-col justify-center relative overflow-hidden">
      {/* Radial glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: '1200px',
          height: '1200px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,107,53,0.08) 0%, rgba(255,200,87,0.03) 40%, transparent 70%)',
          animation: 'pulseGlow 4s ease-in-out infinite',
        }}
      />

      <div className="relative z-10 px-6 sm:px-8 max-w-7xl mx-auto w-full">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE_OUT_EXPO, delay: 0.1 }}
          className="text-section-num tracking-[0.2em] uppercase mb-8"
        >
          {'Indian Data Project'}
        </motion.p>

        {/* Viewport-filling title — typography as architecture */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE_OUT_EXPO, delay: 0.2 }}
          style={{ y: titleY, fontSize: 'clamp(3rem, 9vw, 8rem)', lineHeight: 0.95, letterSpacing: '-0.03em' }}
          className="font-extrabold"
        >
          <span className="gradient-text-saffron">{'Government'}</span>
          <br />
          <span className="gradient-text-saffron">{'data,'}</span>
          <br />
          <span style={{ color: 'var(--text-primary)' }}>{'made visible'}</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE_OUT_EXPO, delay: 0.5 }}
          style={{ opacity: subtitleOpacity }}
          className="mt-8 max-w-lg"
        >
          <p
            className="text-lg md:text-xl leading-relaxed"
            style={{ color: 'var(--text-secondary)' }}
          >
            {'Dense PDFs and buried spreadsheets turned into interactive visual stories.'}
          </p>
          <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>
            {'Real data. No spin. Open source.'}
          </p>
        </motion.div>

        {/* Scroll indicator — thin line growing downward */}
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1.2, ease: EASE_OUT_EXPO, delay: 0.9 }}
          className="mt-20 w-px h-20 origin-top"
          style={{ backgroundColor: 'var(--text-muted)', opacity: 0.5 }}
        />
      </div>
    </section>
  );
}

function DomainCard({ summary }: { summary: BudgetSummary | null }) {
  const [ref, isVisible] = useScrollTrigger({ threshold: 0.1 });

  // Mini sparkline data from summary — the three key ratios
  const barSegments = useMemo(() => {
    if (!summary) return [];
    const total = summary.totalExpenditure;
    const receipts = summary.totalReceipts;
    const deficit = summary.fiscalDeficit;
    return [
      { label: 'Revenue', pct: (receipts / total) * 100, color: 'var(--saffron)' },
      { label: 'Deficit', pct: (deficit / total) * 100, color: 'var(--cyan)' },
    ];
  }, [summary]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: EASE_OUT_EXPO, delay: 0.1 }}
    >
      <Link
        to="/budget"
        className="group block relative rounded-2xl p-px no-underline overflow-hidden"
        style={{ transition: 'transform 0.3s ease' }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0px)'; }}
      >
        {/* Gradient border */}
        <div
          className="absolute inset-0 rounded-2xl opacity-20 group-hover:opacity-50"
          style={{
            background: 'linear-gradient(135deg, var(--saffron), transparent 40%, var(--cyan) 80%, transparent)',
            transition: 'opacity 0.4s ease',
          }}
        />
        {/* Hover glow */}
        <div
          className="absolute -inset-2 rounded-2xl opacity-0 group-hover:opacity-100 blur-2xl pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(255,107,53,0.06), rgba(74,234,220,0.04))',
            transition: 'opacity 0.4s ease',
          }}
        />

        {/* Card content */}
        <div
          className="relative rounded-2xl overflow-hidden"
          style={{ background: 'var(--bg-surface)' }}
        >
          <div className="grid md:grid-cols-[1.4fr_1fr]">
            {/* Left: description + mini viz */}
            <div className="relative p-8 md:p-12 flex flex-col justify-between min-h-[320px]">
              {/* Decorative glow */}
              <div
                className="absolute top-0 right-0 w-3/4 h-full pointer-events-none opacity-[0.03]"
                style={{
                  background: 'radial-gradient(ellipse at 70% 50%, var(--saffron), transparent 70%)',
                }}
              />

              <div className="relative z-10">
                <span className="text-section-num tracking-[0.15em] uppercase mb-4 block">
                  {'01 — Data Story'}
                </span>
                <h2
                  className="text-3xl md:text-4xl font-bold mb-3"
                  style={{ color: 'var(--text-primary)', lineHeight: 1.15 }}
                >
                  {'Union Budget 2025-26'}
                </h2>
                <p className="text-annotation mb-6 max-w-md">
                  {'Where Rs 50 lakh crore goes. Revenue sources, ministry-wise spending, state transfers, and your personal tax share.'}
                </p>
              </div>

              {/* Mini revenue/deficit bar — a taste of the data inside */}
              <div className="relative z-10">
                {barSegments.length > 0 && (
                  <div className="mb-6 max-w-xs">
                    <div className="flex items-center gap-1 h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-raised)' }}>
                      {barSegments.map((seg) => (
                        <motion.div
                          key={seg.label}
                          className="h-full rounded-full"
                          style={{ background: seg.color }}
                          initial={{ width: 0 }}
                          animate={isVisible ? { width: `${seg.pct}%` } : {}}
                          transition={{ duration: 1, ease: EASE_OUT_EXPO, delay: 0.4 }}
                        />
                      ))}
                    </div>
                    <div className="flex gap-4 mt-2">
                      {barSegments.map((seg) => (
                        <span key={seg.label} className="text-xs" style={{ color: 'var(--text-muted)' }}>
                          <span className="inline-block w-2 h-2 rounded-full mr-1" style={{ background: seg.color, verticalAlign: 'middle' }} />
                          {seg.label} {seg.pct.toFixed(0)}%
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div
                  className="inline-flex items-center gap-2 text-sm font-medium"
                  style={{ color: 'var(--saffron)' }}
                >
                  <span>{'Explore the budget'}</span>
                  <span
                    className="group-hover:translate-x-1.5 inline-block"
                    style={{ transition: 'transform 0.2s ease' }}
                  >
                    &rarr;
                  </span>
                </div>
              </div>
            </div>

            {/* Right: key stats — large, monospaced, unapologetic */}
            <div
              className="p-8 md:p-12 flex flex-col justify-center gap-8 border-t md:border-t-0 md:border-l"
              style={{ borderColor: 'rgba(255,255,255,0.06)' }}
            >
              <StatPill
                label={'Total Expenditure'}
                value={summary ? formatLakhCrore(summary.totalExpenditure) : '...'}
                color="var(--saffron)"
                delay={0.3}
                isVisible={isVisible}
              />
              <StatPill
                label={'Per Citizen Per Day'}
                value={summary ? `Rs ${summary.perCapitaDailyExpenditure.toFixed(2)}` : '...'}
                color="var(--cyan)"
                delay={0.4}
                isVisible={isVisible}
              />
              <StatPill
                label={'Fiscal Deficit'}
                value={summary ? `${summary.fiscalDeficitPercentGDP}% of GDP` : '...'}
                color="var(--gold)"
                delay={0.5}
                isVisible={isVisible}
              />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function StatPill({
  label,
  value,
  color,
  delay,
  isVisible,
}: {
  label: string;
  value: string;
  color: string;
  delay: number;
  isVisible: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 12 }}
      animate={isVisible ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, ease: EASE_OUT_EXPO, delay }}
    >
      <p className="text-caption uppercase tracking-wider mb-1">{label}</p>
      <p className="font-mono font-bold text-xl" style={{ color }}>{value}</p>
    </motion.div>
  );
}

function ComingSoon() {
  const [ref, isVisible] = useScrollTrigger({ threshold: 0.15 });

  const domains = [
    'Economic Survey',
    'State Finances',
    'RBI Data',
    'Census & Demographics',
  ];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
      className="mt-16 pt-12"
      style={{ borderTop: 'var(--border-divider)' }}
    >
      <p className="text-section-num tracking-[0.15em] uppercase mb-6">
        {'On the horizon'}
      </p>
      <div className="flex flex-wrap gap-3">
        {domains.map((d, i) => (
          <motion.span
            key={d}
            initial={{ opacity: 0, y: 8 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, ease: EASE_OUT_EXPO, delay: 0.1 + i * 0.07 }}
            className="px-4 py-2 rounded-full text-sm"
            style={{
              border: 'var(--border-subtle)',
              color: 'var(--text-muted)',
              background: 'var(--bg-raised)',
            }}
          >
            {d}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}

export default function HubPage() {
  const location = useLocation();
  const [summary, setSummary] = useState<BudgetSummary | null>(null);

  useEffect(() => {
    loadSummary('2025-26').then(setSummary).catch(() => {});
  }, []);

  // Scroll to hash anchor (e.g. /#stories) after mount
  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) {
        // Small delay lets the page render and animations initialize
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 100);
      }
    }
  }, [location.hash]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <SEOHead
        title="Indian Data Project — Government Data, Made Visible"
        description="Dense PDFs and buried spreadsheets turned into interactive visual stories. Real data. No spin. Open source."
        path="/"
      />

      <HubHero />

      {/* Domain stories */}
      <section id="stories" className="max-w-5xl mx-auto px-6 sm:px-8 pb-24 scroll-mt-20">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
          className="text-section-num tracking-[0.15em] uppercase mb-8"
        >
          {'Data Stories'}
        </motion.p>

        <DomainCard summary={summary} />

        <ComingSoon />
      </section>
    </motion.div>
  );
}
