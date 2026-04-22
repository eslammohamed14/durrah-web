"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale } from "@/lib/contexts/LocaleContext";
import { SearchFilters } from "../SearchFilters/SearchFilters";
import { Spinner } from "@/components/ui/Spinner";
import { getAPIClient } from "@/lib/api";
import type { Property, SearchFilters as SearchFiltersType } from "@/lib/types";
import { PropertyCard } from "@/features/properties/components/propertyCard";

const PAGE_SIZE = 12;

function parseFiltersFromParams(params: URLSearchParams): SearchFiltersType {
  const category = params.get("category") as
    | SearchFiltersType["category"]
    | null;
  const types = params.getAll("type") as SearchFiltersType["type"];
  const location = params.get("location") ?? undefined;
  const rooms = params.get("rooms") ? Number(params.get("rooms")) : undefined;
  const beachView = params.get("beachView") === "true" ? true : undefined;
  const priceMin = params.get("priceMin")
    ? Number(params.get("priceMin"))
    : undefined;
  const priceMax = params.get("priceMax")
    ? Number(params.get("priceMax"))
    : undefined;
  const amenities = params.getAll("amenity");
  const sortBy =
    (params.get("sortBy") as SearchFiltersType["sortBy"]) ?? undefined;

  return {
    ...(category && { category }),
    ...(types?.length && { type: types }),
    ...(location && { location }),
    ...(rooms !== undefined && { rooms }),
    ...(beachView !== undefined && { beachView }),
    ...(priceMin !== undefined || priceMax !== undefined
      ? { priceRange: { min: priceMin ?? 0, max: priceMax ?? 100000 } }
      : {}),
    ...(amenities.length && { amenities }),
    ...(sortBy && { sortBy }),
  };
}

interface SearchResultsProps {
  /** Initial properties fetched server-side */
  initialProperties: Property[];
}

export function 
SearchResults({ initialProperties }: SearchResultsProps) {
  const { t } = useLocale();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [properties, setProperties] = useState<Property[]>(initialProperties);
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Track the last fetched params string to avoid duplicate fetches
  const lastParamsRef = useRef(searchParams.toString());

  const fetchResults = useCallback((filters: SearchFiltersType) => {
    startTransition(async () => {
      try {
        const api = getAPIClient();
        const results = await api.searchProperties(filters);
        setProperties(results);
        setPage(1);
      } catch {
        // Keep previous results on error
      }
    });
  }, []);

  // Re-fetch when URL search params change (e.g. from SearchBar or filter updates)
  useEffect(() => {
    const paramsStr = searchParams.toString();
    if (paramsStr === lastParamsRef.current) return;
    lastParamsRef.current = paramsStr;

    const filters = parseFiltersFromParams(searchParams);
    fetchResults(filters);
  }, [searchParams, fetchResults]);

  const visibleProperties = properties.slice(0, page * PAGE_SIZE);
  const hasMore = visibleProperties.length < properties.length;

  return (
    <div className="flex min-h-screen flex-col">
      {/* Mobile filter toggle */}
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 lg:hidden">
        <p className="text-sm text-gray-600">
          {t("search.results", { count: properties.length })}
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

      <div className="mx-auto w-full max-w-screen-xl px-4 py-6 sm:px-6 lg:px-8 2xl:max-w-screen-2xl">
        <div className="flex gap-8">
          {/* Sidebar filters — desktop */}
          <aside className="hidden w-64 shrink-0 lg:block">
            <div className="sticky top-24 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <SearchFilters />
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
                <SearchFilters onClose={() => setFiltersOpen(false)} />
              </div>
            </div>
          )}

          {/* Results */}
          <main
            className="min-w-0 flex-1"
            id="search-results"
            aria-live="polite"
            aria-busy={isPending}
          >
            {/* Result count + loading indicator */}
            <div className="mb-5 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                {isPending ? (
                  <span className="flex items-center gap-2">
                    <Spinner size="sm" />
                    {t("common.loading")}
                  </span>
                ) : (
                  t("search.results", { count: properties.length })
                )}
              </p>
            </div>

            {/* Grid */}
            {!isPending && properties.length === 0 ? (
              <EmptyState t={t} />
            ) : (
              <>
                <div
                  className={[
                    "grid gap-5 transition-opacity duration-200",
                    "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3",
                    isPending ? "opacity-50" : "opacity-100",
                  ].join(" ")}
                >
                  {visibleProperties.map((property) => (
                    <PropertyCard
                      key={property.id}
                      property={property}
                      variant="grid"
                    />
                  ))}
                </div>

                {/* Load more */}
                {hasMore && (
                  <div className="mt-10 flex justify-center">
                    <button
                      type="button"
                      onClick={() => setPage((p) => p + 1)}
                      className="rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    >
                      {t("common.view")}{" "}
                      {Math.min(
                        PAGE_SIZE,
                        properties.length - visibleProperties.length,
                      )}{" "}
                      {t("common.next").toLowerCase()}
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

function EmptyState({
  t,
}: {
  t: (key: string, params?: Record<string, string | number>) => string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-4 rounded-full bg-gray-100 p-5">
        <SearchIcon className="h-10 w-10 text-gray-400" />
      </div>
      <h3 className="mb-1 text-lg font-semibold text-gray-900">
        {t("search.noResults")}
      </h3>
      <p className="text-sm text-gray-500">{t("search.noResultsHint")}</p>
    </div>
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

function SearchIcon({ className }: { className?: string }) {
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
        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
      />
    </svg>
  );
}
