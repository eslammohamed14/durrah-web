"use client";

/**
 * ActivitiesContent — client component for the activities listing page.
 * Handles filtering, display of activity cards with photos, descriptions, pricing,
 * duration, and schedule information.
 * Requirements: 26.1, 26.2, 26.3
 */

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/navigation";
import { useLocale } from "next-intl";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import { getAPIClient } from "@/lib/api";
import type { Property, SearchFilters } from "@/lib/types";

// ─── Activity Card ─────────────────────────────────────────────────────────

interface ActivityCardProps {
  activity: Property;
}

function ActivityCard({ activity }: ActivityCardProps) {
  const t = useTranslations();
  const locale = useLocale() as "en" | "ar";

  const title = activity.title[locale] || activity.title.en;
  const description = activity.description[locale] || activity.description.en;
  const image = activity.images[0];
  const address =
    activity.location.address[locale] || activity.location.address.en;

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-lg">
      {/* Image */}
      <Link
        href={`/${locale}/activities/${activity.id}`}
        className="relative block"
        tabIndex={-1}
        aria-hidden="true"
      >
        <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
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
              <ActivityIcon className="h-16 w-16" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          {/* Price badge */}
          <div className="absolute bottom-3 end-3">
            <span className="rounded-full bg-white/95 px-3 py-1 text-sm font-semibold text-gray-900 shadow-sm">
              {new Intl.NumberFormat("en-SA").format(
                activity.pricing.basePrice,
              )}{" "}
              <span className="font-normal text-gray-500">
                {activity.pricing.currency}
              </span>
            </span>
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <Link
          href={`/${locale}/activities/${activity.id}`}
          className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 rounded"
        >
          <h3 className="font-semibold text-gray-900 line-clamp-2 hover:text-blue-600 transition-colors">
            {title}
          </h3>
        </Link>

        <p className="mt-1.5 text-sm text-gray-500 line-clamp-2">
          {description}
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          <Badge variant="info" size="sm">
            {t("categories.activity")}
          </Badge>
          {activity.specifications.maxGuests && (
            <Badge variant="default" size="sm">
              <PeopleIcon className="me-1 h-3 w-3 inline" />
              {t("property.maxGuests")}: {activity.specifications.maxGuests}
            </Badge>
          )}
        </div>

        <p className="mt-2 flex items-center gap-1 text-sm text-gray-500">
          <LocationIcon className="h-4 w-4 shrink-0 text-gray-400" />
          <span className="line-clamp-1">{address}</span>
        </p>

        {/* Rating */}
        {activity.ratings.count > 0 && (
          <div className="mt-2 flex items-center gap-1 text-sm">
            <StarIcon className="h-4 w-4 text-yellow-400" />
            <span className="font-medium text-gray-900">
              {activity.ratings.average.toFixed(1)}
            </span>
            <span className="text-gray-400">({activity.ratings.count})</span>
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-gray-100">
          <Link
            href={`/${locale}/activities/${activity.id}`}
            className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          >
            {t("activities.bookNow")}
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
}

interface ActivityFiltersProps {
  filters: FiltersState;
  onChange: (f: FiltersState) => void;
}

function ActivityFilters({ filters, onChange }: ActivityFiltersProps) {
  const t = useTranslations();

  return (
    <div className="space-y-5">
      <h2 className="font-semibold text-gray-900">
        {t("activities.filterTitle")}
      </h2>

      {/* Location */}
      <div>
        <label
          htmlFor="act-location"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          {t("activities.filterLocation")}
        </label>
        <input
          id="act-location"
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
          {t("activities.filterPrice")}
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

      {/* Clear */}
      <button
        type="button"
        onClick={() => onChange({ location: "", priceMin: "", priceMax: "" })}
        className="text-sm text-blue-600 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
      >
        {t("common.clear")} {t("search.filters").toLowerCase()}
      </button>
    </div>
  );
}

// ─── Main Content ──────────────────────────────────────────────────────────

interface ActivitiesContentProps {
  initialActivities: Property[];
}

export function ActivitiesContent({
  initialActivities,
}: ActivitiesContentProps) {
  const t = useTranslations();
  const [activities, setActivities] = useState<Property[]>(initialActivities);
  const [isPending, startTransition] = useTransition();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<FiltersState>({
    location: "",
    priceMin: "",
    priceMax: "",
  });

  function handleFilterChange(newFilters: FiltersState) {
    setFilters(newFilters);
    const searchFilters: SearchFilters = {
      category: "activity",
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
        setActivities(results);
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
            {t("activities.pageTitle")}
          </h1>
          <p className="mt-2 text-gray-600">
            {t("activities.pageDescription")}
          </p>
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
            t("search.results").replace("{{count}}", String(activities.length))
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
              <ActivityFilters
                filters={filters}
                onChange={handleFilterChange}
              />
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
                <ActivityFilters
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
                  t("search.results").replace(
                    "{{count}}",
                    String(activities.length),
                  )
                )}
              </p>
            </div>

            {!isPending && activities.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="mb-4 rounded-full bg-gray-100 p-5">
                  <ActivityIcon className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="mb-1 text-lg font-semibold text-gray-900">
                  {t("activities.noActivities")}
                </h3>
                <p className="text-sm text-gray-500">
                  {t("activities.noActivitiesHint")}
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
                {activities.map((activity) => (
                  <ActivityCard key={activity.id} activity={activity} />
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

function ActivityIcon({ className }: { className?: string }) {
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
        d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
      />
    </svg>
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

function PeopleIcon({ className }: { className?: string }) {
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
        d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
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
