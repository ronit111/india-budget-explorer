import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Fuse from 'fuse.js';
import { useUIStore } from '../../store/uiStore.ts';
import { useBudgetStore } from '../../store/budgetStore.ts';
import { useBudgetData } from '../../hooks/useBudgetData.ts';

interface SearchItem {
  type: 'ministry' | 'scheme' | 'page';
  id: string;
  name: string;
  subtitle: string;
  route: string;
}

export function SearchOverlay() {
  const { searchOpen, setSearchOpen } = useUIStore();
  const year = useBudgetStore((s) => s.selectedYear);
  const { expenditure, schemes } = useBudgetData(year);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchItem[]>([]);

  // Build search index
  const searchItems: SearchItem[] = [];
  if (expenditure) {
    for (const m of expenditure.ministries) {
      searchItems.push({
        type: 'ministry',
        id: m.id,
        name: m.name,
        subtitle: m.humanContext,
        route: `/explore?ministry=${m.id}`,
      });
    }
  }
  if (schemes) {
    for (const s of schemes.schemes) {
      searchItems.push({
        type: 'scheme',
        id: s.id,
        name: s.name,
        subtitle: s.humanContext,
        route: `/explore?scheme=${s.id}`,
      });
    }
  }
  searchItems.push(
    { type: 'page', id: 'home', name: 'Home', subtitle: 'Budget overview and visualizations', route: '/' },
    { type: 'page', id: 'explore', name: 'Data Explorer', subtitle: 'Sortable table of all ministries', route: '/explore' },
    { type: 'page', id: 'calculator', name: 'Tax Calculator', subtitle: 'Find where your taxes go', route: '/calculator' },
    { type: 'page', id: 'methodology', name: 'Methodology', subtitle: 'How we process the data', route: '/methodology' },
    { type: 'page', id: 'economy', name: 'Economic Survey', subtitle: 'GDP, inflation, fiscal, trade analysis', route: '/economy' },
    { type: 'page', id: 'economy-explore', name: 'Indicator Explorer', subtitle: 'Browse economic indicators across years', route: '/economy/explore' },
    { type: 'page', id: 'economy-methodology', name: 'Economy Methodology', subtitle: 'Economic Survey data sources and notes', route: '/economy/methodology' },
  );

  const fuse = new Fuse(searchItems, {
    keys: ['name', 'subtitle'],
    threshold: 0.4,
  });

  const handleSearch = useCallback(
    (q: string) => {
      setQuery(q);
      if (q.trim().length === 0) {
        setResults(searchItems.filter((s) => s.type === 'page'));
      } else {
        setResults(fuse.search(q).map((r) => r.item).slice(0, 8));
      }
    },
    [expenditure, schemes]
  );

  // Keyboard shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(!searchOpen);
      }
      if (e.key === 'Escape') setSearchOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [searchOpen, setSearchOpen]);

  // Focus input when opened
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      handleSearch('');
    } else {
      setQuery('');
    }
  }, [searchOpen]);

  if (!searchOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]"
      onClick={() => setSearchOpen(false)}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-lg mx-4 rounded-xl shadow-2xl overflow-hidden"
        style={{
          background: 'var(--bg-surface)',
          border: 'var(--border-subtle)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center px-4" style={{ borderBottom: 'var(--border-divider)' }}>
          <svg className="w-5 h-5" style={{ color: 'var(--text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search ministries, schemes, pages..."
            className="w-full px-3 py-4 bg-transparent border-none outline-none text-sm"
            style={{ color: 'var(--text-primary)' }}
          />
          <kbd
            className="text-xs px-2 py-0.5 rounded font-mono"
            style={{ color: 'var(--text-muted)', background: 'var(--bg-raised)' }}
          >
            Esc
          </kbd>
        </div>

        <div className="max-h-80 overflow-y-auto p-2">
          {results.length === 0 && query.length > 0 && (
            <p className="text-sm px-3 py-4 text-center" style={{ color: 'var(--text-muted)' }}>
              No results found
            </p>
          )}
          {results.map((item) => (
            <button
              key={`${item.type}-${item.id}`}
              onClick={() => {
                navigate(item.route);
                setSearchOpen(false);
              }}
              className="w-full text-left px-3 py-2.5 rounded-lg transition-colors flex items-start gap-3 cursor-pointer bg-transparent border-none"
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-raised)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <span
                className="mt-0.5 text-[10px] font-mono uppercase px-1.5 py-0.5 rounded"
                style={{
                  background: item.type === 'ministry'
                    ? 'var(--saffron-dim)'
                    : item.type === 'scheme'
                    ? 'rgba(16,185,129,0.15)'
                    : 'rgba(59,130,246,0.15)',
                  color: item.type === 'ministry'
                    ? 'var(--saffron)'
                    : item.type === 'scheme'
                    ? 'var(--positive)'
                    : '#3B82F6',
                }}
              >
                {item.type}
              </span>
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{item.name}</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{item.subtitle}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
