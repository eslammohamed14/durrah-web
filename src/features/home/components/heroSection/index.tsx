"use client";

import { useLocale } from "@/lib/contexts/LocaleContext";
import images from "@/constant/images";
import { FilterContainer } from "./filter-container";

export function HeroSection() {
  const { t } = useLocale();

  return (
    <section
      aria-label="Hero"
      className="relative flex min-h-[948px] flex-col bg-cover bg-no-repeat bg-[50%_25%] pb-[30px]"
      style={{ backgroundImage: `url('${images.durrahHomeHero}')` }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/25" aria-hidden="true" />

      {/* Content — positioned at bottom */}
      <div className="relative mt-auto px-[120px] pb-0">
        <div className="flex flex-col gap-4">
          {/* Headline row */}
          <div className="flex items-end justify-between ">
            <h1
              className="w-[747px] text-[55px] font-medium leading-[1.3] text-white"
              style={{ textTransform: "capitalize" }}
            >
              {t("home.heroHeadline")}
            </h1>
            <p className="w-[384px] text-xl font-medium leading-[1.3] text-white">
              {t("home.heroSubheadline")}
            </p>
          </div>

          {/* Search widget */}
          <FilterContainer />
        </div>
      </div>
    </section>
  );
}
