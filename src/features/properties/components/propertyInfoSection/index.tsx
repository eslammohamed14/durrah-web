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
  const area = property.location.area;
  const sqFt = Math.round(property.specifications.size * 10.7639);

  return (
    <section className="space-y-6 pt-10">
      <div className="space-y-3">
        <p className="text-[16px] font-medium leading-[1.5] text-grey-700">{area}</p>
        <h2 className="text-[28px] font-semibold leading-[1.4] text-grey-800">
          {t("propertyDetails.unitInfo")}
        </h2>
        <div className="flex flex-wrap items-center gap-3 text-[16px] leading-[1.6] text-grey-700">
          <span>{sqFt.toLocaleString("en-US")} sq.ft.</span>
          <span>{property.specifications.rooms ?? 0} Bed</span>
          <span>{property.specifications.bathrooms ?? 0} Bath</span>
          <span>1 Living</span>
          <span>1 Kitchen</span>
          <span>1 Parking Space</span>
        </div>
      </div>
      <p className="text-[16px] leading-[1.6] text-grey-600">{description}</p>
    </section>
  );
}
