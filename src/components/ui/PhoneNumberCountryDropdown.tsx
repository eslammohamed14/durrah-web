"use client";

import React from "react";

export type PhoneCountryRow = {
  code: string;
  name: string;
  dial: string;
};

function isoToFlagEmoji(iso: string): string {
  const upper = iso.toUpperCase();
  if (upper.length !== 2) return "🏳️";
  return [...upper].map((c) => String.fromCodePoint(127397 + c.charCodeAt(0)))
    .join("");
}

export type PhoneNumberCountryDropdownProps = {
  listId: string;
  searchId: string;
  searchPlaceholder: string;
  /** Accessible name for the listbox. */
  listAriaLabel: string;
  query: string;
  onQueryChange: (value: string) => void;
  searchRef: React.RefObject<HTMLInputElement | null>;
  filtered: PhoneCountryRow[];
  activeIso: string;
  onSelectRow: (iso: string) => void;
};

/**
 * Search + scrollable country list for {@link PhoneNumberInput} (anchored by parent).
 */
export const PhoneNumberCountryDropdown = React.forwardRef<
  HTMLDivElement,
  PhoneNumberCountryDropdownProps
>(
  (
    {
      listId,
      searchId,
      searchPlaceholder,
      listAriaLabel,
      query,
      onQueryChange,
      searchRef,
      filtered,
      activeIso,
      onSelectRow,
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        id={listId}
        role="listbox"
        aria-label={listAriaLabel}
        className="absolute start-0 end-0 top-[calc(100%+4px)] z-[80] flex max-h-[min(70vh,420px)] flex-col overflow-hidden rounded-xl border border-grey-100 bg-white shadow-[0_12px_40px_-8px_rgba(0,0,0,0.18)] ring-1 ring-black/5"
      >
        <div className="shrink-0 border-b border-grey-100 p-3">
          <label htmlFor={searchId} className="sr-only">
            {searchPlaceholder}
          </label>
          <input
            ref={searchRef}
            id={searchId}
            type="search"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder={searchPlaceholder}
            autoComplete="off"
            className="h-10 w-full rounded-lg border-2 border-[#7D8DF5] bg-white px-3 text-sm text-[#101828] placeholder:text-grey-400 outline-none transition-shadow focus:border-[#7D8DF5] focus:shadow-[0_0_0_3px_rgba(125,141,245,0.2)]"
          />
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain [scrollbar-width:thin]">
          {filtered.length === 0 ? (
            <p className="px-4 py-5 text-center text-sm text-grey-400">—</p>
          ) : (
            filtered.map((row) => {
              const selected = row.code === activeIso;
              return (
                <button
                  key={row.code}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  className={[
                    "flex w-full items-center gap-3 border-b border-grey-100 px-3 py-2.5 text-left text-sm transition-colors last:border-b-0 sm:px-4 sm:py-3",
                    selected
                      ? "bg-primary-lavender-400 font-medium"
                      : "hover:bg-primary-lavender-100",
                  ].join(" ")}
                  onClick={() => onSelectRow(row.code)}
                >
                  <span
                    className="flex h-5 w-7 shrink-0 items-center justify-center overflow-hidden rounded-sm text-lg leading-none"
                    aria-hidden
                  >
                    {isoToFlagEmoji(row.code)}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-[#101828]">
                    {row.name}
                  </span>
                  <span className="shrink-0 tabular-nums text-sm font-medium text-grey-500">
                    +{row.dial}
                  </span>
                </button>
              );
            })
          )}
        </div>
      </div>
    );
  },
);

PhoneNumberCountryDropdown.displayName = "PhoneNumberCountryDropdown";
