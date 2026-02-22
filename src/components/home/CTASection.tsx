import { Link } from 'react-router-dom';

export function CTASection() {
  return (
    <section className="py-20 md:py-32 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Go deeper
        </h2>
        <p className="text-[var(--color-text-secondary)] text-lg mb-12 max-w-xl mx-auto">
          Calculate exactly where your tax rupees go, or explore the full dataset
          ministry by ministry.
        </p>

        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <Link
            to="/calculator"
            className="group bg-[var(--color-bg-surface)] border border-[rgba(255,255,255,0.08)] rounded-2xl p-8 hover:border-[var(--color-saffron)] transition-all duration-300 no-underline"
          >
            <div className="w-12 h-12 rounded-xl bg-[rgba(255,107,53,0.1)] flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-[var(--color-saffron)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">
              Find Your Share
            </h3>
            <p className="text-sm text-[var(--color-text-muted)]">
              Enter your income. See how much tax you pay and exactly
              which government services your money funds.
            </p>
          </Link>

          <Link
            to="/explore"
            className="group bg-[var(--color-bg-surface)] border border-[rgba(255,255,255,0.08)] rounded-2xl p-8 hover:border-[var(--color-blue)] transition-all duration-300 no-underline"
          >
            <div className="w-12 h-12 rounded-xl bg-[rgba(59,130,246,0.1)] flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-[var(--color-blue)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">
              Data Explorer
            </h3>
            <p className="text-sm text-[var(--color-text-muted)]">
              Sortable tables, scheme breakdowns, and CSV export.
              The full dataset at your fingertips.
            </p>
          </Link>
        </div>
      </div>
    </section>
  );
}
