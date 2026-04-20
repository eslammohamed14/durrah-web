"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/lib/navigation";
import { useLocale } from "@/lib/contexts/LocaleContext";
import { Button } from "@/components/ui/Button";
import type {
  PropertyCategory,
  PropertyType,
  SearchFilters,
} from "@/lib/types";

// ─── Constants ────────────────────────────────────────────────────────────────

const PROPERTY_TYPES: PropertyType[] = [
  "apartment",
  "villa",
  "townhouse",
  "shop",
  "activity_venue",
];

const AMENITIES_LIST = [
  "wifi",
  "parking",
  "pool",
  "gym",
  "air_conditioning",
  "kitchen",
  "washer",
  "balcony",
  "sea_view",
  "elevator",
];

const SORT_OPTIONS: { value: SearchFilters["sortBy"]; labelKey: string }[] = [
  { value: "price_asc", labelKey: "search.sortPrice_asc" },
  { value: "price_desc", labelKey: "search.sortPrice_desc" },
  { value: "rating", labelKey: "search.sortRating" },
  { value: "newest", labelKey: "search.sortNewest" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseFiltersFromParams(params: URLSearchParams): SearchFilters {
  const category = params.get("category") as PropertyCategory | null;
  const types = params.getAll("type") as PropertyType[];
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
  const sortBy = (params.get("sortBy") as SearchFilters["sortBy"]) ?? undefined;

  return {
    ...(category && { category }),
    ...(types.length && { type: types }),
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

export function buildSearchParams(filters: SearchFilters): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.category) params.set("category", filters.category);
  if (filters.type?.length)
    filters.type.forEach((t) => params.append("type", t));
  if (filters.location) params.set("location", filters.location);
  if (filters.rooms !== undefined) params.set("rooms", String(filters.rooms));
  if (filters.beachView) params.set("beachView", "true");
  if (filters.priceRange) {
    params.set("priceMin", String(filters.priceRange.min));
    params.set("priceMax", String(filters.priceRange.max));
  }
  if (filters.amenities?.length)
    filters.amenities.forEach((a) => params.append("amenity", a));
  if (filters.sortBy) params.set("sortBy", filters.sortBy);
  return params;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-gray-200 py-4 last:border-0">
      <h3 className="mb-3 text-sm font-semibold text-gray-900">{title}</h3>
      {children}
    </div>
  );
}

function PriceRangeSlider({
  min,
  max,
  value,
  onChange,
}: {
  min: number;
  max: number;
  value: { min: number; max: number };
  onChange: (v: { min: number; max: number }) => void;
}) {
  const { t } = useLocale();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>
          {value.min.toLocaleString()} {t("currency.SAR")}
        </span>
        <span>
          {value.max.toLocaleString()} {t("currency.SAR")}
        </span>
      </div>
      <div className="relative h-2">
        <div className="absolute inset-0 rounded-full bg-gray-200" />
        <div
          className="absolute h-2 rounded-full bg-blue-500"
          style={{
            left: `${((value.min - min) / (max - min)) * 100}%`,
            right: `${100 - ((value.max - min) / (max - min)) * 100}%`,
          }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={500}
          value={value.min}
          onChange={(e) => {
            const v = Number(e.target.value);
            if (v < value.max) onChange({ ...value, min: v });
          }}
          aria-label="Minimum price"
          className="absolute inset-0 h-2 w-full cursor-pointer appearance-none bg-transparent [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:shadow"
        />
        <input
          type="range"
          min={min}
          max={max}
          step={500}
          value={value.max}
          onChange={(e) => {
            const v = Number(e.target.value);
            if (v > value.min) onChange({ ...value, max: v });
          }}
          aria-label="Maximum price"
          className="absolute inset-0 h-2 w-full cursor-pointer appearance-none bg-transparent [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:shadow"
        />
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface SearchFiltersProps {
  /** Called whenever filters change — parent should re-fetch results */
  onFiltersChange?: (filters: SearchFilters) => void;
  /** Whether to show the mobile drawer close button */
  onClose?: () => void;
}

export function SearchFilters({
  onFiltersChange,
  onClose,
}: SearchFiltersProps) {
  const { t } = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<SearchFilters>(() =>
    parseFiltersFromParams(searchParams),
  );

  // Debounce URL updates to avoid excessive navigation
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const applyFilters = useCallback(
    (next: SearchFilters) => {
      setFilters(next);
      onFiltersChange?.(next);

      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        const params = buildSearchParams(next);
        router.push(`/search?${params.toString()}`, { scroll: false });
      }, 300);
    },
    [router, onFiltersChange],
  );

  // Sync when URL changes externally (e.g. SearchBar navigation)
  useEffect(() => {
    const next = parseFiltersFromParams(searchParams);
    setFilters(next);
    onFiltersChange?.(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  function toggleType(type: PropertyType) {
    const current = filters.type ?? [];
    const next = current.includes(type)
      ? current.filter((t) => t !== type)
      : [...current, type];
    applyFilters({ ...filters, type: next.length ? next : undefined });
  }

  function toggleAmenity(amenity: string) {
    const current = filters.amenities ?? [];
    const next = current.includes(amenity)
      ? current.filter((a) => a !== amenity)
      : [...current, amenity];
    applyFilters({ ...filters, amenities: next.length ? next : undefined });
  }

  function clearAll() {
    const cleared: SearchFilters = { category: filters.category };
    applyFilters(cleared);
  }

  const hasActiveFilters = Boolean(
    filters.type?.length ||
    filters.location ||
    filters.rooms !== undefined ||
    filters.beachView ||
    filters.priceRange ||
    filters.amenities?.length,
  );

  return (
    <aside aria-label={t("search.filters")} className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-4">
        <h2 className="text-base font-semibold text-gray-900">
          {t("search.filters")}
        </h2>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearAll}
              className="text-sm text-blue-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
            >
              {t("common.clear")}
            </button>
          )}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label={t("common.close")}
              className="rounded-full p-1 text-gray-500 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 lg:hidden"
            >
              <XIcon className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* Sort */}
      <FilterSection title={t("search.sortBy")}>
        <select
          value={filters.sortBy ?? ""}
          onChange={(e) =>
            applyFilters({
              ...filters,
              sortBy: (e.target.value as SearchFilters["sortBy"]) || undefined,
            })
          }
          aria-label={t("search.sortBy")}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">{t("search.sortNewest")}</option>
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value ?? ""}>
              {t(opt.labelKey)}
            </option>
          ))}
        </select>
      </FilterSection>

      {/* Property Type */}
      <FilterSection title={t("search.propertyType")}>
        <div className="flex flex-wrap gap-2">
          {PROPERTY_TYPES.map((type) => {
            const selected = filters.type?.includes(type) ?? false;
            return (
              <button
                key={type}
                type="button"
                onClick={() => toggleType(type)}
                aria-pressed={selected}
                className={[
                  "rounded-full border px-3 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                  selected
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-gray-300 bg-white text-gray-700 hover:border-gray-400",
                ].join(" ")}
              >
                {t(`propertyType.${type}`)}
              </button>
            );
          })}
        </div>
      </FilterSection>

      {/* Price Range */}
      <FilterSection title={t("search.priceRange")}>
        <PriceRangeSlider
          min={0}
          max={100000}
          value={filters.priceRange ?? { min: 0, max: 100000 }}
          onChange={(v) => applyFilters({ ...filters, priceRange: v })}
        />
      </FilterSection>

      {/* Location */}
      <FilterSection title={t("search.location")}>
        <input
          type="text"
          value={filters.location ?? ""}
          onChange={(e) =>
            applyFilters({ ...filters, location: e.target.value || undefined })
          }
          placeholder={t("home.searchPlaceholder")}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </FilterSection>

      {/* Rooms — only relevant for rent/buy */}
      {(!filters.category ||
        filters.category === "rent" ||
        filters.category === "buy") && (
        <FilterSection title={t("search.rooms")}>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() =>
                  applyFilters({
                    ...filters,
                    rooms: filters.rooms === n ? undefined : n,
                  })
                }
                aria-pressed={filters.rooms === n}
                className={[
                  "flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                  filters.rooms === n
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-gray-300 bg-white text-gray-700 hover:border-gray-400",
                ].join(" ")}
              >
                {n === 5 ? "5+" : n}
              </button>
            ))}
          </div>
        </FilterSection>
      )}

      {/* Beach View — only relevant for rent/buy */}
      {(!filters.category ||
        filters.category === "rent" ||
        filters.category === "buy") && (
        <FilterSection title={t("search.beachView")}>
          <label className="flex cursor-pointer items-center gap-3">
            <div className="relative">
              <input
                type="checkbox"
                checked={filters.beachView ?? false}
                onChange={(e) =>
                  applyFilters({
                    ...filters,
                    beachView: e.target.checked || undefined,
                  })
                }
                className="sr-only"
              />
              <div
                className={[
                  "h-5 w-9 rounded-full transition-colors",
                  filters.beachView ? "bg-blue-600" : "bg-gray-300",
                ].join(" ")}
              />
              <div
                className={[
                  "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform",
                  filters.beachView ? "translate-x-4" : "translate-x-0.5",
                ].join(" ")}
              />
            </div>
            <span className="text-sm text-gray-700">
              {t("property.beachView")}
            </span>
          </label>
        </FilterSection>
      )}

      {/* Amenities */}
      <FilterSection title={t("search.amenities")}>
        <div className="space-y-2">
          {AMENITIES_LIST.map((amenity) => {
            const checked = filters.amenities?.includes(amenity) ?? false;
            return (
              <label
                key={amenity}
                className="flex cursor-pointer items-center gap-2.5"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleAmenity(amenity)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">
                  {t(`amenity.${amenity}`)}
                </span>
              </label>
            );
          })}
        </div>
      </FilterSection>

      {/* Apply button — visible on mobile */}
      {onClose && (
        <div className="pt-4 lg:hidden">
          <Button onClick={onClose} className="w-full">
            {t("common.apply")}
          </Button>
        </div>
      )}
    </aside>
  );
}

function XIcon({ className }: { className?: string }) {
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
