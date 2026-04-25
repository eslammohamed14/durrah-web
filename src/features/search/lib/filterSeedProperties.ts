import type { ReadonlyURLSearchParams } from "next/navigation";
import type { Property, PropertyType } from "@/lib/types";

export type CheckboxFilterMap = Record<string, boolean>;

/** URL query keys for trial search checkbox filters (comma-separated values). */
export const TRIAL_FILTER_SEARCH_KEYS = {
  unitTypes: "unitTypes",
  amenities: "amenities",
  furnishing: "furnishing",
} as const;

export type TrialFilterSearchKey =
  (typeof TRIAL_FILTER_SEARCH_KEYS)[keyof typeof TRIAL_FILTER_SEARCH_KEYS];

export type SearchTrialFilters = {
  unitTypes: CheckboxFilterMap;
  amenities: CheckboxFilterMap;
  furnishing: CheckboxFilterMap;
};

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
    return true;
  });
}
