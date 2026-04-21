import createMiddleware from "next-intl/middleware";
import { NextRequest } from "next/server";
import {
  SUPPORTED_LOCALES as locales,
  DEFAULT_LOCALE as defaultLocale,
} from "@/config/i18n";

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "always",
  localeDetection: true,
});

// FIXED: Replaced 'export default' with the named 'proxy' function required by Next.js 16
export function proxy(request: NextRequest) {
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    // Match all pathnames except for
    // - … if they start with `/api`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};
