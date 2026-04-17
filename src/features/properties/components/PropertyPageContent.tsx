"use client";

/**
 * PropertyPageContent — client-side wrapper that composes all property detail
 * sections. Receives server-fetched data as props.
 * Requirements: 4.2–4.10, 12.5, 15.2–15.4
 */

import { useLocale } from "@/lib/contexts/LocaleContext";
import PropertyGalleryDynamic from "./PropertyGalleryDynamic";
import { PropertyDetails } from "./PropertyDetails";
import { PropertyReviews } from "./PropertyReviews";
import PropertyMapDynamic from "@/features/properties/PropertyMapDynamic";
import { InquiryForm } from "@/features/inquiry/InquiryForm";
import type { Property, Review } from "@/lib/types";

interface PropertyPageContentProps {
  property: Property;
  reviews: Review[];
  ownerName?: string;
}

export function PropertyPageContent({
  property,
  reviews,
  ownerName,
}: PropertyPageContentProps) {
  const { t } = useLocale();

  return (
    <main className="min-h-screen bg-white">
      {/* Gallery — full width */}
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8 2xl:max-w-screen-2xl">
        <PropertyGalleryDynamic
          images={property.images}
          title={property.title.en}
        />
      </div>

      {/* Content grid */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 2xl:max-w-screen-2xl">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-10">
          {/* Left column — main details */}
          <div className="space-y-0 lg:col-span-2">
            <PropertyDetails property={property} ownerName={ownerName} />

            <hr className="my-8 border-gray-200" />

            {/* Map — requirement 4.6, 15.2–15.4 */}
            <section aria-labelledby="location-heading">
              <h2
                id="location-heading"
                className="mb-4 text-xl font-semibold text-gray-900"
              >
                {t("property.location")}
              </h2>
              <PropertyMapDynamic
                coordinates={property.location.coordinates}
                title={property.title.en}
                height={380}
                className="rounded-xl"
              />
            </section>

            <hr className="my-8 border-gray-200" />

            {/* Reviews */}
            <PropertyReviews
              reviews={reviews}
              averageRating={property.ratings.average}
              reviewCount={property.ratings.count}
            />
          </div>

          {/* Right column — sticky booking card (desktop only) */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-2xl border border-gray-200 shadow-lg p-6">
              <p className="text-2xl font-bold text-gray-900">
                {new Intl.NumberFormat("en-SA").format(
                  property.pricing.basePrice,
                )}{" "}
                <span className="text-base font-normal text-gray-500">
                  {property.pricing.currency}
                </span>
                {property.pricing.priceType === "per_night" && (
                  <span className="text-base font-normal text-gray-500">
                    {" "}
                    /{t("property.perNight")}
                  </span>
                )}
                {property.pricing.priceType === "per_month" && (
                  <span className="text-base font-normal text-gray-500">
                    {" "}
                    /{t("property.perMonth")}
                  </span>
                )}
              </p>
              <div className="mt-1 mb-4 flex items-center gap-1">
                <svg
                  className="h-4 w-4 text-yellow-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-sm font-medium text-gray-900">
                  {property.ratings.average.toFixed(1)}
                </span>
                <span className="text-sm text-gray-500">
                  · {property.ratings.count} reviews
                </span>
              </div>

              {property.category === "rent" ||
              property.category === "activity" ? (
                <a
                  href={`/checkout/${property.id}`}
                  className="block w-full rounded-lg bg-blue-600 px-4 py-3 text-center font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                >
                  {t("property.bookNow")}
                </a>
              ) : (
                <div className="mt-2">
                  <InquiryForm propertyId={property.id} />
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>

      {/* Mobile sticky booking bar */}
      <div className="fixed bottom-0 inset-x-0 z-30 border-t border-gray-200 bg-white px-4 py-3 shadow-lg lg:hidden">
        <div className="flex items-center justify-between gap-4">
          <div>
            <span className="text-lg font-bold text-gray-900">
              {new Intl.NumberFormat("en-SA").format(
                property.pricing.basePrice,
              )}{" "}
              <span className="text-sm font-normal text-gray-500">
                {property.pricing.currency}
              </span>
            </span>
          </div>
          {property.category === "rent" || property.category === "activity" ? (
            <a
              href={`/checkout/${property.id}`}
              className="min-h-[44px] rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            >
              {t("property.bookNow")}
            </a>
          ) : (
            <a
              href="#inquiry"
              className="min-h-[44px] rounded-lg border border-blue-600 px-6 py-2.5 text-sm font-semibold text-blue-600 transition-colors hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            >
              {t("property.inquire")}
            </a>
          )}
        </div>
      </div>
      {/* Bottom padding to prevent content being obscured by the sticky bar on mobile */}
      <div className="h-20 lg:hidden" aria-hidden="true" />
    </main>
  );
}
