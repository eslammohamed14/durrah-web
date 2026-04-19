import Image from "next/image";
import images from "@/constant/images";
import { FilterContainer } from "./filter-container";
import type { Property } from "@/lib/types";
import {createTranslator} from "@/lib/utils/i18n";



interface HeroSectionProps {
  allProperties: Property[];
  t:ReturnType<typeof createTranslator>;
}

export const HeroSection = ({ allProperties,t }: HeroSectionProps) => {
 

  return (
    <section
      aria-label="Hero"
      className="relative flex min-h-[560px] flex-col pb-[30px] sm:min-h-[700px] lg:min-h-[948px]"
    >
      {/* Background Image (Next.js optimized) */}
      <Image
        src={images.durrahHomeHero}
        alt="Hero background"
        fill
        priority
        fetchPriority="high" // 🔥 ADD THIS
        sizes="100vw"

        className="object-cover"
        style={{ objectPosition: "50% 25%" }}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/25" aria-hidden="true" />

      {/* Content — positioned at bottom */}
      <div className="relative mx-auto mt-auto w-full max-w-[1540px] px-4 pb-0 sm:px-6 lg:px-8 xl:px-10">
        <div className="flex flex-col gap-4">
          {/* Headline row */}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <h1
              className="w-full max-w-[747px] text-3xl font-medium leading-[1.2] text-white sm:text-4xl md:text-5xl lg:text-[55px] lg:leading-[1.3]"
              style={{ textTransform: "capitalize" }}
            >
              {t("home.heroHeadline")}
            </h1>
            <p className="w-full max-w-[384px] text-base font-medium leading-[1.3] text-white md:text-lg lg:text-xl">
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