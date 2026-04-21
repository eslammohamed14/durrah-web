"use client";

import { useTranslations } from "next-intl";
import { PropertyCard } from "@/components/ui/PropertyCard";
import type { Property } from "@/lib/types";

interface PropertySimilarSectionProps {
  properties: Property[];
}

export default function PropertySimilarSection({
  properties,
}: PropertySimilarSectionProps) {
  const t = useTranslations();
  if (properties.length === 0) return null;

  return (
    <section className="bg-surface-primary py-16">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <h2 className="text-4xl font-semibold text-text-dark">
          {t("propertyDetails.similarProperties")}
        </h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {properties.slice(0, 3).map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>
    </section>
  );
}
