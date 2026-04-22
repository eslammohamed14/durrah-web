"use client";

/**
 * ActivityDetailContent — client component for activity detail page.
 * Displays complete activity info, availability calendar, and booking CTA.
 * Requirements: 26.4, 26.5
 */

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { Link } from "@/navigation";
import { Badge } from "@/components/ui/Badge";
import PropertyGalleryDynamic from "@/features/properties/components/propertyGalleryDynamic";
import {
  AvailabilityCalendar,
  type DateRange,
} from "@/features/booking/AvailabilityCalendar";
import type { AvailabilityCalendar as AvailabilityData } from "@/lib/types";
import type { Property, Review } from "@/lib/types";

interface ActivityDetailContentProps {
  activity: Property;
  reviews: Review[];
  ownerName?: string;
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

export function ActivityDetailContent({
  activity,
  reviews,
  ownerName,
}: ActivityDetailContentProps) {
  const t = useTranslations();
  const locale = useLocale() as "en" | "ar";

  const title = activity.title[locale] || activity.title.en;
  const description = activity.description[locale] || activity.description.en;
  const address =
    activity.location.address[locale] || activity.location.address.en;

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="mb-4 flex items-center gap-2 text-sm text-gray-500"
        >
          <Link href={`/${locale}`} className="hover:text-gray-700">
            {t("nav.home")}
          </Link>
          <span aria-hidden="true">/</span>
          <Link href={`/${locale}/activities`} className="hover:text-gray-700">
            {t("activities.pageTitle")}
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-gray-900 line-clamp-1">{title}</span>
        </nav>

        {/* Gallery */}
        <PropertyGalleryDynamic images={activity.images} title={title} />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title & meta */}
            <div>
              <div className="flex flex-wrap items-start gap-3 mb-3">
                <Badge variant="info">{t("categories.activity")}</Badge>
                {activity.status === "active" && (
                  <Badge variant="success">
                    {t("dashboard.owner.propertyActive")}
                  </Badge>
                )}
              </div>
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                {title}
              </h1>
              <p className="mt-2 flex items-center gap-1.5 text-gray-500">
                <LocationIcon className="h-4 w-4 shrink-0" />
                {address}
              </p>
              {activity.ratings.count > 0 && (
                <div className="mt-2 flex items-center gap-1.5 text-sm">
                  <StarIcon className="h-4 w-4 text-yellow-400" />
                  <span className="font-semibold text-gray-900">
                    {activity.ratings.average.toFixed(1)}
                  </span>
                  <span className="text-gray-500">
                    · {activity.ratings.count}{" "}
                    {t("review.reviewCount").replace(
                      "{count}",
                      String(activity.ratings.count),
                    )}
                  </span>
                </div>
              )}
            </div>

            <hr className="border-gray-200" />

            {/* Description */}
            <section aria-labelledby="description-heading">
              <h2
                id="description-heading"
                className="mb-3 text-xl font-semibold text-gray-900"
              >
                {t("property.details")}
              </h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                {description}
              </p>
            </section>

            {/* Specifications */}
            {(activity.specifications.maxGuests ||
              activity.specifications.size) && (
              <>
                <hr className="border-gray-200" />
                <section aria-labelledby="specs-heading">
                  <h2
                    id="specs-heading"
                    className="mb-4 text-xl font-semibold text-gray-900"
                  >
                    {t("property.specifications")}
                  </h2>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                    {activity.specifications.size && (
                      <SpecItem
                        label={t("property.size")}
                        value={`${activity.specifications.size} ${t("property.sqm")}`}
                      />
                    )}
                    {activity.specifications.maxGuests && (
                      <SpecItem
                        label={t("property.maxGuests")}
                        value={String(activity.specifications.maxGuests)}
                      />
                    )}
                  </div>
                </section>
              </>
            )}

            {/* Amenities */}
            {activity.amenities.length > 0 && (
              <>
                <hr className="border-gray-200" />
                <section aria-labelledby="amenities-heading">
                  <h2
                    id="amenities-heading"
                    className="mb-4 text-xl font-semibold text-gray-900"
                  >
                    {t("property.amenities")}
                  </h2>
                  <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {activity.amenities.map((amenity) => (
                      <li
                        key={amenity}
                        className="flex items-center gap-2 text-sm text-gray-700"
                      >
                        <CheckIcon className="h-4 w-4 shrink-0 text-green-500" />
                        {t(`amenity.${amenity}`) || amenity}
                      </li>
                    ))}
                  </ul>
                </section>
              </>
            )}

