import arMessages from './ar.json';
import enMessages from './en.json';

export type Locale = 'ar' | 'en';

export const translations = {
  ar: arMessages,
  en: enMessages,
};

export function getDictionary(locale: Locale) {
  return translations[locale] || translations.ar;
}

export function isRTL(locale: Locale): boolean {
  return locale === 'ar';
}

// Deep get helper with fallback
export function t(
  locale: Locale,
  path: string,
  params?: Record<string, string | number>
): string {
  const dict = getDictionary(locale);
  const keys = path.split('.');
  let current: unknown = dict;

  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = (current as Record<string, unknown>)[key];
    } else {
      // fallback to Arabic
      current = undefined;
      break;
    }
  }

  if (typeof current !== 'string') {
    // try Arabic fallback
    let fallback: unknown = translations.ar;
    for (const key of keys) {
      if (fallback && typeof fallback === 'object' && key in fallback) {
        fallback = (fallback as Record<string, unknown>)[key];
      } else {
        return path;
      }
    }
    current = fallback;
  }

  let text = String(current);
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      text = text.replace(new RegExp(`{${k}}`, 'g'), String(v));
    }
  }

  return text;
}
