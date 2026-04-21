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
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-[28px] font-semibold leading-[1.4] text-grey-800">{t("propertyDetails.locationNearby")}</h2>
          <div className="mt-2 flex flex-wrap gap-4 text-[14px] leading-[1.5] text-grey-700">
            {(property.nearby || []).map((item, idx) => (
              <span key={`${item.icon}-${idx}`}>{item.label.en}</span>
            ))}
          </div>
        </div>
        <button
          type="button"
          className="rounded-lg border border-grey-50 px-4 py-2 text-[14px] font-medium leading-[1.5] text-grey-700"
        >
          Show on map
        </button>
      </div>
      <PropertyMapDynamic
        coordinates={property.location.coordinates}
        title={property.title.en}
        height={327}
        className="rounded-xl"
      />
    </section>
  );
}
