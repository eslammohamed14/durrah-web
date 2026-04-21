"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import type { Property } from "@/lib/types";

interface PropertyPoliciesSectionProps {
  property: Property;
}

export default function PropertyPoliciesSection({
  property,
}: PropertyPoliciesSectionProps) {
  const [showCancellation, setShowCancellation] = useState(false);
  const locale = useLocale();
  const t = useTranslations();

  return (
    <section className="space-y-5">
      <div>
        <h3 className="text-[28px] font-semibold leading-[1.4] text-grey-800">
          {t("propertyDetails.reservationPolicy")}
        </h3>
        <p className="mt-3 text-[16px] leading-[1.6] text-grey-600">
          {property.policies.houseRules[locale as "en" | "ar"]}
        </p>
      </div>
      <div className="border-t border-border-default pt-4">
        <button
          type="button"
          onClick={() => setShowCancellation((v) => !v)}
          className="flex w-full items-center justify-between text-left text-[28px] font-semibold leading-[1.4] text-grey-800"
        >
          {t("propertyDetails.cancellationPolicy")}
          <span className="text-[20px]">{showCancellation ? "▲" : "▼"}</span>
        </button>
        {showCancellation && property.policies.cancellation && (
          <p className="mt-3 text-[16px] leading-[1.6] text-grey-600">
            {property.policies.cancellation.description[locale as "en" | "ar"]}
          </p>
        )}
      </div>
    </section>
  );
}
