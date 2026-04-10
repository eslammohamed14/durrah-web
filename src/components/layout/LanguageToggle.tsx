'use client';

import { useLocale } from '@/lib/contexts/LocaleContext';

export function LanguageToggle() {
  const { locale, setLocale } = useLocale();

  const isArabic = locale === 'ar';
  const nextLocale = isArabic ? 'en' : 'ar';
  const label = isArabic ? 'English' : 'العربية';

  return (
    <button
      onClick={() => setLocale(nextLocale)}
      aria-label={`Switch to ${isArabic ? 'English' : 'Arabic'}`}
      className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
    >
      {/* Globe icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4 shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>

      {/* Current language indicator */}
      <span>{label}</span>

      {/* Active locale badge */}
      <span className="rounded bg-gray-200 px-1 py-0.5 text-xs uppercase leading-none text-gray-600">
        {locale}
      </span>
    </button>
  );
}
