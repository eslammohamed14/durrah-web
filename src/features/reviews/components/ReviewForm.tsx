"use client";

/**
 * ReviewForm — allows a guest who has completed a booking to submit a star rating
 * and written comment for a property.
 *
 * Requirements: 25.3, 25.4
 */

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/lib/contexts/AuthContext";
import { getAPIClient } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import type { Booking } from "@/lib/types";

// ─── Star Rating ──────────────────────────────────────────────────────────────

interface StarRatingProps {
  value: number;
  onChange: (rating: number) => void;
  disabled?: boolean;
}

function StarRating({ value, onChange, disabled }: StarRatingProps) {
  const [hovered, setHovered] = useState(0);
  const t = useTranslations();

  return (
    <div
      className="flex gap-1"
      role="radiogroup"
      aria-label={t("review.rating")}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= (hovered || value);
        return (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={value === star}
            aria-label={`${star} star${star !== 1 ? "s" : ""}`}
            disabled={disabled}
            onClick={() => onChange(star)}
            onMouseEnter={() => !disabled && setHovered(star)}
            onMouseLeave={() => !disabled && setHovered(0)}
            className={[
              "text-2xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded",
              disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
              filled ? "text-yellow-400" : "text-gray-300",
            ].join(" ")}
          >
            ★
          </button>
        );
      })}
    </div>
  );
}

// ─── ReviewForm ───────────────────────────────────────────────────────────────

interface ReviewFormProps {
  /** The property being reviewed */
  propertyId: string;
  /**
   * The completed booking that qualifies the user to leave a review.
   * Pass undefined to show a "no completed booking" message.
   */
  completedBooking: Booking | undefined;
  /** Called after a successful submission */
  onSuccess?: () => void;
}

interface FormState {
  rating: number;
  comment: string;
}

interface FormErrors {
  rating?: string;
  comment?: string;
}

function validate(
  values: FormState,
  t: ReturnType<typeof useTranslations>,
): FormErrors {
  const errors: FormErrors = {};
  if (values.rating < 1 || values.rating > 5) {
    errors.rating = t("review.ratingRequired");
  }
  if (!values.comment.trim()) {
    errors.comment = t("validation.required");
  }
  return errors;
}

export function ReviewForm({
  propertyId,
  completedBooking,
  onSuccess,
}: ReviewFormProps) {
  const t = useTranslations();
  const { user } = useAuth();

  const [values, setValues] = useState<FormState>({ rating: 0, comment: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // Requirement 25.3 — only guests with a completed booking may review
  if (!user) {
    return (
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 text-sm text-gray-600">
        {t("review.loginRequired")}
      </div>
    );
  }

  if (!completedBooking) {
    return (
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 text-sm text-gray-600">
        {t("review.noCompletedBooking")}
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-6 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
          <CheckCircleIcon className="h-6 w-6 text-green-600" />
        </div>
        <p className="font-semibold text-green-800">{t("review.submitted")}</p>
      </div>
    );
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
      // Requirement 25.4 — submit review; mock recalculates average rating
      await api.createReview({
        propertyId,
        bookingId: completedBooking!.id,
        rating: values.rating,
        comment: values.comment.trim(),
      });
      setSubmitted(true);
      onSuccess?.();
    } catch {
      setServerError(t("errors.generic"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-label={t("review.title")}
      className="space-y-4"
    >
      <h3 className="text-lg font-semibold text-gray-900">
        {t("review.title")}
      </h3>

      {serverError && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {serverError}
        </div>
      )}

      {/* Star rating */}
      <div>
        <p className="mb-2 text-sm font-medium text-gray-700">
          {t("review.rating")}
          <span className="ms-1 text-red-500" aria-hidden="true">
            *
          </span>
        </p>
        <StarRating
          value={values.rating}
          onChange={(r) => {
            setValues((prev) => ({ ...prev, rating: r }));
            if (errors.rating)
              setErrors((prev) => ({ ...prev, rating: undefined }));
          }}
          disabled={submitting}
        />
        {errors.rating && (
          <p className="mt-1 text-xs text-red-600" role="alert">
            {errors.rating}
          </p>
        )}
      </div>

      {/* Comment textarea */}
      <div>
        <label
          htmlFor="review-comment"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          {t("review.comment")}
          <span className="ms-1 text-red-500" aria-hidden="true">
            *
          </span>
        </label>
        <textarea
          id="review-comment"
          name="comment"
          rows={4}
          value={values.comment}
          onChange={(e) => {
            setValues((prev) => ({ ...prev, comment: e.target.value }));
            if (errors.comment)
              setErrors((prev) => ({ ...prev, comment: undefined }));
          }}
          disabled={submitting}
          required
          aria-invalid={!!errors.comment}
          aria-describedby={errors.comment ? "review-comment-error" : undefined}
          className={[
            "w-full rounded-lg border px-3 py-2 text-sm text-gray-900",
            "placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500",
            "disabled:cursor-not-allowed disabled:bg-gray-50",
            errors.comment
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300",
          ].join(" ")}
          placeholder={t("review.commentPlaceholder")}
        />
        {errors.comment && (
          <p
            id="review-comment-error"
            className="mt-1 text-xs text-red-600"
            role="alert"
          >
            {errors.comment}
          </p>
        )}
      </div>

      <Button
        type="submit"
        variant="primary"
        className="w-full"
        disabled={submitting}
      >
        {submitting ? t("common.loading") : t("review.submit")}
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
