export function Footer() {
  return (
    <footer className="relative py-6 pb-20 md:pb-6">
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06) 20%, rgba(255,255,255,0.06) 80%, transparent)',
        }}
      />
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-2">
        <p className="text-caption text-center md:text-left">
          Data from{' '}
          <a
            href="https://openbudgetsindia.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--text-secondary)] transition-colors"
            style={{ color: 'var(--text-muted)' }}
          >
            Open Budgets India
          </a>
          {' '}&middot;{' '}
          <a
            href="https://data.gov.in/government-open-data-license-india"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--text-secondary)] transition-colors"
            style={{ color: 'var(--text-muted)' }}
          >
            GODL
          </a>
          {' '}&middot; Not affiliated with GoI
        </p>
        <p className="text-caption">Union Budget 2025-26</p>
      </div>
    </footer>
  );
}
