"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/navigation";
import type { Property } from "@/lib/types";

interface PropertyBookingSidebarProps {
  property: Property;
}

export default function PropertyBookingSidebar({
  property,
}: PropertyBookingSidebarProps) {
  const t = useTranslations();
  const isBookable = property.category === "rent" || property.category === "activity";
  const base = property.pricing.basePrice;
  const fees = (property.pricing.fees || []).reduce((sum, item) => sum + item.amount, 0);

  return (
    <aside className="rounded-2xl border border-border-default bg-white p-4 shadow-sm sm:p-6 lg:sticky lg:top-24">
      <p className="text-2xl font-semibold text-text-dark">
        {base} {property.pricing.currency}
        <span className="text-base font-normal text-grey-500"> / {t("property.perNight")}</span>
      </p>

      <div className="mt-4 space-y-3 border-y border-border-default py-4 text-sm text-grey-700">
        <div className="flex justify-between">
          <span>{t("booking.basePrice")}</span>
          <span>
            {base} {property.pricing.currency}
          </span>
        </div>
        {(property.pricing.fees || []).map((fee) => (
          <div key={fee.name} className="flex justify-between">
            <span>{fee.name}</span>
            <span>
              {fee.amount} {property.pricing.currency}
            </span>
          </div>
        ))}
        <div className="flex justify-between border-t border-border-default pt-3 font-semibold text-text-dark">
          <span>{t("booking.total")}</span>
          <span>
            {base + fees} {property.pricing.currency}
          </span>
        </div>
      </div>

      {isBookable ? (
        <Link
          href={`/checkout/${property.id}`}
          className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-primary-blue-400 px-4 py-3 text-white"
        >
          {t("property.bookNow")}
        </Link>
      ) : (
        <Link
          href={`/properties/${property.id}`}
          className="mt-4 inline-flex w-full items-center justify-center rounded-xl border border-primary-blue-400 px-4 py-3 text-primary-blue-400"
        >
          {t("property.inquire")}
        </Link>
      )}
    </aside>
  );
}
