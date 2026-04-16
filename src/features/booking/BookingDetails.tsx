"use client";

/**
 * BookingDetails — full booking detail view with edit (date change) and cancel actions.
 * Requirements: 8.2, 8.3, 8.4
 */

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { Booking, Property, CancellationPolicy } from "@/lib/types";
import type { AvailabilityCalendar as AvailabilityData } from "@/lib/types";
import { useAuth } from "@/lib/contexts/AuthContext";
import { useLocale } from "@/lib/contexts/LocaleContext";
import { getAPIClient } from "@/lib/api";
import {
  calculateRefundAmount,
  isCancellable,
  isEditable,
  nightsBetween,
  formatBookingDate,
  formatCurrency,
} from "@/lib/utils/booking";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Spinner } from "@/components/ui/Spinner";
import {
  AvailabilityCalendar,
  type DateRange as CalDateRange,
} from "./AvailabilityCalendar";

// ── Types ─────────────────────────────────────────────────────────────────────

interface BookingDetailsProps {
  bookingId: string;
}

type BookingStatus = Booking["status"];

const STATUS_VARIANT: Record<
  BookingStatus,
  "default" | "success" | "warning" | "error" | "info"
> = {
  pending: "warning",
  confirmed: "info",
  active: "success",
  completed: "default",
  cancelled: "error",
};

// ── Section helpers ───────────────────────────────────────────────────────────

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
      {children}
    </h3>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between items-start py-2 border-b border-gray-100 last:border-0 gap-4">
      <span className="text-sm text-gray-500 shrink-0">{label}</span>
      <span className="text-sm text-gray-900 text-right">{value}</span>
    </div>
  );
}

// ── Cancel confirmation modal ─────────────────────────────────────────────────

function CancelModal({
  open,
  onClose,
  booking,
  policy,
  onConfirm,
  submitting,
}: {
  open: boolean;
  onClose: () => void;
  booking: Booking;
  policy?: CancellationPolicy;
  onConfirm: (reason: string) => void;
  submitting: boolean;
}) {
  const { t, locale } = useLocale();
  const [reason, setReason] = useState("");
  const refundAmount = calculateRefundAmount(booking, policy);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t("bookingDetails.cancelModal.title")}
    >
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          {t("bookingDetails.cancelModal.body")}
        </p>

        {/* Refund summary */}
        <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-sm">
          {refundAmount > 0 ? (
            <p className="text-amber-800">
              {t("bookingDetails.cancelModal.refundAmount")}{" "}
              <strong>
                {formatCurrency(refundAmount, booking.pricing.currency, locale)}
              </strong>
            </p>
          ) : (
            <p className="text-amber-800">
              {t("bookingDetails.cancelModal.noRefund")}
            </p>
          )}
        </div>

        {/* Reason */}
        <div>
          <label
            htmlFor="cancel-reason"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {t("bookingDetails.cancelModal.reasonLabel")}
          </label>
          <textarea
            id="cancel-reason"
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder={t("bookingDetails.cancelModal.reasonPlaceholder")}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={submitting}
          >
            {t("common.back")}
          </Button>
          <Button
            variant="primary"
            size="sm"
            loading={submitting}
            onClick={() =>
              onConfirm(
                reason.trim() || t("bookingDetails.cancelModal.defaultReason"),
              )
            }
            className="bg-red-600 hover:bg-red-700 focus-visible:ring-red-500"
          >
            {t("bookingDetails.cancelModal.confirmButton")}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

// ── Edit dates modal ──────────────────────────────────────────────────────────

