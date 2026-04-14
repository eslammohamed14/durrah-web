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
    <footer className="relative overflow-hidden bg-[#F0E9E4] px-[120px] py-8">
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
            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2A2F73] focus-visible:ring-offset-2"
          >
            <Image
              src={images.durrahLogoBlue}
              alt="Durrat Al Arous"
              width={132}
              height={42}
              className="object-contain"
            />
          </Link>

          <div className="h-px w-full bg-[#BFBFBF]" />

          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap items-center justify-center gap-12">
              {NAV_LINK_KEYS.map(({ key, href }) => (
                <li key={key}>
                  <Link
                    href={href}
                    className="text-base font-medium text-[#2A2F73] transition-colors hover:text-[#FF765E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2A2F73] focus-visible:ring-offset-2"
                  >
                    {t(`footer.${key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="flex flex-col items-center gap-5">
          <div className="flex w-[471px] items-center gap-6 rounded-lg border border-[#2A2F73] px-2 py-2">
            <input
              type="email"
              placeholder={t("footer.emailPlaceholder")}
              aria-label={t("footer.emailSubscribeLabel")}
              className="flex-1 bg-transparent text-xs text-[#727272] placeholder-[#727272] outline-none"
            />
            <button
              type="button"
              aria-label={t("footer.subscribeLabel")}
              className="flex h-6 w-6 items-center justify-center rounded text-[#2A2F73] transition-colors hover:text-[#FF765E]"
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
              className="text-[#2A2F73] transition-colors hover:text-[#FF765E]"
            >
              <FacebookIcon className="h-6 w-6" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-[#2A2F73] transition-colors hover:text-[#FF765E]"
            >
              <LinkedinIcon className="h-6 w-6" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-[#2A2F73] transition-colors hover:text-[#FF765E]"
            >
              <NormalInstagramIcon className="h-6 w-6" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X (Twitter)"
              className="text-[#2A2F73] transition-colors hover:text-[#FF765E]"
            >
              <XSocialIcon className="h-6 w-6" />
            </a>
          </div>

          <div className="h-px w-full bg-[#BFBFBF]" />
        </div>

        <div className="flex w-full items-center justify-between text-xs text-[#727272]">
          <span>{t("footer.termsAndConditions")}</span>
          <span>{t("footer.copyright")}</span>
          <span>{t("footer.privacyPolicy")}</span>
        </div>
      </div>
    </footer>
  );
}
