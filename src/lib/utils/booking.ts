/**
 * Booking utility functions.
 * Cancellation policy calculation and refund logic.
 * Requirements: 8.4, 8.6
 */

import type {
  Booking,
  CancellationPolicy,
  CancellationPolicyRule,
} from "@/lib/types";

// ─── Cancellation Policy ──────────────────────────────────────────────────────

/**
 * Calculate how many days until check-in from a given date.
 * Returns a negative number if the check-in is in the past.
 */
export function daysUntilCheckIn(
  checkIn: Date | string,
  from: Date = new Date(),
): number {
  const checkInDate = typeof checkIn === "string" ? new Date(checkIn) : checkIn;
  const diffMs = checkInDate.getTime() - from.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Find the applicable cancellation rule for a given number of days before check-in.
 * Rules are sorted descending by daysBeforeCheckIn — the first matching rule wins.
 */
export function findApplicableRule(
  rules: CancellationPolicyRule[],
  daysBeforeCheckIn: number,
): CancellationPolicyRule | null {
  // Sort descending so largest threshold is checked first
  const sorted = [...rules].sort(
    (a, b) => b.daysBeforeCheckIn - a.daysBeforeCheckIn,
  );
  for (const rule of sorted) {
    if (daysBeforeCheckIn >= rule.daysBeforeCheckIn) {
      return rule;
    }
  }
  return null;
}

/**
 * Calculate the refund amount for a cancellation.
 *
 * @param booking - The booking to cancel
 * @param policy  - The property's cancellation policy (may be undefined for non-refundable)
 * @param cancelledAt - When the cancellation is happening (defaults to now)
 * @returns Refund amount in the booking's currency (same unit as booking.pricing.total)
 */
export function calculateRefundAmount(
  booking: Booking,
  policy: CancellationPolicy | undefined,
  cancelledAt: Date = new Date(),
): number {
  const total = booking.pricing.total;

  // No policy defined → non-refundable
  if (
    !policy ||
    policy.type === "non_refundable" ||
    policy.rules.length === 0
  ) {
    return 0;
  }

  const days = daysUntilCheckIn(booking.checkIn, cancelledAt);
  const rule = findApplicableRule(policy.rules, days);

  if (!rule) {
    // No matching rule → no refund
    return 0;
  }

  const refundPercent = Math.min(100, Math.max(0, rule.refundPercentage));
  return Math.round((total * refundPercent) / 100);
}

// ─── Booking Status Helpers ───────────────────────────────────────────────────

/** Returns true when a booking can still be cancelled by the guest. */
export function isCancellable(booking: Booking): boolean {
  return booking.status === "pending" || booking.status === "confirmed";
}

/** Returns true when dates can still be modified. */
export function isEditable(booking: Booking): boolean {
  return booking.status === "confirmed";
}

/** Returns true when the check-in is in the future and booking is not cancelled. */
export function isUpcoming(booking: Booking): boolean {
  const checkIn =
    typeof booking.checkIn === "string"
      ? new Date(booking.checkIn)
      : booking.checkIn;
  return checkIn > new Date() && booking.status !== "cancelled";
}

// ─── Date / Nights Helpers ────────────────────────────────────────────────────

export function nightsBetween(
  checkIn: Date | string,
  checkOut: Date | string,
): number {
  const ci = typeof checkIn === "string" ? new Date(checkIn) : checkIn;
  const co = typeof checkOut === "string" ? new Date(checkOut) : checkOut;
  const diffMs = co.getTime() - ci.getTime();
  return Math.max(0, Math.round(diffMs / (1000 * 60 * 60 * 24)));
}

export function formatBookingDate(date: Date | string, locale: string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString(locale === "ar" ? "ar-SA" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatCurrency(
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
