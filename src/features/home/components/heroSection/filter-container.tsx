"use client";

import Link from "next/link";
import { useLocale } from "@/lib/contexts/LocaleContext";
import { SearchIcon } from "@/assets/icons";
import { FilterField } from "./FilterField";
import { Button } from "@/components/ui/Button";

export function FilterContainer() {
  const { t } = useLocale();

  return (
    <div className="rounded-2xl bg-white/10 backdrop-blur-[8px] px-4 py-5 flex flex-col gap-6">
      {/* Find your dream escape + Rent/Buy tabs */}
      <div className="flex flex-col gap-3">
        <p className="text-xl font-medium text-white">
          {t("home.findYourDreamEscape")}
        </p>
        {/* Tabs */}
        <div className="flex w-[132px] items-stretch gap-1 rounded-lg border border-[#F0F1F3] bg-white p-0.5">
          <button
            type="button"
            className="flex-1 rounded-lg bg-[#FF765E] py-1 text-xs font-medium text-white shadow-sm"
          >
            {t("nav.rent")}
          </button>
          <button
            type="button"
            className="flex-1 rounded-lg py-1 text-xs font-medium text-[#8B8B8C]"
          >
            {t("nav.buy")}
          </button>
        </div>
      </div>

      {/* Search fields row */}
      <div className="flex items-end gap-4">
        {/* Fields */}
        <div className="flex flex-1 items-end gap-3">
          <FilterField
            label={t("home.unitType")}
            placeholder={t("home.selectUnitType")}
            trailing="chevron"
            chevronClassName="text-[#000000]"
          />
          <FilterField
            label={t("home.bookingDates")}
            placeholder={t("home.addDates")}
            trailing="calendar"
          />
          <FilterField
            label={t("search.guests")}
            placeholder={t("search.guests")}
            trailing="dualChevron"
            chevronClassName="text-[#000000]"
          />
          <FilterField
            label={t("search.priceRange")}
            placeholder={t("home.selectPriceRange")}
            trailing="chevron"
          />
        </div>
        {/* Search button */}

        <Button
          size="md"
          backgroundColor="#FF765E"
          className="flex h-12 w-[152px] items-center justify-center gap-2.5 rounded-lg text-base font-medium text-white transition-colors hover:bg-[#e8614a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF765E] focus-visible:ring-offset-2"
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
              aria-hidden="true"
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
