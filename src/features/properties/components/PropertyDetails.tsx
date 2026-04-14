"use client";

/**
 * PropertyDetails — displays specs, pricing, amenities, floor plans,
 * host info, and booking policies.
 * Requirements: 4.2, 4.3, 4.4, 4.5, 4.7, 4.9
 */

import Image from "next/image";
import Link from "next/link";
import { useLocale } from "@/lib/contexts/LocaleContext";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { Property } from "@/lib/types";

interface PropertyDetailsProps {
  property: Property;
  ownerName?: string;
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xl font-semibold text-gray-900 mb-4">{children}</h2>
  );
}

function Divider() {
  return <hr className="my-8 border-gray-200" />;
}

function SpecItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-gray-500">{icon}</span>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="font-medium text-gray-900">{value}</p>
      </div>
    </div>
  );
}

// ── Icons ──────────────────────────────────────────────────────────────────────

function BedIcon() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
      />
    </svg>
  );
}

function BathIcon() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 10.5h18M3 10.5V19a2 2 0 002 2h14a2 2 0 002-2v-8.5M3 10.5V7a4 4 0 014-4h10a4 4 0 014 4v3.5"
      />
    </svg>
  );
}

function SizeIcon() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
      />
    </svg>
  );
}

function GuestsIcon() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      className="h-4 w-4 text-green-500 shrink-0"
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

