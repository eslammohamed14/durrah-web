"use client";

import { useState } from "react";
import { useRouter } from "@/navigation";
import { useLocale } from "@/lib/contexts/LocaleContext";

/**
 * Search bar from Figma node 1578:27192 (file XKx3FF4Xw6ZpvooyvB71Kn):
 * filled field + primary coral CTA, spacing and radii matched to spec.
 */
export function SearchBar2() {
  const { t } = useLocale();
  const router = useRouter();
  const [location, setLocation] = useState("");

  function handleSearch() {
    const params = new URLSearchParams({ category: "rent" });
    if (location.trim()) params.set("location", location.trim());
    router.push(`/search?${params.toString()}`);
  }

  return (
    <div
      className="flex w-full max-w-[856px] flex-col items-stretch gap-3 sm:flex-row sm:items-center"
      role="search"
      aria-label={t("common.search")}
    >
      {/* Frame 1984078964 — search field */}
      <div className="flex min-h-[42px] min-w-0 flex-1 items-center gap-1 rounded-xl border border-border-default bg-surface-primary px-3 py-3 shadow-[0_0_24px_rgba(0,0,0,0.06)]">
        {/* <SearchGlyph
          className="size-[18px] shrink-0 text-grey-200"
          aria-hidden
        /> */}
        <SearchIcon className="h-4 w-4" />
        {/*  */}
        <input
          id="search-bar-2-location"
          type="search"
          enterKeyHint="search"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder={t("search.barPlaceholder")}
          className="min-w-0 flex-1 bg-transparent text-xs leading-[18px] text-text-dark placeholder:text-grey-200 focus:outline-none"
        />
      </div>

      {/* BTN — Primary */}
      <button
        type="button"
        onClick={handleSearch}
        className="inline-flex h-[42px] shrink-0 items-center justify-center rounded-xl bg-primary-coral-400 px-4 py-2 text-sm font-medium leading-[21px] text-white transition-colors hover:bg-primary-coral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-coral-400 focus-visible:ring-offset-2"
      >
        {t("common.search")}
      </button>
    </div>
  );
}


function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
  );
}