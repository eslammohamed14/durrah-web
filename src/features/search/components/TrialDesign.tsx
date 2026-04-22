import SearchCalender from "./searchCalender/SearchCalender";
import { SearchBar2 } from "./searchBar/SearchBar2";

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
          <TrialResultsPanel />
        </section>
      </div>
    </div>
  );
}

function TrialFiltersPanel() {
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
        <CheckboxRow label="Villa" checked readOnly />
        <CheckboxRow label="Chalet" />
        <CheckboxRow label="Apartment" />
        <CheckboxRow label="Penthouse" />
      </FilterSection>

      <FilterSection title="Price Range" defaultOpen>
        <p className="mb-3 text-sm font-normal leading-[21px] text-grey-800">
          $25.00 - $125.00
        </p>
        <div className="relative h-1.5 w-full rounded-full bg-grey-100">
          <div className="absolute left-[18%] right-[28%] top-0 h-full rounded-full bg-primary-coral-400" />
          <span className="absolute left-[18%] top-1/2 size-[18px] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-primary-coral-400 shadow-sm" />
          <span className="absolute right-[28%] top-1/2 size-[18px] translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-primary-coral-400 shadow-sm" />
        </div>
      </FilterSection>

      <FilterSection title="Land Area (Sqft)" defaultOpen>
        <p className="mb-3 text-sm font-normal leading-[21px] text-grey-800">
          1500 - 3000
        </p>
        <div className="relative h-1.5 w-full rounded-full bg-grey-100">
          <div className="absolute left-[22%] right-[30%] top-0 h-full rounded-full bg-primary-coral-400" />
          <span className="absolute left-[22%] top-1/2 size-[18px] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-primary-coral-400 shadow-sm" />
          <span className="absolute right-[30%] top-1/2 size-[18px] translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-primary-coral-400 shadow-sm" />
        </div>
      </FilterSection>

      <FilterSection title="Rooms" defaultOpen>
        <div className="flex flex-wrap gap-2">
          {["1", "2", "3", "+4"].map((n) => (
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
          {["1", "2", "+3"].map((n) => (
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
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <CheckboxRow label="Private Pool" checked readOnly />
          <CheckboxRow label="Garden" checked readOnly />
          <CheckboxRow label="Terrace" />
          <CheckboxRow label="Parking" />
          <CheckboxRow label="Yacht Parking" checked readOnly />
          <CheckboxRow label="Sea View" checked readOnly />
          <CheckboxRow label="Gym Access" checked readOnly />
          <CheckboxRow label="Wi-Fi" />
        </div>
      </FilterSection>
    </div>
  );
}

function FilterSection({
  title,
  children,
  defaultOpen,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}) {
  return (
    <details
      open={defaultOpen}
      className={`group border-b border-border-default py-4 first:pt-0 ${className}`}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-2 text-base font-semibold leading-6 text-text-dark [&::-webkit-details-marker]:hidden">
        {title}
        <ChevronUpIcon className="size-[18px] shrink-0 text-grey-600 transition-transform group-open:rotate-180" />
      </summary>
      <div className="mt-4 space-y-3">{children}</div>
    </details>
  );
}

function CheckboxRow({
  label,
  checked,
  readOnly,
}: {
  label: string;
  checked?: boolean;
  readOnly?: boolean;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-sm font-normal leading-[21px] text-grey-800">
      <span
        className={`flex size-[18px] shrink-0 items-center justify-center rounded border ${
          checked
            ? "border-primary-coral-400 bg-primary-coral-400"
            : "border-grey-200 bg-white"
        }`}
      >
        {checked ? <TickIcon className="size-3 text-white" /> : null}
      </span>
      <input
        type="checkbox"
        className="sr-only"
        defaultChecked={checked}
        readOnly={readOnly}
      />
      {label}
    </label>
  );
}

function RadioRow({
  label,
  checked,
  readOnly,
}: {
  label: string;
  checked?: boolean;
  readOnly?: boolean;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm font-normal leading-[21px] text-grey-800">
      <span className="flex size-6 shrink-0 items-center justify-center">
        <span
          className={`flex size-5 items-center justify-center rounded-full border-2 ${
            checked
              ? "border-primary-coral-400"
              : "border-grey-200 bg-white"
          }`}
        >
          {checked ? (
            <span className="size-2.5 rounded-full bg-primary-coral-400" />
          ) : null}
        </span>
      </span>
      <input
        type="radio"
        className="sr-only"
        defaultChecked={checked}
        readOnly={readOnly}
      />
      {label}
    </label>
  );
}

function TrialResultsPanel() {
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
        <PropertyCardTrial
          badge="Apartment"
          title="Skyline Residence"
          tag="Family"
          location="core bay beach"
          sqft="4,200 sq.ft."
          price="AED 2,450,000"
        />
        <PropertyCardTrial
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

function ViewModeButton({
  children,
  active,
  "aria-label": ariaLabel,
}: {
  children: React.ReactNode;
  active?: boolean;
  "aria-label"?: string;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className={`flex size-[38px] items-center justify-center rounded-md transition-colors ${
        active
          ? "bg-white text-primary-coral-400 shadow-sm ring-1 ring-black/[0.06]"
          : "text-grey-500 hover:text-grey-800"
      }`}
    >
      {children}
    </button>
  );
}

function PropertyCardTrial({
  badge,
  title,
  tag,
  location,
  sqft,
  price,
}: {
  badge: string;
  title: string;
  tag: string;
  location: string;
  sqft: string;
  price: string;
}) {
  return (
    <article className="flex w-full max-w-[416px] flex-col overflow-hidden rounded-xl bg-white shadow-[0_0_24px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.04]">
      <div className="relative aspect-[416/216] w-full bg-gradient-to-br from-grey-100 to-grey-200">
        <div className="absolute left-3 top-3">
          <span className="inline-flex items-center rounded-md bg-white/95 px-2.5 py-1 text-xs font-medium leading-[18px] text-text-dark shadow-sm ring-1 ring-black/[0.06]">
            {badge}
          </span>
        </div>
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className={`size-2 rounded-full ${i === 0 ? "bg-white" : "bg-white/50"}`}
            />
          ))}
        </div>
        <button
          type="button"
          aria-label="Previous image"
          className="absolute left-2 top-1/2 flex size-[42px] -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-grey-800 shadow-md ring-1 ring-black/[0.06] transition hover:bg-white"
        >
          <ChevronLeftBold className="size-5" />
        </button>
        <button
          type="button"
          aria-label="Next image"
          className="absolute right-2 top-1/2 flex size-[42px] -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-grey-800 shadow-md ring-1 ring-black/[0.06] transition hover:bg-white"
        >
          <ChevronRightBold className="size-5" />
        </button>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <h3 className="text-lg font-semibold leading-[30px] text-text-dark">
            {title}
          </h3>
          <span className="rounded-md bg-primary-lavender-200 px-2 py-1 text-xs font-medium leading-[18px] text-primary-blue-400">
            {tag}
          </span>
        </div>
        <p className="flex items-center gap-1.5 text-sm leading-[22px] text-grey-600">
          <LocationPinIcon className="size-[18px] shrink-0 text-grey-600" />
          {location}
        </p>
        <p className="flex items-center gap-1.5 text-sm leading-[22px] text-grey-600">
          <ExpandIcon className="size-[18px] shrink-0 text-grey-600" />
          {sqft}
        </p>
        <p className="pt-1 text-base font-semibold text-primary-coral-500">
          {price}
        </p>
      </div>
    </article>
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

function ChevronUpIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden
    >
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

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
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

function TickIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 12 12" fill="none" aria-hidden>
      <path
        d="M2.5 6l2.5 2.5L9.5 3.5"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MapIcon() {
  return (
    <svg className="size-[18px]" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path
        opacity={0.4}
        d="M6.75 2.25L2.25 3.75v10.5l4.5-1.5M6.75 2.25l4.5 1.5M6.75 2.25v12M11.25 3.75l4.5-1.5v10.5l-4.5 1.5"
        stroke="currentColor"
        strokeWidth={1.3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg className="size-[18px]" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path
        d="M6 4.5h9M6 9h9M6 13.5h9M3 4.5h.01M3 9h.01M3 13.5h.01"
        stroke="currentColor"
        strokeWidth={1.3}
        strokeLinecap="round"
      />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg className="size-[18px]" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path
        d="M7.5 3h-3a1.5 1.5 0 00-1.5 1.5v3A1.5 1.5 0 004.5 9h3A1.5 1.5 0 009 7.5v-3A1.5 1.5 0 007.5 3zM16.5 3h-3A1.5 1.5 0 0012 4.5v3A1.5 1.5 0 0013.5 9h3A1.5 1.5 0 0018 7.5v-3A1.5 1.5 0 0016.5 3zM7.5 12h-3A1.5 1.5 0 003 13.5v3A1.5 1.5 0 004.5 18h3A1.5 1.5 0 009 16.5v-3A1.5 1.5 0 007.5 12zM16.5 12h-3a1.5 1.5 0 00-1.5 1.5v3a1.5 1.5 0 001.5 1.5h3a1.5 1.5 0 001.5-1.5v-3a1.5 1.5 0 00-1.5-1.5z"
        stroke="currentColor"
        strokeWidth={1.1}
      />
    </svg>
  );
}

function LocationPinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 18 18" fill="none" aria-hidden>
      <path
        opacity={0.4}
        d="M9 9.75a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z"
        stroke="currentColor"
        strokeWidth={1.2}
      />
      <path
        d="M3.09 6.87a6.08 6.08 0 1111.82 0c.17.57.02 1.2-.42 1.64l-4.24 4.24a1.5 1.5 0 01-2.12 0L3.51 8.51a1.5 1.5 0 01-.42-1.64z"
        stroke="currentColor"
        strokeWidth={1.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ExpandIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 18 18" fill="none" aria-hidden>
      <path
        d="M11.25 3.75H14.25V6.75M14.25 3.75L9 9M6.75 14.25H3.75V11.25M3.75 14.25L9 9"
        stroke="currentColor"
        strokeWidth={1.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronLeftBold({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M15 18l-6-6 6-6"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronRightBold({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M9 18l6-6-6-6"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
