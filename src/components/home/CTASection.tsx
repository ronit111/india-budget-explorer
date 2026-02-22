import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useScrollTrigger } from '../../hooks/useScrollTrigger.ts';
import { SectionNumber } from '../ui/SectionNumber.tsx';

export function CTASection() {
  const [ref, isVisible] = useScrollTrigger({ threshold: 0.15 });

  return (
    <section ref={ref} className="composition">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <SectionNumber number={5} className="mb-6 block text-center" />

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-composition mb-10"
        >
          Go deeper
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          >
            <Link
              to="/calculator"
              className="group block rounded-xl p-6 transition-all duration-300 no-underline hover:-translate-y-1"
              style={{
                background: 'linear-gradient(135deg, rgba(255,107,53,0.08), rgba(255,200,87,0.04))',
                border: 'var(--border-subtle)',
              }}
            >
              <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                Find Your Share
              </h3>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                Enter your income. See where your tax rupees go.
              </p>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          >
            <Link
              to="/explore"
              className="group block rounded-xl p-6 transition-all duration-300 no-underline hover:-translate-y-1"
              style={{
                background: 'linear-gradient(135deg, rgba(74,234,220,0.06), rgba(59,130,246,0.04))',
                border: 'var(--border-subtle)',
              }}
            >
              <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                Data Explorer
              </h3>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                Full dataset. Sortable tables, scheme breakdowns, CSV export.
              </p>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
