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
      className="bg-[#FAFAFA] px-[120px] py-[100px]"
    >
      <div className="mx-auto flex min-w-0 max-w-[1300px] flex-col gap-10">
        <div className="flex min-w-0 items-end gap-4">
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
                    className="text-2xl font-medium text-[#2A2F73]"
                  >
                    {t("home.propertiesHeadline")}
                  </h2>
                </div>
              </div>
            </div>
            <p className="max-w-[875px] text-base font-normal text-[#5A5A5A]">
              {t("home.propertiesSubtitle")}
            </p>
          </div>
          <CtaNavigateButton
            href="/search"
            className="shrink-0"
            rightIcon={<ArrowRightIcon className="h-6 w-6" />}
          >
            {t("home.viewAllProperties")}
          </CtaNavigateButton>
        </div>

        <div className="grid min-w-0 grid-cols-3 gap-6">
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
