"use client";

import type { Locale } from "@/lib/types";
import { useLocale } from "@/lib/contexts/LocaleContext";

export function LanguageToggle() {
  const { locale, setLocale, isPending, t } = useLocale();

  const isArabic = locale === "ar";
  const nextLocale: Locale = isArabic ? "en" : "ar";
  const label = isArabic ? t("common.languageEnglish") : t("common.languageArabic");
  const ariaLabel = isArabic ? t("common.switchToEnglish") : t("common.switchToArabic");

  const handleToggle = () => {
    setLocale(nextLocale);
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      aria-label={ariaLabel}
      className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    >
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

      <span>{label}</span>

      <span className="rounded bg-gray-200 px-1 py-0.5 text-xs uppercase leading-none text-gray-600">
        {locale}
      </span>
    </button>
  );
}
