"use client";

/**
 * AvailabilityCalendar — date range picker for booking.
 *
 * - Displays a two-month calendar (current + next)
 * - Disables booked, blocked, and past dates
 * - Allows selecting a check-in / check-out range
 * - Calculates number of nights
 * - Shows min/max stay requirements
 * - Validates check-out > check-in
 *
 * Requirements: 29.1, 29.2, 29.3, 29.5, 29.6, 30.1, 30.3
 */

import React, { useState, useCallback, useMemo } from "react";
import type { AvailabilityCalendar as AvailabilityData } from "@/lib/types";
import { useLocale } from "@/lib/contexts/LocaleContext";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface DateRange {
  checkIn: Date | null;
  checkOut: Date | null;
}

export interface AvailabilityCalendarProps {
  availability: AvailabilityData;
  value: DateRange;
  onChange: (range: DateRange) => void;
  /** Locale for day/month labels */
  locale?: string;
  className?: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function toDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date: Date, n: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

function diffDays(a: Date, b: Date): number {
  return Math.round(
    (startOfDay(b).getTime() - startOfDay(a).getTime()) / 86_400_000,
  );
}

function isSameDay(a: Date, b: Date): boolean {
  return toDateKey(a) === toDateKey(b);
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number): number {
  return new Date(year, month, 1).getDay(); // 0 = Sunday
}

// ── Day status ────────────────────────────────────────────────────────────────

type DayStatus =
  | "available"
  | "booked"
  | "blocked"
  | "past"
  | "selected-start"
  | "selected-end"
  | "selected-range"
  | "hover-range";

function getDayStatus(
  date: Date,
  today: Date,
  bookedSet: Set<string>,
  blockedSet: Set<string>,
  value: DateRange,
  hoverDate: Date | null,
): DayStatus {
  const key = toDateKey(date);

  if (date < today) return "past";
  if (bookedSet.has(key)) return "booked";
  if (blockedSet.has(key)) return "blocked";

  const { checkIn, checkOut } = value;

  if (checkIn && isSameDay(date, checkIn)) return "selected-start";
  if (checkOut && isSameDay(date, checkOut)) return "selected-end";

  if (checkIn && checkOut && date > checkIn && date < checkOut)
    return "selected-range";

  // Hover preview (only when checkIn is set but checkOut is not)
  if (
    checkIn &&
    !checkOut &&
    hoverDate &&
    date > checkIn &&
    date <= hoverDate
  ) {
    return "hover-range";
  }

  return "available";
}

// ── Day cell styles ───────────────────────────────────────────────────────────

const dayBase =
  "relative flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium transition-colors select-none";

const statusStyles: Record<DayStatus, string> = {
  available:
    "cursor-pointer text-gray-800 hover:bg-blue-100 hover:text-blue-700",
  booked: "cursor-not-allowed text-gray-300 line-through",
  blocked: "cursor-not-allowed text-gray-300 line-through",
  past: "cursor-not-allowed text-gray-300",
  "selected-start": "cursor-pointer bg-blue-600 text-white rounded-full",
  "selected-end": "cursor-pointer bg-blue-600 text-white rounded-full",
  "selected-range": "cursor-pointer bg-blue-100 text-blue-700 rounded-none",
  "hover-range": "cursor-pointer bg-blue-50 text-blue-600 rounded-none",
};

// ── Month grid ────────────────────────────────────────────────────────────────

interface MonthGridProps {
  year: number;
  month: number; // 0-indexed
  today: Date;
  bookedSet: Set<string>;
  blockedSet: Set<string>;
  value: DateRange;
  hoverDate: Date | null;
  onDayClick: (date: Date) => void;
  onDayHover: (date: Date | null) => void;
  locale: string;
}

const WEEKDAYS_EN = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const WEEKDAYS_AR = ["أح", "إث", "ثل", "أر", "خم", "جم", "سب"];

function MonthGrid({
  year,
  month,
  today,
  bookedSet,
  blockedSet,
  value,
  hoverDate,
  onDayClick,
  onDayHover,
  locale,
}: MonthGridProps) {
  const isAr = locale === "ar";
  const weekdays = isAr ? WEEKDAYS_AR : WEEKDAYS_EN;

  const monthName = new Date(year, month, 1).toLocaleString(locale, {
    month: "long",
    year: "numeric",
  });

  const daysInMonth = getDaysInMonth(year, month);
  const firstDow = getFirstDayOfWeek(year, month);

  const cells: (Date | null)[] = [
    ...Array(firstDow).fill(null),
    ...Array.from(
      { length: daysInMonth },
      (_, i) => new Date(year, month, i + 1),
    ),
  ];

  return (
    <div className="min-w-[280px]">
      {/* Month header */}
      <p className="mb-3 text-center text-sm font-semibold capitalize text-gray-800">
        {monthName}
      </p>

      {/* Weekday labels */}
      <div className="mb-1 grid grid-cols-7 gap-0">
        {weekdays.map((d) => (
          <div
            key={d}
            className="flex h-8 items-center justify-center text-xs font-medium text-gray-400"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-0">
        {cells.map((date, idx) => {
          if (!date) {
            return <div key={`empty-${idx}`} />;
          }

          const status = getDayStatus(
            date,
            today,
            bookedSet,
            blockedSet,
            value,
            hoverDate,
          );
          const isDisabled =
            status === "past" || status === "booked" || status === "blocked";

          return (
            <div
              key={toDateKey(date)}
              role="button"
              tabIndex={isDisabled ? -1 : 0}
              aria-label={date.toLocaleDateString(locale, {
                dateStyle: "long",
              })}
              aria-disabled={isDisabled}
              aria-pressed={
                status === "selected-start" || status === "selected-end"
              }
              className={[dayBase, statusStyles[status]].join(" ")}
              onClick={() => !isDisabled && onDayClick(date)}
              onMouseEnter={() => !isDisabled && onDayHover(date)}
              onMouseLeave={() => onDayHover(null)}
              onKeyDown={(e) => {
                if (!isDisabled && (e.key === "Enter" || e.key === " ")) {
                  e.preventDefault();
                  onDayClick(date);
                }
              }}
            >
              {date.getDate()}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Legend ────────────────────────────────────────────────────────────────────

function Legend() {
  const { t } = useLocale();
  const items = [
    { color: "bg-blue-600", label: t("availability.legendSelected") },
    { color: "bg-gray-200", label: t("availability.legendBooked") },
    {
      color: "bg-gray-100 border border-dashed border-gray-300",
      label: t("availability.legendBlocked"),
    },
  ];
  return (
    <div className="mt-3 flex flex-wrap gap-4">
      {items.map(({ color, label }) => (
        <div
          key={label}
          className="flex items-center gap-1.5 text-xs text-gray-500"
        >
          <span className={`h-3 w-3 rounded-full ${color}`} />
          {label}
        </div>
      ))}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function AvailabilityCalendar({
  availability,
  value,
  onChange,
  locale = "en",
  className = "",
}: AvailabilityCalendarProps) {
  const { t } = useLocale();
  const today = useMemo(() => startOfDay(new Date()), []);

  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [hoverDate, setHoverDate] = useState<Date | null>(null);

  const bookedSet = useMemo(
    () => new Set(availability.bookedDates),
    [availability.bookedDates],
  );
  const blockedSet = useMemo(
    () => new Set(availability.blockedDates),
    [availability.blockedDates],
  );

  // Second month
  const nextMonth = viewMonth === 11 ? 0 : viewMonth + 1;
  const nextYear = viewMonth === 11 ? viewYear + 1 : viewYear;

  // Navigation
  const prevMonth = useCallback(() => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  }, [viewMonth]);

  const goNextMonth = useCallback(() => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  }, [viewMonth]);

  const canGoPrev = useMemo(() => {
    const firstOfView = new Date(viewYear, viewMonth, 1);
    const firstOfToday = new Date(today.getFullYear(), today.getMonth(), 1);
    return firstOfView > firstOfToday;
  }, [viewYear, viewMonth, today]);

  // Day click — first click sets checkIn, second sets checkOut
  const handleDayClick = useCallback(
    (date: Date) => {
      const { checkIn, checkOut } = value;

      if (!checkIn || (checkIn && checkOut)) {
        // Start fresh selection
        onChange({ checkIn: date, checkOut: null });
        return;
      }

      // checkIn is set, checkOut is not
      if (date <= checkIn) {
        // Clicked before or on checkIn — restart
        onChange({ checkIn: date, checkOut: null });
        return;
      }

      // Validate min/max stay
      const nights = diffDays(checkIn, date);
      const { minStay, maxStay } = availability;

      if (minStay && nights < minStay) {
        // Snap to minStay
        onChange({ checkIn, checkOut: addDays(checkIn, minStay) });
        return;
      }
      if (maxStay && nights > maxStay) {
        // Snap to maxStay
        onChange({ checkIn, checkOut: addDays(checkIn, maxStay) });
        return;
      }

      onChange({ checkIn, checkOut: date });
    },
    [value, onChange, availability],
  );

  // Nights count
  const nights = useMemo(() => {
    if (value.checkIn && value.checkOut) {
      return diffDays(value.checkIn, value.checkOut);
    }
    return null;
  }, [value]);

  return (
    <div
      className={`rounded-xl border border-gray-200 bg-white p-4 shadow-sm ${className}`}
    >
      {/* Navigation header */}
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={prevMonth}
          disabled={!canGoPrev}
          aria-label={t("availability.prevMonth")}
          className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30"
        >
          <ChevronLeft />
        </button>

        <div className="flex-1" />

        <button
          type="button"
          onClick={goNextMonth}
          aria-label={t("availability.nextMonth")}
          className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100"
        >
          <ChevronRight />
        </button>
      </div>

      {/* Two-month grid */}
      <div className="flex flex-col gap-6 sm:flex-row sm:gap-8">
        <MonthGrid
          year={viewYear}
          month={viewMonth}
          today={today}
          bookedSet={bookedSet}
          blockedSet={blockedSet}
          value={value}
          hoverDate={hoverDate}
          onDayClick={handleDayClick}
          onDayHover={setHoverDate}
          locale={locale}
        />
        <MonthGrid
          year={nextYear}
          month={nextMonth}
          today={today}
          bookedSet={bookedSet}
          blockedSet={blockedSet}
          value={value}
          hoverDate={hoverDate}
          onDayClick={handleDayClick}
          onDayHover={setHoverDate}
          locale={locale}
        />
      </div>

      {/* Stay info */}
      <div className="mt-4 space-y-1 text-xs text-gray-500">
        {availability.minStay && (
          <p>
            {t("availability.minStayNights", { n: availability.minStay })}
          </p>
        )}
        {availability.maxStay && (
          <p>
            {t("availability.maxStayNights", { n: availability.maxStay })}
          </p>
        )}
        {nights !== null && (
          <p className="font-medium text-blue-600">
            {nights === 1
              ? t("availability.oneNightSelected")
              : t("availability.nightsSelectedPlural", { n: nights })}
          </p>
        )}
      </div>

      <Legend />
    </div>
  );
}

// ── Icons ─────────────────────────────────────────────────────────────────────

function ChevronLeft() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
        clipRule="evenodd"
      />
    </svg>
  );
}
