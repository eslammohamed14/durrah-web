"use client";

/**
 * BookingList — reusable component that displays a list of bookings
 * with status indicators, date/status filters, and action buttons.
 *
 * Requirements: 8.1, 8.5
 */

import React, { useState, useMemo } from "react";
import type { Booking, BookingStatus } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";

// ── Types ─────────────────────────────────────────────────────────────────────

interface BookingListProps {
  bookings: Booking[];
  loading?: boolean;
  /** Properties map for displaying property names */
  propertyNames?: Record<string, string>;
  onViewDetails?: (bookingId: string) => void;
  onEdit?: (bookingId: string) => void;
  onCancel?: (bookingId: string) => void;
  /** If true, hides action buttons (for read-only views like investor dashboard) */
  readOnly?: boolean;
  locale?: string;
}

type StatusFilter = BookingStatus | "all";
type DateFilter = "all" | "upcoming" | "past";

// ── Helpers ───────────────────────────────────────────────────────────────────

const STATUS_BADGE_VARIANT: Record<
  BookingStatus,
  "default" | "success" | "warning" | "error" | "info"
> = {
  pending: "warning",
  confirmed: "info",
  active: "success",
  completed: "default",
  cancelled: "error",
};

function formatDate(dateInput: Date | string, locale: string): string {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  return date.toLocaleDateString(locale === "ar" ? "ar-SA" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
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

function isUpcoming(booking: Booking): boolean {
  const now = new Date();
  const checkIn =
    typeof booking.checkIn === "string"
      ? new Date(booking.checkIn)
      : booking.checkIn;
  return checkIn > now && booking.status !== "cancelled";
}

function isCancellable(booking: Booking): boolean {
  return booking.status === "pending" || booking.status === "confirmed";
}

function isEditable(booking: Booking): boolean {
  return booking.status === "confirmed";
}

// ── Status label ──────────────────────────────────────────────────────────────

function statusLabel(status: BookingStatus, isAr: boolean): string {
  const labels: Record<BookingStatus, [string, string]> = {
    pending: ["Pending", "قيد الانتظار"],
    confirmed: ["Confirmed", "مؤكد"],
    active: ["Active", "نشط"],
    completed: ["Completed", "مكتمل"],
    cancelled: ["Cancelled", "ملغى"],
  };
  return labels[status][isAr ? 1 : 0];
}

// ── BookingCard ───────────────────────────────────────────────────────────────

function BookingCard({
  booking,
  propertyName,
  onViewDetails,
  onEdit,
  onCancel,
  readOnly,
  locale,
}: {
  booking: Booking;
  propertyName?: string;
  onViewDetails?: (id: string) => void;
  onEdit?: (id: string) => void;
  onCancel?: (id: string) => void;
  readOnly?: boolean;
  locale: string;
}) {
  const isAr = locale === "ar";

  return (
    <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      {/* Header */}
      <div className="mb-3 flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold text-gray-900 text-sm">
            {propertyName ?? booking.propertyId}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            {isAr ? "رقم الحجز:" : "Booking ID:"} {booking.id}
          </p>
        </div>
        <Badge variant={STATUS_BADGE_VARIANT[booking.status]} size="sm">
          {statusLabel(booking.status, isAr)}
        </Badge>
      </div>

      {/* Dates */}
      <div className="mb-3 grid grid-cols-2 gap-3 text-xs">
        <div>
          <p className="text-gray-400 mb-0.5">
            {isAr ? "تسجيل الوصول" : "Check-in"}
          </p>
          <p className="font-medium text-gray-700">
            {formatDate(booking.checkIn, locale)}
          </p>
        </div>
        <div>
          <p className="text-gray-400 mb-0.5">
            {isAr ? "تسجيل المغادرة" : "Check-out"}
          </p>
          <p className="font-medium text-gray-700">
            {formatDate(booking.checkOut, locale)}
          </p>
        </div>
      </div>

      {/* Guests + Price */}
      <div className="mb-3 flex items-center justify-between text-xs text-gray-600">
        <span>
          {isAr
            ? `${booking.guests.adults} بالغ${booking.guests.children > 0 ? `، ${booking.guests.children} طفل` : ""}`
            : `${booking.guests.adults} adult${booking.guests.adults !== 1 ? "s" : ""}${booking.guests.children > 0 ? `, ${booking.guests.children} child${booking.guests.children !== 1 ? "ren" : ""}` : ""}`}
        </span>
        <span className="font-semibold text-gray-900">
          {formatCurrency(
            booking.pricing.total,
            booking.pricing.currency,
            locale,
          )}
        </span>
      </div>

      {/* Actions */}
      {!readOnly && (
        <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-100">
          {onViewDetails && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewDetails(booking.id)}
            >
              {isAr ? "عرض التفاصيل" : "View Details"}
            </Button>
          )}
          {onEdit && isEditable(booking) && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(booking.id)}
            >
              {isAr ? "تعديل" : "Edit"}
            </Button>
          )}
          {onCancel && isCancellable(booking) && (
            <Button
              variant="ghost"
              size="sm"
              className="text-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={() => onCancel(booking.id)}
            >
              {isAr ? "إلغاء" : "Cancel"}
            </Button>
          )}
        </div>
      )}
    </article>
  );
}

