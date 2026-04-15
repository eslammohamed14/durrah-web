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
}

function GuestCounter({ label, value, min, max, onChange }: GuestCounterProps) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-700">{label}</span>
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label={`Decrease ${label}`}
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
          aria-label={`Increase ${label}`}
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
  const isAr = locale === "ar";
  const fmt = (n: number) => formatCurrency(n, breakdown.currency, locale);

  return (
    <div className="space-y-2 rounded-lg bg-gray-50 p-4 text-sm">
      <div className="flex justify-between text-gray-600">
        <span>
          {fmt(basePrice)} × {breakdown.nights}{" "}
          {isAr ? "ليلة" : `night${breakdown.nights !== 1 ? "s" : ""}`}
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
        <span>{isAr ? "الضريبة (15%)" : "Taxes (15%)"}</span>
        <span>{fmt(breakdown.taxes)}</span>
      </div>

      <div className="flex justify-between border-t border-gray-200 pt-2 font-semibold text-gray-900">
        <span>{isAr ? "الإجمالي" : "Total"}</span>
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
  const isAr = locale === "ar";

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
      errs.push(
        isAr
          ? "يرجى تحديد تواريخ الوصول والمغادرة"
          : "Please select check-in and check-out dates",
      );
    }
    if (
      dateRange.checkIn &&
      dateRange.checkOut &&
      dateRange.checkOut <= dateRange.checkIn
    ) {
      errs.push(
        isAr
          ? "يجب أن يكون تاريخ المغادرة بعد تاريخ الوصول"
          : "Check-out must be after check-in",
      );
    }
    if (adults < 1) {
      errs.push(
        isAr
          ? "يجب أن يكون هناك ضيف بالغ واحد على الأقل"
          : "At least one adult guest is required",
      );
    }
    if (totalGuests > maxGuests) {
      errs.push(
        isAr
          ? `الحد الأقصى للضيوف هو ${maxGuests}`
          : `Maximum ${maxGuests} guests allowed`,
      );
    }

    setErrors(errs);
    return errs.length === 0;
  }, [dateRange, adults, totalGuests, maxGuests, isAr]);

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
          {isAr ? "اختر التواريخ" : "Select dates"}
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
          {isAr ? "عدد الضيوف" : "Guests"}
          {maxGuests < 99 && (
            <span className="ms-1 font-normal text-gray-400">
              ({isAr ? `الحد الأقصى ${maxGuests}` : `max ${maxGuests}`})
            </span>
          )}
        </h3>
        <div className="space-y-3">
          <GuestCounter
            label={isAr ? "بالغون" : "Adults"}
            value={adults}
            min={1}
            max={maxGuests - children}
            onChange={setAdults}
          />
          <GuestCounter
            label={isAr ? "أطفال" : "Children"}
            value={children}
            min={0}
            max={maxGuests - adults}
            onChange={setChildren}
          />
        </div>
      </div>

      {/* Price breakdown */}
      {breakdown && (
        <div>
          <h3 className="mb-2 text-sm font-semibold text-gray-800">
            {isAr ? "تفاصيل السعر" : "Price breakdown"}
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
          ? isAr
            ? `احجز الآن — ${formatCurrency(breakdown.total, breakdown.currency, locale)}`
            : `Reserve — ${formatCurrency(breakdown.total, breakdown.currency, locale)}`
          : isAr
            ? "اختر التواريخ للمتابعة"
            : "Select dates to continue"}
      </Button>
    </form>
  );
}
