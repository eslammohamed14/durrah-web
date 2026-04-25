import { getTranslations } from "next-intl/server";
import { ArrowRightIcon } from "@/assets/icons";
import { CtaNavigateButton } from "@/components/ui/CtaNavigateButton";
import { PropertyCard } from "@/components/ui/PropertyCard";
import type { Property } from "@/lib/types";
import { toApiPropertyCard } from "@/features/properties/utils/toApiPropertyCard";

interface PropertySimilarSectionProps {
  properties: Property[];
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
