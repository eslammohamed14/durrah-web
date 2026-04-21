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
  const nightlyRate = property.pricing.previewNightlyRate ?? base;
  const nights = property.pricing.previewNights ?? 1;
  const fees = (property.pricing.fees || []).reduce((sum, item) => sum + item.amount, 0);
  const subtotal = nightlyRate * nights;
  const discount = property.pricing.offerPercentage
    ? Math.round(subtotal * (property.pricing.offerPercentage / 100) * 10) / 10
    : 0;
  const total = property.pricing.priceType === "total" ? base : subtotal - discount + fees;

  return (
    <aside className="bg-white pt-10 lg:sticky lg:top-24">
      <div className="w-full rounded-[12px] border border-grey-50 bg-white px-4 py-6 shadow-[0_0_24px_0_rgba(0,0,0,0.06)]">
        <div className="space-y-1">
          {property.pricing.originalPrice && (
            <p className="text-[12px] font-normal leading-[1.5] text-grey-600 line-through">
              {property.pricing.originalPrice} {property.pricing.currency} / {t("property.perNight")}
            </p>
          )}
          <div className="flex items-center justify-between">
            <p className="text-[18px] font-semibold leading-[1.4] text-grey-800">
              {base} {property.pricing.currency}
              <span className="text-[12px] font-medium leading-[1.5] text-grey-600"> / {t("property.perNight")}</span>
            </p>
            {property.pricing.offerPercentage && (
              <span className="rounded-full border border-grey-50 px-2 py-1 text-[12px] font-medium leading-[1.5] text-primary-coral-400">
                Offer {property.pricing.offerPercentage} %
              </span>
            )}
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <p className="text-[16px] font-semibold leading-[1.5] text-grey-800">Booking Dates</p>
          <div className="h-[42px] rounded-xl border border-grey-50 bg-surface-primary px-3 py-2 text-[14px] leading-[1.6] text-grey-900 shadow-[0_0_24px_0_rgba(0,0,0,0.06)]">
            16 Feb 2026 - 22 Feb 2026
          </div>
          <div className="h-[42px] rounded-xl border border-grey-50 bg-surface-primary px-3 py-2 text-[14px] leading-[1.6] text-grey-900 shadow-[0_0_24px_0_rgba(0,0,0,0.06)]">
            {property.specifications.maxGuests ?? 3} Guests
          </div>
        </div>

        {isBookable ? (
          <Link
            href={`/checkout/${property.id}`}
            className="mt-4 inline-flex h-12 w-full items-center justify-center rounded-lg bg-primary-coral-400 px-4 text-[16px] font-medium leading-[1.6] text-white"
          >
            {t("property.bookNow")}
          </Link>
        ) : (
          <Link
            href={`/properties/${property.id}`}
            className="mt-4 inline-flex h-12 w-full items-center justify-center rounded-lg border border-primary-coral-400 px-4 text-[16px] font-medium leading-[1.6] text-primary-coral-400"
          >
            {t("property.inquire")}
          </Link>
        )}

        <div className="my-4 h-px w-full bg-grey-50" />

        <div className="space-y-3">
          <p className="text-[16px] font-semibold leading-[1.5] text-grey-800">Pricing Breackdown</p>
          <div className="space-y-3 text-[16px]">
            <div className="flex items-center justify-between text-grey-600">
              <span>{nightlyRate} {property.pricing.currency} * {nights} nights</span>
              <span className="font-medium text-grey-800">{subtotal} {property.pricing.currency}</span>
            </div>
            {!!discount && (
              <div className="flex items-center justify-between font-medium text-success-dark">
                <span>{property.pricing.offerPercentage}% OFF</span>
                <span>- {discount} {property.pricing.currency}</span>
              </div>
            )}
            {(property.pricing.fees || []).map((fee) => (
              <div key={fee.name} className="flex items-center justify-between text-grey-600">
                <span>{fee.name}</span>
                <span className="font-medium text-grey-800">{fee.amount} {property.pricing.currency}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="my-4 h-px w-full bg-grey-50" />
        <div className="flex items-center justify-between">
          <span className="text-[18px] font-semibold leading-[1.4] text-grey-800">{t("booking.total")}</span>
          <span className="text-[22px] font-semibold leading-[1.4] text-primary-coral-400">
            {total} {property.pricing.currency}
          </span>
        </div>
      </div>
    </aside>
  );
}
