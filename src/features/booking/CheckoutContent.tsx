"use client";

/**
 * CheckoutContent — client-side checkout flow for Rent & Activity properties.
 *
 * Steps:
 *  1. Guest info form (name, email, phone)
 *  2. Booking summary + policy acknowledgment
 *  3. Payment via Stripe (PaymentForm)
 *  4. Success / failure state
 *
 * Requirements: 7.1–7.9
 */

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { Property } from "@/lib/types";
import type { BookingFormData } from "./BookingForm";
import { PaymentForm } from "./PaymentForm";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Spinner } from "@/components/ui/Spinner";
import { createPaymentIntent } from "@/app/checkout/[propertyId]/actions";
import { getAPIClient } from "@/lib/api";

// ── Types ─────────────────────────────────────────────────────────────────────

interface GuestInfo {
  name: string;
  email: string;
  phone: string;
}

type CheckoutStep = "guest-info" | "payment" | "success" | "error";

export interface CheckoutContentProps {
  property: Property;
  bookingData: BookingFormData;
  locale?: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(date: Date, locale: string): string {
  return date.toLocaleDateString(locale === "ar" ? "ar-SA" : "en-US", {
    weekday: "short",
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

function validateGuestInfo(
  info: GuestInfo,
  isAr: boolean,
): Record<keyof GuestInfo, string> {
  const errors: Record<keyof GuestInfo, string> = {
    name: "",
    email: "",
    phone: "",
  };

  if (!info.name.trim()) {
    errors.name = isAr ? "الاسم مطلوب" : "Name is required";
  }
  if (!info.email.trim()) {
    errors.email = isAr ? "البريد الإلكتروني مطلوب" : "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(info.email)) {
    errors.email = isAr ? "بريد إلكتروني غير صالح" : "Invalid email address";
  }
  if (!info.phone.trim()) {
    errors.phone = isAr ? "رقم الهاتف مطلوب" : "Phone number is required";
  }

  return errors;
}

// ── Booking summary ───────────────────────────────────────────────────────────

function BookingSummary({
  property,
  bookingData,
  locale,
}: {
  property: Property;
  bookingData: BookingFormData;
  locale: string;
}) {
  const isAr = locale === "ar";
  const { pricing, checkIn, checkOut, guests } = bookingData;
  const fmt = (n: number) => formatCurrency(n, pricing.currency, locale);

  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm">
      <h3 className="mb-3 font-semibold text-gray-900">
        {isAr ? "ملخص الحجز" : "Booking summary"}
      </h3>

      {/* Property */}
      <p className="mb-1 font-medium text-gray-800">
        {property.title[locale === "ar" ? "ar" : "en"]}
      </p>
      <p className="mb-3 text-xs text-gray-500">
        {property.location.address[locale === "ar" ? "ar" : "en"]}
      </p>

      {/* Dates */}
      <div className="mb-3 grid grid-cols-2 gap-2 text-xs">
        <div>
          <p className="text-gray-400">{isAr ? "تسجيل الوصول" : "Check-in"}</p>
          <p className="font-medium text-gray-700">
            {formatDate(checkIn, locale)}
          </p>
        </div>
        <div>
          <p className="text-gray-400">
            {isAr ? "تسجيل المغادرة" : "Check-out"}
          </p>
          <p className="font-medium text-gray-700">
            {formatDate(checkOut, locale)}
          </p>
        </div>
      </div>

      {/* Guests */}
      <p className="mb-3 text-xs text-gray-600">
        {isAr
          ? `${guests.adults} بالغ${guests.children > 0 ? `، ${guests.children} طفل` : ""}`
          : `${guests.adults} adult${guests.adults !== 1 ? "s" : ""}${guests.children > 0 ? `, ${guests.children} child${guests.children !== 1 ? "ren" : ""}` : ""}`}
      </p>

      {/* Price breakdown */}
      <div className="space-y-1 border-t border-gray-200 pt-3">
        <div className="flex justify-between text-gray-600">
          <span>
            {fmt(property.pricing.basePrice)} × {pricing.nights}{" "}
            {isAr ? "ليلة" : `night${pricing.nights !== 1 ? "s" : ""}`}
          </span>
          <span>{fmt(pricing.basePrice)}</span>
        </div>
        {pricing.fees.map((fee) => (
          <div key={fee.name} className="flex justify-between text-gray-600">
            <span>{fee.name}</span>
            <span>{fmt(fee.amount)}</span>
          </div>
        ))}
        <div className="flex justify-between text-gray-600">
          <span>{isAr ? "الضريبة (15%)" : "Taxes (15%)"}</span>
          <span>{fmt(pricing.taxes)}</span>
        </div>
        <div className="flex justify-between border-t border-gray-200 pt-2 font-semibold text-gray-900">
          <span>{isAr ? "الإجمالي" : "Total"}</span>
          <span>{fmt(pricing.total)}</span>
        </div>
      </div>
    </div>
  );
}

// ── Cancellation policy ───────────────────────────────────────────────────────

function CancellationPolicyDisplay({
  property,
  locale,
}: {
  property: Property;
  locale: string;
}) {
  const policy = property.policies.cancellation;
  if (!policy) return null;

  const isAr = locale === "ar";
  const desc = policy.description[locale === "ar" ? "ar" : "en"];

  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
      <p className="mb-1 font-semibold">
        {isAr ? "سياسة الإلغاء" : "Cancellation policy"}
      </p>
      <p>{desc}</p>
    </div>
  );
}

// ── House rules ───────────────────────────────────────────────────────────────

function HouseRulesDisplay({
  property,
  locale,
}: {
  property: Property;
  locale: string;
}) {
  const rules = property.policies.houseRules[locale === "ar" ? "ar" : "en"];
  if (!rules) return null;

  const isAr = locale === "ar";

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-3 text-xs text-gray-700">
      <p className="mb-1 font-semibold text-gray-800">
        {isAr ? "قواعد المنزل" : "House rules"}
      </p>
      <p>{rules}</p>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function CheckoutContent({
  property,
  bookingData,
  locale = "en",
}: CheckoutContentProps) {
  const router = useRouter();
  const isAr = locale === "ar";

  const [step, setStep] = useState<CheckoutStep>("guest-info");
  const [guestInfo, setGuestInfo] = useState<GuestInfo>({
    name: "",
    email: "",
    phone: "",
  });
  const [fieldErrors, setFieldErrors] = useState<
    Record<keyof GuestInfo, string>
  >({
    name: "",
    email: "",
    phone: "",
  });
  const [acknowledged, setAcknowledged] = useState(false);
  const [ackError, setAckError] = useState("");

  const [paymentData, setPaymentData] = useState<{
    clientSecret: string;
    paymentIntentId: string;
    publishableKey: string;
  } | null>(null);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [bookingId, setBookingId] = useState<string | null>(null);

  // ── Step 1: validate guest info and proceed to payment ────────────────────

  const handleGuestInfoSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      const errors = validateGuestInfo(guestInfo, isAr);
      setFieldErrors(errors);
      if (Object.values(errors).some(Boolean)) return;

      if (!acknowledged) {
        setAckError(
          isAr
            ? "يجب الموافقة على سياسات الحجز للمتابعة"
            : "You must acknowledge the booking policies to continue",
        );
        return;
      }
      setAckError("");

      setLoadingPayment(true);
      try {
        const result = await createPaymentIntent(bookingData.pricing.total);
        setPaymentData(result);
        setStep("payment");
      } catch (err) {
        setErrorMessage(
          err instanceof Error
            ? err.message
            : isAr
              ? "فشل في تهيئة الدفع. يرجى المحاولة مرة أخرى."
              : "Failed to initialize payment. Please try again.",
        );
        setStep("error");
      } finally {
        setLoadingPayment(false);
      }
    },
    [guestInfo, acknowledged, bookingData.pricing.total, isAr],
  );

  // ── Step 2: payment success ───────────────────────────────────────────────

  const handlePaymentSuccess = useCallback(
    async (transactionId: string) => {
      try {
        const api = getAPIClient();
        const booking = await api.createBooking({
          propertyId: property.id,
          checkIn: bookingData.checkIn.toISOString(),
          checkOut: bookingData.checkOut.toISOString(),
          guests: bookingData.guests,
          guestInfo,
          paymentIntentId: transactionId,
          acknowledgedPolicies: true,
        });
        setBookingId(booking.id);
        setStep("success");
      } catch (err) {
        setErrorMessage(
          err instanceof Error
            ? err.message
            : isAr
              ? "تم الدفع ولكن فشل إنشاء الحجز. يرجى التواصل مع الدعم."
              : "Payment succeeded but booking creation failed. Please contact support.",
        );
        setStep("error");
      }
    },
    [property.id, bookingData, guestInfo, isAr],
  );

  const handlePaymentError = useCallback((message: string) => {
    setErrorMessage(message);
  }, []);

  // ── Render ────────────────────────────────────────────────────────────────

  if (step === "success") {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <CheckIcon className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">
          {isAr ? "تم تأكيد الحجز!" : "Booking confirmed!"}
        </h2>
        <p className="text-sm text-gray-500">
          {isAr
            ? "تم إرسال تأكيد الحجز إلى بريدك الإلكتروني."
            : "A confirmation has been sent to your email."}
        </p>
        {bookingId && (
          <p className="text-xs text-gray-400">
            {isAr ? `رقم الحجز: ${bookingId}` : `Booking ID: ${bookingId}`}
          </p>
        )}
        <Button
          variant="primary"
          size="md"
          onClick={() => router.push("/dashboard/guest")}
        >
          {isAr ? "عرض حجوزاتي" : "View my bookings"}
        </Button>
      </div>
    );
  }