            {/* Availability */}
            {activity.availability && (
              <>
                <hr className="border-gray-200" />
                <section aria-labelledby="availability-heading">
                  <h2
                    id="availability-heading"
                    className="mb-4 text-xl font-semibold text-gray-900"
                  >
                    {t("availability.legendSelected")
                      ? "Availability"
                      : "Availability"}
                  </h2>
                  <AvailabilityCalendarWrapper
                    availability={activity.availability}
                  />
                </section>
              </>
            )}

            {/* Reviews */}
            {reviews.length > 0 && (
              <>
                <hr className="border-gray-200" />
                <section aria-labelledby="reviews-heading">
                  <h2
                    id="reviews-heading"
                    className="mb-4 text-xl font-semibold text-gray-900"
                  >
                    {t("property.reviews")}
                  </h2>
                  <div className="space-y-4">
                    {reviews.slice(0, 5).map((review) => (
                      <div
                        key={review.id}
                        className="rounded-xl border border-gray-100 bg-gray-50 p-4"
                      >
                        <div className="mb-2 flex items-center gap-2">
                          <div className="flex">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <StarIcon
                                key={i}
                                className={`h-4 w-4 ${i < review.rating ? "text-yellow-400" : "text-gray-200"}`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-gray-400">
                            {new Date(review.createdAt).toLocaleDateString(
                              locale === "ar" ? "ar-SA" : "en-SA",
                            )}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">
                          {review.comment}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              </>
            )}

            {/* Host */}
            {ownerName && (
              <>
                <hr className="border-gray-200" />
                <section aria-labelledby="host-heading">
                  <h2
                    id="host-heading"
                    className="mb-3 text-xl font-semibold text-gray-900"
                  >
                    {t("property.details")}
                  </h2>
                  <p className="text-sm text-gray-600">{ownerName}</p>
                </section>
              </>
            )}
          </div>

          {/* Right column — booking card */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-2xl border border-gray-200 shadow-lg p-6">
              <p className="text-2xl font-bold text-gray-900">
                {new Intl.NumberFormat("en-SA").format(
                  activity.pricing.basePrice,
                )}{" "}
                <span className="text-base font-normal text-gray-500">
                  {activity.pricing.currency}
                </span>
                <span className="text-base font-normal text-gray-500">
                  {" "}
                  / {t("activities.perPerson")}
                </span>
              </p>

              {activity.ratings.count > 0 && (
                <div className="mt-1 mb-4 flex items-center gap-1 text-sm">
                  <StarIcon className="h-4 w-4 text-yellow-400" />
                  <span className="font-medium text-gray-900">
                    {activity.ratings.average.toFixed(1)}
                  </span>
                  <span className="text-gray-500">
                    · {activity.ratings.count} reviews
                  </span>
                </div>
              )}

              <Link
                href={`/checkout/${activity.id}`}
                className="mt-4 block w-full text-center rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              >
                {t("activities.bookNow")}
              </Link>
            </div>
          </aside>
        </div>
      </div>

      {/* Mobile sticky CTA */}
      <div className="fixed bottom-0 inset-x-0 z-40 border-t border-gray-200 bg-white p-4 lg:hidden">
        <div className="flex items-center justify-between gap-4">
          <div>
            <span className="text-xl font-bold text-gray-900">
              {new Intl.NumberFormat("en-SA").format(
                activity.pricing.basePrice,
              )}{" "}
              <span className="text-sm font-normal text-gray-500">
                {activity.pricing.currency}
              </span>
            </span>
            <p className="text-xs text-gray-500">{t("activities.perPerson")}</p>
          </div>
          <Link
            href={`/checkout/${activity.id}`}
            className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            {t("activities.bookNow")}
          </Link>
        </div>
      </div>
      {/* Spacer so content doesn't hide behind mobile CTA */}
      <div className="h-24 lg:hidden" aria-hidden="true" />
    </main>
  );
}

function SpecItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
      <dt className="text-xs text-gray-500">{label}</dt>
      <dd className="mt-0.5 font-semibold text-gray-900">{value}</dd>
    </div>
  );
}

function AvailabilityCalendarWrapper({
  availability,
}: {
  availability: AvailabilityData;
}) {
  const [range, setRange] = useState<DateRange>({
    checkIn: null,
    checkOut: null,
  });
  return (
    <AvailabilityCalendar
      availability={availability}
      value={range}
      onChange={setRange}
    />
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
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

function LocationIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
      />
    </svg>
  );
}
