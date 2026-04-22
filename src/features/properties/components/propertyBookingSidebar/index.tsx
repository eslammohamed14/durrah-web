"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { DiscountIcon, Profile2UserIcon } from "@/assets/icons";
import { Link } from "@/navigation";
import { DateRangePanel } from "@/features/home/components/heroSection/DateRangePanel";
import { FilterField } from "@/features/home/components/heroSection/FilterField";
import type { DateRange } from "@/features/home/hooks/useHeroFilter";
import type { Property } from "@/lib/types";

interface PropertyBookingSidebarProps {
  property: Property;
}

function defaultDateRange(property: Property): DateRange {
  const nights = Math.max(1, property.pricing.previewNights ?? 1);
  const from = new Date();
  from.setHours(12, 0, 0, 0);
  from.setDate(from.getDate() + 30);
  const to = new Date(from);
  to.setDate(to.getDate() + nights);
  return { from, to };
}

function nightsBetween(
  from: Date | undefined,
  to: Date | undefined,
  fallback: number,
): number {
  if (!from || !to) return Math.max(1, fallback);
  const start = new Date(from);
  const end = new Date(to);
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  const days = Math.round((end.getTime() - start.getTime()) / 86400000);
  return Math.max(1, days);
}

export default function PropertyBookingSidebar({
  property,
}: PropertyBookingSidebarProps) {
  const t = useTranslations();
  const locale = useLocale();
  const isBookable =
    property.category === "rent" || property.category === "activity";
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [dateRange, setDateRange] = useState<DateRange>(() =>
    defaultDateRange(property),
  );
  const [guests, setGuests] = useState(() => {
    const max = property.specifications.maxGuests ?? 8;
    const included = property.pricing.includedGuestsForPricing ?? 2;
    return Math.min(max, Math.max(1, included));
  });
  const [openPanel, setOpenPanel] = useState<"date" | "guests" | null>(null);

  const closePanel = useCallback(() => setOpenPanel(null), []);
  const togglePanel = useCallback((panel: "date" | "guests") => {
    setOpenPanel((prev) => (prev === panel ? null : panel));
  }, []);

  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        closePanel();
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [closePanel]);

  const formatDateRange = useCallback(
    (range: DateRange): string => {
      if (!range.from) return "";
      const opts: Intl.DateTimeFormatOptions = {
        day: "2-digit",
        month: "short",
      };
      const fmt = (d: Date) => new Intl.DateTimeFormat(locale, opts).format(d);
      return range.to
        ? `${fmt(range.from)} – ${fmt(range.to)}`
        : fmt(range.from);
    },
    [locale],
  );

  const dateLabel = formatDateRange(dateRange);
  const guestsLabel = t("property.guestsShort", { count: guests });
  const maxGuests = property.specifications.maxGuests ?? 99;

  const base = property.pricing.basePrice;
  const nightlyRate = property.pricing.previewNightlyRate ?? base;
  const previewNightsFallback = property.pricing.previewNights ?? 1;
  const nights = nightsBetween(
    dateRange.from,
    dateRange.to,
    previewNightsFallback,
  );

  const includedGuests = property.pricing.includedGuestsForPricing ?? 1;
  const extraGuestPerNight = property.pricing.extraGuestFeePerNight ?? 0;
  const extraGuestCount = Math.max(0, guests - includedGuests);
  const extraGuestTotal =
    extraGuestPerNight > 0 ? extraGuestCount * extraGuestPerNight * nights : 0;

  const accommodationSubtotal = nightlyRate * nights;
  const discount = property.pricing.offerPercentage
    ? Math.round(
        accommodationSubtotal * (property.pricing.offerPercentage / 100) * 10,
      ) / 10
    : 0;
  const feesTotal = (property.pricing.fees || []).reduce(
    (sum, item) => sum + item.amount,
    0,
  );
  const total =
    property.pricing.priceType === "total"
      ? base
      : accommodationSubtotal - discount + extraGuestTotal + feesTotal;

  const nightsLabel =
    nights === 1
      ? t("booking.nights", { count: 1 })
      : t("booking.nights_plural", { count: nights });

  const accommodationDescription = t("property.accommodationLine", {
    rate: nightlyRate,
    currency: property.pricing.currency,
    nightsLabel,
  });

  const incrementGuests = useCallback(() => {
    setGuests((n) => Math.min(maxGuests, n + 1));
  }, [maxGuests]);

  const decrementGuests = useCallback(() => {
    setGuests((n) => Math.max(1, n - 1));
  }, []);

  const checkoutHref = useMemo(() => {
    const params = new URLSearchParams();
    if (dateRange.from)
      params.set("checkIn", dateRange.from.toISOString().split("T")[0]);
    if (dateRange.to)
      params.set("checkOut", dateRange.to.toISOString().split("T")[0]);
    params.set("guests", String(guests));
    const q = params.toString();
    return q ? `/checkout/${property.id}?${q}` : `/checkout/${property.id}`;
  }, [dateRange.from, dateRange.to, guests, property.id]);

  return (
    <aside className="pt-10">
      <div className="w-full rounded-[12px] border border-grey-50 bg-white px-4 py-6 shadow-[0_0_24px_0_rgba(0,0,0,0.06)]">
        <div className="space-y-1">
          {property.pricing.originalPrice && (
            <p className="text-[12px] font-normal leading-[1.5] text-grey-600 line-through">
              {property.pricing.originalPrice} {property.pricing.currency} /{" "}
              {t("property.perNight")}
            </p>
          )}
          <div className="flex items-center justify-between">
            <p className="text-[18px] font-semibold leading-[1.4] text-grey-800">
              {base} {property.pricing.currency}
              <span className="text-[12px] font-medium leading-[1.5] text-grey-600">
                {" "}
                / {t("property.perNight")}
              </span>
            </p>
            {property.pricing.offerPercentage && (
              <span className="rounded-full border border-grey-50 px-2 py-1 text-[12px] font-medium leading-[1.5] text-primary-coral-400">
                Offer {property.pricing.offerPercentage} %
              </span>
            )}
          </div>
        </div>

        <div
          ref={wrapperRef}
          className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2"
        >
          <div className="relative sm:col-span-2">
            <FilterField
              variant="card"
              label={t("home.bookingDates")}
              value={dateLabel}
              placeholder={t("home.addDates")}
              trailing="calendar"
              isOpen={openPanel === "date"}
              onClick={() => togglePanel("date")}
              panel={
                <DateRangePanel
                  value={dateRange}
                  onChange={(range) => {
                    setDateRange(range);
                    if (range.from && range.to) closePanel();
                  }}
                />
              }
            />
          </div>
          <div className="relative space-y-1 sm:col-span-2">
            <FilterField
              variant="card"
              label=""
              ariaLabel={t("search.guests")}
              value={guestsLabel}
              placeholder={t("search.guests")}
              trailing="dualChevron"
              chevronClassName="#404040"
              leading={<Profile2UserIcon size={18} strokeColor="#262626" />}
              isOpen={openPanel === "guests"}
              onClick={() => togglePanel("guests")}
              onIncrement={incrementGuests}
              onDecrement={decrementGuests}
              decrementDisabled={guests <= 1}
            />
            <p className="text-[12px] font-normal leading-normal text-grey-300">
              {t("property.guestPermitHelper")}
            </p>
          </div>
        </div>

        {isBookable ? (
          <Link
            href={checkoutHref}
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
          <p className="text-[16px] font-semibold leading-[1.5] text-grey-800">
            {t("property.pricingBreakdownTitle")}
          </p>
          <div className="space-y-3 text-[16px]">
            <div className="flex items-center justify-between text-grey-600">
              <span>{accommodationDescription}</span>
              <span className="font-medium text-grey-800">
                {accommodationSubtotal} {property.pricing.currency}
              </span>
            </div>
            {!!discount && (
              <div className="flex items-center justify-between text-[16px] font-medium text-[#3E7D3E]">
                <span className="flex items-center gap-1">
                  <DiscountIcon
                    size={22}
                    strokeColor="#3E7D3E"
                    className="shrink-0"
                  />
                  {t("property.discountPercentLabel", {
                    percent: property.pricing.offerPercentage ?? 0,
                  })}
                </span>
                <span className="text-right">
                  - {discount} {property.pricing.currency}
                </span>
              </div>
            )}
            {extraGuestTotal > 0 && (
              <div className="flex items-center justify-between text-grey-600">
                <span>{t("property.extraGuestFees")}</span>
                <span className="font-medium text-grey-800">
                  {extraGuestTotal} {property.pricing.currency}
                </span>
              </div>
            )}
            {(property.pricing.fees || []).map((fee) => (
              <div
                key={fee.name}
                className="flex items-center justify-between text-grey-600"
              >
                <span>{fee.name}</span>
                <span className="font-medium text-grey-800">
                  {fee.amount} {property.pricing.currency}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="my-4 h-px w-full bg-grey-50" />
        <div className="flex items-center justify-between">
          <span className="text-[18px] font-semibold leading-[1.4] text-grey-800">
            {t("booking.total")}
          </span>
          <span className="text-[22px] font-semibold leading-[1.4] text-primary-coral-400">
            {total} {property.pricing.currency}
          </span>
        </div>
      </div>
    </aside>
  );
}
