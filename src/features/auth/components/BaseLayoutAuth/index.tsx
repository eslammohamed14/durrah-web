import type { ReactNode } from "react";
import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import images from "@/constant/images";
import AuthSlider, { type AuthSliderPaginationVariant } from "../AuthSlider";

type BaseLayoutAuthProps = {
  children: ReactNode;
  /**
   * `register` — Sign Up (Figma): lock viewport height, hero fills the left column,
   * and only the form column scrolls (not the whole document / slider column).
   * All other auth pages should keep the default.
   */
  authShellVariant?: "default" | "register";
  /** Overrides default promo strings from `auth.layout` (e.g. verify-email Figma). */
  promoTitle?: string;
  promoSubtitle?: string;
  sliderPaginationVariant?: AuthSliderPaginationVariant;
  /** Footer link row tone — `verifyEmail` / `register` tune copy for those flows only. */
  footerVariant?: "default" | "verifyEmail" | "register";
  /** Form column max width (register uses a wider shell than login). */
  contentMaxWidthClass?: string;
  /** When false, hides the decorative graphic behind the form column (register). */
  showFormColumnDecoration?: boolean;
  /** Override default centered form shell (e.g. full-bleed layouts). */
  formAreaClassName?: string;
  /** Extra classes on the inner max-width wrapper (e.g. Sign Up Figma asymmetric padding). */
  contentInnerClassName?: string;
};

/**
 * Shared split-shell for all `/auth/*` pages: visual panel + form column.
 * Uses CSS Grid (`lg:grid-cols-2`) so both columns share one viewport-tall row
 * (`min-h-0` + `h-full`) — avoids flex/fixed quirks and keeps the hero full-height.
 * Use `authShellVariant="register"` for the long Sign Up form (inner column scroll only).
 * Server component so promo copy uses `next-intl` without a client boundary here.
 */
export default async function BaseLayoutAuth({
  children,
  authShellVariant = "default",
  promoTitle,
  promoSubtitle,
  sliderPaginationVariant = "default",
  footerVariant = "default",
  contentMaxWidthClass = "max-w-[28rem]",
  showFormColumnDecoration = true,
  formAreaClassName,
  contentInnerClassName,
}: BaseLayoutAuthProps) {
  const t = await getTranslations("auth");
  const locale = await getLocale();
  const dir = locale === "ar" ? "rtl" : "ltr";
  const panelTitle = promoTitle ?? t("layout.promoTitle");
  const panelSubtitle = promoSubtitle ?? t("layout.promoSubtitle");
  const footerLinksClass =
    footerVariant === "verifyEmail"
      ? "text-[#21265d]"
      : footerVariant === "register"
        ? "text-primary-coral-400"
        : "text-[#667085]";
  const footerCopyrightClass =
    footerVariant === "verifyEmail" || footerVariant === "register"
      ? "text-grey-400"
      : "text-[#98A2B3]";

  const isRegisterShell = authShellVariant === "register";

  const formAreaClasses =
    formAreaClassName ??
    "flex min-h-0 flex-1 items-center justify-center px-6 py-10 sm:px-10";

  const innerMaxWidthClasses = [
    "w-full",
    contentMaxWidthClass,
    contentInnerClassName ?? "",
  ].join(" ");

  const authFooter = (
    <footer className="relative z-10 shrink-0 pb-6 text-center">
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
  );

  const formColumn = (
    <div className={formAreaClasses}>
      <div className={innerMaxWidthClasses}>{children}</div>
    </div>
  );

  return (
    <div
      dir={dir}
      lang={locale}
      className={[
        "w-full bg-[var(--surface-primary,#fafafa)] text-durrah-blue",
        isRegisterShell
          ? "flex flex-col items-start min-h-[100dvh] overflow-x-hidden lg:flex-row"
          : "grid min-h-0 h-[100dvh] grid-cols-1 overflow-hidden lg:grid-cols-2",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <aside
        className={[
          "relative hidden bg-black lg:block",
          isRegisterShell
            ? "h-[968px] w-full shrink-0 lg:w-[52%] lg:max-w-[52%]"
            : "h-full min-h-0",
        ].join(" ")}
      >
        <AuthSlider
          title={panelTitle}
          subtitle={panelSubtitle}
          imageAlt={t("layout.panelAlt")}
          paginationVariant={sliderPaginationVariant}
        />
      </aside>

      <main
        className={[
          "relative flex flex-col bg-white",
          isRegisterShell
            ? "w-full min-h-[100dvh] min-w-0 overflow-x-hidden overflow-y-visible lg:w-[48%] lg:max-w-[48%] lg:shrink-0"
            : "min-h-0 h-full min-w-0 overflow-x-hidden overflow-y-auto lg:border-s lg:border-grey-100",
        ].join(" ")}
      >
        {/* Decorative waves — logical end so RTL matches LTR corner placement */}
        {showFormColumnDecoration ? (
          <>
            <Image
              src={images.yachtShape}
              alt="icon yacht"
              width={208}
              height={195}
              className="pointer-events-none absolute top-0 end-[-130px] rotate-180"
              aria-hidden
            />
            {isRegisterShell && (
              <Image
                src={images.yachtShape}
                alt="icon yacht bottom"
                width={208}
                height={195}
                className="pointer-events-none absolute bottom-[-7%] start-[-130px]"
                aria-hidden
              />
            )}
          </>
        ) : null}

        {formColumn}
        {authFooter}
      </main>
    </div>
  );
}
