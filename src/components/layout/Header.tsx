"use client";

import { useState } from "react";
import { Link } from "@/navigation";
import { useLocale } from "@/lib/contexts/LocaleContext";
import images from "@/constant/images";
import Image from "next/image";

const NAV_LINKS = [
  { key: "home", href: "/" },
  { key: "thingsToDo", href: "/", hasDropdown: true }, ///search?category=activity
  { key: "stay", href: "/" }, //search?category=rent
  { key: "offers", href: "/" }, //search?category=rent&offers=true
  { key: "company", href: "/", hasDropdown: true }, //about
] as const;

interface HeaderProps {
  transparent?: boolean;
}

export function Header({ transparent = false }: HeaderProps) {
  const { locale, setLocale, t, dir, isPending } = useLocale();
  const [mobileOpen, setMobileOpen] = useState(false);

  const baseClasses = transparent
    ? "absolute top-0 left-0 right-0 z-50"
    : "relative z-50 bg-transparent pt-6";

  const bgClasses = transparent
    ? "bg-white/10"
    : "bg-white rounded-[100px] px-6 py-4";

  const linkClasses = transparent
    ? "text-white/90 hover:text-white"
    : "text-primary-blue-400 hover:text-primary-blue-300";

  return (
    <header className={baseClasses}>
      <div className="w-full">
        <div
          className={`mx-auto flex w-full max-w-[1200px] items-center justify-between ${bgClasses}`}
        >
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2"
            aria-label="Durrah — home"
          >
            <Image
              src={transparent ? images.durrahLogo : images.durrahLogoBlue}
              alt="Durrah Logo"
              className="object-contain"
              width={130}
              height={40}
            />
          </Link>

          {/* Desktop nav */}
          <nav
            aria-label="Main navigation"
            className={`hidden items-center rounded-full md:flex ${transparent ? "gap-18 bg-white/10 p-2 px-10 py-5 backdrop-blur-[18px]" : "gap-8 bg-grey-50 px-6 py-3 shadow-[0_0_24px_0_rgba(0,0,0,0.06)]"}`}
            dir={dir}
          >
            {NAV_LINKS.map((item) => {
              const { key, href } = item;
              const hasDropdown =
                "hasDropdown" in item && item.hasDropdown === true;
              return (
                <div key={key} className="flex items-center gap-1">
                  <Link
                    href={href}
                    className={`text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${linkClasses} ${key === "home" ? "border-b border-current pb-1 font-semibold leading-[1.5]" : "font-normal leading-[1.6]"}`}
                  >
                    {t(`nav.${key}`)}
                  </Link>
                  {hasDropdown && (
                    <svg
                      className={`h-[18px] w-[18px] ${transparent ? "text-white/70" : "text-text-dark/70"}`}
                      viewBox="0 0 18 18"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M4.5 6.75L9 11.25L13.5 6.75"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-6">
            {/* Language toggle */}
            <div
              className={`flex h-[42px] w-[98px] items-center gap-1 rounded-full px-2 py-1 ${transparent ? "bg-white/10 backdrop-blur-[18px]" : "bg-grey-50 shadow-[0_0_24px_0_rgba(0,0,0,0.06)]"} ${isPending ? "pointer-events-none opacity-50" : ""}`}
            >
              <button
                type="button"
                onClick={() => setLocale("en")}
                disabled={locale === "en" || isPending}
                aria-pressed={locale === "en"}
                className={`rounded-full px-[10px] py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 ${
                  locale === "en"
                    ? transparent
                      ? "bg-white text-primary-coral-400"
                      : "bg-primary-blue-400 text-white"
                    : transparent
                      ? "text-white/70 hover:text-white"
                      : "text-primary-blue-400 hover:text-primary-blue-300"
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLocale("ar")}
                disabled={locale === "ar" || isPending}
                aria-pressed={locale === "ar"}
                className={`rounded-full px-[10px] py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 ${
                  locale === "ar"
                    ? transparent
                      ? "bg-white text-primary-coral-400"
                      : "bg-primary-blue-400 text-white"
                    : transparent
                      ? "text-surface-primary hover:text-surface-primary/80"
                      : "text-primary-blue-400 hover:text-primary-blue-300"
                }`}
              >
                AR
              </button>
            </div>

            {/* Auth buttons */}
            <div className="hidden items-center gap-2 md:flex">
              <Link
                href="/login"
                className={`rounded-lg border px-7 py-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${transparent ? "border-white text-white hover:bg-white/10" : "border-primary-blue-400 text-primary-blue-400 hover:bg-grey-50"}`}
              >
                {t("nav.login")}
              </Link>
              <Link
                href="/register"
                className={`rounded-xl px-7 py-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${transparent ? "bg-white text-primary-coral-400 hover:bg-white/90" : "bg-primary-blue-400 text-white hover:bg-primary-blue-300"}`}
              >
                {t("nav.signUp")}
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              type="button"
              aria-label={mobileOpen ? t("common.close") : "Open menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              onClick={() => setMobileOpen((v) => !v)}
              className={`inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg p-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 md:hidden ${transparent ? "text-white hover:bg-white/10" : "text-gray-600 hover:bg-gray-100"}`}
            >
              {mobileOpen ? (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav
          id="mobile-menu"
          aria-label="Mobile navigation"
          className="border-t border-gray-200 bg-white px-4 pb-4 pt-2 md:hidden"
        >
          <ul className="flex flex-col gap-1" role="list">
            {NAV_LINKS.map(({ key, href }) => (
              <li key={key}>
                <Link
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className="flex min-h-[44px] items-center rounded-lg px-3 py-2 text-sm font-medium text-text-dark transition-colors hover:bg-gray-100"
                >
                  {t(`nav.${key}`)}
                </Link>
              </li>
            ))}
            <li className="mt-2 flex gap-2 border-t border-gray-100 pt-2">
              <Link
                href="/auth/login"
                onClick={() => setMobileOpen(false)}
                className="flex flex-1 items-center justify-center rounded-lg border border-text-dark px-3 py-2 text-center text-sm font-medium text-text-dark min-h-[44px]"
              >
                {t("nav.login")}
              </Link>
              <Link
                href="/auth/register"
                onClick={() => setMobileOpen(false)}
                className="flex flex-1 items-center justify-center rounded-lg bg-text-dark px-3 py-2 text-center text-sm font-medium text-white min-h-[44px]"
              >
                {t("nav.signUp")}
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