function StarIcon() {
  return (
    <svg
      className="h-4 w-4 text-yellow-400"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

// ── Price formatting ───────────────────────────────────────────────────────────

function formatPrice(price: number, currency: string): string {
  return (
    new Intl.NumberFormat("en-SA", {
      style: "decimal",
      maximumFractionDigits: 0,
    }).format(price) +
    " " +
    currency
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export function PropertyDetails({ property, ownerName }: PropertyDetailsProps) {
  const { locale, t } = useLocale();

  const title = property.title[locale] || property.title.en;
  const description = property.description[locale] || property.description.en;
  const address =
    property.location.address[locale] || property.location.address.en;
  const houseRules =
    property.policies.houseRules[locale] || property.policies.houseRules.en;
  const cancellationDesc =
    property.policies.cancellation?.description[locale] ||
    property.policies.cancellation?.description.en;

  const isBookable =
    property.category === "rent" || property.category === "activity";
  const isInquiry = property.category === "buy" || property.category === "shop";

  const totalFees = (property.pricing.fees ?? []).reduce(
    (sum, f) => sum + f.amount,
    0,
  );

  return (
    <div className="max-w-4xl">
      {/* ── Title & meta ── */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {title}
          </h1>
          <p className="mt-1 text-gray-500">{address}</p>
        </div>
        <div className="flex items-center gap-2">
          <StarIcon />
          <span className="font-semibold text-gray-900">
            {property.ratings.average.toFixed(1)}
          </span>
          <span className="text-gray-500 text-sm">
            ({property.ratings.count}{" "}
            {t("review.reviewCount").replace(
              "{{count}}",
              String(property.ratings.count),
            )}
            )
          </span>
        </div>
      </div>

      {/* Category + type badges */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Badge variant="info">{t(`categories.${property.category}`)}</Badge>
        <Badge variant="default">{t(`propertyType.${property.type}`)}</Badge>
        {property.specifications.beachView && (
          <Badge variant="success">{t("property.beachView")}</Badge>
        )}
      </div>

      <Divider />

      {/* ── Specifications ── */}
      <section aria-labelledby="specs-heading">
        <SectionHeading>{t("property.specifications")}</SectionHeading>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          <SpecItem
            icon={<SizeIcon />}
            label={t("property.size")}
            value={`${property.specifications.size} ${t("property.sqm")}`}
          />
          {property.specifications.rooms !== undefined && (
            <SpecItem
              icon={<BedIcon />}
              label={t("property.rooms")}
              value={String(property.specifications.rooms)}
            />
          )}
          {property.specifications.bathrooms !== undefined && (
            <SpecItem
              icon={<BathIcon />}
              label={t("property.bathrooms")}
              value={String(property.specifications.bathrooms)}
            />
          )}
          {property.specifications.maxGuests !== undefined && (
            <SpecItem
              icon={<GuestsIcon />}
              label={t("property.maxGuests")}
              value={String(property.specifications.maxGuests)}
            />
          )}
        </div>
      </section>

      <Divider />

      {/* ── Description ── */}
      <section aria-labelledby="desc-heading">
        <SectionHeading>{t("property.details")}</SectionHeading>
        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
          {description}
        </p>
      </section>

      <Divider />

      {/* ── Pricing ── */}
      <section aria-labelledby="pricing-heading">
        <SectionHeading>
          {property.category === "buy"
            ? t("property.totalPrice")
            : t("booking.priceBreakdown")}
        </SectionHeading>
        <div className="rounded-xl border border-gray-200 p-5 space-y-3 max-w-sm">
          <div className="flex justify-between text-gray-700">
            <span>{t("booking.basePrice")}</span>
            <span className="font-medium">
              {formatPrice(
                property.pricing.basePrice,
                property.pricing.currency,
              )}
              {property.pricing.priceType === "per_night" && (
                <span className="text-sm text-gray-500">
                  {" "}
                  /{t("property.perNight")}
                </span>
              )}
              {property.pricing.priceType === "per_month" && (
                <span className="text-sm text-gray-500">
                  {" "}
                  /{t("property.perMonth")}
                </span>
              )}
            </span>
          </div>
          {(property.pricing.fees ?? []).map((fee) => (
            <div
              key={fee.name}
              className="flex justify-between text-gray-600 text-sm"
            >
              <span>{fee.name}</span>
              <span>{formatPrice(fee.amount, property.pricing.currency)}</span>
            </div>
          ))}
          {totalFees > 0 && (
            <div className="flex justify-between font-semibold text-gray-900 border-t border-gray-200 pt-3">
              <span>{t("booking.total")}</span>
              <span>
                {formatPrice(
                  property.pricing.basePrice + totalFees,
                  property.pricing.currency,
                )}
              </span>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="mt-6">
          {isBookable && (
            <Link href={"/"}>
              {/* checkout/${property.id} */}
              <Button size="lg">{t("property.bookNow")}</Button>
            </Link>
          )}
          {isInquiry && (
            <Button size="lg" variant="outline">
              {t("property.inquire")}
            </Button>
          )}
        </div>
      </section>

      <Divider />

      {/* ── Amenities ── */}
      {property.amenities.length > 0 && (
        <>
          <section aria-labelledby="amenities-heading">
            <SectionHeading>{t("property.amenities")}</SectionHeading>
            <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3" role="list">
              {property.amenities.map((amenity) => (
                <li
                  key={amenity}
                  className="flex items-center gap-2 text-gray-700"
                >
                  <CheckIcon />
                  <span>{amenity}</span>
                </li>
              ))}
            </ul>
          </section>
          <Divider />
        </>
      )}

      {/* ── Floor Plans ── */}
      {property.floorPlans && property.floorPlans.length > 0 && (
        <>
          <section aria-labelledby="floorplans-heading">
            <SectionHeading>{t("property.floorPlans")}</SectionHeading>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {property.floorPlans.map((plan, i) => (
                <div
                  key={i}
                  className="relative aspect-[4/3] rounded-lg overflow-hidden border border-gray-200"
                >
                  <Image
                    src={plan}
                    alt={`Floor plan ${i + 1}`}
                    fill
                    loading="lazy"
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-contain bg-gray-50"
                  />
                </div>
              ))}
            </div>
          </section>
          <Divider />
        </>
      )}

      {/* ── Host / Owner ── */}
      {ownerName && (
        <>
          <section aria-labelledby="host-heading">
            <SectionHeading>Hosted by {ownerName}</SectionHeading>
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xl">
                {ownerName.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-medium text-gray-900">{ownerName}</p>
                <p className="text-sm text-gray-500">Property Owner</p>
              </div>
            </div>
          </section>
          <Divider />
        </>
      )}

      {/* ── Policies ── */}
      <section aria-labelledby="policies-heading">
        <SectionHeading>{t("property.policies")}</SectionHeading>
        <div className="space-y-6">
          {/* Cancellation */}
          {property.policies.cancellation && (
            <div>
              <h3 className="font-medium text-gray-900 mb-1">
                {t("property.cancellationPolicy")}
              </h3>
              <p className="text-gray-700 text-sm">{cancellationDesc}</p>
              {(property.policies.minStay || property.policies.maxStay) && (
                <p className="text-gray-500 text-sm mt-1">
                  {property.policies.minStay &&
                    `Min stay: ${property.policies.minStay} nights`}
                  {property.policies.minStay &&
                    property.policies.maxStay &&
                    " · "}
                  {property.policies.maxStay &&
                    `Max stay: ${property.policies.maxStay} nights`}
                </p>
              )}
            </div>
          )}

          {/* House rules */}
          <div>
            <h3 className="font-medium text-gray-900 mb-1">
              {t("property.houseRules")}
            </h3>
            <p className="text-gray-700 text-sm whitespace-pre-line">
              {houseRules}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
