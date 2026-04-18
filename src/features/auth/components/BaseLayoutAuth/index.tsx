import type { ReactNode } from "react";
import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import images from "@/constant/images";
import AuthSlider from "../AuthSlider";

type BaseLayoutAuthProps = {
  children: ReactNode;
};

/**
 * Shared split-shell for all `/auth/*` pages: visual panel + form column.
 * Server component so promo copy uses `next-intl` without a client boundary here.
 */
export default async function BaseLayoutAuth({
  children,
}: BaseLayoutAuthProps) {
  const t = await getTranslations("auth");
  const locale = await getLocale();
  const dir = locale === "ar" ? "rtl" : "ltr";

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
          title={t("layout.promoTitle")}
          subtitle={t("layout.promoSubtitle")}
          imageAlt={t("layout.panelAlt")}
        />
      </aside>

      {/* ✅ Right panel: full width on mobile, half on desktop, scrolls internally */}
      <main
        style={{ height: "100vh", overflowY: "auto" }}
        className="relative flex w-full flex-col lg:w-1/2"
      >
        {/* Decorative waves */}
        <Image
          src={images.homeDecorativeWave}
          alt=""
          width={108}
          height={195}
          className="pointer-events-none absolute end-5 top-0 opacity-35"
          aria-hidden
        />
        <Image
          src={images.homeDecorativeWave}
          alt=""
          width={108}
          height={195}
          className="pointer-events-none absolute bottom-6 start-1/2 -translate-x-1/2 rotate-180 opacity-35"
          aria-hidden
        />

        {/* ✅ Centered form — flex-1 fills remaining height, items/justify center the child */}
        <div className="flex flex-1 items-center justify-center px-6 py-10 sm:px-10">
          <div className="w-full max-w-[25rem]">{children}</div>
        </div>

        {/* Footer */}
        <footer className="relative z-10 pb-6 text-center">
          <div className="mx-auto flex flex-wrap items-center justify-center gap-2 text-[11px] text-[#667085]">
            <span>{t("layout.footer.faq")}</span>
            <span>|</span>
            <span>{t("layout.footer.investments")}</span>
            <span>|</span>
            <span>{t("layout.footer.terms")}</span>
            <span>|</span>
            <span>{t("layout.footer.contact")}</span>
          </div>
          <p className="mt-1 text-[10px] text-[#98A2B3]">
            {t("layout.footer.copyright")}
          </p>
        </footer>
      </main>
    </div>
  );
}
