"use client";

import { useEffect, useRef } from "react";
import { useLocale } from "@/lib/contexts/LocaleContext";
import { SearchIcon } from "@/assets/icons";
import { Button } from "@/components/ui/Button";
import { FilterField } from "./FilterField";
import { DateRangePanel } from "./DateRangePanel";
import { useHeroFilter, PRICE_RANGES } from "../../hooks/useHeroFilter";
import type { Property } from "@/lib/types";

interface FilterContainerProps {
  allProperties: Property[];
}

export function FilterContainer({ allProperties }: FilterContainerProps) {
  const { t, dir } = useLocale();
  const wrapperRef = useRef<HTMLDivElement>(null);

  const {
    activeTab,
    selectedType,
    dateRange,
    guests,
    selectedPriceRange,
    openPanel,
    unitTypes,
    handleTabChange,
    setSelectedType,
    setDateRange,
    incrementGuests,
    decrementGuests,
    setSelectedPriceRange,
    togglePanel,
    closePanel,
    handleSearch,
    formatDateRange,
  } = useHeroFilter({ allProperties });

  // Close any open panel when clicking outside the whole widget
  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        closePanel();
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [closePanel]);

  // ── Derived display values ─────────────────────────────────────────────────
  const typeLabel = selectedType ? t(`propertyType.${selectedType}`) : "";
  const dateLabel = formatDateRange(dateRange);
  const guestsLabel = String(guests);
  const priceLabel =
    selectedPriceRange.min === 0 && selectedPriceRange.max === Infinity
      ? ""
      : selectedPriceRange.label;

  return (
    <div
      ref={wrapperRef}
      className="rounded-2xl bg-white/10 backdrop-blur-[8px] px-4 py-5 flex flex-col gap-6"
      dir={dir}
    >
      {/* Title + Rent/Buy tabs */}
      <div className="flex flex-col gap-3">
        <p className="text-xl font-medium text-white">
          {t("home.findYourDreamEscape")}
        </p>
        <div className="flex w-[132px] items-stretch gap-1 rounded-lg border border-[#F0F1F3] bg-white p-0.5">
          {(["rent", "buy"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => handleTabChange(tab)}
              className={[
                "flex-1 rounded-lg py-1 text-xs font-medium transition-colors",
                activeTab === tab
                  ? "bg-[#FF765E] text-white shadow-sm"
                  : "text-[#8B8B8C] hover:text-gray-700",
              ].join(" ")}
            >
              {t(`nav.${tab}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Fields row */}
      <div className="flex items-end gap-4">
        <div className="flex flex-1 items-end gap-3" dir={dir}>
          {/* ── Unit Type ── */}
          <div className="relative flex-1">
            <FilterField
              label={t("home.unitType")}
              value={typeLabel}
              placeholder={t("home.selectUnitType")}
              trailing="chevron"
              chevronClassName="#000000"
              isOpen={openPanel === "type"}
              onClick={() => togglePanel("type")}
              panel={
                <ul
                  role="listbox"
                  aria-label={t("home.unitType")}
                  className="rounded-xl bg-white py-1 shadow-xl ring-1 ring-black/10"
                >
                  {unitTypes.map(({ value, labelKey }) => (
                    <li
                      key={value}
                      role="option"
                      aria-selected={selectedType === value}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedType(
                            selectedType === value ? null : value,
                          );
                          closePanel();
                        }}
                        className={[
                          "flex w-full items-center gap-2 px-4 py-2.5 text-sm transition-colors hover:bg-gray-50",
                          selectedType === value
                            ? "font-semibold text-[#FF765E]"
                            : "text-gray-700",
                        ].join(" ")}
                      >
                        {selectedType === value && (
                          <CheckIcon className="h-3.5 w-3.5 shrink-0 text-[#FF765E]" />
                        )}
                        <span className={selectedType === value ? "" : "ps-5"}>
                          {t(labelKey)}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              }
            />
          </div>

          {/* ── Booking Dates ── */}
          <div className="relative flex-1">
            <FilterField
              label={t("home.bookingDates")}
              value={dateLabel}
              placeholder={t("home.addDates")}
              trailing="calendar"
              isOpen={openPanel === "date"}
              onClick={() => togglePanel("date")}
              panel={
                <DateRangePanel
                  value={dateRange}
                  onChange={(range) => {
                    setDateRange(range);
                    // Auto-close once both dates are picked
                    if (range.from && range.to) closePanel();
                  }}
                />
              }
            />
          </div>

          {/* ── Guests ── */}
          <div className="relative flex-1">
            <FilterField
              label={t("search.guests")}
              value={guestsLabel}
              placeholder={t("search.guests")}
              trailing="dualChevron"
              chevronClassName="#000000"
              isOpen={openPanel === "guests"}
              onClick={() => togglePanel("guests")}
              onIncrement={incrementGuests}
              onDecrement={decrementGuests}
              decrementDisabled={guests <= 1}
            />
          </div>

          {/* ── Price Range ── */}
          <div className="relative flex-1">
            <FilterField
              label={t("search.priceRange")}
              value={priceLabel}
              placeholder={t("home.selectPriceRange")}
              trailing="chevron"
              isOpen={openPanel === "price"}
              onClick={() => togglePanel("price")}
              panel={
                <ul
                  role="listbox"
                  aria-label={t("search.priceRange")}
                  className="rounded-xl bg-white py-1 shadow-xl ring-1 ring-black/10"
                >
                  {PRICE_RANGES.map((range) => (
                    <li
                      key={range.label}
                      role="option"
                      aria-selected={selectedPriceRange.label === range.label}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedPriceRange(range);
                          closePanel();
                        }}
                        className={[
                          "flex w-full items-center gap-2 px-4 py-2.5 text-sm transition-colors hover:bg-gray-50",
                          selectedPriceRange.label === range.label
                            ? "font-semibold text-[#FF765E]"
                            : "text-gray-700",
                        ].join(" ")}
                      >
                        {selectedPriceRange.label === range.label && (
                          <CheckIcon className="h-3.5 w-3.5 shrink-0 text-[#FF765E]" />
                        )}
                        <span
                          className={
                            selectedPriceRange.label === range.label
                              ? ""
                              : "ps-5"
                          }
                        >
                          {range.label}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              }
            />
          </div>
        </div>

        {/* Search button */}
        <Button
          size="md"
          backgroundColor="#FF765E"
          onClick={() => {}} //handleSearch
          className="flex h-12 w-[152px] shrink-0 items-center justify-center gap-2.5 rounded-lg text-base font-medium text-white transition-colors hover:bg-[#e8614a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF765E] focus-visible:ring-offset-2"
          leftIcon={<SearchIcon size={24} />}
        >
          {t("common.search")}
        </Button>
      </div>

      {/* Filter tags */}
      <div className="flex items-center gap-4">
        <span className="text-xs text-white">{t("home.filter")}</span>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2.5 rounded-full border border-[#FF765E] bg-[#FFE4DE] px-3 py-2">
            <span className="text-xs font-medium text-[#FF765E]">
              {t("home.specialOffers")}
            </span>
            <svg
              className="h-4 w-4 text-[#FF765E]"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden
            >
              <path
                d="M4 4l8 8M12 4l-8 8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div className="flex items-center gap-2.5 rounded-full border border-[#F1F1F2]/50 bg-white/5 px-3 py-2">
            <span className="text-xs font-normal text-white">
              {t("home.topRatedFilter")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 8l3.5 3.5L13 4.5"
      />
    </svg>
  );
}
