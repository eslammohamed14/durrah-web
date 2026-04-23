import { getTranslations } from "next-intl/server";
import { ArrowRightIcon } from "@/assets/icons";
import { CtaNavigateButton } from "@/components/ui/CtaNavigateButton";
import { PropertyCard } from "@/components/ui/PropertyCard";
import type { Property } from "@/lib/types";
import type { PropertyCard as ApiPropertyCard } from "@/features/properties/type/propertyApiTypes";

interface PropertySimilarSectionProps {
  properties: Property[];
}

function toApiPropertyCard(property: Property): ApiPropertyCard {
  return {
    id: Number(property.id) || 0,
    slug: property.id,
    title: property.title.en || property.title.ar || "Property",
    image: property.images[0]?.url ?? null,
    city: property.location.area || "",
    district: property.location.address.en || property.location.address.ar || "",
    total_area: property.specifications.size ?? 0,
    price_per_day: property.pricing.basePrice ?? 0,
    price_per_week: undefined,
    price_per_month: undefined,
    bedrooms: property.specifications.rooms ?? 0,
    bathrooms: property.specifications.bathrooms ?? 0,
    guests: property.specifications.maxGuests ?? 0,
    property_type: property.type,
  };
}

export default async function PropertySimilarSection({
  properties,
}: PropertySimilarSectionProps) {
  const t = await getTranslations();
  if (properties.length === 0) return null;
  const apiProperties = properties.map(toApiPropertyCard);

  return (
    <section className="bg-surface-primary py-16">
      <div className="w-full px-4 sm:px-6 lg:px-[120px]">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-[28px] font-semibold leading-[1.4] text-primary-blue-400">
            {t("propertyDetails.similarProperties")}
          </h2>
          <CtaNavigateButton
            href="/properties"
            className="h-10 shrink-0 px-4 text-[14px] leading-[1.4]"
            rightIcon={<ArrowRightIcon size={20} />}
          >
            {t("home.viewAllProperties")}
          </CtaNavigateButton>
        </div>
        <div className="mt-8 grid items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3">
          {apiProperties.slice(0, 3).map((property) => (
            <div key={property.slug || String(property.id)} className="h-full">
              <PropertyCard property={property} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
