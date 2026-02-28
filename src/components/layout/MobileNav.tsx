import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

// SVG path data for tab icons
const ICONS = {
  home: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
  budget: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  economy: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
  rbi: 'M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3',
  explore: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
  calculator: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z',
  methodology: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  glossary: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
};

export function MobileNav() {
  const location = useLocation();
  const isBudgetSection = location.pathname.startsWith('/budget');
  const isEconomySection = location.pathname.startsWith('/economy');
  const isRBISection = location.pathname.startsWith('/rbi');

  const hubTabs = [
    { to: '/', label: 'Home', icon: ICONS.home },
    { to: '/budget', label: 'Budget', icon: ICONS.budget },
    { to: '/economy', label: 'Economy', icon: ICONS.economy },
    { to: '/rbi', label: 'RBI', icon: ICONS.rbi },
  ];

  const budgetTabs = [
    { to: '/', label: 'Hub', icon: ICONS.home },
    { to: '/budget', label: 'Story', icon: ICONS.budget },
    { to: '/budget/explore', label: 'Explore', icon: ICONS.explore },
    { to: '/budget/calculator', label: 'Your Share', icon: ICONS.calculator },
    { to: '/budget/methodology', label: 'Methods', icon: ICONS.methodology },
    { to: '/budget/glossary', label: 'Glossary', icon: ICONS.glossary },
  ];

  const economyTabs = [
    { to: '/', label: 'Hub', icon: ICONS.home },
    { to: '/economy', label: 'Story', icon: ICONS.economy },
    { to: '/economy/explore', label: 'Explore', icon: ICONS.explore },
    { to: '/economy/methodology', label: 'Methods', icon: ICONS.methodology },
    { to: '/economy/glossary', label: 'Glossary', icon: ICONS.glossary },
  ];

  const rbiTabs = [
    { to: '/', label: 'Hub', icon: ICONS.home },
    { to: '/rbi', label: 'Story', icon: ICONS.rbi },
    { to: '/rbi/explore', label: 'Explore', icon: ICONS.explore },
    { to: '/rbi/methodology', label: 'Methods', icon: ICONS.methodology },
    { to: '/rbi/glossary', label: 'Glossary', icon: ICONS.glossary },
  ];

  const tabs = isBudgetSection
    ? budgetTabs
    : isEconomySection
      ? economyTabs
      : isRBISection
        ? rbiTabs
        : hubTabs;

  const isActiveTab = (tabTo: string) => {
    if (tabTo === '/') return location.pathname === '/';
    if (tabTo === '/budget') return location.pathname === '/budget';
    if (tabTo === '/economy') return location.pathname === '/economy';
    if (tabTo === '/rbi') return location.pathname === '/rbi';
    return location.pathname === tabTo;
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass mobile-nav-safe">
      <div className="flex justify-around items-center h-14">
        {tabs.map((tab) => {
          const isActive = isActiveTab(tab.to);
          return (
            <Link
              key={tab.to}
              to={tab.to}
              className="relative flex flex-col items-center gap-1 px-3 py-1 no-underline transition-colors"
              style={{
                color: isActive ? 'var(--saffron)' : 'var(--text-muted)',
              }}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={isActive ? 2 : 1.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d={tab.icon} />
              </svg>
              <span className="text-[10px] font-medium">{tab.label}</span>
              {isActive && (
                <motion.div
                  layoutId="mobile-nav-dot"
                  className="absolute bottom-0 w-1 h-1 rounded-full"
                  style={{ backgroundColor: 'var(--saffron)' }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
