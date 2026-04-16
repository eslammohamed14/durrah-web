/**
 * Booking-related email helpers.
 * Sends booking confirmation, cancellation, and update notifications.
 * Requirements: 8.6, 28.1, 28.2
 */

import type { Booking, Property } from "@/lib/types";
import { MockEmailAdapter } from "./MockEmailAdapter";

// Single shared instance (can be replaced with a real adapter)
const emailService = new MockEmailAdapter();

export async function sendBookingConfirmationEmail(
  booking: Booking,
  property: Property,
  locale: "en" | "ar" = "en",
): Promise<void> {
  const title = property.title[locale] ?? property.title.en;
  await emailService.sendEmail({
    to: booking.guestInfo.email,
    template: "booking_confirmation",
    data: {
      bookingId: booking.id,
      guestName: booking.guestInfo.name,
      propertyTitle: title,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      total: booking.pricing.total,
      currency: booking.pricing.currency,
    },
  });
}

export async function sendBookingCancellationEmail(
  booking: Booking,
  property: Property,
  refundAmount: number,
  locale: "en" | "ar" = "en",
): Promise<void> {
  const title = property.title[locale] ?? property.title.en;
  await emailService.sendEmail({
    to: booking.guestInfo.email,
    template: "booking_cancellation",
    data: {
      bookingId: booking.id,
      guestName: booking.guestInfo.name,
      propertyTitle: title,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      refundAmount,
      currency: booking.pricing.currency,
    },
  });
}

export async function sendBookingUpdatedEmail(
  booking: Booking,
  property: Property,
  locale: "en" | "ar" = "en",
): Promise<void> {
  const title = property.title[locale] ?? property.title.en;
  await emailService.sendEmail({
    to: booking.guestInfo.email,
    template: "booking_updated",
    data: {
      bookingId: booking.id,
      guestName: booking.guestInfo.name,
      propertyTitle: title,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
    },
  });
}
