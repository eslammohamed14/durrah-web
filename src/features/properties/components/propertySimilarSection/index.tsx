"use client";

import { useTranslations } from "next-intl";
import { ArrowRightIcon } from "@/assets/icons";
import { CtaNavigateButton } from "@/components/ui/CtaNavigateButton";
import { PropertyCard } from "@/components/ui/PropertyCard";
import type { Property } from "@/lib/types";

interface PropertySimilarSectionProps {
  properties: Property[];
}

export default function PropertySimilarSection({
  properties,
}: PropertySimilarSectionProps) {
  const t = useTranslations();
  if (properties.length === 0) return null;

  return (
    <section className="bg-surface-primary py-16">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-0">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-[28px] font-semibold leading-[1.4] text-primary-blue-400">
            {t("propertyDetails.similarProperties")}
          </h2>
          <CtaNavigateButton
            href="/properties"
            className="h-10 shrink-0 px-4 text-[14px] leading-[1.4]"
            rightIcon={<ArrowRightIcon size={20} />}
          >
            {t("home.viewAllProperties")}
          </CtaNavigateButton>
        </div>
        <div className="mt-8 grid items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3">
          {properties.slice(0, 3).map((property) => (
            <div key={property.id} className="h-full">
              <PropertyCard property={property} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
