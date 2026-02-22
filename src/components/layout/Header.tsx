import { Link, useLocation } from 'react-router-dom';
import { useUIStore } from '../../store/uiStore.ts';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/explore', label: 'Explore' },
  { to: '/calculator', label: 'Your Share' },
  { to: '/methodology', label: 'Methodology' },
];

export function Header() {
  const location = useLocation();
  const toggleSearch = useUIStore((s) => s.toggleSearch);

  return (
    <header className="glass fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 no-underline">
          <span className="text-xl font-bold gradient-text-saffron">
            India Budget Explorer
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors no-underline ${
                location.pathname === link.to
                  ? 'text-[var(--color-saffron)] bg-[rgba(255,107,53,0.1)]'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-raised)]'
              }`}
            >
              {link.label}
            </Link>
          ))}

          <button
            onClick={toggleSearch}
            className="ml-2 px-3 py-1.5 rounded-lg text-xs text-[var(--color-text-muted)] bg-[var(--color-bg-raised)] border border-[rgba(255,255,255,0.08)] hover:border-[var(--color-saffron)] transition-colors cursor-pointer"
            aria-label="Search"
          >
            <span className="font-mono">Cmd+K</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
