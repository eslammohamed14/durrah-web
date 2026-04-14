"use client";

import { DayPicker } from "react-day-picker";
import type { DateRange } from "../../hooks/useHeroFilter";

// Import react-day-picker base styles (minimal, we override with Tailwind)
import "react-day-picker/style.css";

interface DateRangePanelProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
}

export function DateRangePanel({ value, onChange }: DateRangePanelProps) {
  const selected =
    value.from || value.to ? { from: value.from, to: value.to } : undefined;

  return (
    <div className="rounded-2xl bg-white p-3 shadow-xl ring-1 ring-black/10">
      <DayPicker
        mode="range"
        selected={selected}
        onSelect={(range) => {
          onChange({ from: range?.from, to: range?.to });
        }}
        disabled={{ before: new Date() }}
        numberOfMonths={2}
        classNames={{
          root: "rdp-custom",
          months: "flex gap-6",
          month: "flex flex-col gap-2",
          month_caption: "flex items-center justify-between px-1 py-1",
          caption_label: "text-sm font-semibold text-gray-900",
          nav: "flex items-center gap-1",
          button_previous:
            "flex h-7 w-7 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF765E]",
          button_next:
            "flex h-7 w-7 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF765E]",
          weekdays: "flex",
          weekday: "w-9 text-center text-xs font-medium text-gray-400 py-1",
          weeks: "flex flex-col gap-1",
          week: "flex",
          day: "relative flex h-9 w-9 items-center justify-center",
          day_button:
            "h-9 w-9 rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF765E] focus-visible:ring-offset-1",
          selected:
            "[&>button]:bg-[#FF765E] [&>button]:text-white [&>button]:hover:bg-[#e8614a]",
          range_start:
            "rounded-l-full bg-[#FF765E]/15 [&>button]:bg-[#FF765E] [&>button]:text-white",
          range_end:
            "rounded-r-full bg-[#FF765E]/15 [&>button]:bg-[#FF765E] [&>button]:text-white",
          range_middle:
            "bg-[#FF765E]/10 rounded-none [&>button]:text-[#FF765E] [&>button]:hover:bg-[#FF765E]/20",
          today: "[&>button]:font-bold [&>button]:underline",
          outside: "opacity-30",
          disabled:
            "opacity-25 cursor-not-allowed [&>button]:cursor-not-allowed",
          hidden: "invisible",
        }}
      />
    </div>
  );
}
