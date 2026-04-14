import { cookies } from "next/headers";
import images from "@/constant/images";
import { FilterContainer } from "./filter-container";
import type { Property } from "@/lib/types";
import {
  createTranslator,
  getBundledTranslations,
} from "@/lib/utils/i18n";
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
          <FilterContainer allProperties={allProperties} />
        </div>
      </div>
    </section>
  );
}
