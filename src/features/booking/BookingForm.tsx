"use client";

/**
 * BookingForm — date range + guest count + price breakdown for a property.
 *
 * - Embeds AvailabilityCalendar for date selection
 * - Guest count inputs (adults / children) with maxGuests validation
 * - Dynamic pricing: base price × nights + fees + 15% tax
 * - Price breakdown display
 * - Form validation before proceeding to checkout
 *
 * Requirements: 7.1, 7.2, 7.7, 29.4
 */

import React, { useState, useMemo, useCallback } from "react";
import type { Property } from "@/lib/types";
import { AvailabilityCalendar } from "./AvailabilityCalendar";
import type { DateRange } from "./AvailabilityCalendar";
import { Button } from "@/components/ui/Button";
import { useLocale } from "@/lib/contexts/LocaleContext";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface BookingFormData {
  checkIn: Date;
  checkOut: Date;
  guests: { adults: number; children: number };
  pricing: {
    basePrice: number;
    fees: { name: string; amount: number }[];
    taxes: number;
    total: number;
    currency: string;
    nights: number;
  };
}

export interface BookingFormProps {
  property: Property;
  onSubmit: (data: BookingFormData) => void;
  locale?: string;
  className?: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function diffDays(a: Date, b: Date): number {
  return Math.round((b.getTime() - a.getTime()) / 86_400_000);
}

function formatCurrency(
  amount: number,
  currency: string,
  locale: string,
): string {
  try {
    return new Intl.NumberFormat(locale === "ar" ? "ar-SA" : "en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${amount.toLocaleString()} ${currency}`;
  }
}

// ── Price calculation ─────────────────────────────────────────────────────────

interface PriceBreakdown {
  nights: number;
  baseTotal: number;
  fees: { name: string; amount: number }[];
  taxes: number;
  total: number;
  currency: string;
}

function calculatePrice(property: Property, nights: number): PriceBreakdown {
  const { basePrice, currency, fees = [] } = property.pricing;
  const baseTotal = basePrice * nights;
  const feesTotal = fees.reduce((sum, f) => sum + f.amount, 0);
  const taxes = Math.round((baseTotal + feesTotal) * 0.15);
  const total = baseTotal + feesTotal + taxes;

  return { nights, baseTotal, fees, taxes, total, currency };
}

// ── Guest counter ─────────────────────────────────────────────────────────────

interface GuestCounterProps {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
  ariaDecrease: string;
  ariaIncrease: string;
}

function GuestCounter({
  label,
  value,
  min,
  max,
  onChange,
  ariaDecrease,
  ariaIncrease,
}: GuestCounterProps) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-700">{label}</span>
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label={ariaDecrease}
          disabled={value <= min}
          onClick={() => onChange(Math.max(min, value - 1))}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          −
        </button>
        <span className="w-4 text-center text-sm font-medium tabular-nums">
          {value}
        </span>
        <button
          type="button"
          aria-label={ariaIncrease}
          disabled={value >= max}
          onClick={() => onChange(Math.min(max, value + 1))}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          +
        </button>
      </div>
    </div>
  );
}

// ── Price breakdown ───────────────────────────────────────────────────────────

interface PriceBreakdownProps {
  breakdown: PriceBreakdown;
  basePrice: number;
  locale: string;
}

