import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useScrollTrigger } from '../../hooks/useScrollTrigger.ts';
import { SectionNumber } from '../ui/SectionNumber.tsx';

function GlowCard({
  to,
  title,
  description,
  accentColor,
  delay,
  isVisible,
}: {
  to: string;
  title: string;
  description: string;
  accentColor: string;
  delay: number;
  isVisible: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay }}
    >
      <Link
        to={to}
        className="group block relative rounded-xl p-px no-underline overflow-hidden h-full"
        style={{ transition: 'transform 0.3s ease' }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0px)';
        }}
      >
        {/* Animated gradient border */}
        <div
          className="absolute inset-0 rounded-xl opacity-40 group-hover:opacity-100"
          style={{
            background: `linear-gradient(135deg, ${accentColor}, transparent 50%, ${accentColor})`,
            transition: 'opacity 0.4s ease',
          }}
        />
        {/* Hover glow */}
        <div
          className="absolute -inset-1 rounded-xl opacity-0 group-hover:opacity-100 blur-xl"
          style={{
            background: accentColor,
            opacity: 0,
            transition: 'opacity 0.4s ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.12'; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = '0'; }}
        />
        {/* Card content */}
        <div
          className="relative rounded-xl px-8 py-8 h-full flex flex-col"
          style={{ background: 'var(--bg-surface)' }}
        >
          <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            {title}
          </h3>
          <p className="text-sm leading-relaxed flex-1" style={{ color: 'var(--text-secondary)' }}>
            {description}
          </p>
          <div
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium"
            style={{ color: accentColor }}
          >
            <span>Explore</span>
            <span className="group-hover:translate-x-1" style={{ transition: 'transform 0.2s ease' }}>
              &rarr;
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function CTASection() {
  const [ref, isVisible] = useScrollTrigger({ threshold: 0.15 });

  return (
    <section ref={ref} className="composition">
      <div className="max-w-4xl mx-auto px-6 sm:px-8 text-center">
        <SectionNumber number={7} className="mb-6 block text-center" isVisible={isVisible} />

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-composition mb-12"
        >
          Go deeper
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-8">
          <GlowCard
            to="/budget/calculator"
            title="Find Your Share"
            description="Enter your income. See exactly where your tax rupees go across Defence, Education, Health, and every ministry."
            accentColor="var(--saffron)"
            delay={0.1}
            isVisible={isVisible}
          />
          <GlowCard
            to="/budget/explore"
            title="Data Explorer"
            description="Full dataset. Sortable tables, scheme-level breakdowns, per-capita numbers. Export to CSV."
            accentColor="var(--cyan)"
            delay={0.2}
            isVisible={isVisible}
          />
        </div>
      </div>
    </section>
  );
}
