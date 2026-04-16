"use client";

import { useTransition } from "react";
import type { Locale } from "@/lib/types";
import { useLocale as useNextIntlLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/lib/navigation";

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  dir: "ltr" | "rtl";
  isPending: boolean;
}

export function useLocale(): LocaleContextValue {
  const locale = useNextIntlLocale() as Locale;
  const tIntl = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const dir: "ltr" | "rtl" = locale === "ar" ? "rtl" : "ltr";

  const setLocale = (next: Locale) => {
    if (next === locale || isPending) return;
    startTransition(() => {
      router.replace(pathname, { locale: next });
    });
  };

  return {
    locale,
    setLocale,
    t: (key, params) => tIntl(key, params),
    dir,
    isPending,
  };
}
