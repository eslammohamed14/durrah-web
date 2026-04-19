import type { ReactNode } from "react";
import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import images from "@/constant/images";
import AuthSlider, {
  type AuthSliderPaginationVariant,
} from "../AuthSlider";

type BaseLayoutAuthProps = {
  children: ReactNode;
  /** Overrides default promo strings from `auth.layout` (e.g. verify-email Figma). */
  promoTitle?: string;
  promoSubtitle?: string;
  sliderPaginationVariant?: AuthSliderPaginationVariant;
  /** Footer link row tone — `verifyEmail` matches Figma verify screen. */
  footerVariant?: "default" | "verifyEmail";
};

/**
 * Shared split-shell for all `/auth/*` pages: visual panel + form column.
 * Server component so promo copy uses `next-intl` without a client boundary here.
 */
export default async function BaseLayoutAuth({
  children,
  promoTitle,
  promoSubtitle,
  sliderPaginationVariant = "default",
  footerVariant = "default",
}: BaseLayoutAuthProps) {
  const t = await getTranslations("auth");
  const locale = await getLocale();
  const dir = locale === "ar" ? "rtl" : "ltr";
  const panelTitle = promoTitle ?? t("layout.promoTitle");
  const panelSubtitle = promoSubtitle ?? t("layout.promoSubtitle");
  const footerLinksClass =
    footerVariant === "verifyEmail"
      ? "text-[#21265d]"
      : "text-[#667085]";
  const footerCopyrightClass =
    footerVariant === "verifyEmail"
      ? "text-grey-400"
      : "text-[#98A2B3]";

  return (
    <div
      dir={dir}
      lang={locale}
      // ✅ flex row, locked to viewport, no overflow escape
      className="flex h-screen overflow-hidden bg-background text-durrah-blue"
    >
      {/* ✅ sticky + explicit h-screen = never collapses regardless of display mode */}
      <aside
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          width: "50%",
          flexShrink: 0,
        }}
        className="hidden lg:block"
      >
        <AuthSlider
          title={panelTitle}
          subtitle={panelSubtitle}
          imageAlt={t("layout.panelAlt")}
          paginationVariant={sliderPaginationVariant}
        />
      </aside>

      {/* ✅ Right panel: full width on mobile, half on desktop, scrolls internally */}
      <main
        style={{ height: "100vh", overflowY: "auto" }}
        className="relative flex w-full flex-col lg:w-1/2 overflow-x-hidden"
      >
        {/* Decorative waves */}
        <Image
          src={images.yachtShape}
          alt="icon yacht"
          width={208}
          height={195}
          className="pointer-events-none absolute  top-0  right-[-130px] rotate-180" //opacity-35
          aria-hidden
        />

        {/* ✅ Centered form — flex-1 fills remaining height, items/justify center the child */}
        <div className="flex flex-1 items-center justify-center px-6 py-10 sm:px-10">
          <div className="w-full max-w-[28rem]">{children}</div>
        </div>

        {/* Footer */}
        <footer className="relative z-10 pb-6 text-center">
          <div
            className={`mx-auto flex flex-wrap items-center justify-center gap-2 text-[11px] ${footerLinksClass}`}
          >
            <span>{t("layout.footer.faq")}</span>
            <span>|</span>
            <span>{t("layout.footer.investments")}</span>
            <span>|</span>
            <span>{t("layout.footer.terms")}</span>
            <span>|</span>
            <span>{t("layout.footer.contact")}</span>
          </div>
          <p className={`mt-1 text-[10px] ${footerCopyrightClass}`}>
            {t("layout.footer.copyright")}
          </p>
        </footer>
      </main>
    </div>
  );
}
