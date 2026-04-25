"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import FilterSection from "../filterSection/FilterSection";
import CheckboxRow, {
  type CheckboxRowChangeDetail,
} from "../CheckboxRow";
import { seedProperties } from "@/lib/api/mock/seedData";
import { CloseFilterIcon } from "@/assets/icons";
import {
  TRIAL_FILTER_SEARCH_KEYS,
  parseCommaSeparatedParam,
} from "@/features/search/lib/filterSeedProperties";
import RangeSlider from "../rangeslider/RangeSlider";
import { useRangeQueryParams } from "@/features/search/hooks/useRangeQueryParams";

const PRICE_RANGE_LIMITS = { min: 0, max: 20000 } as const;
const LAND_RANGE_LIMITS = { min: 0, max: 3000 } as const;

function getSpecOptions(
  properties: typeof seedProperties,
  key: keyof (typeof seedProperties)[number]["specifications"],
) {
  const set = new Set<number>();
  properties.forEach((property) => {
    const value = property?.specifications?.[key];
    if (typeof value === "number") {
      set.add(value);
    }
  });
  return Array.from(set).sort((a, b) => a - b);
}

function getAmenitiesOptions(properties: typeof seedProperties): string[] {
  const amenitySet = new Set<string>();
  properties.forEach((property) => {
    property.amenities.forEach((amenity) => {
      amenitySet.add(amenity);
    });
  });
  return Array.from(amenitySet).sort();
}

function getFurnishingOptions(properties: typeof seedProperties): string[] {
  const set = new Set<string>();
  properties.forEach((property) => {
    const f = property.specifications.furnishing;
    if (typeof f === "string" && f.length > 0) {
      set.add(f);
    }
  });
  return Array.from(set).sort();
}

