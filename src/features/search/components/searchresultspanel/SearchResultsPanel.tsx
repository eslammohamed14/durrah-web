 "use client";

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { MapIcon } from "@/assets/icons/MapIcon";
import ViewModeButton from "../ViewModeButton";
import { ListIcon } from "@/assets/icons/ListIcon";
import { GridIcon } from "@/assets/icons/GridIcon";
import { PropertyCard } from "@/components/ui/PropertyCard";
import type { Property } from "@/lib/types";
import { seedProperties } from "@/lib/api/mock/seedData";
import LocationMap from "../LocationMap/LocationMap";

type ViewMode = "grid" | "list" | "map";

export default function SearchResultsPanel({
  properties,
}: {
  properties: Property[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const count = properties.length;
  const rawView = searchParams.get("view");
  const currentView: ViewMode =
    rawView === "list" || rawView === "map" ? rawView : "grid";
  const numberOfColumns = currentView === "list" ? 1 : 2;

  const handleViewChange = useCallback(
    (view: ViewMode) => {
      const next = new URLSearchParams(searchParams.toString());
      next.set("view", view);
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams],
  );
console.log(seedProperties)
  return (
    <>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-lg font-semibold leading-6 text-text-dark">
          {count} {count === 1 ? "Property" : "Properties"} Found
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center rounded-lg bg-grey-50 p-1 ring-1 ring-black/[0.06]">
            <ViewModeButton
              active={currentView === "map"}
              aria-label="Map view"
              onClick={() => handleViewChange("map")}
            >
              <MapIcon />
            </ViewModeButton>
            <ViewModeButton
              active={currentView === "list"}
              aria-label="List view"
              onClick={() => handleViewChange("list")}
            >
              <ListIcon />
            </ViewModeButton>
            <ViewModeButton
              active={currentView === "grid"}
              aria-label="Grid view"
              onClick={() => handleViewChange("grid")}
            >
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

     {currentView==='map'? <LocationMap /> : <div
        className={[
          "grid gap-6",
          numberOfColumns === 1 ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2",
        ].join(" ")}
      >
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property}  />
        ))}
      </div>}
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
