"use client";

import { useCallback, useMemo, useState } from "react";
import SearchCalender from "./searchCalender/SearchCalender";
import { SearchBar2 } from "./searchBar/SearchBar2";
import TrialFiltersPanel from "./searchfilterspanel/SearchFiltersPanel";
import SearchResultsPanel from "./searchresultspanel/SearchResultsPanel";
import { seedProperties } from "@/lib/api/mock/seedData";
import {
  filterPropertiesByTrialFilters,
  type CheckboxFilterMap,
} from "@/features/search/lib/filterSeedProperties";
import type { CheckboxRowChangeDetail } from "./CheckboxRow";

/**
 * Layout trial from Figma `1070:16801` (Frame 2147236618): 1200px search page —
 * top row (date 320 + search 856, gap 24), then filters column 320 + results 856.
 */
export default function TrialDesign() {
  const [unitTypesChecked, setUnitTypesChecked] = useState<CheckboxFilterMap>({});
  const [amenitiesChecked, setAmenitiesChecked] =
    useState<CheckboxFilterMap>({});
  const [furnishingChecked, setFurnishingChecked] =
    useState<CheckboxFilterMap>({});

  const handleUnitTypeChange = useCallback(
    ({ value, checked }: CheckboxRowChangeDetail) => {
      setUnitTypesChecked((prev) => ({ ...prev, [value]: checked }));
    },
    [],
  );

  const handleAmenityChange = useCallback(
    ({ value, checked }: CheckboxRowChangeDetail) => {
      setAmenitiesChecked((prev) => ({ ...prev, [value]: checked }));
    },
    [],
  );

  const handleFurnishingChange = useCallback(
    ({ value, checked }: CheckboxRowChangeDetail) => {
      setFurnishingChecked((prev) => ({ ...prev, [value]: checked }));
    },
    [],
  );

  const clearFilters = useCallback(() => {
    setUnitTypesChecked({});
    setAmenitiesChecked({});
    setFurnishingChecked({});
  }, []);

  const filteredProperties = useMemo(
    () =>
      filterPropertiesByTrialFilters(seedProperties, {
        unitTypes: unitTypesChecked,
        amenities: amenitiesChecked,
        furnishing: furnishingChecked,
      }),
    [unitTypesChecked, amenitiesChecked, furnishingChecked],
  );

  return (
    <div className="mx-auto w-full max-w-[1200px] px-4 pb-16 pt-4 sm:px-6 lg:px-0">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-6">
        <SearchCalender rangeLabel="16 Feb 2026 - 22 Feb 2026" />
        <div className="min-w-0 flex-1 lg:max-w-[856px]">
          <SearchBar2 />
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-6 lg:mt-8 lg:flex-row lg:items-start lg:gap-6">
        <aside className="w-full shrink-0 lg:w-80">
          <TrialFiltersPanel
            unitTypesChecked={unitTypesChecked}
            amenitiesChecked={amenitiesChecked}
            furnishingChecked={furnishingChecked}
            onUnitTypeChange={handleUnitTypeChange}
            onAmenityChange={handleAmenityChange}
            onFurnishingChange={handleFurnishingChange}
            onClearAll={clearFilters}
          />
        </aside>

        <section className="min-w-0 flex-1 lg:max-w-[856px]">
          <SearchResultsPanel properties={filteredProperties} />
        </section>
      </div>
    </div>
  );
}
