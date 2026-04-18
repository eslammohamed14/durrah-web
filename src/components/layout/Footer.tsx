"use client";

import Link from "next/link";
import images from "@/constant/images";
import { useLocale } from "@/lib/contexts/LocaleContext";
import Image from "next/image";
import {
  FacebookIcon,
  LinkedinIcon,
  NormalInstagramIcon,
  XSocialIcon,
} from "@/assets/icons";

const NAV_LINK_KEYS = [
  { key: "home", href: "/" },
  { key: "properties", href: "/" }, //"/search"
  { key: "activities", href: "/" }, //"search?category=activity"
  { key: "shops", href: "/" }, //"/search?category=shop"
  { key: "about", href: "/" }, //"about"
  { key: "contactUs", href: "/" }, //"contact"
] as const;

export function Footer() {
  const { t } = useLocale();

  return (
    <footer className="relative overflow-hidden bg-surface-desert-sand px-4 py-8 sm:px-6 lg:px-16 xl:px-[120px]">
      <div
        className="pointer-events-none absolute left-0 top-0 opacity-30"
        aria-hidden="true"
      >
        <img
          src={images.yachtShape}
          alt=""
          className="h-[160px] w-[140px] object-cover"
        />
      </div>
      <div
        className="pointer-events-none absolute bottom-0 right-0 opacity-20"
        aria-hidden="true"
      >
        <img
          src={images.yachtShape}
          alt=""
          className="h-[120px] w-[90px] object-cover"
        />
      </div>

      <div className="relative mx-auto flex max-w-[1200px] flex-col gap-4">
        <div className="flex flex-col items-center gap-5">
          <Link
            href="/"
            aria-label="Durrah — home"
            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-dark focus-visible:ring-offset-2"
          >
            <Image
              src={images.durrahLogoBlue}
              alt="Durrat Al Arous"
              width={132}
              height={42}
              className="object-contain"
            />
          </Link>

          <div className="h-px w-full bg-grey-200" />

          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 lg:gap-12">
              {NAV_LINK_KEYS.map(({ key, href }) => (
                <li key={key}>
                  <Link
                    href={href}
                    className="text-sm font-medium text-text-dark transition-colors hover:text-primary-coral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-datext-text-dark focus-visible:ring-offset-2 sm:text-base"
                  >
                    {t(`footer.${key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="flex flex-col items-center gap-5">
          <div className="flex w-full max-w-[471px] items-center gap-6 rounded-lg border border-text-dark px-2 py-2">
            <input
              type="email"
              placeholder={t("footer.emailPlaceholder")}
              aria-label={t("footer.emailSubscribeLabel")}
              className="flex-1 bg-transparent text-xs text-grey-500 placeholder-grey-500 outline-none"
            />
            <button
              type="button"
              aria-label={t("footer.subscribeLabel")}
              className="flex h-6 w-6 items-center justify-center rounded text-text-dborder-text-dark transition-colors hover:text-primary-coral-400"
            >
              <svg
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M5 12H19M19 12L13 6M19 12L13 18"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="text-text-dborder-text-dark transition-colors hover:text-primary-coral-400"
            >
              <FacebookIcon className="h-6 w-6" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-text-dborder-text-dark transition-colors hover:text-primary-coral-400"
            >
              <LinkedinIcon className="h-6 w-6" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-text-dborder-text-dark transition-colors hover:text-primary-coral-400"
            >
              <NormalInstagramIcon className="h-6 w-6" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X (Twitter)"
              className="text-text-dborder-text-dark transition-colors hover:text-primary-coral-400"
            >
              <XSocialIcon className="h-6 w-6" />
            </a>
          </div>

          <div className="h-px w-full bg-grey-200" />
        </div>

        <div className="flex w-full flex-col items-center gap-2 text-xs text-grey-500 sm:flex-row sm:justify-between">
          <span>{t("footer.termsAndConditions")}</span>
          <span>{t("footer.copyright")}</span>
          <span>{t("footer.privacyPolicy")}</span>
        </div>
      </div>
    </footer>
  );
}
