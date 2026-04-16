"use client";

/**
 * PropertyReviews — displays the list of reviews for a property and
 * conditionally renders the ReviewForm for eligible guests.
 *
 * Requirements: 25.1, 25.2, 25.3, 25.4, 25.5, 25.6
 */

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useReview } from "../hooks/useReview";
import { ReviewForm } from "./ReviewForm";
import { Spinner } from "@/components/ui/Spinner";

const PAGE_SIZE = 5;

interface PropertyReviewsProps {
  propertyId: string;
}

export function PropertyReviews({ propertyId }: PropertyReviewsProps) {
  const t = useTranslations();
  const { completedBooking, reviews, averageRating, loading, refreshReviews } =
    useReview(propertyId);
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);

  const visible = reviews.slice(0, page * PAGE_SIZE);
  const hasMore = reviews.length > page * PAGE_SIZE;

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner />
      </div>
    );
  }

  return (
    <section aria-labelledby="reviews-heading" className="space-y-6">
      <div className="flex items-center justify-between">
        <h2
          id="reviews-heading"
          className="text-xl font-semibold text-gray-900"
        >
          {t("property.reviews")}
        </h2>

        {/* Summary */}
        {reviews.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <StarIcon className="h-4 w-4 text-yellow-400" />
            <span className="font-semibold text-gray-900">{averageRating}</span>
            <span>({t("review.reviewCount", { count: reviews.length })})</span>
          </div>
        )}
      </div>

      {/* Review submission toggle — only for guests with a completed booking */}
      {completedBooking && !showForm && (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="rounded-lg border border-blue-500 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          {t("review.title")}
        </button>
      )}

      {showForm && (
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <ReviewForm
            propertyId={propertyId}
            completedBooking={completedBooking}
            onSuccess={async () => {
              setShowForm(false);
              await refreshReviews();
            }}
          />
        </div>
      )}

      {/* Review list */}
      {reviews.length === 0 ? (
        <p className="text-sm text-gray-500">{t("property.noReviews")}</p>
      ) : (
        <ul className="space-y-4" aria-label={t("property.reviews")}>
          {visible.map((review) => (
            <li
              key={review.id}
              className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
            >
              <div className="mb-2 flex items-center gap-3">
                {/* Star display */}
                <div
                  className="flex gap-0.5"
                  aria-label={`${review.rating} stars`}
                >
                  {[1, 2, 3, 4, 5].map((s) => (
                    <span
                      key={s}
                      aria-hidden="true"
                      className={
                        s <= review.rating ? "text-yellow-400" : "text-gray-200"
                      }
                    >
                      ★
                    </span>
                  ))}
                </div>
                {/* Date */}
                <time
                  dateTime={new Date(review.createdAt).toISOString()}
                  className="ms-auto text-xs text-gray-400"
                >
                  {new Date(review.createdAt).toLocaleDateString()}
                </time>
              </div>
              <p className="text-sm text-gray-700">{review.comment}</p>
            </li>
          ))}
        </ul>
      )}

      {hasMore && (
        <button
          type="button"
          onClick={() => setPage((p) => p + 1)}
          className="text-sm font-medium text-blue-600 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          {t("common.view")} {t("common.next")}
        </button>
      )}
    </section>
  );
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}
