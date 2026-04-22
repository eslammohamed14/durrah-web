import { getLocale, getTranslations } from "next-intl/server";
import {
  BathroomIcon,
  BedIcon,
  DimensionIcon,
  KitchenIcon,
  LivingRoomIcon,
  LocationOutlineIcon,
  ParkingIcon,
} from "@/assets/icons";
import InlineInfoItem from "@/components/ui/InlineInfoItem";
import type { Property } from "@/lib/types";
import { DescriptionToggle } from "./DescriptionToggle";

interface PropertyInfoSectionProps {
  property: Property;
}

export default async function PropertyInfoSection({
  property,
}: PropertyInfoSectionProps) {
  const t = await getTranslations();
  const locale = (await getLocale()) as "en" | "ar";

  const description =
    property.description[locale] || property.description.en;
  const area = property.location.area;
  const sqFt = Math.round(property.specifications.size * 10.7639);

  const specs = [
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
  ];

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
            <InlineInfoItem
              key={spec.key}
              icon={spec.icon}
              text={spec.value}
              showDivider={index < specs.length - 1}
              className={[
                "text-[16px] leading-[1.6]",
                index > 0 ? "ps-3.5" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            />
          ))}
        </div>
      </div>
      {/* Leaf client component: handles expand/collapse toggle */}
      <DescriptionToggle description={description} />
    </section>
  );
}