export default function SearchFiltersPanel() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const unitTypesActive = useMemo(
    () => parseCommaSeparatedParam(searchParams, TRIAL_FILTER_SEARCH_KEYS.unitTypes),
    [searchParams],
  );
  const amenitiesActive = useMemo(
    () => parseCommaSeparatedParam(searchParams, TRIAL_FILTER_SEARCH_KEYS.amenities),
    [searchParams],
  );
  const furnishingActive = useMemo(
    () => parseCommaSeparatedParam(searchParams, TRIAL_FILTER_SEARCH_KEYS.furnishing),
    [searchParams],
  );
  const [priceRange, setPriceRange, commitPriceRange] = useRangeQueryParams({
    minKey: "priceMin",
    maxKey: "priceMax",
    limits: PRICE_RANGE_LIMITS,
  });
  const [landRange, setLandRange, commitLandRange] = useRangeQueryParams({
    minKey: "landMin",
    maxKey: "landMax",
    limits: LAND_RANGE_LIMITS,
  });

  const roomsParamKey = TRIAL_FILTER_SEARCH_KEYS.rooms;
  const bathroomsParamKey = TRIAL_FILTER_SEARCH_KEYS.bathrooms;

  const selectedRooms = useMemo(() => {
    const raw = searchParams.get(roomsParamKey);
    if (raw == null || raw === "") return undefined;
    const n = Number(raw);
    return Number.isFinite(n) && Number.isInteger(n) && n >= 0 ? n : undefined;
  }, [roomsParamKey, searchParams]);

  const selectedBathrooms = useMemo(() => {
    const raw = searchParams.get(bathroomsParamKey);
    if (raw == null || raw === "") return undefined;
    const n = Number(raw);
    return Number.isFinite(n) && Number.isInteger(n) && n >= 0 ? n : undefined;
  }, [bathroomsParamKey, searchParams]);

  const replaceParams = useCallback(
    (next: URLSearchParams) => {
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router],
  );

  const toggleFilter = useCallback(
    (paramKey: string, value: string) => {
      const next = new URLSearchParams(searchParams.toString());
      const current = parseCommaSeparatedParam(next, paramKey);
      const exists = current.includes(value);
      const updated = exists ? current.filter((v) => v !== value) : [...current, value];
      if (updated.length === 0) {
        next.delete(paramKey);
      } else {
        next.set(paramKey, updated.join(","));
      }
      replaceParams(next);
    },
    [replaceParams, searchParams],
  );

  

  const resetAll = useCallback(() => {
    router.replace(pathname, { scroll: false });
  }, [pathname, router]);

  const utKey = TRIAL_FILTER_SEARCH_KEYS.unitTypes;
  const amKey = TRIAL_FILTER_SEARCH_KEYS.amenities;
  const fuKey = TRIAL_FILTER_SEARCH_KEYS.furnishing;

  const onUnitTypeChange = useCallback(
    (_detail: CheckboxRowChangeDetail) => {
      toggleFilter(utKey, _detail.value);
    },
    [toggleFilter, utKey],
  );

  const onAmenityChange = useCallback(
    (_detail: CheckboxRowChangeDetail) => {
      toggleFilter(amKey, _detail.value);
    },
    [toggleFilter, amKey],
  );

  const onFurnishingChange = useCallback(
    (_detail: CheckboxRowChangeDetail) => {
      toggleFilter(fuKey, _detail.value);
    },
    [toggleFilter, fuKey],
  );

  const handleToggleRooms = useCallback(
    (value: number) => {
      const next = new URLSearchParams(searchParams.toString());
      if (selectedRooms === value) {
        next.delete(roomsParamKey);
      } else {
        next.set(roomsParamKey, String(value));
      }
      replaceParams(next);
    },
    [replaceParams, roomsParamKey, searchParams, selectedRooms],
  );

  const handleToggleBathrooms = useCallback(
    (value: number) => {
      const next = new URLSearchParams(searchParams.toString());
      if (selectedBathrooms === value) {
        next.delete(bathroomsParamKey);
      } else {
        next.set(bathroomsParamKey, String(value));
      }
      replaceParams(next);
    },
    [
      bathroomsParamKey,
      replaceParams,
      searchParams,
      selectedBathrooms,
    ],
  );

  const unitTypes = Array.from(new Set(seedProperties.map((p) => p.type)));
  const roomOptions = getSpecOptions(seedProperties, "rooms");
  const bathroomOptions = getSpecOptions(seedProperties, "bathrooms");
  const amenitiesOptions = getAmenitiesOptions(seedProperties);
  const furnishingOptions = getFurnishingOptions(seedProperties);

  return (
    <div className="rounded-xl bg-white p-4 shadow-[0_0_24px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.04]">
      <div className="mb-6 flex items-start justify-between gap-3">
        <h2 className="text-[22px] font-semibold leading-8 text-text-dark">
          Filters
        </h2>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 text-xs font-normal leading-[18px] text-grey-600 transition-colors hover:text-primary-coral-500"
          onClick={resetAll}
        >
          Clear All
          <CloseFilterIcon />
        </button>
      </div>

      <FilterSection title="Unit Type" defaultOpen>
        {unitTypes.map((type) => (
          <CheckboxRow
            key={type}
            label={type}
            value={type}
            checked={unitTypesActive.includes(type)}
            onCheckedChange={onUnitTypeChange}
          />
        ))}
      </FilterSection>

      <FilterSection
        collapsible={false}
        showChevron={false}
        title="Price Range"
        defaultOpen
      >
        <RangeSlider
          min={PRICE_RANGE_LIMITS.min}
          max={PRICE_RANGE_LIMITS.max}
          value={priceRange}
          onChange={setPriceRange}
          onChangeEnd={commitPriceRange}
          step={1000}
          unitLabel="SAR"
          minAriaLabel="Minimum price"
          maxAriaLabel="Maximum price"
        />
      </FilterSection>

      <FilterSection title="Land Area (Sqft)"  defaultOpen collapsible={false}>
        <RangeSlider
          min={LAND_RANGE_LIMITS.min}
          max={LAND_RANGE_LIMITS.max}
          value={landRange}
          onChange={setLandRange}
          onChangeEnd={commitLandRange}
          step={50}
          unitLabel="sqft"
          minAriaLabel="Minimum land area"
          maxAriaLabel="Maximum land area"
        />
      </FilterSection>

      <FilterSection title="Rooms" collapsible={false} defaultOpen>
        <div className="flex flex-wrap gap-2">
          {roomOptions.map((n) => {
            const active = selectedRooms === n;
            return (
              <button
                key={n}
                type="button"
                aria-pressed={active}
                onClick={() => handleToggleRooms(n)}
                className={[
                  "flex size-9 items-center justify-center rounded-lg border text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-blue-400",
                  active
                    ? "border-primary-blue-400 bg-primary-coral-400 text-white"
                    : "border-border-default bg-surface-primary text-text-dark hover:border-grey-400",
                ].join(" ")}
              >
                {n}
              </button>
            );
          })}
        </div>
      </FilterSection>

      <FilterSection title="Bathrooms" collapsible={false} defaultOpen>
        <div className="flex flex-wrap gap-2">
          {bathroomOptions.map((n) => {
            const active = selectedBathrooms === n;
            return (
              <button
                key={n}
                type="button"
                aria-pressed={active}
                onClick={() => handleToggleBathrooms(n)}
                className={[
                  "flex size-9 items-center justify-center rounded-lg border text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-blue-400",
                  active
                    ? "border-primary-blue-400 bg-primary-coral-400 text-white"
                    : "border-border-default bg-surface-primary text-text-dark hover:border-grey-400",
                ].join(" ")}
              >
                {n}
              </button>
            );
          })}
        </div>
      </FilterSection>

      <FilterSection title="Furnishing" defaultOpen>
        {furnishingOptions.map((option) => (
          <CheckboxRow
            key={option}
            label={option}
            value={option}
            checked={furnishingActive.includes(option)}
            onCheckedChange={onFurnishingChange}
          />
        ))}
      </FilterSection>

      

      <FilterSection title="Amenities" defaultOpen className="border-b-0 pb-0">
        <div className="grid grid-cols-1 gap-2 ">
          {amenitiesOptions.map((amenity) => (
            <CheckboxRow
              key={amenity}
              label={amenity}
              value={amenity}
              checked={amenitiesActive.includes(amenity)}
              onCheckedChange={onAmenityChange}
            />
          ))}
        </div>
      </FilterSection>
    </div>
  );
}
