import { Link, useLocation } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useUIStore } from '../../store/uiStore.ts';
import { LanguageSwitcher } from '../i18n/LanguageSwitcher.tsx';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/explore', label: 'Explore' },
  { to: '/calculator', label: 'Your Share' },
  { to: '/methodology', label: 'Methodology' },
];

export function Header() {
  const location = useLocation();
  const toggleSearch = useUIStore((s) => s.toggleSearch);
  const { scrollY } = useScroll();

  const bgOpacity = useTransform(scrollY, [0, 100], [0, 1]);
  const borderOpacity = useTransform(scrollY, [0, 100], [0, 0.06]);

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
        <Link to="/" className="flex items-center gap-2 no-underline">
          <span className="text-lg font-bold gradient-text-saffron">
            India Budget Explorer
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className="relative px-3 py-2 text-sm font-medium transition-colors no-underline"
                style={{
                  color: isActive
                    ? 'var(--text-primary)'
                    : 'var(--text-muted)',
                }}
              >
                {link.label}
                {isActive && (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full"
                    style={{ backgroundColor: 'var(--saffron)' }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}

          <button
            onClick={toggleSearch}
            className="ml-3 px-3 py-1.5 rounded-lg text-xs font-mono cursor-pointer transition-colors"
            style={{
              color: 'var(--text-muted)',
              background: 'var(--bg-raised)',
              border: 'var(--border-subtle)',
            }}
            aria-label="Search"
          >
            Cmd+K
          </button>

          <LanguageSwitcher />
        </nav>
      </div>
    </motion.header>
  );
}
