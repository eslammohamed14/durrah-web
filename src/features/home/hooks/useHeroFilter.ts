"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "@/navigation";
import type { Property, PropertyCategory, PropertyType } from "@/lib/types";

// ─── Types ────────────────────────────────────────────────────────────────────

export type HeroTab = "rent" | "buy";

export interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

export interface PriceRange {
  label: string;
  min: number;
  max: number;
}

export const PRICE_RANGES: PriceRange[] = [
  { label: "Any price", min: 0, max: Infinity },
  { label: "0 – 500 SAR", min: 0, max: 500 },
  { label: "500 – 1,500 SAR", min: 500, max: 1500 },
  { label: "1,500 – 5,000 SAR", min: 1500, max: 5000 },
  { label: "5,000+ SAR", min: 5000, max: Infinity },
];

// Unit types shown per tab
const UNIT_TYPES_BY_TAB: Record<
  HeroTab,
  { value: PropertyType; labelKey: string }[]
> = {
  rent: [
    { value: "apartment", labelKey: "propertyType.apartment" },
    { value: "villa", labelKey: "propertyType.villa" },
    { value: "townhouse", labelKey: "propertyType.townhouse" },
    { value: "shop", labelKey: "propertyType.shop" },
    { value: "activity_venue", labelKey: "propertyType.activity_venue" },
  ],
  buy: [
    { value: "apartment", labelKey: "propertyType.apartment" },
    { value: "villa", labelKey: "propertyType.villa" },
    { value: "townhouse", labelKey: "propertyType.townhouse" },
  ],
};

export { UNIT_TYPES_BY_TAB };

// ─── Hook ─────────────────────────────────────────────────────────────────────

export interface UseHeroFilterOptions {
  allProperties: Property[];
}

export function useHeroFilter({ allProperties }: UseHeroFilterOptions) {
  const router = useRouter();

  // ── State ──────────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<HeroTab>("rent");
  const [selectedType, setSelectedType] = useState<PropertyType | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });
  const [guests, setGuests] = useState(1);
  const [selectedPriceRange, setSelectedPriceRange] = useState<PriceRange>(
    PRICE_RANGES[0],
  );

  // Which dropdown/popover is open
  const [openPanel, setOpenPanel] = useState<
    "type" | "date" | "guests" | "price" | null
  >(null);

  // Ref for click-outside detection
  const containerRef = useRef<HTMLDivElement>(null);

  // ── Derived ────────────────────────────────────────────────────────────────
  const unitTypes = UNIT_TYPES_BY_TAB[activeTab];

  /** Live-filtered count so the user gets instant feedback */
  const filteredCount = allProperties.filter((p) => {
    const category: PropertyCategory = activeTab === "rent" ? "rent" : "buy";
    if (p.category !== category) return false;
    if (selectedType && p.type !== selectedType) return false;
    if (
      selectedPriceRange.max !== Infinity &&
      p.pricing.basePrice > selectedPriceRange.max
    )
      return false;
    if (p.pricing.basePrice < selectedPriceRange.min) return false;
    return true;
  }).length;

  // ── Handlers ───────────────────────────────────────────────────────────────
  const togglePanel = useCallback(
    (panel: "type" | "date" | "guests" | "price") => {
      setOpenPanel((prev) => (prev === panel ? null : panel));
    },
    [],
  );

  const closePanel = useCallback(() => setOpenPanel(null), []);

  const handleTabChange = useCallback((tab: HeroTab) => {
    setActiveTab(tab);
    setSelectedType(null);
    setOpenPanel(null);
  }, []);

  const incrementGuests = useCallback(() => setGuests((n) => n + 1), []);

  const decrementGuests = useCallback(
    () => setGuests((n) => Math.max(1, n - 1)),
    [],
  );

  const handleSearch = useCallback(() => {
    const params = new URLSearchParams();
    params.set("category", activeTab);
    if (selectedType) params.set("type", selectedType);
    if (dateRange.from)
      params.set("checkIn", dateRange.from.toISOString().split("T")[0]);
    if (dateRange.to)
      params.set("checkOut", dateRange.to.toISOString().split("T")[0]);
    if (guests > 1) params.set("adults", String(guests));
    if (selectedPriceRange.min > 0)
      params.set("priceMin", String(selectedPriceRange.min));
    if (selectedPriceRange.max !== Infinity)
      params.set("priceMax", String(selectedPriceRange.max));

    router.push(`/search?${params.toString()}`);
  }, [activeTab, selectedType, dateRange, guests, selectedPriceRange, router]);

  // ── Date helpers ───────────────────────────────────────────────────────────
  const formatDateRange = useCallback((range: DateRange): string => {
    if (!range.from) return "";
    const fmt = (d: Date) =>
      d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
    return range.to ? `${fmt(range.from)} – ${fmt(range.to)}` : fmt(range.from);
  }, []);

  return {
    // state
    activeTab,
    selectedType,
    dateRange,
    guests,
    selectedPriceRange,
    openPanel,
    containerRef,
    // derived
    unitTypes,
    filteredCount,
    // actions
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
  };
}
