import type { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { AuthProvider } from "@/lib/contexts/AuthContext";
import { DEFAULT_LOCALE } from "@/config/i18n";

/**
 * `/auth/*` lives outside `app/[locale]/`, so it does not inherit locale layout
 * providers. Auth pages use `useAuth` and `useLocale` (next-intl); wrap them here
 * so static generation and runtime both have context.
 */
export default async function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  setRequestLocale(DEFAULT_LOCALE);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={DEFAULT_LOCALE} messages={messages}>
      <AuthProvider>{children}</AuthProvider>
    </NextIntlClientProvider>
  );
}
