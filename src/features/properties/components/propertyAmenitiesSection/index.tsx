import { getTranslations } from "next-intl/server";
import {
  ActivitiesSectionIcon,
  BeachesSectionIcon,
  DiningIcon,
  EventsIcon,
  PoolPremiumIcon,
  SeaViewPremiumIcon,
} from "@/assets/icons";
import type {
  PropertyAmenity,
  PropertyDetails,
} from "@/features/properties/type/propertyApiTypes";

const ICON_SIZE = 24;

function PremiumAmenityIcon({ amenity }: { amenity: PropertyAmenity }) {
  switch (amenity.title) {
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
    default:
      return null;
  }
}

interface PropertyAmenitiesSectionProps {
  property: PropertyDetails;
}

export default async function PropertyAmenitiesSection({
  property,
}: PropertyAmenitiesSectionProps) {
  const t = await getTranslations();

  return (
    <section className="space-y-4">
      <h2 className="text-[22px] font-semibold leading-[1.4] text-primary-blue-400">
        {t("propertyDetails.premiumAmenities")}
      </h2>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {property.amenities.map((amenity, index) => (
          <li
            key={`${amenity.title}-${index}`}
            className="flex h-[42px] items-center gap-3 rounded-xl border border-grey-50 bg-surface-primary px-3"
          >
            <PremiumAmenityIcon amenity={amenity} />
            <span className="text-[12px] font-semibold leading-[1.4] text-grey-900">
              {amenity.title}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