// ── BookingList ───────────────────────────────────────────────────────────────

export function BookingList({
  bookings,
  loading = false,
  propertyNames = {},
  onViewDetails,
  onEdit,
  onCancel,
  readOnly = false,
  locale = "en",
}: BookingListProps) {
  const isAr = locale === "ar";

  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");

  const filtered = useMemo(() => {
    return bookings.filter((b) => {
      if (statusFilter !== "all" && b.status !== statusFilter) return false;
      if (dateFilter === "upcoming" && !isUpcoming(b)) return false;
      if (dateFilter === "past" && isUpcoming(b)) return false;
      return true;
    });
  }, [bookings, statusFilter, dateFilter]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" aria-label={isAr ? "جارٍ التحميل" : "Loading"} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        {/* Date filter */}
        <div className="flex rounded-lg border border-gray-200 bg-white overflow-hidden text-sm">
          {(["all", "upcoming", "past"] as DateFilter[]).map((f) => (
            <button
              key={f}
              onClick={() => setDateFilter(f)}
              className={[
                "px-3 py-1.5 transition-colors",
                dateFilter === f
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-gray-50",
              ].join(" ")}
            >
              {f === "all"
                ? isAr
                  ? "الكل"
                  : "All"
                : f === "upcoming"
                  ? isAr
                    ? "القادمة"
                    : "Upcoming"
                  : isAr
                    ? "السابقة"
                    : "Past"}
            </button>
          ))}
        </div>

        {/* Status filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
          className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label={isAr ? "تصفية حسب الحالة" : "Filter by status"}
        >
          <option value="all">{isAr ? "جميع الحالات" : "All Statuses"}</option>
          <option value="pending">{isAr ? "قيد الانتظار" : "Pending"}</option>
          <option value="confirmed">{isAr ? "مؤكد" : "Confirmed"}</option>
          <option value="active">{isAr ? "نشط" : "Active"}</option>
          <option value="completed">{isAr ? "مكتمل" : "Completed"}</option>
          <option value="cancelled">{isAr ? "ملغى" : "Cancelled"}</option>
        </select>
      </div>

      {/* Results count */}
      <p className="text-xs text-gray-400">
        {isAr
          ? `${filtered.length} حجز`
          : `${filtered.length} booking${filtered.length !== 1 ? "s" : ""}`}
      </p>

      {/* Booking cards */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-gray-200 py-12 text-center">
          <p className="text-gray-400 text-sm">
            {isAr ? "لا توجد حجوزات" : "No bookings found"}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              propertyName={propertyNames[booking.propertyId]}
              onViewDetails={onViewDetails}
              onEdit={onEdit}
              onCancel={onCancel}
              readOnly={readOnly}
              locale={locale}
            />
          ))}
        </div>
      )}
    </div>
  );
}
