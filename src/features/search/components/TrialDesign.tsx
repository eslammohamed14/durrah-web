"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import SearchCalender from "./searchCalender/SearchCalender";
import { SearchBar2 } from "./searchBar/SearchBar2";
import SearchFiltersPanel from "./searchfilterspanel/SearchFiltersPanel";
import SearchResultsPanel from "./searchresultspanel/SearchResultsPanel";
import { seedProperties } from "@/lib/api/mock/seedData";
import {
  filterPropertiesByTrialFilters,
  trialFiltersFromSearchParams,
} from "@/features/search/lib/filterSeedProperties";

/**
 * Layout trial from Figma `1070:16801` (Frame 2147236618): 1200px search page —
 * top row (date 320 + search 856, gap 24), then filters column 320 + results 856.
 */
export default function TrialDesign() {
  const searchParams = useSearchParams();

  const filteredProperties = useMemo(
    () =>
      filterPropertiesByTrialFilters(
        seedProperties,
        trialFiltersFromSearchParams(searchParams),
      ),
    [searchParams],
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
          <SearchFiltersPanel />
        </aside>

        <section className="min-w-0 flex-1 lg:max-w-[856px]">
          <SearchResultsPanel properties={filteredProperties} />
        </section>
      </div>
    </div>
  );
}
