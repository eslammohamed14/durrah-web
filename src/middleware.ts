import createMiddleware from "next-intl/middleware";
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

export default intlMiddleware;

export const config = {
  matcher: [
    // Match all pathnames except for
    // - … if they start with `/api`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};
