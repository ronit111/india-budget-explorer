import { Link, useLocation } from 'react-router-dom';

export function Footer() {
  const location = useLocation();
  const isBudget = location.pathname.startsWith('/budget');

  return (
    <footer className="relative py-8 pb-24 md:pb-8" style={{ background: 'var(--bg-surface)' }}>
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08) 20%, rgba(255,255,255,0.08) 80%, transparent)',
        }}
      />
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {isBudget && (
          <div className="flex justify-center mb-6">
            <Link
              to="/#stories"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm no-underline transition-colors hover:bg-[var(--bg-raised)]"
              style={{ color: 'var(--text-muted)' }}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 3L5 8l5 5" />
              </svg>
              Indian Data Project
            </Link>
          </div>
        )}
        <div className="flex flex-col md:flex-row justify-between items-center gap-3">
        {isBudget ? (
          <p className="text-caption text-center md:text-left">
            Data from{' '}
            <a
              href="https://openbudgetsindia.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="link-hover"
              style={{ color: 'var(--text-muted)' }}
            >
              Open Budgets India
            </a>
            {' '}&middot;{' '}
            <a
              href="https://data.gov.in/government-open-data-license-india"
              target="_blank"
              rel="noopener noreferrer"
              className="link-hover"
              style={{ color: 'var(--text-muted)' }}
            >
              GODL
            </a>
            {' '}&middot; Not affiliated with GoI
          </p>
        ) : (
          <p className="text-caption text-center md:text-left">
            Open-source civic tech. Real government data, made accessible.
          </p>
        )}
        <p className="text-caption font-mono" style={{ color: 'var(--text-muted)' }}>
          {isBudget ? (
            'Union Budget 2025-26'
          ) : (
            <a
              href="https://github.com/RonitChidara/indian-data-project"
              target="_blank"
              rel="noopener noreferrer"
              className="link-hover"
              style={{ color: 'var(--text-muted)' }}
            >
              AGPL-3.0 · Open Source
            </a>
          )}
        </p>
        </div>
      </div>
    </footer>
  );
}
