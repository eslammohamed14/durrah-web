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
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import type { Property } from "@/lib/types";
import type { BookingFormData } from "./BookingForm";
import { PaymentForm } from "./PaymentForm";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Spinner } from "@/components/ui/Spinner";
import { createPaymentIntent } from "@/app/checkout/[propertyId]/actions";
import { getAPIClient } from "@/lib/api";
import { useLocale } from "@/lib/contexts/LocaleContext";

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

type TFn = (key: string, params?: Record<string, string | number>) => string;

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
  t: TFn,
): Record<keyof GuestInfo, string> {
  const errors: Record<keyof GuestInfo, string> = {
    name: "",
    email: "",
    phone: "",
  };

  if (!info.name.trim()) {
    errors.name = t("checkout.nameRequired");
  }
  if (!info.email.trim()) {
    errors.email = t("checkout.emailRequired");
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(info.email)) {
    errors.email = t("checkout.invalidEmail");
  }
  if (!info.phone.trim()) {
    errors.phone = t("checkout.phoneRequired");
  }

  return errors;
}

function guestSummaryLine(t: TFn, adults: number, children: number) {
  const adultPart =
    adults === 1
      ? t("booking.guestsOneAdult", { count: 1 })
      : t("booking.guestsManyAdults", { count: adults });
  if (!children) return adultPart;
  const childPart =
    children === 1
      ? t("booking.guestsOneChild", { count: 1 })
      : t("booking.guestsManyChildren", { count: children });
  return `${adultPart} · ${childPart}`;
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
  const { t } = useLocale();
  const { pricing, checkIn, checkOut, guests } = bookingData;
  const fmt = (n: number) => formatCurrency(n, pricing.currency, locale);
  const nightsWord =
    pricing.nights === 1 ? t("checkout.night") : t("checkout.night_plural");

  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm">
      <h3 className="mb-3 font-semibold text-gray-900">
        {t("checkout.summaryTitle")}
      </h3>

      <p className="mb-1 font-medium text-gray-800">
        {property.title[locale === "ar" ? "ar" : "en"]}
      </p>
      <p className="mb-3 text-xs text-gray-500">
        {property.location.address[locale === "ar" ? "ar" : "en"]}
      </p>

      <div className="mb-3 grid grid-cols-2 gap-2 text-xs">
        <div>
          <p className="text-gray-400">{t("booking.checkIn")}</p>
          <p className="font-medium text-gray-700">
            {formatDate(checkIn, locale)}
          </p>
        </div>
        <div>
          <p className="text-gray-400">{t("booking.checkOut")}</p>
          <p className="font-medium text-gray-700">
            {formatDate(checkOut, locale)}
          </p>
        </div>
      </div>

      <p className="mb-3 text-xs text-gray-600">
        {guestSummaryLine(t, guests.adults, guests.children)}
      </p>

      <div className="space-y-1 border-t border-gray-200 pt-3">
        <div className="flex justify-between text-gray-600">
          <span>
            {fmt(property.pricing.basePrice)} × {pricing.nights} {nightsWord}
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
          <span>{t("checkout.taxesPercent")}</span>
          <span>{fmt(pricing.taxes)}</span>
        </div>
        <div className="flex justify-between border-t border-gray-200 pt-2 font-semibold text-gray-900">
          <span>{t("checkout.total")}</span>
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
  const { t } = useLocale();
  const policy = property.policies.cancellation;
  if (!policy) return null;

  const desc = policy.description[locale === "ar" ? "ar" : "en"];

  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
      <p className="mb-1 font-semibold">
        {t("checkout.cancellationPolicyTitle")}
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
  const { t } = useLocale();
  const rules = property.policies.houseRules[locale === "ar" ? "ar" : "en"];
  if (!rules) return null;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-3 text-xs text-gray-700">
      <p className="mb-1 font-semibold text-gray-800">
        {t("checkout.houseRulesTitle")}
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
  const { t } = useLocale();

  const [step, setStep] = useState<CheckoutStep>("guest-info");
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

  // React Hook Form — field-level validation with real-time error display
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors: fieldErrors },
  } = useForm<GuestInfo>({
    mode: "onBlur",
    defaultValues: { name: "", email: "", phone: "" },
  });

  const onGuestInfoValid = useCallback(
    async (data: GuestInfo) => {
      void data; // consumed via getValues() in handlePaymentSuccess
      if (!acknowledged) {
        setAckError(t("checkout.mustAcknowledgePolicies"));
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
          err instanceof Error ? err.message : t("checkout.paymentInitFailed"),
        );
        setStep("error");
      } finally {
        setLoadingPayment(false);
      }
    },
    [acknowledged, bookingData.pricing.total, t],
  );

  const handlePaymentSuccess = useCallback(
    async (transactionId: string) => {
      const guestInfo = getValues();
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
            : t("checkout.paidButBookingFailed"),
        );
        setStep("error");
      }
    },
    [property.id, bookingData, getValues, t],
  );

  const handlePaymentError = useCallback((message: string) => {
    setErrorMessage(message);
  }, []);

  if (step === "success") {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <CheckIcon className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">
          {t("checkout.bookingConfirmed")}
        </h2>
        <p className="text-sm text-gray-500">
          {t("checkout.confirmationEmailBody")}
        </p>
        {bookingId && (
          <p className="text-xs text-gray-400">
            {t("checkout.bookingIdLine", { id: bookingId })}
          </p>
        )}
        <Button
          variant="primary"
          size="md"
          onClick={() => router.push("/dashboard/guest")}
        >
          {t("checkout.viewMyBookings")}
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
          {t("checkout.somethingWrong")}
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
          {t("checkout.tryAgain")}
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
      <div className="space-y-6">
        {step === "guest-info" && (
          <form
            onSubmit={handleSubmit(onGuestInfoValid)}
            noValidate
            className="space-y-5"
          >
            <h2 className="text-lg font-bold text-gray-900">
              {t("checkout.guestInformation")}
            </h2>

            <Input
              label={t("checkout.fullName")}
              type="text"
              autoComplete="name"
              errorText={fieldErrors.name?.message}
              validationState={fieldErrors.name ? "error" : "default"}
              required
              {...register("name", {
                required: t("checkout.nameRequired"),
              })}
            />

            <Input
              label={t("checkout.emailAddress")}
              type="email"
              autoComplete="email"
              errorText={fieldErrors.email?.message}
              validationState={fieldErrors.email ? "error" : "default"}
              required
              {...register("email", {
                required: t("checkout.emailRequired"),
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: t("checkout.invalidEmail"),
                },
              })}
            />

            <Input
              label={t("checkout.phoneNumber")}
              type="tel"
              autoComplete="tel"
              errorText={fieldErrors.phone?.message}
              validationState={fieldErrors.phone ? "error" : "default"}
              required
              {...register("phone", {
                required: t("checkout.phoneRequired"),
              })}
            />

            <div className="space-y-3">
              <CancellationPolicyDisplay property={property} locale={locale} />
              <HouseRulesDisplay property={property} locale={locale} />
            </div>

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
                {t("checkout.acknowledgePolicies")}
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
                ? t("checkout.preparing")
                : t("checkout.continueToPayment")}
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
                aria-label={t("checkout.backAria")}
              >
                <ChevronLeftIcon />
                {t("common.back")}
              </button>
              <h2 className="text-lg font-bold text-gray-900">
                {t("checkout.payment")}
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
