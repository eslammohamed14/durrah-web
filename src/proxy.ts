import { NextResponse, type NextRequest } from "next/server";
import { DEFAULT_LOCALE, isValidLocale, NEXT_LOCALE_COOKIE } from "@/config/i18n";

export function proxy(request: NextRequest) {
  const localeCookie = request.cookies.get(NEXT_LOCALE_COOKIE)?.value;
  const locale = isValidLocale(localeCookie) ? localeCookie : DEFAULT_LOCALE;

  const response = NextResponse.next();
  response.cookies.set({
    name: NEXT_LOCALE_COOKIE,
    value: locale,
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
