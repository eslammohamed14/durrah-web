import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import { setRequestLocale, getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import type { ReactNode } from "react";
import { isValidLocale, SUPPORTED_LOCALES } from "@/config/i18n";
import { AuthProvider } from "@/lib/contexts/AuthContext";
import { NotificationProvider } from "@/lib/contexts/NotificationContext";
import { ToastProvider } from "@/components/ui/Toast";
import { OfflineBanner } from "@/components/ui/NetworkErrorBanner";
import { SkipLink } from "@/components/shared/SkipLink";
import { AriaLiveProvider } from "@/components/shared/AriaLiveRegion";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://durrah.sa";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Durrah | Property Management Platform",
    template: "%s | Durrah",
  },
  description:
    "Search, view, and book properties across Saudi Arabia — rentals, purchases, shops, and activities.",
  alternates: {
    languages: {
      en: `${baseUrl}/en`,
      ar: `${baseUrl}/ar`,
    },
  },
  openGraph: {
    siteName: "Durrah",
    type: "website",
  },
};

interface LocaleLayoutProps {
  children: ReactNode;
  /** Next.js types `[locale]` as `string`; narrow with `isValidLocale` below. */
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale: rawLocale } = await params;

  if (!isValidLocale(rawLocale)) {
    notFound();
  }

  const locale = rawLocale;

  setRequestLocale(locale);
  const messages = await getMessages();

  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <div
      lang={locale}
      dir={dir}
      className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} h-full antialiased`}
    >
      <SkipLink />
      <NextIntlClientProvider locale={locale} messages={messages}>
        <AuthProvider>
          <NotificationProvider>
            <ToastProvider>
              <AriaLiveProvider>
                <OfflineBanner />
                {children}
              </AriaLiveProvider>
            </ToastProvider>
          </NotificationProvider>
        </AuthProvider>
      </NextIntlClientProvider>
    </div>
  );
}
