import Image from "next/image";
import { getTranslations } from "next-intl/server";
import images from "@/constant/images";

/**
 * Search hero — Figma node `1578:27181`: frame **1440×609** (desktop). Background is
 * full-bleed; inner copy aligns to **max-width 1440px** with **609px** height from `lg` up.
 * Smaller viewports use shorter min-heights so content still fits under the transparent header.
 */
export default function SearchHeroSection({ t }: { t: (key: string) => string }) {

  return (
    <section
      aria-labelledby="search-hero-heading"
      className="relative flex min-h-[609px] w-full flex-col overflow-hidden sm:min-h-[420px] md:min-h-[480px] lg:h-[609px] lg:min-h-[609px] lg:max-h-[609px]"
    >
      <Image
        src={images.searchHero}
        alt="hero-search-img"
        fill
        priority
        sizes="100vw"
        className="object-cover object-[50%_42%]"
      />
      {/* Base dim + slight top-to-bottom gradient for white upholstery scenes */}
      <div
        className="absolute inset-0 bg-black/35 bg-gradient-to-b from-black/25 via-black/20 to-black/45"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto box-border flex h-full w-full max-w-[1440px] flex-1 flex-col justify-center px-4 pb-10 pt-24 sm:px-6 sm:pb-12 sm:pt-28 lg:px-[120px] lg:pb-14 lg:pt-32">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 lg:flex-row lg:items-end lg:gap-[69px]">
          <h1
            id="search-hero-heading"
            className="max-w-[747px] text-3xl font-poppins font-medium leading-[1.15] tracking-tight text-white sm:text-4xl md:text-[2.75rem] lg:text-[55px] lg:leading-[1.28]"
          >
            {t("search.heroTitle")}
          </h1>
          <p className="max-w-[384px] text-base font-medium leading-[1.4] text-white/95 sm:text-lg lg:text-[22px] lg:leading-[1.35]">
            {t("search.heroSubtitle")}
          </p>
        </div>
      </div>
    </section>
  );
}
