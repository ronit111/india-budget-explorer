import { Link, useLocation } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useUIStore } from '../../store/uiStore.ts';

export function Header() {
  const location = useLocation();
  const toggleSearch = useUIStore((s) => s.toggleSearch);
  const { scrollY } = useScroll();

  const bgOpacity = useTransform(scrollY, [0, 100], [0, 1]);
  const borderOpacity = useTransform(scrollY, [0, 100], [0, 0.06]);

  const isBudgetSection = location.pathname.startsWith('/budget');
  const isEconomySection = location.pathname.startsWith('/economy');
  const isRBISection = location.pathname.startsWith('/rbi');
  const isStatesSection = location.pathname.startsWith('/states');
  const isDataDomain = isBudgetSection || isEconomySection || isRBISection || isStatesSection;

  // Context-aware title: show story name when inside a data story
  const headerTitle = isBudgetSection
    ? 'Budget 2025-26'
    : isEconomySection
      ? 'Economic Survey 2025-26'
      : isRBISection
        ? 'RBI Data'
        : isStatesSection
          ? 'State Finances'
          : 'Indian Data Project';
  const headerLink = isBudgetSection
    ? '/budget'
    : isEconomySection
      ? '/economy'
      : isRBISection
        ? '/rbi'
        : isStatesSection
          ? '/states'
          : '/';

  // Only show nav links inside a data story (domain sub-pages)
  const navLinks = isBudgetSection
    ? [
        { to: '/budget', label: 'Story' },
        { to: '/budget/explore', label: 'Explore' },
        { to: '/budget/calculator', label: 'Your Share' },
        { to: '/budget/methodology', label: 'Methodology' },
        { to: '/budget/glossary', label: 'Glossary' },
      ]
    : isEconomySection
      ? [
          { to: '/economy', label: 'Story' },
          { to: '/economy/explore', label: 'Explore' },
          { to: '/economy/methodology', label: 'Methodology' },
          { to: '/economy/glossary', label: 'Glossary' },
        ]
      : isRBISection
        ? [
            { to: '/rbi', label: 'Story' },
            { to: '/rbi/explore', label: 'Explore' },
            { to: '/rbi/methodology', label: 'Methodology' },
            { to: '/rbi/glossary', label: 'Glossary' },
          ]
        : isStatesSection
          ? [
              { to: '/states', label: 'Story' },
              { to: '/states/explore', label: 'Explore' },
              { to: '/states/methodology', label: 'Methodology' },
              { to: '/states/glossary', label: 'Glossary' },
            ]
          : [];

  const isActiveLink = (linkTo: string) => {
    if (linkTo === '/budget') return location.pathname === '/budget';
    if (linkTo === '/economy') return location.pathname === '/economy';
    if (linkTo === '/rbi') return location.pathname === '/rbi';
    if (linkTo === '/states') return location.pathname === '/states';
    return location.pathname === linkTo;
  };

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}
    >
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundColor: 'var(--bg-void)',
          opacity: bgOpacity,
        }}
      />
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          backgroundColor: 'white',
          opacity: borderOpacity,
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {isDataDomain && (
            <Link
              to="/#stories"
              className="flex items-center no-underline p-1.5 -ml-1.5 rounded-md transition-colors hover:bg-[var(--bg-raised)]"
              style={{ color: 'var(--text-muted)' }}
              aria-label="Back to hub"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 3L5 8l5 5" />
              </svg>
            </Link>
          )}
          <Link to={headerLink} className="flex items-center gap-2 no-underline">
            <span className="text-lg font-bold gradient-text-saffron">
              {headerTitle}
            </span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-2">
          {navLinks.map((link) => {
            const isActive = isActiveLink(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                className="relative px-4 py-2 text-sm font-medium no-underline rounded-lg transition-all duration-150 hover:bg-[var(--bg-raised)]"
                style={{
                  color: isActive
                    ? 'var(--text-primary)'
                    : 'var(--text-secondary)',
                }}
              >
                {link.label}
                {isActive && (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full"
                    style={{ backgroundColor: 'var(--saffron)' }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}

          {navLinks.length > 0 && (
            <div className="w-px h-5 mx-2" style={{ background: 'rgba(255,255,255,0.08)' }} />
          )}

          <button
            onClick={toggleSearch}
            className="p-2 rounded-lg cursor-pointer transition-colors hover:bg-[var(--bg-raised)]"
            style={{
              color: 'var(--text-muted)',
              background: 'transparent',
              border: 'none',
            }}
            aria-label="Search"
            title="Search (Cmd+K)"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </button>
        </nav>
      </div>
    </motion.header>
  );
}
