"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import FilterSection from "../filterSection/FilterSection";
import CheckboxRow, {
  type CheckboxRowChangeDetail,
} from "../CheckboxRow";
import RadioRow from "../RadioRow";
import { seedProperties } from "@/lib/api/mock/seedData";
import { CloseFilterIcon } from "@/assets/icons";
import {
  TRIAL_FILTER_SEARCH_KEYS,
  parseCommaSeparatedParam,
} from "@/features/search/lib/filterSeedProperties";

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

  const clearCategory = useCallback(
    (paramKey: string) => {
      const next = new URLSearchParams(searchParams.toString());
      next.delete(paramKey);
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

      <FilterSection showChevron={false} title="Price Range" defaultOpen>
        <p className="mb-3 text-sm font-normal leading-[21px] text-grey-800">
          $25.00 - $125.00
        </p>
        <div className="relative h-1.5 w-full rounded-full bg-grey-100">
          <div className="absolute left-[18%] right-[28%] top-0 h-full rounded-full bg-primary-blue-400" />
          <span className="absolute left-[18%] top-1/2 size-[18px] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-primary-blue-400 shadow-sm" />
          <span className="absolute right-[28%] top-1/2 size-[18px] translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-primary-blue-400 shadow-sm" />
        </div>
      </FilterSection>

      <FilterSection title="Land Area (Sqft)" defaultOpen>
        <p className="mb-3 text-sm font-normal leading-[21px] text-grey-800">
          1500 - 3000
        </p>
        <div className="relative h-1.5 w-full rounded-full bg-grey-100">
          <div className="absolute left-[22%] right-[30%] top-0 h-full rounded-full bg-primary-blue-400" />
          <span className="absolute left-[22%] top-1/2 size-[18px] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-primary-blue-400 shadow-sm" />
          <span className="absolute right-[30%] top-1/2 size-[18px] translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-primary-blue-400 shadow-sm" />
        </div>
      </FilterSection>

      <FilterSection title="Rooms" defaultOpen>
        <div className="flex flex-wrap gap-2">
          {roomOptions.map((n) => (
            <span
              key={n}
              className="flex size-9 items-center justify-center rounded-lg border border-border-default bg-surface-primary text-sm font-medium text-text-dark"
            >
              {n}
            </span>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Bathrooms" defaultOpen>
        <div className="flex flex-wrap gap-2">
          {bathroomOptions.map((n) => (
            <span
              key={n}
              className="flex size-9 items-center justify-center rounded-lg border border-border-default bg-surface-primary text-sm font-medium text-text-dark"
            >
              {n}
            </span>
          ))}
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

      <FilterSection title="Availability" defaultOpen>
        <RadioRow label="Available Now" checked readOnly />
        <RadioRow label="Under Construction" />
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
