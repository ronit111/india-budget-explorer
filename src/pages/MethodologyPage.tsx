import { SEOHead } from '../components/seo/SEOHead.tsx';

export default function MethodologyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 md:py-12">
      <SEOHead
        title="Methodology — India Budget Explorer"
        description="Data sources, tax calculation methodology, number formatting, per-capita estimates, and limitations of the India Budget Explorer. Data under GODL license."
        path="/methodology"
      />
      <h1 className="text-3xl md:text-4xl font-bold mb-8">Methodology</h1>

      <div className="space-y-8 text-[var(--color-text-secondary)]">
        <section>
          <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-3">
            Data Sources
          </h2>
          <p>
            All budget figures are sourced from the Union Budget 2025-26 documents
            published by the Ministry of Finance. The primary data pipeline pulls
            from:
          </p>
          <ul className="mt-3 space-y-2 ml-4">
            <li className="flex gap-2">
              <span className="text-[var(--color-saffron)]">&#8226;</span>
              <span>
                <a
                  href="https://openbudgetsindia.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--color-blue)] hover:text-[var(--color-blue-hover)]"
                >
                  Open Budgets India
                </a>{' '}
                for structured budget data
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-[var(--color-saffron)]">&#8226;</span>
              <span>
                Union Budget documents (Expenditure Budget Vol. 1 &amp; 2,
                Receipt Budget, Finance Bill) available on{' '}
                <a
                  href="https://www.indiabudget.gov.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--color-blue)] hover:text-[var(--color-blue-hover)]"
                >
                  indiabudget.gov.in
                </a>
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-[var(--color-saffron)]">&#8226;</span>
              <span>Population estimates from Census projections and RBI reports</span>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-3">
            Tax Calculator
          </h2>
          <p>
            The tax computation follows the Income Tax Act slab rates for AY 2026-27
            (FY 2025-26). Both Old and New regime rates are implemented with:
          </p>
          <ul className="mt-3 space-y-2 ml-4">
            <li className="flex gap-2">
              <span className="text-[var(--color-saffron)]">&#8226;</span>
              <span>Standard deduction (Rs 75,000 new / Rs 50,000 old)</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[var(--color-saffron)]">&#8226;</span>
              <span>Section 87A rebate</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[var(--color-saffron)]">&#8226;</span>
              <span>Surcharge slabs for high incomes</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[var(--color-saffron)]">&#8226;</span>
              <span>4% Health and Education Cess</span>
            </li>
          </ul>
          <p className="mt-3 text-sm text-[var(--color-text-muted)]">
            Note: The calculator does not account for HRA, 80C, 80D, or other
            specific deductions under the Old Regime. It uses gross income and
            standard deduction only.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-3">
            Number Formatting
          </h2>
          <p>
            All numbers use the Indian numbering system (lakhs and crores),
            formatted as per convention: 50,21,536 (not 5,021,536). Large
            amounts are displayed in &ldquo;lakh crore&rdquo; where appropriate.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-3">
            Per-Capita Calculations
          </h2>
          <p>
            Per-capita figures use an estimated population of 145 crore (1.45 billion)
            for 2025-26. This is an approximation based on Census projections and may
            differ slightly from the actual figure when the next Census is conducted.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-3">
            Open Data License
          </h2>
          <p>
            Budget data is released by the Government of India under the{' '}
            <a
              href="https://data.gov.in/government-open-data-license-india"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-blue)] hover:text-[var(--color-blue-hover)]"
            >
              Government Open Data License - India (GODL)
            </a>
            . This project uses that data for public-interest visualization. The project
            itself is not affiliated with or endorsed by the Government of India.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-3">
            Limitations
          </h2>
          <ul className="space-y-2 ml-4">
            <li className="flex gap-2">
              <span className="text-[var(--color-saffron)]">&#8226;</span>
              <span>
                Budget Estimates only. Revised Estimates and Actuals are not yet
                available for 2025-26.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-[var(--color-saffron)]">&#8226;</span>
              <span>
                Ministry-level aggregation simplifies the actual 100+ demand-for-grants
                structure.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-[var(--color-saffron)]">&#8226;</span>
              <span>
                State transfer figures are approximations. Actual Finance Commission
                devolution follows a complex formula.
              </span>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
