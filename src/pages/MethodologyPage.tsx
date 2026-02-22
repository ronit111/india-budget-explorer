import { motion } from 'framer-motion';
import { SEOHead } from '../components/seo/SEOHead.tsx';

const SECTIONS = [
  {
    title: 'Data Sources',
    content: (
      <>
        <p>
          All budget figures are sourced from the Union Budget 2025-26 documents published by the
          Ministry of Finance. The primary data pipeline pulls from:
        </p>
        <ul className="mt-3 space-y-2">
          <li className="flex gap-3">
            <span style={{ color: 'var(--saffron)' }}>&#8226;</span>
            <span>
              <a
                href="https://openbudgetsindia.org/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--cyan)' }}
              >
                Open Budgets India
              </a>{' '}
              for structured budget data
            </span>
          </li>
          <li className="flex gap-3">
            <span style={{ color: 'var(--saffron)' }}>&#8226;</span>
            <span>
              Union Budget documents (Expenditure Budget Vol. 1 & 2, Receipt Budget, Finance Bill)
              from{' '}
              <a
                href="https://www.indiabudget.gov.in/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--cyan)' }}
              >
                indiabudget.gov.in
              </a>
            </span>
          </li>
          <li className="flex gap-3">
            <span style={{ color: 'var(--saffron)' }}>&#8226;</span>
            <span>Population estimates from Census projections and RBI reports</span>
          </li>
        </ul>
      </>
    ),
  },
  {
    title: 'Tax Calculator',
    content: (
      <>
        <p>
          The tax computation follows the Income Tax Act slab rates for AY 2026-27 (FY 2025-26).
          Both Old and New regime rates are implemented with:
        </p>
        <ul className="mt-3 space-y-2">
          <li className="flex gap-3">
            <span style={{ color: 'var(--saffron)' }}>&#8226;</span>
            <span>Standard deduction (Rs 75,000 new / Rs 50,000 old)</span>
          </li>
          <li className="flex gap-3">
            <span style={{ color: 'var(--saffron)' }}>&#8226;</span>
            <span>Section 87A rebate</span>
          </li>
          <li className="flex gap-3">
            <span style={{ color: 'var(--saffron)' }}>&#8226;</span>
            <span>Surcharge slabs for high incomes</span>
          </li>
          <li className="flex gap-3">
            <span style={{ color: 'var(--saffron)' }}>&#8226;</span>
            <span>4% Health and Education Cess</span>
          </li>
        </ul>
        <div
          className="mt-4 rounded-lg px-4 py-3"
          style={{ background: 'var(--bg-raised)', borderLeft: '3px solid var(--gold)' }}
        >
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            The calculator does not account for HRA, 80C, 80D, or other specific deductions
            under the Old Regime. It uses gross income and standard deduction only.
          </p>
        </div>
      </>
    ),
  },
  {
    title: 'Number Formatting',
    content: (
      <p>
        All numbers use the Indian numbering system (lakhs and crores), formatted as per
        convention: 50,21,536 (not 5,021,536). Large amounts are displayed in "lakh crore" where
        appropriate.
      </p>
    ),
  },
  {
    title: 'Per-Capita Calculations',
    content: (
      <p>
        Per-capita figures use an estimated population of 145 crore (1.45 billion) for 2025-26.
        This is an approximation based on Census projections and may differ from the actual figure
        when the next Census is conducted.
      </p>
    ),
  },
  {
    title: 'Open Data License',
    content: (
      <p>
        Budget data is released by the Government of India under the{' '}
        <a
          href="https://data.gov.in/government-open-data-license-india"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'var(--cyan)' }}
        >
          Government Open Data License - India (GODL)
        </a>
        . This project uses that data for public-interest visualization. The project is not
        affiliated with or endorsed by the Government of India.
      </p>
    ),
  },
  {
    title: 'Limitations',
    content: (
      <ul className="space-y-2">
        <li className="flex gap-3">
          <span style={{ color: 'var(--saffron)' }}>&#8226;</span>
          <span>
            Budget Estimates only. Revised Estimates and Actuals are not yet available for
            2025-26.
          </span>
        </li>
        <li className="flex gap-3">
          <span style={{ color: 'var(--saffron)' }}>&#8226;</span>
          <span>
            Ministry-level aggregation simplifies the actual 100+ demand-for-grants structure.
          </span>
        </li>
        <li className="flex gap-3">
          <span style={{ color: 'var(--saffron)' }}>&#8226;</span>
          <span>
            State transfer figures are approximations. Actual Finance Commission devolution
            follows a complex formula.
          </span>
        </li>
      </ul>
    ),
  },
];

export default function MethodologyPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-3xl mx-auto px-4 py-8 md:py-12"
    >
      <SEOHead
        title="Methodology — India Budget Explorer"
        description="Data sources, tax calculation methodology, number formatting, per-capita estimates, and limitations of the India Budget Explorer. Data under GODL license."
        path="/methodology"
      />

      <h1 className="text-composition mb-2">Methodology</h1>
      <p className="text-annotation mb-10">
        Data sources, calculation methodology, and known limitations.
      </p>

      <div className="space-y-10">
        {SECTIONS.map((section, i) => (
          <motion.section
            key={section.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
          >
            <h2
              className="text-lg font-semibold mb-3"
              style={{ color: 'var(--text-primary)' }}
            >
              {section.title}
            </h2>
            <div className="text-annotation leading-relaxed">{section.content}</div>
          </motion.section>
        ))}
      </div>

      <p className="source-attribution mt-12">
        Source: Union Budget 2025-26, Ministry of Finance, Government of India
      </p>
    </motion.div>
  );
}
