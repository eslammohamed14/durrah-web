import SearchCalender from "./searchCalender/SearchCalender";
import { SearchBar2 } from "./searchBar/SearchBar2";
import TrialFiltersPanel from "./searchfilterspanel/SearchFiltersPanel";
import SearchResultsPanel from "./searchresultspanel/SearchResultsPanel";

/**
 * Layout trial from Figma `1070:16801` (Frame 2147236618): 1200px search page —
 * top row (date 320 + search 856, gap 24), then filters column 320 + results 856.
 */
export default function TrialDesign() {
  return (
    <div className="mx-auto w-full max-w-[1200px] px-4 pb-16 pt-4 sm:px-6 lg:px-0">
      {/* Frame 2147236617 — top toolbar */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-6">
        <SearchCalender rangeLabel="16 Feb 2026 - 22 Feb 2026" />
        <div className="min-w-0 flex-1 lg:max-w-[856px]">
          <SearchBar2 />
        </div>
      </div>

      {/* Frame 2147236616 — main split */}
      <div className="mt-6 flex flex-col gap-6 lg:mt-8 lg:flex-row lg:items-start lg:gap-6">
        <aside className="w-full shrink-0 lg:w-80">
          <TrialFiltersPanel />
        </aside>

        <section className="min-w-0 flex-1 lg:max-w-[856px]">
          <SearchResultsPanel />
        </section>
      </div>
    </div>
  );
}





function ChevronUpIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 18 18" fill="none" aria-hidden>
      <path
        d="M4.5 11.25L9 6.75l4.5 4.5"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}













