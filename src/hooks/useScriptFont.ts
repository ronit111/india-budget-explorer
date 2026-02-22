import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Dynamically loads the appropriate Noto Sans font for non-Latin scripts.
 * Call once at the app root level.
 *
 * Font packages must be installed:
 * - @fontsource-variable/noto-sans-devanagari (Hindi)
 * - @fontsource-variable/noto-sans-telugu (Telugu)
 * - @fontsource-variable/noto-sans-tamil (Tamil)
 * - @fontsource-variable/noto-sans-kannada (Kannada)
 * - @fontsource-variable/noto-sans-malayalam (Malayalam)
 */
export function useScriptFont() {
  const { i18n } = useTranslation();

  useEffect(() => {
    const lang = i18n.language;

    // English uses Inter, already loaded
    if (lang === 'en') {
      document.documentElement.style.removeProperty('--font-script');
      return;
    }

    const fontMap: Record<string, { family: string; importPath: string }> = {
      hi: { family: "'Noto Sans Devanagari'", importPath: '@fontsource-variable/noto-sans-devanagari' },
      te: { family: "'Noto Sans Telugu'", importPath: '@fontsource-variable/noto-sans-telugu' },
      ta: { family: "'Noto Sans Tamil'", importPath: '@fontsource-variable/noto-sans-tamil' },
      kn: { family: "'Noto Sans Kannada'", importPath: '@fontsource-variable/noto-sans-kannada' },
      ml: { family: "'Noto Sans Malayalam'", importPath: '@fontsource-variable/noto-sans-malayalam' },
    };

    const font = fontMap[lang];
    if (!font) return;

    // Dynamic import — only loads the CSS (and font files) when needed
    import(/* @vite-ignore */ font.importPath)
      .then(() => {
        document.documentElement.style.setProperty(
          '--font-script',
          `${font.family}, var(--font-body)`
        );
      })
      .catch(() => {
        // Font package not installed yet — fail silently, use fallback
      });
  }, [i18n.language]);
}
