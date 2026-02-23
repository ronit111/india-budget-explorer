export function Footer() {
  return (
    <footer className="relative py-8 pb-24 md:pb-8" style={{ background: 'var(--bg-surface)' }}>
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08) 20%, rgba(255,255,255,0.08) 80%, transparent)',
        }}
      />
      <div className="max-w-7xl mx-auto px-6 sm:px-8 flex flex-col md:flex-row justify-between items-center gap-3">
        <p className="text-caption text-center md:text-left">
          Data from{' '}
          <a
            href="https://openbudgetsindia.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors"
            style={{ color: 'var(--text-muted)', textDecoration: 'underline', textDecorationColor: 'transparent' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.textDecorationColor = 'var(--text-muted)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.textDecorationColor = 'transparent'; }}
          >
            Open Budgets India
          </a>
          {' '}&middot;{' '}
          <a
            href="https://data.gov.in/government-open-data-license-india"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors"
            style={{ color: 'var(--text-muted)', textDecoration: 'underline', textDecorationColor: 'transparent' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.textDecorationColor = 'var(--text-muted)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.textDecorationColor = 'transparent'; }}
          >
            GODL
          </a>
          {' '}&middot; Not affiliated with GoI
        </p>
        <p className="text-caption font-mono" style={{ color: 'var(--text-muted)' }}>
          Union Budget 2025-26
        </p>
      </div>
    </footer>
  );
}