function PriceBreakdownDisplay({
  breakdown,
  basePrice,
  locale,
}: PriceBreakdownProps) {
  const { t } = useLocale();
  const fmt = (n: number) => formatCurrency(n, breakdown.currency, locale);
  const nightsWord =
    breakdown.nights === 1
      ? t("bookingForm.night")
      : t("bookingForm.night_plural");

  return (
    <div className="space-y-2 rounded-lg bg-gray-50 p-4 text-sm">
      <div className="flex justify-between text-gray-600">
        <span>
          {fmt(basePrice)} × {breakdown.nights} {nightsWord}
        </span>
        <span>{fmt(breakdown.baseTotal)}</span>
      </div>

      {breakdown.fees.map((fee) => (
        <div key={fee.name} className="flex justify-between text-gray-600">
          <span>{fee.name}</span>
          <span>{fmt(fee.amount)}</span>
        </div>
      ))}

      <div className="flex justify-between text-gray-600">
        <span>{t("bookingForm.taxesPercent")}</span>
        <span>{fmt(breakdown.taxes)}</span>
      </div>

      <div className="flex justify-between border-t border-gray-200 pt-2 font-semibold text-gray-900">
        <span>{t("bookingForm.total")}</span>
        <span>{fmt(breakdown.total)}</span>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function BookingForm({
  property,
  onSubmit,
  locale = "en",
  className = "",
}: BookingFormProps) {
  const { t } = useLocale();

  const [dateRange, setDateRange] = useState<DateRange>({
    checkIn: null,
    checkOut: null,
  });
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);

  const maxGuests = property.specifications.maxGuests ?? 20;
  const totalGuests = adults + children;

  const nights = useMemo(() => {
    if (dateRange.checkIn && dateRange.checkOut) {
      return diffDays(dateRange.checkIn, dateRange.checkOut);
    }
    return 0;
  }, [dateRange]);

  const breakdown = useMemo(() => {
    if (nights > 0) return calculatePrice(property, nights);
    return null;
  }, [property, nights]);

  const availability = property.availability ?? {
    propertyId: property.id,
    bookedDates: [],
    blockedDates: [],
  };

  const validate = useCallback((): boolean => {
    const errs: string[] = [];

    if (!dateRange.checkIn || !dateRange.checkOut) {
      errs.push(t("bookingForm.selectDatesError"));
    }
    if (
      dateRange.checkIn &&
      dateRange.checkOut &&
      dateRange.checkOut <= dateRange.checkIn
    ) {
      errs.push(t("bookingForm.checkoutAfterCheckinError"));
    }
    if (adults < 1) {
      errs.push(t("bookingForm.atLeastOneAdult"));
    }
    if (totalGuests > maxGuests) {
      errs.push(t("bookingForm.maxGuestsError", { max: maxGuests }));
    }

    setErrors(errs);
    return errs.length === 0;
  }, [dateRange, adults, totalGuests, maxGuests, t]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (
        !validate() ||
        !breakdown ||
        !dateRange.checkIn ||
        !dateRange.checkOut
      )
        return;

      onSubmit({
        checkIn: dateRange.checkIn,
        checkOut: dateRange.checkOut,
        guests: { adults, children },
        pricing: {
          basePrice: breakdown.baseTotal,
          fees: breakdown.fees,
          taxes: breakdown.taxes,
          total: breakdown.total,
          currency: breakdown.currency,
          nights: breakdown.nights,
        },
      });
    },
    [validate, breakdown, dateRange, adults, children, onSubmit],
  );

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className={`space-y-5 ${className}`}
    >
      {/* Date selection */}
      <div>
        <h3 className="mb-2 text-sm font-semibold text-gray-800">
          {t("bookingForm.selectDates")}
        </h3>
        <AvailabilityCalendar
          availability={availability}
          value={dateRange}
          onChange={setDateRange}
          locale={locale}
        />
      </div>

      {/* Guest count */}
      <div className="rounded-lg border border-gray-200 p-4">
        <h3 className="mb-3 text-sm font-semibold text-gray-800">
          {t("bookingForm.guestsLabel")}
          {maxGuests < 99 && (
            <span className="ms-1 font-normal text-gray-400">
              ({t("bookingForm.maxGuestsHint", { max: maxGuests })})
            </span>
          )}
        </h3>
        <div className="space-y-3">
          <GuestCounter
            label={t("bookingForm.adults")}
            value={adults}
            min={1}
            max={maxGuests - children}
            onChange={setAdults}
            ariaDecrease={t("bookingForm.decreaseCount", {
              label: t("bookingForm.adults"),
            })}
            ariaIncrease={t("bookingForm.increaseCount", {
              label: t("bookingForm.adults"),
            })}
          />
          <GuestCounter
            label={t("bookingForm.children")}
            value={children}
            min={0}
            max={maxGuests - adults}
            onChange={setChildren}
            ariaDecrease={t("bookingForm.decreaseCount", {
              label: t("bookingForm.children"),
            })}
            ariaIncrease={t("bookingForm.increaseCount", {
              label: t("bookingForm.children"),
            })}
          />
        </div>
      </div>

      {/* Price breakdown */}
      {breakdown && (
        <div>
          <h3 className="mb-2 text-sm font-semibold text-gray-800">
            {t("bookingForm.priceBreakdown")}
          </h3>
          <PriceBreakdownDisplay
            breakdown={breakdown}
            basePrice={property.pricing.basePrice}
            locale={locale}
          />
        </div>
      )}

      {/* Validation errors */}
      {errors.length > 0 && (
        <ul role="alert" className="space-y-1 rounded-md bg-red-50 p-3">
          {errors.map((err) => (
            <li key={err} className="text-xs text-red-600">
              {err}
            </li>
          ))}
        </ul>
      )}

      {/* Submit */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full"
        disabled={!dateRange.checkIn || !dateRange.checkOut}
      >
        {breakdown
          ? t("bookingForm.bookNowWithTotal", {
              amount: formatCurrency(
                breakdown.total,
                breakdown.currency,
                locale,
              ),
            })
          : t("bookingForm.selectDatesToContinue")}
      </Button>
    </form>
  );
}
