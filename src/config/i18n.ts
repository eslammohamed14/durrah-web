/**
 * Internationalization configuration.
 * Defines supported locales, default locale, and locale metadata.
 */

import type { Locale } from '@/lib/types';

export const SUPPORTED_LOCALES: Locale[] = ['en', 'ar'];
export const DEFAULT_LOCALE: Locale = 'en';

export interface LocaleConfig {
  code: Locale;
  name: string;
  nativeName: string;
  dir: 'ltr' | 'rtl';
}

export const LOCALE_CONFIG: Record<Locale, LocaleConfig> = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    dir: 'ltr',
  },
  ar: {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    dir: 'rtl',
  },
};

export function isValidLocale(value: unknown): value is Locale {
  return typeof value === 'string' && SUPPORTED_LOCALES.includes(value as Locale);
}

export function getLocaleDir(locale: Locale): 'ltr' | 'rtl' {
  return LOCALE_CONFIG[locale].dir;
}
