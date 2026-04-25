import type { ReadonlyURLSearchParams } from "next/navigation";
import type { Property, PropertyType } from "@/lib/types";

export type CheckboxFilterMap = Record<string, boolean>;
export type NumericRange = { min: number; max: number };

/** URL query keys for trial search checkbox filters (comma-separated values). */
export const TRIAL_FILTER_SEARCH_KEYS = {
  unitTypes: "unitTypes",
  amenities: "amenities",
  furnishing: "furnishing",
  priceMin: "priceMin",
  priceMax: "priceMax",
  landMin: "landMin",
  landMax: "landMax",
  rooms: "rooms",
  bathrooms: "bathrooms",
} as const;

export type TrialFilterSearchKey =
  (typeof TRIAL_FILTER_SEARCH_KEYS)[keyof typeof TRIAL_FILTER_SEARCH_KEYS];

export type SearchTrialFilters = {
  unitTypes: CheckboxFilterMap;
  amenities: CheckboxFilterMap;
  furnishing: CheckboxFilterMap;
  priceRange?: NumericRange;
  landRange?: NumericRange;
  rooms?: number;
  bathrooms?: number;
};

function clampRange(range: NumericRange, limits: NumericRange): NumericRange {
  const min = Math.max(limits.min, Math.min(range.min, limits.max));
  const max = Math.max(limits.min, Math.min(range.max, limits.max));

  return min <= max ? { min, max } : { min: max, max };
}

function parseNumericRangeParam(
  searchParams: ReadonlyURLSearchParams | URLSearchParams,
  minKey: string,
  maxKey: string,
  limits: NumericRange,
): NumericRange | undefined {
  const rawMin = searchParams.get(minKey);
  const rawMax = searchParams.get(maxKey);

  if (!rawMin && !rawMax) {
    return undefined;
  }

  const parsedMin = Number(rawMin);
  const parsedMax = Number(rawMax);

  return clampRange(
    {
      min: Number.isFinite(parsedMin) ? parsedMin : limits.min,
      max: Number.isFinite(parsedMax) ? parsedMax : limits.max,
    },
    limits,
  );
}

function parsePositiveIntParam(
  searchParams: ReadonlyURLSearchParams | URLSearchParams,
  key: string,
): number | undefined {
  const raw = searchParams.get(key);
  if (raw == null || raw === "") return undefined;
  const n = Number(raw);
  if (!Number.isFinite(n) || !Number.isInteger(n) || n < 0) return undefined;
  return n;
}

export function parseCommaSeparatedParam(
  searchParams: ReadonlyURLSearchParams | URLSearchParams,
  key: string,
): string[] {
  const raw = searchParams.get(key);
  if (!raw) return [];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function trialFiltersFromSearchParams(
  searchParams: ReadonlyURLSearchParams | URLSearchParams,
): SearchTrialFilters {
  const toMap = (paramKey: string): CheckboxFilterMap => {
    const values = parseCommaSeparatedParam(searchParams, paramKey);
    return Object.fromEntries(values.map((v) => [v, true] as const));
  };
  return {
    unitTypes: toMap(TRIAL_FILTER_SEARCH_KEYS.unitTypes),
    amenities: toMap(TRIAL_FILTER_SEARCH_KEYS.amenities),
    furnishing: toMap(TRIAL_FILTER_SEARCH_KEYS.furnishing),
    priceRange: parseNumericRangeParam(
      searchParams,
      TRIAL_FILTER_SEARCH_KEYS.priceMin,
      TRIAL_FILTER_SEARCH_KEYS.priceMax,
      { min: 0, max: 1000000 },
    ),
    landRange: parseNumericRangeParam(
      searchParams,
      TRIAL_FILTER_SEARCH_KEYS.landMin,
      TRIAL_FILTER_SEARCH_KEYS.landMax,
      { min: 0, max: 3000 },
    ),
    rooms: parsePositiveIntParam(searchParams, TRIAL_FILTER_SEARCH_KEYS.rooms),
    bathrooms: parsePositiveIntParam(
      searchParams,
      TRIAL_FILTER_SEARCH_KEYS.bathrooms,
    ),
  };
}

function activeKeys(record: CheckboxFilterMap): string[] {
  return Object.entries(record)
    .filter(([, on]) => on)
    .map(([key]) => key);
}

function propertyFurnishing(p: Property): string | undefined {
  const f = p.specifications.furnishing;
  return typeof f === "string" && f.length > 0 ? f : undefined;
}

/**
 * Sidebar checkbox filters. An empty dimension (no boxes checked) does not filter.
 */
export function filterPropertiesByTrialFilters(
  properties: Property[],
  filters: SearchTrialFilters,
): Property[] {
  const unitPick = activeKeys(filters.unitTypes) as PropertyType[];
  const amenPick = activeKeys(filters.amenities);
  const furnPick = activeKeys(filters.furnishing);

  return properties.filter((p) => {
    if (unitPick.length > 0 && !unitPick.includes(p.type)) {
      return false;
    }
    if (furnPick.length > 0) {
      const f = propertyFurnishing(p);
      if (!f || !furnPick.includes(f)) {
        return false;
      }
    }
    if (amenPick.length > 0) {
      for (const amenity of amenPick) {
        if (!p.amenities.includes(amenity)) {
          return false;
        }
      }
    }
    if (filters.priceRange) {
      const basePrice = p.pricing.basePrice;
      if (
        basePrice < filters.priceRange.min ||
        basePrice > filters.priceRange.max
      ) {
        return false;
      }
    }
    if (filters.landRange) {
      /** TODO: put the value inside the utils and import from there  */
      const propertySize = Math.round(p.specifications.size * 10.7639);

      if (
        propertySize < filters.landRange.min ||
        propertySize > filters.landRange.max
      ) {
        return false;
      }
    }
    if (filters.rooms !== undefined) {
      const rooms = p.specifications.rooms;
      if (rooms === undefined || rooms !== filters.rooms) {
        return false;
      }
    }
    if (filters.bathrooms !== undefined) {
      const bathrooms = p.specifications.bathrooms;
      if (bathrooms === undefined || bathrooms !== filters.bathrooms) {
        return false;
      }
    }
    return true;
  });
}
