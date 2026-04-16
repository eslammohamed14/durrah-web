"use client";

/**
 * InquiryForm — shared inquiry form used by Buy property pages and Shop detail pages.
 * Collects name, phone, email, message and submits via API.
 * Requirements: 31.1, 31.2, 31.3, 31.4, 31.7
 */

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/lib/contexts/AuthContext";
import { getAPIClient } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface InquiryFormProps {
  propertyId: string;
  /** Called after a successful submission */
  onSuccess?: () => void;
}

interface FormState {
  name: string;
  email: string;
  phone: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
}

function validate(
  values: FormState,
  t: ReturnType<typeof useTranslations>,
): FormErrors {
  const errors: FormErrors = {};
  if (!values.name.trim()) errors.name = t("validation.required");
  if (!values.email.trim()) {
    errors.email = t("validation.required");
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = t("validation.email");
  }
  if (!values.phone.trim()) errors.phone = t("validation.required");
  if (!values.message.trim()) errors.message = t("validation.required");
  return errors;
}

export function InquiryForm({ propertyId, onSuccess }: InquiryFormProps) {
  const t = useTranslations();
  const { user } = useAuth();

  const [values, setValues] = useState<FormState>({
    name: user?.name ?? "",
    email: user?.email ?? "",
    phone: user?.phoneNumber ?? "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate(values, t);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setSubmitting(true);
    setServerError(null);

    try {
      const api = getAPIClient();
      await api.createInquiry({
        propertyId,
        name: values.name.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
        message: values.message.trim(),
      });
      setSubmitted(true);
      onSuccess?.();
    } catch {
      setServerError(t("errors.generic"));
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-6 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
          <CheckCircleIcon className="h-6 w-6 text-green-600" />
        </div>
        <p className="font-semibold text-green-800">{t("inquiry.sent")}</p>
        <p className="mt-1 text-sm text-green-700">
          {t("inquiry.confirmationNote")}
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-label={t("inquiry.title")}
      className="space-y-4"
    >
      <h3 className="text-lg font-semibold text-gray-900">
        {t("inquiry.title")}
      </h3>

      {serverError && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {serverError}
        </div>
      )}

      <Input
        id="inquiry-name"
        name="name"
        label={t("inquiry.name")}
        value={values.name}
        onChange={handleChange}
        errorText={errors.name}
        autoComplete="name"
        required
      />

      <Input
        id="inquiry-email"
        name="email"
        type="email"
        label={t("inquiry.email")}
        value={values.email}
        onChange={handleChange}
        errorText={errors.email}
        autoComplete="email"
        required
      />

      <Input
        id="inquiry-phone"
        name="phone"
        type="tel"
        label={t("inquiry.phone")}
        value={values.phone}
        onChange={handleChange}
        errorText={errors.phone}
        autoComplete="tel"
        required
      />

      <div>
        <label
          htmlFor="inquiry-message"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          {t("inquiry.message")}
          <span className="ms-1 text-red-500" aria-hidden="true">
            *
          </span>
        </label>
        <textarea
          id="inquiry-message"
          name="message"
          rows={4}
          value={values.message}
          onChange={handleChange}
          required
          aria-invalid={!!errors.message}
          aria-describedby={
            errors.message ? "inquiry-message-error" : undefined
          }
          className={[
            "w-full rounded-lg border px-3 py-2 text-sm text-gray-900",
            "placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500",
            "disabled:cursor-not-allowed disabled:bg-gray-50",
            errors.message
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300",
          ].join(" ")}
          placeholder={t("inquiry.messagePlaceholder")}
        />
        {errors.message && (
          <p
            id="inquiry-message-error"
            className="mt-1 text-xs text-red-600"
            role="alert"
          >
            {errors.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        variant="primary"
        className="w-full"
        disabled={submitting}
      >
        {submitting ? t("common.loading") : t("inquiry.send")}
      </Button>
    </form>
  );
}

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}
