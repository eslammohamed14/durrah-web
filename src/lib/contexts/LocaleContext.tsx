'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Locale } from '@/lib/types';
import { DEFAULT_LOCALE } from '@/config/i18n';
import {
  applyLocaleToDocument,
  createTranslator,
  getStoredLocale,
  loadTranslations,
  storeLocale,
} from '@/lib/utils/i18n';

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  dir: 'ltr' | 'rtl';
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

// Fallback no-op translator used before translations are loaded
const fallbackT = (key: string) => key;

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);
  const [t, setT] = useState<(key: string, params?: Record<string, string | number>) => string>(
    () => fallbackT
  );

  // On mount: read stored locale and load its translations
  useEffect(() => {
    const stored = getStoredLocale();
    applyLocaleToDocument(stored);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocaleState(stored);

    loadTranslations(stored).then((translations) => {
      setT(() => createTranslator(stored, translations));
    });
  }, []);

  const setLocale = (newLocale: Locale) => {
    storeLocale(newLocale);
    applyLocaleToDocument(newLocale);
    setLocaleState(newLocale);

    loadTranslations(newLocale).then((translations) => {
      setT(() => createTranslator(newLocale, translations));
    });
  };

  const dir: 'ltr' | 'rtl' = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t, dir }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return ctx;
}
