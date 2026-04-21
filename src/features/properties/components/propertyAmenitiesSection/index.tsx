"use client";

import { useTranslations } from "next-intl";
import type { Property } from "@/lib/types";

interface PropertyAmenitiesSectionProps {
  property: Property;
}

export default function PropertyAmenitiesSection({
  property,
}: PropertyAmenitiesSectionProps) {
  const t = useTranslations();

  return (
    <section className="space-y-4">
      <h2 className="text-3xl font-semibold text-text-dark">
        {t("propertyDetails.premiumAmenities")}
      </h2>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {property.amenities.map((amenity) => (
          <li
            key={amenity}
            className="rounded-xl border border-border-default px-4 py-3 text-sm text-grey-700"
          >
            {amenity}
          </li>
        ))}
      </ul>
    </section>
  );
}
