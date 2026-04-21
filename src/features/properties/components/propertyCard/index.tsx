"use client";

import Image from "next/image";
import { Link } from "@/navigation";
import { useState } from "react";
import { useLocale } from "@/lib/contexts/LocaleContext";
import { Badge } from "@/components/ui/Badge";
import type { Property } from "@/lib/types";

export interface PropertyCardProps {
  property: Property;
  variant?: "grid" | "list";
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

function HeartIcon({
  filled,
  className,
}: {
  filled: boolean;
  className?: string;
}) {
  return filled ? (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
    </svg>
  ) : (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
      />
    </svg>
  );
}

function formatPrice(
  price: number,
  currency: string,
  priceType: Property["pricing"]["priceType"],
  t: (k: string) => string,
): string {
  const formatted = new Intl.NumberFormat("en-SA", {
    style: "decimal",
    maximumFractionDigits: 0,
  }).format(price);
  const currencyLabel = t(`currency.${currency}`) || currency;
  const suffix =
    priceType === "per_night"
      ? `/${t("property.perNight")}`
      : priceType === "per_month"
        ? `/${t("property.perMonth")}`
        : "";
  return `${formatted} ${currencyLabel}${suffix}`;
}

export function PropertyCard({
  property,
  variant = "grid",
}: PropertyCardProps) {
  const { locale, t } = useLocale();
  const [saved, setSaved] = useState(false);
  const propertyHref = `/properties/${property.id}`;

  const title = property.title[locale] || property.title.en;
  const address = property.location.address[locale] || property.location.address.en;
  const image = property.images[0];
  const priceStr = formatPrice(
    property.pricing.basePrice,
    property.pricing.currency,
    property.pricing.priceType,
    t,
  );
  const categoryLabel = t(`categories.${property.category}`);

  if (variant === "list") {
    return (
      <article className="group flex overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
        <Link href={propertyHref} className="relative w-48 shrink-0 sm:w-64" tabIndex={-1} aria-hidden="true">
          <div className="relative h-full min-h-[160px] overflow-hidden bg-gray-100">
            {image ? (
              <Image
                src={image.url}
                alt={image.alt || title}
                fill
                sizes="(max-width: 640px) 192px, 256px"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : null}
          </div>
        </Link>

        <div className="flex flex-1 flex-col justify-between p-4">
          <div>
            <div className="mb-1 flex items-start justify-between gap-2">
              <Link
                href={propertyHref}
                className="flex-1 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1"
              >
                <h3 className="line-clamp-2 font-semibold text-gray-900 transition-colors hover:text-blue-600">
                  {title}
                </h3>
              </Link>
              <button
                type="button"
                onClick={() => setSaved((v) => !v)}
                aria-label={t("property.saveProperty")}
                aria-pressed={saved}
                className="shrink-0 rounded-full p-1 text-gray-400 transition-colors hover:text-red-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <HeartIcon filled={saved} className="h-5 w-5" />
              </button>
            </div>
            <p className="line-clamp-1 text-sm text-gray-500">{address}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <Badge variant="info" size="sm">
                {categoryLabel}
              </Badge>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <StarIcon className="h-4 w-4 text-yellow-400" />
              <span className="font-medium">{property.ratings.average.toFixed(1)}</span>
            </div>
            <p className="font-semibold text-gray-900">{priceStr}</p>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <Link href={propertyHref} className="relative block overflow-hidden" tabIndex={-1} aria-hidden="true">
        <div className="relative aspect-[4/3] bg-gray-100">
          {image ? (
            <Image
              src={image.url}
              alt={image.alt || title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : null}
          <div className="absolute left-3 top-3">
            <Badge variant="info" size="sm">
              {categoryLabel}
            </Badge>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setSaved((v) => !v);
            }}
            aria-label={t("property.saveProperty")}
            aria-pressed={saved}
            className="absolute right-3 top-3 rounded-full bg-white/90 p-1.5 text-gray-500 shadow-sm transition-colors hover:text-red-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <HeartIcon filled={saved} className="h-4 w-4" />
          </button>
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <Link
          href={propertyHref}
          className="rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1"
        >
          <h3 className="line-clamp-2 font-semibold text-gray-900 transition-colors hover:text-blue-600">
            {title}
          </h3>
        </Link>
        <p className="mt-1 line-clamp-1 text-sm text-gray-500">{address}</p>
        <div className="mt-auto pt-3 text-sm font-semibold text-gray-900">{priceStr}</div>
      </div>
    </article>
  );
}
