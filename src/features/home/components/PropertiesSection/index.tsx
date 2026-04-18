"use client";

import type { Property } from "@/lib/types";
import { useLocale } from "@/lib/contexts/LocaleContext";
import { ArrowRightIcon, PropertySectionIcon } from "@/assets/icons";
import { CtaNavigateButton } from "@/components/ui/CtaNavigateButton";
import { PropertyCard } from "@/components/ui/PropertyCard";
import { SectionTag } from "@/features/home/components/sectionTag";

export interface PropertiesSectionProps {
  properties: Property[];
}

export function PropertiesSection({ properties }: PropertiesSectionProps) {
  const { t } = useLocale();

  return (
    <section
      aria-labelledby="properties-heading"
      className="bg-background px-4 py-8 sm:px-6 sm:py-10 lg:px-16 xl:px-[120px] xl:py-[40px]"
    >
      <div className="mx-auto flex min-w-0 max-w-screen-2xl flex-col gap-8 xl:max-w-[1300px] xl:gap-10">
        <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex min-w-0 flex-1 flex-col gap-4">
            <div className="flex items-end justify-between">
              <div className="flex flex-col gap-4">
                <SectionTag
                  icon={<PropertySectionIcon />}
                  label={t("home.findYourSpace")}
                />
                <div className="flex w-full min-w-0 items-end justify-between">
                  <h2
                    id="properties-heading"
                    className="text-xl font-medium text-text-dark sm:text-2xl"
                  >
                    {t("home.propertiesHeadline")}
                  </h2>
                </div>
              </div>
            </div>
            <p className="max-w-[875px] text-sm font-normal text-text-body-dark sm:text-base">
              {t("home.propertiesSubtitle")}
            </p>
          </div>
          <CtaNavigateButton
            href="/" // "search"
            className="shrink-0 self-start sm:self-auto"
            rightIcon={<ArrowRightIcon className="h-6 w-6" />}
          >
            {t("home.viewAllProperties")}
          </CtaNavigateButton>
        </div>

        <div className="grid min-w-0 grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {properties.slice(0, 6).map((p) => (
            <div key={p.id} className="min-w-0">
              <PropertyCard property={p} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
