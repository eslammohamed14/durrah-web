"use client";

/**
 * CheckoutPageClient — client shell for the checkout flow.
 *
 * Manages the two-phase flow:
 *   Phase 1: BookingForm (date selection + guest count + price preview)
 *   Phase 2: CheckoutContent (guest info + payment)
 */

import React, { useState } from "react";
import type { Property } from "@/lib/types";
import {
  BookingForm,
  type BookingFormData,
} from "@/features/booking/BookingForm";
import { CheckoutContent } from "@/features/booking/CheckoutContent";
import { useLocale } from "@/lib/contexts/LocaleContext";

interface Props {
  property: Property;
}

export function CheckoutPageClient({ property }: Props) {
  const { locale, t } = useLocale();

  const [bookingData, setBookingData] = useState<BookingFormData | null>(null);

  const propertyTitle = property.title[locale === "ar" ? "ar" : "en"];

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          {bookingData
            ? t("checkoutClient.completeBooking")
            : t("checkoutClient.bookYourStay")}
        </h1>
        <p className="mt-1 text-sm text-gray-500">{propertyTitle}</p>
      </div>

      {!bookingData ? (
        /* Phase 1: date + guest selection */
        <div className="max-w-xl">
          <BookingForm
            property={property}
            onSubmit={setBookingData}
            locale={locale}
          />
        </div>
      ) : (
        /* Phase 2: guest info + payment */
        <>
          {/* Back to date selection */}
          <button
            type="button"
            onClick={() => setBookingData(null)}
            className="mb-6 flex items-center gap-1 text-sm text-blue-600 hover:underline"
          >
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
            {t("checkoutClient.editDates")}
          </button>

          <CheckoutContent
            property={property}
            bookingData={bookingData}
            locale={locale}
          />
        </>
      )}
    </main>
  );
}
