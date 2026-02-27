import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { DEFAULT_LANGUAGE, LANGUAGE_CODES } from '../../lib/i18n.ts';

/**
 * Syncs the URL language prefix with i18next's active language.
 * Parses /:lang from location.pathname directly (works outside <Route>).
 */
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { i18n } = useTranslation();

  useEffect(() => {
    const firstSegment = location.pathname.split('/')[1];
    const lang = LANGUAGE_CODES.includes(firstSegment as typeof LANGUAGE_CODES[number])
      ? firstSegment
      : DEFAULT_LANGUAGE;

    if (i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }

    document.documentElement.lang = lang;
  }, [location.pathname, i18n]);

  return <>{children}</>;
}
