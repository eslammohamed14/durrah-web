"use client";

/**
 * ShopsContent — client component for the shops listing page.
 * Displays shop cards with photos, specifications, lease terms, amenities.
 * Filters by size, location, price, category.
 * Requirements: 27.1, 27.2, 27.3, 27.5
 */

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import { getAPIClient } from "@/lib/api";
import type { Property, SearchFilters } from "@/lib/types";

// ─── Shop Card ─────────────────────────────────────────────────────────────

interface ShopCardProps {
  shop: Property;
}

function ShopCard({ shop }: ShopCardProps) {
  const t = useTranslations();
  const locale = useLocale() as "en" | "ar";

  const title = shop.title[locale] || shop.title.en;
  const description = shop.description[locale] || shop.description.en;
  const image = shop.images[0];
  const address = shop.location.address[locale] || shop.location.address.en;

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-lg">
      {/* Image */}
      <Link
        href={`/${locale}/shops/${shop.id}`}
        className="relative block"
        tabIndex={-1}
        aria-hidden="true"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
          {image ? (
            <Image
              src={image.url}
              alt={image.alt || title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-gray-300">
              <ShopIcon className="h-16 w-16" />
            </div>
          )}
          {/* Price overlay */}
          <div className="absolute bottom-3 end-3">
            <span className="rounded-full bg-white/95 px-3 py-1 text-sm font-semibold text-gray-900 shadow-sm">
              {new Intl.NumberFormat("en-SA").format(shop.pricing.basePrice)}{" "}
              <span className="font-normal text-gray-500">
                {shop.pricing.currency}
              </span>
              <span className="font-normal text-gray-400">
                {" "}
                /{t("shops.perMonth")}
              </span>
            </span>
          </div>
          <div className="absolute start-3 top-3">
            <Badge variant="warning" size="sm">
              {t("categories.shop")}
            </Badge>
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <Link
          href={`/${locale}/shops/${shop.id}`}
          className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 rounded"
        >
          <h3 className="font-semibold text-gray-900 line-clamp-2 hover:text-blue-600 transition-colors">
            {title}
          </h3>
        </Link>

        <p className="mt-1.5 text-sm text-gray-500 line-clamp-2">
          {description}
        </p>

        {/* Specs row */}
        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-gray-600">
          {shop.specifications.size && (
            <span className="flex items-center gap-1">
              <SizeIcon className="h-4 w-4 text-gray-400" />
              {shop.specifications.size} {t("shops.sqm")}
            </span>
          )}
          {shop.specifications.rooms && (
            <span className="flex items-center gap-1">
              <RoomsIcon className="h-4 w-4 text-gray-400" />
              {shop.specifications.rooms} {t("property.rooms")}
            </span>
          )}
        </div>

        <p className="mt-2 flex items-center gap-1 text-sm text-gray-500">
          <LocationIcon className="h-4 w-4 shrink-0 text-gray-400" />
          <span className="line-clamp-1">{address}</span>
        </p>

        {/* Amenity highlights */}
        {shop.amenities.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {shop.amenities.slice(0, 3).map((amenity) => (
              <span
                key={amenity}
                className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-600"
              >
                {t(`amenity.${amenity}`) || amenity}
              </span>
            ))}
            {shop.amenities.length > 3 && (
              <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-500">
                +{shop.amenities.length - 3}
              </span>
            )}
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-gray-100">
          <Link
            href={`/${locale}/shops/${shop.id}`}
            className="inline-flex w-full items-center justify-center rounded-lg border border-blue-600 px-4 py-2.5 text-sm font-semibold text-blue-600 transition-colors hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          >
            {t("shops.inquireNow")}
          </Link>
        </div>
      </div>
    </article>
  );
}

// ─── Filters ───────────────────────────────────────────────────────────────

interface FiltersState {
  location: string;
  priceMin: string;
  priceMax: string;
  sizeMin: string;
  sizeMax: string;
}

interface ShopFiltersProps {
  filters: FiltersState;
  onChange: (f: FiltersState) => void;
}

function ShopFilters({ filters, onChange }: ShopFiltersProps) {
  const t = useTranslations();

  return (
    <div className="space-y-5">
      <h2 className="font-semibold text-gray-900">{t("shops.filterTitle")}</h2>

      {/* Location */}
      <div>
        <label
          htmlFor="shop-location"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          {t("shops.filterLocation")}
        </label>
        <input
          id="shop-location"
          type="text"
          value={filters.location}
          onChange={(e) => onChange({ ...filters, location: e.target.value })}
          placeholder={t("search.location")}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Price range */}
      <div>
        <p className="mb-1.5 text-sm font-medium text-gray-700">
          {t("shops.filterPrice")}
        </p>
        <div className="flex gap-2">
          <input
            type="number"
            value={filters.priceMin}
            onChange={(e) => onChange({ ...filters, priceMin: e.target.value })}
            placeholder="Min"
            min={0}
            className="w-1/2 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Minimum price"
          />
          <input
            type="number"
            value={filters.priceMax}
            onChange={(e) => onChange({ ...filters, priceMax: e.target.value })}
            placeholder="Max"
            min={0}
            className="w-1/2 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Maximum price"
          />
        </div>
      </div>

      {/* Size range */}
      <div>
        <p className="mb-1.5 text-sm font-medium text-gray-700">
          {t("shops.filterSize")}
        </p>
        <div className="flex gap-2">
          <input
            type="number"
            value={filters.sizeMin}
            onChange={(e) => onChange({ ...filters, sizeMin: e.target.value })}
            placeholder="Min"
            min={0}
            className="w-1/2 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Minimum size"
          />
          <input
            type="number"
            value={filters.sizeMax}
            onChange={(e) => onChange({ ...filters, sizeMax: e.target.value })}
            placeholder="Max"
            min={0}
            className="w-1/2 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Maximum size"
          />
        </div>
      </div>

      {/* Clear */}
      <button
        type="button"
        onClick={() =>
          onChange({
            location: "",
            priceMin: "",
            priceMax: "",
            sizeMin: "",
            sizeMax: "",
          })
        }
        className="text-sm text-blue-600 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
      >
        {t("common.clear")} {t("search.filters").toLowerCase()}
      </button>
    </div>
  );
}

