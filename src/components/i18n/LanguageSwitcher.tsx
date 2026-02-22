import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from '../../lib/i18n.ts';

/**
 * Language switcher dropdown for the header.
 * Shows script names (हिन्दी, తెలుగు, etc.) alongside codes.
 */
export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = SUPPORTED_LANGUAGES.find((l) => l.code === i18n.language)
    ?? SUPPORTED_LANGUAGES[0];

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const switchLanguage = (code: string) => {
    setOpen(false);

    // Strip existing lang prefix from path
    const pathParts = location.pathname.split('/').filter(Boolean);
    const currentLangInPath = SUPPORTED_LANGUAGES.find((l) => l.code === pathParts[0]);
    const basePath = currentLangInPath
      ? '/' + pathParts.slice(1).join('/')
      : location.pathname;

    const newPath = code === DEFAULT_LANGUAGE
      ? basePath || '/'
      : `/${code}${basePath}`;

    navigate(newPath);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer"
        style={{
          color: 'var(--text-muted)',
          background: open ? 'var(--bg-raised)' : 'transparent',
        }}
        aria-label="Switch language"
      >
        {current.code.toUpperCase()}
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" style={{ opacity: 0.5 }}>
          <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-1 rounded-lg py-1 min-w-[140px] z-50"
          style={{
            background: 'var(--bg-raised)',
            border: 'var(--border-subtle)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
          }}
        >
          {SUPPORTED_LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => switchLanguage(lang.code)}
              className="w-full px-3 py-2 text-left text-sm transition-colors cursor-pointer flex justify-between items-center"
              style={{
                color: lang.code === current.code ? 'var(--saffron)' : 'var(--text-secondary)',
                background: 'transparent',
                border: 'none',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-hover)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <span>{lang.label}</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>
                {lang.code.toUpperCase()}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