function EditDatesModal({
  open,
  onClose,
  booking,
  onConfirm,
  submitting,
}: {
  open: boolean;
  onClose: () => void;
  booking: Booking;
  onConfirm: (checkIn: Date, checkOut: Date) => void;
  submitting: boolean;
}) {
  const { t, locale } = useLocale();
  const [range, setRange] = useState<CalDateRange>({
    checkIn:
      typeof booking.checkIn === "string"
        ? new Date(booking.checkIn)
        : booking.checkIn,
    checkOut:
      typeof booking.checkOut === "string"
        ? new Date(booking.checkOut)
        : booking.checkOut,
  });
  const [availability, setAvailability] = useState<AvailabilityData>({
    propertyId: booking.propertyId,
    bookedDates: [],
    blockedDates: [],
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    getAPIClient()
      .getPropertyAvailability(booking.propertyId)
      .then(setAvailability)
      .catch(() => {});
  }, [open, booking.propertyId]);

  const handleSubmit = () => {
    if (!range.checkIn || !range.checkOut) {
      setError(t("validation.required"));
      return;
    }
    if (range.checkOut <= range.checkIn) {
      setError(t("validation.checkoutAfterCheckin"));
      return;
    }
    setError(null);
    onConfirm(range.checkIn, range.checkOut);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t("bookingDetails.editDatesModal.title")}
      className="max-w-xl"
    >
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          {t("bookingDetails.editDatesModal.body")}
        </p>

        <AvailabilityCalendar
          availability={availability}
          value={range}
          onChange={setRange}
          locale={locale}
        />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex justify-end gap-3 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={submitting}
          >
            {t("common.cancel")}
          </Button>
          <Button
            variant="primary"
            size="sm"
            loading={submitting}
            onClick={handleSubmit}
          >
            {t("bookingDetails.editDatesModal.saveButton")}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

// ── BookingDetails ────────────────────────────────────────────────────────────

export function BookingDetails({ bookingId }: BookingDetailsProps) {
  const { user } = useAuth();
  const { t, locale } = useLocale();
  const router = useRouter();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [cancelOpen, setCancelOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const api = getAPIClient();
      const bk = await api.getBooking(bookingId);
      const prop = await api.getProperty(bk.propertyId);
      setBooking(bk);
      setProperty(prop);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("errors.generic"));
    } finally {
      setLoading(false);
    }
  }, [bookingId, t]);

  useEffect(() => {
    load();
  }, [load]);

  // ── Cancel ──────────────────────────────────────────────────────────────────

  const handleCancel = async (reason: string) => {
    if (!booking || !property) return;
    setSubmitting(true);
    setActionError(null);
    try {
      const api = getAPIClient();
      const policy = property.policies.cancellation;
      const refundAmount = calculateRefundAmount(booking, policy);

      const updated = await api.cancelBooking(booking.id, reason);

      // Fire-and-forget email notification
      import("@/lib/services/email/sendBookingEmail").then(
        ({ sendBookingCancellationEmail }) => {
          sendBookingCancellationEmail(
            {
              ...updated,
              cancellation: {
                cancelledAt: new Date(),
                reason,
                refundAmount,
              },
            },
            property,
            refundAmount,
            locale,
          ).catch(() => {});
        },
      );

      setBooking(updated);
      setCancelOpen(false);
      setSuccessMessage(t("bookingDetails.cancelledSuccess"));
    } catch (err) {
      setActionError(err instanceof Error ? err.message : t("errors.generic"));
    } finally {
      setSubmitting(false);
    }
  };

  // ── Edit dates ──────────────────────────────────────────────────────────────

  const handleEditDates = async (checkIn: Date, checkOut: Date) => {
    if (!booking || !property) return;
    setSubmitting(true);
    setActionError(null);
    try {
      const api = getAPIClient();
      const updated = await api.updateBooking(booking.id, {
        checkIn: checkIn.toISOString(),
        checkOut: checkOut.toISOString(),
      });

      // Fire-and-forget email notification
      import("@/lib/services/email/sendBookingEmail").then(
        ({ sendBookingUpdatedEmail }) => {
          sendBookingUpdatedEmail(updated, property, locale).catch(() => {});
        },
      );

      setBooking(updated);
      setEditOpen(false);
      setSuccessMessage(t("bookingDetails.updatedSuccess"));
    } catch (err) {
      setActionError(err instanceof Error ? err.message : t("errors.generic"));
    } finally {
      setSubmitting(false);
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size="lg" aria-label={t("common.loading")} />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="space-y-4 text-center py-16">
        <p className="text-red-600 text-sm">{error ?? t("errors.generic")}</p>
        <Button variant="outline" size="sm" onClick={load}>
          {t("common.retry")}
        </Button>
      </div>
    );
  }

  const nights = nightsBetween(booking.checkIn, booking.checkOut);
  const propertyTitle = property
    ? (property.title[locale] ?? property.title.en)
    : booking.propertyId;
  const cancellable = isCancellable(booking);
  const editable = isEditable(booking);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <button
            onClick={() => router.back()}
            className="mb-2 inline-flex items-center gap-1.5 text-sm text-blue-600 hover:underline"
            aria-label={t("common.back")}
          >
            ← {t("common.back")}
          </button>
          <h2 className="text-2xl font-bold text-gray-900">
            {t("bookingDetails.title")}
          </h2>
          <p className="text-sm text-gray-400 mt-0.5">
            {t("booking.bookingIdLabel")} {booking.id}
          </p>
        </div>
        <Badge variant={STATUS_VARIANT[booking.status]} size="sm">
          {t(`booking.status_${booking.status}`)}
        </Badge>
      </div>

      {/* Success / error banners */}
      {successMessage && (
        <div className="rounded-lg bg-green-50 border border-green-200 p-3 text-sm text-green-800">
          {successMessage}
        </div>
      )}
      {actionError && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
          {actionError}
        </div>
      )}

      {/* Property */}
      <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <SectionTitle>{t("bookingDetails.propertySection")}</SectionTitle>
        <InfoRow
          label={t("bookingDetails.propertyName")}
          value={propertyTitle}
        />
        {property && (
          <InfoRow
            label={t("bookingDetails.propertyLocation")}
            value={
              property.location.address[locale] ?? property.location.address.en
            }
          />
        )}
      </section>

      {/* Dates */}
      <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <SectionTitle>{t("bookingDetails.datesSection")}</SectionTitle>
        <InfoRow
          label={t("booking.checkIn")}
          value={formatBookingDate(booking.checkIn, locale)}
        />
        <InfoRow
          label={t("booking.checkOut")}
          value={formatBookingDate(booking.checkOut, locale)}
        />
        <InfoRow
          label={
            nights === 1
              ? t("booking.nights", { count: 1 })
              : t("booking.nights_plural", { count: nights })
          }
          value={nights}
        />
        <InfoRow
          label={t("bookingDetails.guests")}
          value={`${booking.guests.adults} ${t("search.adults")}${
            booking.guests.children
              ? `, ${booking.guests.children} ${t("search.children")}`
              : ""
          }`}
        />
      </section>

      {/* Guest info */}
      <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <SectionTitle>{t("bookingDetails.guestSection")}</SectionTitle>
        <InfoRow label={t("auth.name")} value={booking.guestInfo.name} />
        <InfoRow label={t("auth.email")} value={booking.guestInfo.email} />
        <InfoRow
          label={t("auth.phoneNumber")}
          value={booking.guestInfo.phone}
        />
      </section>

      {/* Pricing */}
      <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <SectionTitle>{t("booking.priceBreakdown")}</SectionTitle>
        <InfoRow
          label={t("booking.basePrice")}
          value={formatCurrency(
            booking.pricing.basePrice,
            booking.pricing.currency,
            locale,
          )}
        />
        {booking.pricing.fees.map((fee) => (
          <InfoRow
            key={fee.name}
            label={fee.name}
            value={formatCurrency(fee.amount, booking.pricing.currency, locale)}
          />
        ))}
        <InfoRow
          label={t("booking.taxes")}
          value={formatCurrency(
            booking.pricing.taxes,
            booking.pricing.currency,
            locale,
          )}
        />
        <InfoRow
          label={t("booking.total")}
          value={
            <strong>
              {formatCurrency(
                booking.pricing.total,
                booking.pricing.currency,
                locale,
              )}
            </strong>
          }
        />
      </section>

      {/* Payment */}
      <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <SectionTitle>{t("bookingDetails.paymentSection")}</SectionTitle>
        <InfoRow
          label={t("bookingDetails.transactionId")}
          value={booking.payment.transactionId}
        />
        <InfoRow
          label={t("bookingDetails.paymentMethod")}
          value={booking.payment.method}
        />
        <InfoRow
          label={t("bookingDetails.paymentStatus")}
          value={booking.payment.status}
        />
      </section>

      {/* Cancellation info (if cancelled) */}
      {booking.status === "cancelled" && booking.cancellation && (
        <section className="rounded-xl border border-red-200 bg-red-50 p-5">
          <SectionTitle>{t("bookingDetails.cancellationSection")}</SectionTitle>
          <InfoRow
            label={t("bookingDetails.cancelledAt")}
            value={formatBookingDate(booking.cancellation.cancelledAt, locale)}
          />
          <InfoRow
            label={t("bookingDetails.cancelReason")}
            value={booking.cancellation.reason}
          />
          <InfoRow
            label={t("bookingDetails.refundAmount")}
            value={formatCurrency(
              booking.cancellation.refundAmount,
              booking.pricing.currency,
              locale,
            )}
          />
        </section>
      )}

      {/* Actions */}
      {(editable || cancellable) && user && (
        <div className="flex flex-wrap gap-3 pt-2">
          {editable && (
            <Button
              variant="outline"
              size="md"
              onClick={() => setEditOpen(true)}
            >
              {t("booking.editBooking")}
            </Button>
          )}
          {cancellable && (
            <Button
              variant="ghost"
              size="md"
              className="text-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={() => setCancelOpen(true)}
            >
              {t("booking.cancelBooking")}
            </Button>
          )}
        </div>
      )}

      {/* Modals */}
      {booking && property && (
        <>
          <CancelModal
            open={cancelOpen}
            onClose={() => setCancelOpen(false)}
            booking={booking}
            policy={property.policies.cancellation}
            onConfirm={handleCancel}
            submitting={submitting}
          />
          <EditDatesModal
            open={editOpen}
            onClose={() => setEditOpen(false)}
            booking={booking}
            onConfirm={handleEditDates}
            submitting={submitting}
          />
        </>
      )}
    </div>
  );
}
