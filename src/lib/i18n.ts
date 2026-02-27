import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

export const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English', script: 'Latin' },
  { code: 'hi', label: 'हिन्दी', script: 'Devanagari' },
  { code: 'te', label: 'తెలుగు', script: 'Telugu' },
  { code: 'ta', label: 'தமிழ்', script: 'Tamil' },
  { code: 'kn', label: 'ಕನ್ನಡ', script: 'Kannada' },
  { code: 'ml', label: 'മലയാളം', script: 'Malayalam' },
] as const;

export const LANGUAGE_CODES = SUPPORTED_LANGUAGES.map((l) => l.code);
export const DEFAULT_LANGUAGE = 'en';

export const NAMESPACES = [
  'common',
  'home',
  'explore',
  'calculator',
  'methodology',
  'viz',
  'seo',
] as const;

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: DEFAULT_LANGUAGE,
    supportedLngs: LANGUAGE_CODES,
    defaultNS: 'common',
    ns: ['common', 'seo'],

    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },

    detection: {
      order: ['path', 'localStorage', 'navigator'],
      lookupFromPathIndex: 0,
      caches: ['localStorage'],
    },

    interpolation: {
      escapeValue: false, // React handles XSS
    },

    react: {
      useSuspense: false, // Don't block rendering while loading translations
    },
  });

export default i18n;
