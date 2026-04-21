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
      <h2 className="text-[28px] font-semibold leading-[1.4] text-grey-800">
        {t("propertyDetails.premiumAmenities")}
      </h2>
      <ul className="grid gap-x-4 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
        {property.amenities.map((amenity) => (
          <li
            key={amenity}
            className="flex h-[42px] items-center rounded-xl border border-grey-50 bg-surface-primary px-3 text-[14px] leading-[1.6] text-grey-700"
          >
            {amenity}
          </li>
        ))}
      </ul>
    </section>
  );
}
