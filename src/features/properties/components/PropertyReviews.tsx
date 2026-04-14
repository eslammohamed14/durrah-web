"use client";

/**
 * PropertyReviews — displays average rating, review count, individual reviews
 * sorted by most recent, with pagination.
 * Requirements: 4.8, 25.1, 25.2, 25.5
 */

import { useState } from "react";
import { useLocale } from "@/lib/contexts/LocaleContext";
import type { Review } from "@/lib/types";

interface PropertyReviewsProps {
  reviews: Review[];
  averageRating: number;
  reviewCount: number;
}

const PAGE_SIZE = 5;

function StarRating({
  rating,
  size = "md",
}: {
  rating: number;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClass =
    size === "sm" ? "h-3.5 w-3.5" : size === "lg" ? "h-6 w-6" : "h-4 w-4";
  return (
    <div
      className="flex items-center gap-0.5"
      aria-label={`${rating} out of 5 stars`}
      role="img"
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={[
            sizeClass,
            star <= rating ? "text-yellow-400" : "text-gray-200",
          ].join(" ")}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="py-6 border-b border-gray-100 last:border-0">
      <div className="flex items-start justify-between gap-4 mb-2">
        <div className="flex items-center gap-3">
          {/* Avatar placeholder */}
          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-sm shrink-0">
            G
          </div>
          <div>
            <p className="font-medium text-gray-900 text-sm">Guest</p>
            <time
              className="text-xs text-gray-500"
              dateTime={new Date(review.createdAt).toISOString()}
            >
              {formatDate(review.createdAt)}
            </time>
          </div>
        </div>
        <StarRating rating={review.rating} size="sm" />
      </div>
      <p className="text-gray-700 text-sm leading-relaxed">{review.comment}</p>
    </article>
  );
}

export function PropertyReviews({
  reviews,
  averageRating,
  reviewCount,
}: PropertyReviewsProps) {
  const { t } = useLocale();
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(reviews.length / PAGE_SIZE);
  const visible = reviews.slice(0, page * PAGE_SIZE);
  const hasMore = page < totalPages;

  if (reviewCount === 0) {
    return (
      <section aria-labelledby="reviews-heading">
        <h2
          id="reviews-heading"
          className="text-xl font-semibold text-gray-900 mb-4"
        >
          {t("property.reviews")}
        </h2>
        <p className="text-gray-500">{t("property.noReviews")}</p>
      </section>
    );
  }

  return (
    <section aria-labelledby="reviews-heading">
      <div className="flex items-center gap-4 mb-6">
        <h2
          id="reviews-heading"
          className="text-xl font-semibold text-gray-900"
        >
          {t("property.reviews")}
        </h2>
        <div className="flex items-center gap-2">
          <StarRating rating={Math.round(averageRating)} size="md" />
          <span className="font-semibold text-gray-900">
            {averageRating.toFixed(1)}
          </span>
          <span className="text-gray-500 text-sm">
            ({reviewCount}{" "}
            {reviewCount === 1
              ? t("review.reviewCount").replace("{{count}}", "1")
              : t("review.reviewCount_plural").replace(
                  "{{count}}",
                  String(reviewCount),
                )}
            )
          </span>
        </div>
      </div>

      {/* Rating distribution bar (visual summary) */}
      <div className="mb-6 space-y-1.5 max-w-xs">
        {[5, 4, 3, 2, 1].map((star) => {
          const count = reviews.filter(
            (r) => Math.round(r.rating) === star,
          ).length;
          const pct = reviewCount > 0 ? (count / reviewCount) * 100 : 0;
          return (
            <div key={star} className="flex items-center gap-2 text-sm">
              <span className="w-4 text-gray-600 text-right">{star}</span>
              <svg
                className="h-3.5 w-3.5 text-yellow-400 shrink-0"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-yellow-400 transition-all"
                  style={{ width: `${pct}%` }}
                  role="presentation"
                />
              </div>
              <span className="w-6 text-gray-500 text-xs">{count}</span>
            </div>
          );
        })}
      </div>

      {/* Review list */}
      <div role="list" aria-label="Property reviews">
        {visible.map((review) => (
          <div key={review.id} role="listitem">
            <ReviewCard review={review} />
          </div>
        ))}
      </div>

      {/* Load more */}
      {hasMore && (
        <button
          type="button"
          onClick={() => setPage((p) => p + 1)}
          className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
        >
          Show more reviews ({reviews.length - visible.length} remaining)
        </button>
      )}
    </section>
  );
}
