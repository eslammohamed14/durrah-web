"use client";

import { useTranslations } from "next-intl";
import type { Property } from "@/lib/types";

interface PropertyHostSectionProps {
  property: Property;
  ownerName?: string;
}

export default function PropertyHostSection({
  property,
  ownerName,
}: PropertyHostSectionProps) {
  const t = useTranslations();
  const label = ownerName || "DURRAT AL AROUS";

  return (
    <section className="space-y-4">
      <h2 className="text-3xl font-semibold text-text-dark">{t("propertyDetails.aboutHost")}</h2>
      <div className="rounded-2xl border border-border-default p-4 sm:p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-blue-50 text-xl font-semibold text-primary-blue-400">
            {label.charAt(0)}
          </div>
          <div>
            <h3 className="text-xl font-semibold text-text-dark">{label}</h3>
            <p className="text-sm text-grey-600">{t("propertyDetails.officialUnit")}</p>
          </div>
        </div>
        <p className="mt-4 text-grey-700">
          {property.category === "rent"
            ? t("propertyDetails.hostDescription")
            : t("propertyDetails.hostDescriptionAlt")}
        </p>
      </div>
    </section>
  );
}
