import { MapIcon } from "@/assets/icons/MapIcon";
import ViewModeButton from "../ViewModeButton";
import { ListIcon } from "@/assets/icons/ListIcon";
import { GridIcon } from "@/assets/icons/GridIcon";
import PropertyCardSearch from "../propertyCard/PropertyCardSearch";

export default function SearchResultsPanel() {
  return (
    <>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-lg font-semibold leading-6 text-text-dark">
          24 Properties Found
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center rounded-lg bg-grey-50 p-1 ring-1 ring-black/[0.06]">
            <ViewModeButton active aria-label="Map view">
              <MapIcon />
            </ViewModeButton>
            <ViewModeButton aria-label="List view">
              <ListIcon />
            </ViewModeButton>
            <ViewModeButton aria-label="Grid view">
              <GridIcon />
            </ViewModeButton>
          </div>
          <button
            type="button"
            className="inline-flex h-[42px] min-w-[132px] items-center justify-center gap-2 rounded-xl border border-border-default bg-surface-primary px-4 text-sm font-medium leading-[21px] text-text-dark shadow-[0_0_24px_rgba(0,0,0,0.06)] transition-colors hover:bg-grey-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-coral-400 focus-visible:ring-offset-2"
          >
            Sorted By
            <ChevronDownIcon className="size-5 text-grey-600" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <PropertyCardSearch
          badge="Apartment"
          title="Skyline Residence"
          tag="Family"
          location="core bay beach"
          sqft="4,200 sq.ft."
          price="AED 2,450,000"
        />
        <PropertyCardSearch
          badge="Villa"
          title="Palm Horizon Villa"
          tag="Luxury"
          location="marina walk"
          sqft="6,800 sq.ft."
          price="AED 5,200,000"
        />
      </div>
    </>
  );
}
function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 9l6 6 6-6"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
