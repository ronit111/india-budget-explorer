export function Footer() {
  return (
    <footer className="border-t border-[rgba(255,255,255,0.05)] py-8 pb-24 md:pb-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-[var(--color-text-muted)]">
          <div className="text-center md:text-left">
            <p>
              Data sourced from{' '}
              <a
                href="https://openbudgetsindia.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-blue)] hover:text-[var(--color-blue-hover)] transition-colors"
              >
                Open Budgets India
              </a>{' '}
              and Union Budget documents.
            </p>
            <p className="mt-1 text-xs">
              Released under{' '}
              <a
                href="https://data.gov.in/government-open-data-license-india"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-blue)] hover:text-[var(--color-blue-hover)] transition-colors"
              >
                Government Open Data License - India (GODL)
              </a>
            </p>
          </div>

          <div className="text-center md:text-right text-xs">
            <p>Union Budget 2025-26</p>
            <p className="mt-1">Built as a public good. Not affiliated with GoI.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
