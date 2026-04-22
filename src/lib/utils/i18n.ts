/**
 * i18n utility functions for translation and locale management.
 */

import type { Locale } from '@/lib/types';
import { DEFAULT_LOCALE } from '@/config/i18n';
import enBundled from '../../../public/locales/en.json';
import arBundled from '../../../public/locales/ar.json';

// Lazily loaded translation dictionaries
const translationCache: Partial<Record<Locale, Record<string, unknown>>> = {
  en: enBundled as Record<string, unknown>,
  ar: arBundled as Record<string, unknown>,
};

/** Synchronous access to bundled locale JSON (used for first paint and after bfcache). */
export function getBundledTranslations(locale: Locale): Record<string, unknown> {
  return translationCache[locale] ?? translationCache[DEFAULT_LOCALE]!;
}

/**
 * Load translations for a given locale.
 * In a browser environment, fetches from /locales/{locale}.json.
 * Falls back to an empty object on failure.
 */
export async function loadTranslations(locale: Locale): Promise<Record<string, unknown>> {
  if (translationCache[locale]) {
    return translationCache[locale]!;
  }

  try {
    const response = await fetch(`/locales/${locale}.json`);
    if (!response.ok) throw new Error(`Failed to load translations for ${locale}`);
    const data = (await response.json()) as Record<string, unknown>;
    translationCache[locale] = data;
    return data;
  } catch {
    console.error(`[i18n] Could not load translations for locale: ${locale}`);
    return {};
  }
}

/**
 * Synchronously set translations in the cache (used for SSR or preloading).
 */
export function setTranslations(locale: Locale, translations: Record<string, unknown>): void {
  translationCache[locale] = translations;
}

/**
 * Resolve a dot-notation key from a nested object.
 * e.g. "auth.login" → translations.auth.login
 */
function resolvePath(obj: Record<string, unknown>, path: string): string | undefined {
  const parts = path.split('.');
  let current: unknown = obj;

  for (const part of parts) {
    if (current == null || typeof current !== 'object') return undefined;
    current = (current as Record<string, unknown>)[part];
  }

  return typeof current === 'string' ? current : undefined;
}

/**
 * Interpolate template variables in a translation string.
 * e.g. "Hello {{name}}" with { name: "Ali" } → "Hello Ali"
 */
function interpolate(template: string, params: Record<string, string | number>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => {
    return key in params ? String(params[key]) : `{{${key}}}`;
  });
}

/**
 * Create a translation function bound to a specific locale and its loaded translations.
 */
export function createTranslator(
  locale: Locale,
  translations: Record<string, unknown>
): (key: string, params?: Record<string, string | number>) => string {
  return function t(key: string, params?: Record<string, string | number>): string {
    const raw = resolvePath(translations, key);

    if (raw === undefined) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`[i18n] Missing translation key: "${key}" for locale: "${locale}"`);
      }
      return key;
    }

    return params ? interpolate(raw, params) : raw;
  };
}

/**
 * Apply locale-specific attributes to the document root element.
 * Updates `lang` and `dir` attributes for proper RTL/LTR rendering.
 */
export function applyLocaleToDocument(locale: Locale): void {
  if (typeof document === 'undefined') return;

  document.documentElement.lang = locale;
  document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
}