// ─── Main Content ──────────────────────────────────────────────────────────

interface ShopsContentProps {
  initialShops: Property[];
}

export function ShopsContent({ initialShops }: ShopsContentProps) {
  const t = useTranslations();
  const [shops, setShops] = useState<Property[]>(initialShops);
  const [isPending, startTransition] = useTransition();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<FiltersState>({
    location: "",
    priceMin: "",
    priceMax: "",
    sizeMin: "",
    sizeMax: "",
  });

  function handleFilterChange(newFilters: FiltersState) {
    setFilters(newFilters);
    const searchFilters: SearchFilters = {
      category: "shop",
      ...(newFilters.location && { location: newFilters.location }),
      ...(newFilters.priceMin || newFilters.priceMax
        ? {
            priceRange: {
              min: Number(newFilters.priceMin) || 0,
              max: Number(newFilters.priceMax) || 999999,
            },
          }
        : {}),
    };

    startTransition(async () => {
      try {
        const api = getAPIClient();
        const results = await api.searchProperties(searchFilters);
        // Client-side size filtering (API doesn't support it directly)
        const sizeMin = Number(newFilters.sizeMin) || 0;
        const sizeMax = Number(newFilters.sizeMax) || Infinity;
        const filtered = results.filter((p) => {
          const size = p.specifications.size ?? 0;
          return size >= sizeMin && size <= sizeMax;
        });
        setShops(filtered);
      } catch {
        // keep previous results
      }
    });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page header */}
      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {t("shops.pageTitle")}
          </h1>
          <p className="mt-2 text-gray-600">{t("shops.pageDescription")}</p>
        </div>
      </div>

      {/* Mobile filter toggle */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 lg:hidden">
        <p className="text-sm text-gray-600">
          {isPending ? (
            <span className="flex items-center gap-2">
              <Spinner size="sm" />
              {t("common.loading")}
            </span>
          ) : (
            t("search.results").replace("{{count}}", String(shops.length))
          )}
        </p>
        <button
          type="button"
          onClick={() => setFiltersOpen(true)}
          className="flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <FilterIcon className="h-4 w-4" />
          {t("search.filters")}
        </button>
      </div>

      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex gap-8">
          {/* Sidebar filters — desktop */}
          <aside className="hidden w-64 shrink-0 lg:block">
            <div className="sticky top-24 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <ShopFilters filters={filters} onChange={handleFilterChange} />
            </div>
          </aside>

          {/* Mobile filter drawer */}
          {filtersOpen && (
            <div
              className="fixed inset-0 z-50 lg:hidden"
              role="dialog"
              aria-modal="true"
              aria-label={t("search.filters")}
            >
              <div
                className="absolute inset-0 bg-black/40"
                onClick={() => setFiltersOpen(false)}
                aria-hidden="true"
              />
              <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-white p-5 shadow-xl">
                <div className="mb-4 flex items-center justify-between">
                  <span className="font-semibold text-gray-900">
                    {t("search.filters")}
                  </span>
                  <button
                    type="button"
                    onClick={() => setFiltersOpen(false)}
                    aria-label={t("common.close")}
                    className="rounded-full p-1 text-gray-500 hover:bg-gray-100"
                  >
                    <CloseIcon className="h-5 w-5" />
                  </button>
                </div>
                <ShopFilters
                  filters={filters}
                  onChange={(f) => {
                    handleFilterChange(f);
                    setFiltersOpen(false);
                  }}
                />
              </div>
            </div>
          )}

          {/* Results */}
          <main
            className="min-w-0 flex-1"
            aria-live="polite"
            aria-busy={isPending}
          >
            <div className="mb-5 hidden items-center lg:flex">
              <p className="text-sm text-gray-600">
                {isPending ? (
                  <span className="flex items-center gap-2">
                    <Spinner size="sm" />
                    {t("common.loading")}
                  </span>
                ) : (
                  t("search.results").replace("{{count}}", String(shops.length))
                )}
              </p>
            </div>

            {!isPending && shops.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="mb-4 rounded-full bg-gray-100 p-5">
                  <ShopIcon className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="mb-1 text-lg font-semibold text-gray-900">
                  {t("shops.noShops")}
                </h3>
                <p className="text-sm text-gray-500">
                  {t("shops.noShopsHint")}
                </p>
              </div>
            ) : (
              <div
                className={[
                  "grid gap-6 transition-opacity duration-200",
                  "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3",
                  isPending ? "opacity-50" : "opacity-100",
                ].join(" ")}
              >
                {shops.map((shop) => (
                  <ShopCard key={shop.id} shop={shop} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

// ─── Icons ─────────────────────────────────────────────────────────────────

function ShopIcon({ className }: { className?: string }) {
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
        d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z"
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

function SizeIcon({ className }: { className?: string }) {
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
        d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
      />
    </svg>
  );
}

function RoomsIcon({ className }: { className?: string }) {
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
        d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z"
      />
    </svg>
  );
}

function FilterIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z"
      />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
}
