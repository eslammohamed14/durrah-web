"use client";

/**
 * useReview — provides the completed booking (if any) that qualifies the
 * current user to review a property, plus a callback to refresh reviews
 * after a successful submission.
 *
 * Requirements: 25.3, 25.4, 25.6, 28.4
 */

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/lib/contexts/AuthContext";
import { getAPIClient } from "@/lib/api";
import type { Booking, Review } from "@/lib/types";

interface UseReviewResult {
  /** The most recent completed booking for this property, or undefined */
  completedBooking: Booking | undefined;
  /** All existing reviews for the property */
  reviews: Review[];
  /** Average rating (0 if no reviews) */
  averageRating: number;
  /** Whether initial data is loading */
  loading: boolean;
  /** Refresh reviews — call after a successful submission */
  refreshReviews: () => Promise<void>;
}

export function useReview(propertyId: string): UseReviewResult {
  const { user } = useAuth();
  const [completedBooking, setCompletedBooking] = useState<Booking | undefined>(
    undefined,
  );
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = useCallback(async () => {
    try {
      const api = getAPIClient();
      const data = await api.getPropertyReviews(propertyId);
      setReviews(data);
    } catch {
      // non-fatal — reviews may be empty
    }
  }, [propertyId]);

  useEffect(() => {
    async function init() {
      setLoading(true);
      const api = getAPIClient();

      // Fetch reviews
      await fetchReviews();

      // Fetch completed booking for this property (guest only)
      if (user) {
        try {
          const bookings = await api.getUserBookings(user.id);
          const done = bookings.find(
            (b) => b.propertyId === propertyId && b.status === "completed",
          );
          setCompletedBooking(done);
        } catch {
          // ignore — user may not have bookings
        }
      }

      setLoading(false);
    }

    init();
  }, [propertyId, user, fetchReviews]);

  const averageRating =
    reviews.length > 0
      ? Math.round(
          (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10,
        ) / 10
      : 0;

  return {
    completedBooking,
    reviews,
    averageRating,
    loading,
    refreshReviews: fetchReviews,
  };
}
