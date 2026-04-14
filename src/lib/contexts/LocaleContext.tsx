'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Locale } from '@/lib/types';
import { DEFAULT_LOCALE } from '@/config/i18n';
import {
  applyLocaleToDocument,
  createTranslator,
  getBundledTranslations,
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

function initialLocale(): Locale {
  if (typeof window === 'undefined') return DEFAULT_LOCALE;
  return getStoredLocale();
}

function initialTranslator() {
  const loc = initialLocale();
  return createTranslator(loc, getBundledTranslations(loc));
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const [t, setT] = useState<(key: string, params?: Record<string, string | number>) => string>(
    initialTranslator
  );

  // Sync locale + translator after navigation (incl. bfcache restore after 404 → back)
  useEffect(() => {
    const sync = () => {
      const stored = getStoredLocale();
      applyLocaleToDocument(stored);
      setLocaleState(stored);
      void loadTranslations(stored).then((translations) => {
        setT(() => createTranslator(stored, translations));
      });
    };

    sync();

    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) sync();
    };
    window.addEventListener('pageshow', onPageShow);
    return () => window.removeEventListener('pageshow', onPageShow);
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
