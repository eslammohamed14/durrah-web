import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import { setRequestLocale, getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import type { ReactNode } from "react";
import type { Locale } from "@/lib/types";
import { SUPPORTED_LOCALES } from "@/config/i18n";
import { AuthProvider } from "@/lib/contexts/AuthContext";

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
  params: Promise<{ locale: Locale }>;
}

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!SUPPORTED_LOCALES.includes(locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AuthProvider>{children}</AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
