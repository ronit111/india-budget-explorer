import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { DEFAULT_LANGUAGE, LANGUAGE_CODES } from '../../lib/i18n.ts';

/**
 * Syncs the URL /:lang? parameter with i18next's active language.
 * Place inside the route tree where :lang param is available.
 */
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { lang } = useParams<{ lang?: string }>();
  const { i18n } = useTranslation();

  useEffect(() => {
    const target = lang && LANGUAGE_CODES.includes(lang as typeof LANGUAGE_CODES[number])
      ? lang
      : DEFAULT_LANGUAGE;

    if (i18n.language !== target) {
      i18n.changeLanguage(target);
    }

    document.documentElement.lang = target;
  }, [lang, i18n]);

  return <>{children}</>;
}
