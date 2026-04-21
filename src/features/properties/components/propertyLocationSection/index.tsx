"use client";

import { useTranslations } from "next-intl";
import PropertyMapDynamic from "@/features/properties/components/propertyMapDynamic";
import type { Property } from "@/lib/types";

interface PropertyLocationSectionProps {
  property: Property;
}

export default function PropertyLocationSection({
  property,
}: PropertyLocationSectionProps) {
  const t = useTranslations();

  return (
    <section className="space-y-4">
      <h2 className="text-3xl font-semibold text-text-dark">{t("propertyDetails.locationNearby")}</h2>
      <PropertyMapDynamic
        coordinates={property.location.coordinates}
        title={property.title.en}
        height={327}
        className="rounded-2xl"
      />
    </section>
  );
}
