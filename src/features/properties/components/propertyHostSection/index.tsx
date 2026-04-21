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
  const label = ownerName || property.host?.name.en || "DURRAT AL AROUS";
  const hostTitle = property.host?.title?.en || t("propertyDetails.officialUnit");
  const hostDescription =
    property.host?.description?.en ||
    (property.category === "rent"
      ? t("propertyDetails.hostDescription")
      : t("propertyDetails.hostDescriptionAlt"));

  return (
    <section className="space-y-4">
      <h2 className="text-[28px] font-semibold leading-[1.4] text-grey-800">{t("propertyDetails.aboutHost")}</h2>
      <div className="rounded-xl border border-grey-50 bg-white p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-[78px] w-[78px] items-center justify-center rounded-full bg-primary-blue-50 text-xl font-semibold text-primary-blue-400">
            {label.charAt(0)}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-[22px] font-semibold leading-[1.4] text-grey-800">{label}</h3>
              <span className="rounded-full bg-surface-primary px-2 py-1 text-[12px] font-medium leading-[1.5] text-primary-blue-400">
                {hostTitle}
              </span>
            </div>
          </div>
        </div>
        <p className="mt-4 text-[16px] font-medium leading-[1.5] text-grey-800">Managed by Durrat Al Arous</p>
        <p className="mt-1 text-[14px] leading-[1.6] text-grey-600">{hostDescription}</p>
      </div>
    </section>
  );
}
