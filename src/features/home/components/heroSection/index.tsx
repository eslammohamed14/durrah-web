import { cookies } from "next/headers";
import images from "@/constant/images";
import { FilterContainer } from "./filter-container";
import type { Property } from "@/lib/types";
import { createTranslator, getBundledTranslations } from "@/lib/utils/i18n";
import {
  DEFAULT_LOCALE,
  isValidLocale,
  NEXT_LOCALE_COOKIE,
} from "@/config/i18n";

interface HeroSectionProps {
  allProperties: Property[];
}

export async function HeroSection({ allProperties }: HeroSectionProps) {
  const localeCookie = (await cookies()).get(NEXT_LOCALE_COOKIE)?.value;
  const locale = isValidLocale(localeCookie) ? localeCookie : DEFAULT_LOCALE;
  const t = createTranslator(locale, getBundledTranslations(locale));

  return (
    <section
      aria-label="Hero"
      className="relative flex min-h-[948px] flex-col bg-cover bg-no-repeat bg-[50%_25%] pb-[30px]"
      style={{ backgroundImage: `url('${images.durrahHomeHero}')` }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/25" aria-hidden="true" />

      {/* Content — positioned at bottom */}
      <div className="relative mx-auto mt-auto w-full max-w-[1540px] px-4 pb-0 sm:px-6 lg:px-8 xl:px-10">
        <div className="flex flex-col gap-4">
          {/* Headline row */}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <h1
              className="w-full max-w-[747px] text-4xl font-medium leading-[1.2] text-white md:text-5xl lg:text-[55px] lg:leading-[1.3]"
              style={{ textTransform: "capitalize" }}
            >
              {t("home.heroHeadline")}
            </h1>
            <p className="w-full max-w-[384px] text-lg font-medium leading-[1.3] text-white md:text-xl">
              {t("home.heroSubheadline")}
            </p>
          </div>

          {/* Search widget */}
          <FilterContainer allProperties={allProperties} />
        </div>
      </div>
    </section>
  );
}
