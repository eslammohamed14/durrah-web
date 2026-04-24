import FilterSection from "../filterSection/FilterSection";
import CheckboxRow from "../CheckboxRow";
import RadioRow from "../RadioRow";
import { seedProperties } from "@/lib/api/mock/seedData";

export default function TrialFiltersPanel() {
  const unitTypes = Array.from(new Set(seedProperties.map((p) => p.type)));
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
      if (Array.isArray(property.amenities)) {
        property.amenities.forEach((amenity) => {
          amenitySet.add(amenity);
        });
      }
    });

    return Array.from(amenitySet).sort();
  }
  const roomOptions = getSpecOptions(seedProperties, "rooms");
  const bathroomOptions = getSpecOptions(seedProperties, "bathrooms");
  const amenitiesOptions = getAmenitiesOptions(seedProperties);
  return (
    <div className="rounded-xl bg-white p-4 shadow-[0_0_24px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.04]">
      <div className="mb-6 flex items-start justify-between gap-3">
        <h2 className="text-[22px] font-semibold leading-8 text-text-dark">
          Filters
        </h2>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 text-xs font-normal leading-[18px] text-grey-600 transition-colors hover:text-primary-coral-500"
        >
          Clear All
          <CloseSquareIcon className="size-4 shrink-0 text-grey-600" />
        </button>
      </div>

      <FilterSection title="Unit Type" defaultOpen>
        {unitTypes.map((type) => (
          <CheckboxRow key={type} label={type} />
        ))}
      </FilterSection>
      {/* TODO: use actual range sliders that is dynamic */}
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
      {/* TODO: use actual range sliders that is dynamic */}

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
        <CheckboxRow label="Furnished" checked readOnly />
        <CheckboxRow label="Semi-Furnished" />
        <CheckboxRow label="Unfurnished" />
      </FilterSection>

      <FilterSection title="Availability" defaultOpen>
        <RadioRow label="Available Now" checked readOnly />
        <RadioRow label="Under Construction" />
      </FilterSection>

      <FilterSection title="Amenities" defaultOpen className="border-b-0 pb-0">
        <div className="grid grid-cols-1 gap-2 ">
          {amenitiesOptions.map((amenity) => (
            <CheckboxRow key={amenity} label={amenity} />
          ))}
        </div>
      </FilterSection>
    </div>
  );
}
function CloseSquareIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M6 6l4 4m0-4l-4 4"
        stroke="currentColor"
        strokeWidth={1}
        strokeLinecap="round"
      />
      <path
        d="M6.67 1.33h2.67c2.67 0 4 1.33 4 4v5.34c0 2.67-1.33 4-4 4H6.67c-2.67 0-4-1.33-4-4V5.33c0-2.67 1.33-4 4-4Z"
        stroke="currentColor"
        strokeWidth={1}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
