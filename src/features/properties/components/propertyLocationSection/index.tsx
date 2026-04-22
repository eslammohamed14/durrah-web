"use client";

import { useLocale, useTranslations } from "next-intl";
import {
  ArrowRightLineIcon,
  LocationOutlineIcon,
  PropertyNearbyBuildingIcon,
  PropertyNearbyShopIcon,
} from "@/assets/icons";
import InlineInfoItem from "@/components/ui/InlineInfoItem";
import PropertyMapDynamic from "@/features/properties/components/propertyMapDynamic";
import type { Property } from "@/lib/types";

interface PropertyLocationSectionProps {
  property: Property;
}

export default function PropertyLocationSection({
  property,
}: PropertyLocationSectionProps) {
  const t = useTranslations();
  const locale = useLocale() as "en" | "ar";
  const nearbyItems = property.nearby || [];
  const { lat, lng } = property.location.coordinates;
  const directionsHref = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

  return (
    <section className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-[27px] text-primary-blue-400 font-semibold leading-[1.4]">
            {t("propertyDetails.locationNearby")}
          </h2>
          <a
            href={directionsHref}
            target="_blank"
            rel="noreferrer"
            className="group flex shrink-0 items-center gap-1 text-[14px] font-medium leading-[1.5] text-primary-coral-400"
          >
            <span className="text-nowrap">
              {t("propertyDetails.getDirections")}
            </span>
            <ArrowRightLineIcon
              size={24}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </a>
        </div>
        <div className="flex items-center gap-y-1 overflow-x-auto whitespace-nowrap">
          {nearbyItems.map((item, idx) => (
            <InlineInfoItem
              key={`${item.icon}-${idx}`}
              icon={
                item.icon === "shop" ? (
                  <PropertyNearbyShopIcon size={20} className="text-grey-500" />
                ) : item.icon === "building" ? (
                  <PropertyNearbyBuildingIcon
                    size={20}
                    className="text-grey-500"
                  />
                ) : (
                  <LocationOutlineIcon
                    size={20}
                    color="currentColor"
                    className="text-grey-500"
                  />
                )
              }
              text={item.label[locale] || item.label.en}
              showDivider={idx < nearbyItems.length - 1}
              className={["text-[14px] leading-[1.6]", idx > 0 ? "ps-3.5" : ""]
                .filter(Boolean)
                .join(" ")}
            />
          ))}
        </div>
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
