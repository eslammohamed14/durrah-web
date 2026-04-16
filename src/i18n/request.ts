import { getRequestConfig } from "next-intl/server";
import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from "@/config/i18n";
import type { Locale } from "@/lib/types";

// Import all locales statically for proper bundling
import enMessages from "../../public/locales/en.json";
import arMessages from "../../public/locales/ar.json";

const messages: Record<Locale, typeof enMessages> = {
  en: enMessages,
  ar: arMessages,
};

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = (await requestLocale) as Locale;

  if (!locale || !SUPPORTED_LOCALES.includes(locale)) {
    locale = DEFAULT_LOCALE;
  }

  return {
    locale,
    messages: messages[locale],
    onError(error) {
      if (error.code === "MISSING_MESSAGE") {
        console.warn("Missing translation:", error.message);
      } else {
        console.error("Translation error:", error);
      }
    },
    getMessageFallback({ namespace, key }) {
      return `${namespace}.${key}`;
    },
  };
});
