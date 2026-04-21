"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  BathroomIcon,
  BedIcon,
  DimensionIcon,
  KitchenIcon,
  LivingRoomIcon,
  LocationOutlineIcon,
  ParkingIcon,
} from "@/assets/icons";
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
  const [expanded, setExpanded] = useState(false);
  const shouldClampDescription = description.length > 260;

  const specs = useMemo(
    () => [
      {
        key: "size",
        icon: <DimensionIcon size={24} color="#727272" />,
        value: `${sqFt.toLocaleString("en-US")} sq.ft.`,
      },
      {
        key: "rooms",
        icon: <BedIcon size={24} color="#727272" />,
        value: t("propertyDetails.bedShort", {
          count: property.specifications.rooms ?? 0,
        }),
      },
      {
        key: "bathrooms",
        icon: <BathroomIcon size={24} color="#727272" />,
        value: t("propertyDetails.bathShort", {
          count: property.specifications.bathrooms ?? 0,
        }),
      },
      {
        key: "living",
        icon: <LivingRoomIcon size={24} />,
        value: t("propertyDetails.livingShort", { count: 1 }),
      },
      {
        key: "kitchen",
        icon: <KitchenIcon size={24} />,
        value: t("propertyDetails.kitchenShort", { count: 1 }),
      },
      {
        key: "parking",
        icon: <ParkingIcon size={24} />,
        value: t("propertyDetails.parkingSpaceShort", { count: 1 }),
      },
    ],
    [property.specifications.rooms, property.specifications.bathrooms, sqFt, t],
  );

  const visibleDescription =
    shouldClampDescription && !expanded
      ? `${description.slice(0, 260).trimEnd()}..`
      : description;

  return (
    <section className="space-y-6">
      <div className="space-y-3">
        <div className="flex items-center gap-1">
          <LocationOutlineIcon size={24} />
          <p className="text-[16px] font-medium leading-[1.5] text-primary-blue-300/90">
            {area}
          </p>
        </div>
        <h2 className="text-[22px] font-semibold leading-[1.5] text-primary-blue-400">
          {t("propertyDetails.unitInfo")}
        </h2>
        <div className="flex flex-wrap items-center gap-y-2">
          {specs.map((spec, index) => (
            <div
              key={spec.key}
              className={[
                "flex items-center gap-1.5 pe-2 text-[16px] leading-[1.6] text-grey-600",
                index < specs.length - 1 ? "border-e border-grey-100" : "",
              ].join(" ")}
            >
              {spec.icon}
              <span>{spec.value}</span>
            </div>
          ))}
        </div>
      </div>
      <p className="text-[18px] leading-[1.6] text-grey-600">
        {visibleDescription}{" "}
        {shouldClampDescription ? (
          <button
            type="button"
            onClick={() => setExpanded((prev) => !prev)}
            className="text-[18px] font-semibold leading-[1.4] text-primary-blue-400"
          >
            {expanded ? t("propertyDetails.readLess") : t("propertyDetails.readMore")}
          </button>
        ) : null}
      </p>
    </section>
  );
}
