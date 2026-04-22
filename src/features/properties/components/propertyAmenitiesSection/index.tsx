import { getTranslations } from "next-intl/server";
import {
  ActivitiesSectionIcon,
  BeachesSectionIcon,
  DiningIcon,
  EventsIcon,
  PoolPremiumIcon,
  SeaViewPremiumIcon,
} from "@/assets/icons";
import type { PremiumAmenityIconKey, Property } from "@/lib/types";

const ICON_SIZE = 24;

function PremiumAmenityIcon({ kind }: { kind: PremiumAmenityIconKey }) {
  switch (kind) {
    case "pool":
      return <PoolPremiumIcon size={ICON_SIZE} className="shrink-0" />;
    case "marina":
      return <BeachesSectionIcon size={ICON_SIZE} className="shrink-0" />;
    case "seaView":
      return <SeaViewPremiumIcon size={ICON_SIZE} className="shrink-0" />;
    case "waterSports":
      return <ActivitiesSectionIcon size={ICON_SIZE} className="shrink-0" />;
    case "dining":
      return <DiningIcon size={ICON_SIZE} className="shrink-0" />;
    case "events":
      return <EventsIcon size={ICON_SIZE} className="shrink-0" />;
    default: {
      const _exhaustive: never = kind;
      return _exhaustive;
    }
  }
}

interface PropertyAmenitiesSectionProps {
  property: Property;
}

export default async function PropertyAmenitiesSection({
  property,
}: PropertyAmenitiesSectionProps) {
  const t = await getTranslations();
  const premium = property.premiumAmenities;

  return (
    <section className="space-y-4">
      <h2 className="text-[22px] font-semibold leading-[1.4] text-primary-blue-400">
        {t("propertyDetails.premiumAmenities")}
      </h2>
      {premium?.length ? (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {premium.map((row) => (
            <li
              key={row.id}
              className="flex h-[42px] items-center gap-3 rounded-xl border border-grey-50 bg-surface-primary px-3"
            >
              <PremiumAmenityIcon kind={row.icon} />
              <span className="text-[12px] font-semibold leading-[1.4] text-grey-900">
                {t(`propertyDetails.${row.labelKey}`)}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {property.amenities.map((amenity) => (
            <li
              key={amenity}
              className="flex h-[42px] items-center rounded-xl border border-grey-50 bg-surface-primary px-3 text-[12px] font-medium leading-[1.4] text-grey-700"
            >
              {amenity}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
