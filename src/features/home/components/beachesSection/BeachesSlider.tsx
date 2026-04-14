"use client";

import { useState } from "react";
import { ArrowRightIcon } from "@/assets/icons";
import { BeachItem, type BeachItemData } from "./BeachItem";

export interface BeachesSliderProps {
  items: BeachItemData[];
}

export function BeachesSlider({ items }: BeachesSliderProps) {
  const visibleOffsets = [-2, -1, 0, 1, 2] as const;
  const initialIndex = Math.floor(items.length / 2);
  const [activeIndex, setActiveIndex] = useState(initialIndex);

  const normalizeIndex = (index: number) => {
    const length = items.length;
    return ((index % length) + length) % length;
  };

  const getItemByOffset = (offset: number) => {
    const index = normalizeIndex(activeIndex + offset);
    return { item: items[index], index };
  };

  const handleNext = () => {
    setActiveIndex((prev) => normalizeIndex(prev + 1));
  };

  const handlePrev = () => {
    setActiveIndex((prev) => normalizeIndex(prev - 1));
  };

  if (items.length === 0) return null;

  return (
    <div className="space-y-5">
      <div className="flex h-[411px] items-end justify-center overflow-visible">
        {visibleOffsets.map((offset, renderOrder) => {
          const { item, index } = getItemByOffset(offset);
          const distanceFromActive = Math.abs(offset);
          const zIndex = distanceFromActive === 0 ? 30 : distanceFromActive === 1 ? 20 : 10;
          const marginClass = renderOrder === 0 ? "" : "-ml-[34px]";

          return (
            <div
              key={`${item.id}-${activeIndex}-${offset}`}
              className={`flex h-[411px] items-end justify-center ${marginClass}`}
              style={{ zIndex }}
            >
            <BeachItem
              item={item}
              isActive={index === activeIndex}
              distanceFromActive={distanceFromActive}
            />
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          className="beaches-prev flex h-10 w-10 items-center justify-center rounded-full border border-[#C4C7EB] bg-transparent text-[#2A2F73] transition-colors hover:bg-white/40"
          aria-label="Previous beach"
          onClick={handlePrev}
        >
          <ArrowRightIcon className="h-[18px] w-[18px] rotate-180" />
        </button>
        <button
          type="button"
          className="beaches-next flex h-10 w-10 items-center justify-center rounded-full border border-[#C4C7EB] bg-transparent text-[#2A2F73] transition-colors hover:bg-white/40"
          aria-label="Next beach"
          onClick={handleNext}
        >
          <ArrowRightIcon className="h-[18px] w-[18px]" />
        </button>
      </div>
    </div>
  );
}
