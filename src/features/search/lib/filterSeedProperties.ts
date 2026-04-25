import type { Property, PropertyType } from "@/lib/types";

export type CheckboxFilterMap = Record<string, boolean>;

function activeKeys(record: CheckboxFilterMap): string[] {
  return Object.entries(record)
    .filter(([, on]) => on)
    .map(([key]) => key);
}

export type SearchTrialFilters = {
  unitTypes: CheckboxFilterMap;
  amenities: CheckboxFilterMap;
  furnishing: CheckboxFilterMap;
};

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
