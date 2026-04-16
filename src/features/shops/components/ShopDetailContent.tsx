"use client";

/**
 * ShopDetailContent — client component for shop detail page.
 * Displays complete shop info and inline InquiryForm.
 * Requirements: 27.4, 31.1, 31.2
 */

import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { PropertyGallery } from "@/features/properties/components/PropertyGallery";
import { InquiryForm } from "@/features/inquiry/InquiryForm";
import type { Property } from "@/lib/types";

interface ShopDetailContentProps {
  shop: Property;
  ownerName?: string;
}

export function ShopDetailContent({ shop, ownerName }: ShopDetailContentProps) {
  const t = useTranslations();
  const locale = useLocale() as "en" | "ar";

  const title = shop.title[locale] || shop.title.en;
  const description = shop.description[locale] || shop.description.en;
  const address = shop.location.address[locale] || shop.location.address.en;
  const houseRules =
    shop.policies.houseRules?.[locale] || shop.policies.houseRules?.en;

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
          <Link href={`/${locale}/shops`} className="hover:text-gray-700">
            {t("shops.pageTitle")}
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-gray-900 line-clamp-1">{title}</span>
        </nav>

        {/* Gallery */}
        <PropertyGallery images={shop.images} title={title} />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title & meta */}
            <div>
              <div className="flex flex-wrap items-start gap-3 mb-3">
                <Badge variant="warning">{t("categories.shop")}</Badge>
                {shop.status === "active" && (
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
            <hr className="border-gray-200" />
            <section aria-labelledby="specs-heading">
              <h2
                id="specs-heading"
                className="mb-4 text-xl font-semibold text-gray-900"
              >
                {t("property.specifications")}
              </h2>
              <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {shop.specifications.size && (
                  <SpecItem
                    label={t("shops.size")}
                    value={`${shop.specifications.size} ${t("shops.sqm")}`}
                  />
                )}
                {shop.specifications.rooms && (
                  <SpecItem
                    label={t("property.rooms")}
                    value={String(shop.specifications.rooms)}
                  />
                )}
                {shop.specifications.bathrooms && (
                  <SpecItem
                    label={t("property.bathrooms")}
                    value={String(shop.specifications.bathrooms)}
                  />
                )}
                {shop.specifications.floors && (
                  <SpecItem
                    label="Floors"
                    value={String(shop.specifications.floors)}
                  />
                )}
              </dl>
            </section>

            {/* Pricing / Lease terms */}
            <hr className="border-gray-200" />
            <section aria-labelledby="pricing-heading">
              <h2
                id="pricing-heading"
                className="mb-4 text-xl font-semibold text-gray-900"
              >
                {t("shops.leaseTerms")}
              </h2>
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                <p className="text-2xl font-bold text-gray-900">
                  {new Intl.NumberFormat("en-SA").format(
                    shop.pricing.basePrice,
                  )}{" "}
                  <span className="text-base font-normal text-gray-500">
                    {shop.pricing.currency} / {t("shops.perMonth")}
                  </span>
                </p>
                {shop.pricing.fees && shop.pricing.fees.length > 0 && (
                  <ul className="mt-3 space-y-1">
                    {shop.pricing.fees.map((fee) => (
                      <li
                        key={fee.name}
                        className="flex justify-between text-sm text-gray-600"
                      >
                        <span>{fee.name}</span>
                        <span>
                          {fee.amount} {shop.pricing.currency}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>

            {/* Amenities */}
            {shop.amenities.length > 0 && (
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
                    {shop.amenities.map((amenity) => (
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

            {/* Policies / House rules */}
            {houseRules && (
              <>
                <hr className="border-gray-200" />
                <section aria-labelledby="policies-heading">
                  <h2
                    id="policies-heading"
                    className="mb-3 text-xl font-semibold text-gray-900"
                  >
                    {t("property.policies")}
                  </h2>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {houseRules}
                  </p>
                </section>
              </>
            )}

            {/* Owner */}
            {ownerName && (
              <>
                <hr className="border-gray-200" />
                <p className="text-sm text-gray-500">
                  {t("property.details")}: {ownerName}
                </p>
              </>
            )}

            {/* Inquiry form — mobile (shown below details on small screens) */}
            <div className="lg:hidden">
              <hr className="border-gray-200" />
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <InquiryForm propertyId={shop.id} />
              </div>
            </div>
          </div>

          {/* Right column — sticky inquiry form */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-2xl border border-gray-200 shadow-lg p-6">
              <InquiryForm propertyId={shop.id} />
            </div>
          </aside>
        </div>
      </div>
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