  if (step === "error") {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <XIcon className="h-8 w-8 text-red-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">
          {isAr ? "حدث خطأ" : "Something went wrong"}
        </h2>
        <p className="max-w-sm text-sm text-gray-500">{errorMessage}</p>
        <Button
          variant="outline"
          size="md"
          onClick={() => {
            setStep("guest-info");
            setErrorMessage("");
          }}
        >
          {isAr ? "حاول مرة أخرى" : "Try again"}
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
      {/* Left: form */}
      <div className="space-y-6">
        {step === "guest-info" && (
          <form
            onSubmit={handleGuestInfoSubmit}
            noValidate
            className="space-y-5"
          >
            <h2 className="text-lg font-bold text-gray-900">
              {isAr ? "معلومات الضيف" : "Guest information"}
            </h2>

            <Input
              label={isAr ? "الاسم الكامل" : "Full name"}
              type="text"
              autoComplete="name"
              value={guestInfo.name}
              onChange={(e) =>
                setGuestInfo((p) => ({ ...p, name: e.target.value }))
              }
              errorText={fieldErrors.name || undefined}
              validationState={fieldErrors.name ? "error" : "default"}
              required
            />

            <Input
              label={isAr ? "البريد الإلكتروني" : "Email address"}
              type="email"
              autoComplete="email"
              value={guestInfo.email}
              onChange={(e) =>
                setGuestInfo((p) => ({ ...p, email: e.target.value }))
              }
              errorText={fieldErrors.email || undefined}
              validationState={fieldErrors.email ? "error" : "default"}
              required
            />

            <Input
              label={isAr ? "رقم الهاتف" : "Phone number"}
              type="tel"
              autoComplete="tel"
              value={guestInfo.phone}
              onChange={(e) =>
                setGuestInfo((p) => ({ ...p, phone: e.target.value }))
              }
              errorText={fieldErrors.phone || undefined}
              validationState={fieldErrors.phone ? "error" : "default"}
              required
            />

            {/* Policies */}
            <div className="space-y-3">
              <CancellationPolicyDisplay property={property} locale={locale} />
              <HouseRulesDisplay property={property} locale={locale} />
            </div>

            {/* Acknowledgment */}
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={acknowledged}
                onChange={(e) => {
                  setAcknowledged(e.target.checked);
                  if (e.target.checked) setAckError("");
                }}
                className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">
                {isAr
                  ? "أوافق على سياسات الحجز وقواعد المنزل"
                  : "I agree to the booking policies and house rules"}
              </span>
            </label>
            {ackError && (
              <p role="alert" className="text-xs text-red-500">
                {ackError}
              </p>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              loading={loadingPayment}
              disabled={loadingPayment}
            >
              {loadingPayment
                ? isAr
                  ? "جارٍ التحضير…"
                  : "Preparing…"
                : isAr
                  ? "المتابعة للدفع"
                  : "Continue to payment"}
            </Button>
          </form>
        )}

        {step === "payment" && paymentData && (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setStep("guest-info")}
                className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
                aria-label={isAr ? "رجوع" : "Back"}
              >
                <ChevronLeftIcon />
                {isAr ? "رجوع" : "Back"}
              </button>
              <h2 className="text-lg font-bold text-gray-900">
                {isAr ? "الدفع" : "Payment"}
              </h2>
            </div>

            {errorMessage && (
              <p
                role="alert"
                className="rounded-md bg-red-50 p-3 text-sm text-red-600"
              >
                {errorMessage}
              </p>
            )}

            <PaymentForm
              publishableKey={paymentData.publishableKey}
              clientSecret={paymentData.clientSecret}
              displayAmount={formatCurrency(
                bookingData.pricing.total,
                bookingData.pricing.currency,
                locale,
              )}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
            />
          </div>
        )}
      </div>

      {/* Right: summary */}
      <div className="space-y-4">
        <BookingSummary
          property={property}
          bookingData={bookingData}
          locale={locale}
        />
      </div>
    </div>
  );
}

// ── Icons ─────────────────────────────────────────────────────────────────────

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      className={className}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.5 12.75l6 6 9-13.5"
      />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      className={className}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
}

function ChevronLeftIcon() {
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
