"use client";

import { useLocale, useTranslations } from "next-intl";
import type { Property } from "@/lib/types";

interface PropertyInfoSectionProps {
  property: Property;
}

export default function PropertyInfoSection({ property }: PropertyInfoSectionProps) {
  const locale = useLocale();
  const t = useTranslations();
  const description =
    property.description[locale as "en" | "ar"] || property.description.en;
  const area =
    property.location.address[locale as "en" | "ar"] || property.location.address.en;

  return (
    <section className="space-y-4">
      <div className="space-y-2">
        <p className="text-base text-grey-700">{area}</p>
        <h2 className="text-3xl font-semibold text-text-dark">
          {t("propertyDetails.unitInfo")}
        </h2>
        <div className="flex flex-wrap gap-4 text-base text-grey-700">
          <span>{property.specifications.size} sq.ft.</span>
          <span>{property.specifications.rooms ?? 0} Bed</span>
          <span>{property.specifications.bathrooms ?? 0} Bath</span>
          <span>{property.specifications.maxGuests ?? 1} Guests</span>
        </div>
      </div>
      <p className="leading-8 text-grey-700">{description}</p>
    </section>
  );
}
