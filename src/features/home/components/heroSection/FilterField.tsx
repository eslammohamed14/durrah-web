"use client";

import type { ReactNode } from "react";
import {
  ArrowSolidDownIcon,
  ArrowSolidUpIcon,
  CalendarIcon,
} from "@/assets/icons";
import { useLocale } from "@/lib/contexts/LocaleContext";

export type FilterFieldTrailing = "chevron" | "calendar" | "dualChevron";

export interface FilterFieldProps {
  label: string;
  /** Displayed value; falls back to placeholder styling when empty */
  value?: string;
  placeholder: string;
  trailing: FilterFieldTrailing;
  chevronClassName?: string;
  /** Whether the dropdown/panel below this field is open */
  isOpen?: boolean;
  onClick?: () => void;
  /** For dualChevron fields: called when up arrow is clicked */
  onIncrement?: () => void;
  /** For dualChevron fields: called when down arrow is clicked */
  onDecrement?: () => void;
  /** Whether decrement should be disabled (e.g. guests = 1) */
  decrementDisabled?: boolean;
  /** Slot for a dropdown/popover rendered directly below the field */
  panel?: ReactNode;
}

export function FilterField({
  label,
  value,
  placeholder,
  trailing,
  chevronClassName,
  isOpen = false,
  onClick,
  onIncrement,
  onDecrement,
  decrementDisabled,
  panel,
}: FilterFieldProps) {
  const { dir } = useLocale();
  const hasValue = Boolean(value);

  // ── Trailing element ───────────────────────────────────────────────────────
  let right: ReactNode;

  if (trailing === "calendar") {
    right = (
      <CalendarIcon
        size={16}
        color={isOpen ? "#FF765E" : "#8B8B8C"}
        className="shrink-0 transition-colors"
      />
    );
  } else if (trailing === "dualChevron") {
    right = (
      <div className="flex shrink-0 flex-col items-center gap-0.5">
        {/* Use divs with role="button" to avoid nested <button> inside the outer trigger <button> */}
        <div
          role="button"
          tabIndex={-1}
          onPointerDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onIncrement?.();
          }}
          className="flex cursor-pointer items-center justify-center rounded p-0.5 hover:bg-black/10"
          aria-label="Increase"
        >
          <ArrowSolidUpIcon size={12} color={chevronClassName ?? "#000000"} />
        </div>
        <div
          role="button"
          tabIndex={-1}
          onPointerDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!decrementDisabled) onDecrement?.();
          }}
          aria-disabled={decrementDisabled}
          className={[
            "flex cursor-pointer items-center justify-center rounded p-0.5 hover:bg-black/10",
            decrementDisabled ? "pointer-events-none opacity-30" : "",
          ].join(" ")}
          aria-label="Decrease"
        >
          <ArrowSolidDownIcon size={12} color={chevronClassName ?? "#000000"} />
        </div>
      </div>
    );
  } else {
    // chevron
    right = (
      <ArrowSolidDownIcon
        size={14}
        color={isOpen ? "#FF765E" : "#8B8B8C"}
        className={[
          "shrink-0 transition-transform duration-200",
          isOpen ? "rotate-180" : "",
        ].join(" ")}
      />
    );
  }

  return (
    <div className="relative flex flex-1 flex-col gap-2">
      <label className="text-xs font-normal text-[#F5F4F2]">{label}</label>

      {/* Trigger */}
      <button
        type="button"
        onClick={onClick}
        aria-expanded={isOpen}
        aria-haspopup={trailing !== "dualChevron" ? "listbox" : undefined}
        dir={dir}
        className={[
          "flex h-[42px] w-full items-center gap-2.5 rounded-xl bg-white px-3 py-2 transition-shadow",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-coral-400",
          dir === "rtl" ? "flex-row-reverse text-right" : "text-left",
          isOpen ? "ring-2 ring-primary-coral-400" : "",
        ].join(" ")}
      >
        <span
          className={[
            "flex-1 truncate text-xs",
            hasValue ? "text-[#1A1A1A] font-medium" : "text-[#8B8B8C]",
          ].join(" ")}
        >
          {hasValue ? value : placeholder}
        </span>
        {right}
      </button>

      {/* Panel slot — rendered below the field, absolutely positioned */}
      {isOpen && panel && (
        <div
          className={[
            "absolute top-full z-50 mt-2 min-w-full",
            dir === "rtl" ? "right-0" : "left-0",
          ].join(" ")}
          role="presentation"
          onClick={(e) => e.stopPropagation()}
        >
          {panel}
        </div>
      )}
    </div>
  );
}
