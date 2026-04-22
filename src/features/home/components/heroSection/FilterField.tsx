"use client";

import type { ReactNode } from "react";
import {
  ArrowSolidDownIcon,
  ArrowSolidUpIcon,
  CalendarIcon,
} from "@/assets/icons";
import { useLocale } from "@/lib/contexts/LocaleContext";

export type FilterFieldTrailing = "chevron" | "calendar" | "dualChevron";

export type FilterFieldVariant = "hero" | "card";

export interface FilterFieldProps {
  label: string;
  /** Displayed value; falls back to placeholder styling when empty */
  value?: string;
  placeholder: string;
  trailing: FilterFieldTrailing;
  /** `hero` matches the home hero (light labels); `card` matches light surfaces (e.g. booking sidebar). */
  variant?: FilterFieldVariant;
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
  /** Optional icon or node before the value (e.g. profile-2user on guest field). */
  leading?: ReactNode;
  /** When `label` is empty, set for accessibility (e.g. guest field). */
  ariaLabel?: string;
}

export function FilterField({
  label,
  value,
  placeholder,
  trailing,
  variant = "hero",
  chevronClassName,
  isOpen = false,
  onClick,
  onIncrement,
  onDecrement,
  decrementDisabled,
  panel,
  leading,
  ariaLabel,
}: FilterFieldProps) {
  const { dir } = useLocale();
  const hasValue = Boolean(value);
  const isCard = variant === "card";

  // ── Trailing element ───────────────────────────────────────────────────────
  let right: ReactNode;

  const mutedIcon = isCard ? "#8B8B8C" : "#8B8B8C";
  const activeIcon = isCard ? "#FF765E" : "#FF765E";

  if (trailing === "calendar") {
    right = (
      <CalendarIcon
        size={16}
        color={isOpen ? activeIcon : mutedIcon}
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
          <ArrowSolidUpIcon
            size={12}
            color={chevronClassName ?? (isCard ? "#404040" : "#000000")}
          />
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
          <ArrowSolidDownIcon
            size={12}
            color={chevronClassName ?? (isCard ? "#404040" : "#000000")}
          />
        </div>
      </div>
    );
  } else {
    // chevron
    right = (
      <ArrowSolidDownIcon
        size={14}
        color={isOpen ? activeIcon : mutedIcon}
        className={[
          "shrink-0 transition-transform duration-200",
          isOpen ? "rotate-180" : "",
        ].join(" ")}
      />
    );
  }

  return (
    <div className={["relative flex flex-1 flex-col", label ? "gap-2" : "gap-0"].join(" ")}>
      {label ? (
        <label
          className={
            isCard
              ? "text-base font-semibold leading-[1.5] text-grey-800"
              : "text-xs font-normal text-[#F5F4F2]"
          }
        >
          {label}
        </label>
      ) : null}

      {/* Trigger */}
      <button
        type="button"
        onClick={onClick}
        aria-expanded={isOpen}
        aria-label={ariaLabel}
        aria-haspopup={trailing !== "dualChevron" ? "listbox" : undefined}
        dir={dir}
        className={[
          "flex h-[42px] w-full items-center gap-2.5 rounded-xl px-3 py-2 transition-shadow",
          isCard
            ? "border border-grey-50 bg-surface-primary shadow-[0_0_24px_0_rgba(0,0,0,0.06)]"
            : "bg-white",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-coral-400",
          dir === "rtl" ? "flex-row-reverse text-right" : "text-left",
          isOpen ? "ring-2 ring-primary-coral-400" : "",
        ].join(" ")}
      >
        <span
          className={[
            "flex min-w-0 flex-1 items-center gap-2.5 truncate",
            isCard ? "text-sm" : "text-xs",
            hasValue
              ? isCard
                ? "font-medium text-grey-900"
                : "text-[#1A1A1A] font-medium"
              : "text-[#8B8B8C]",
          ].join(" ")}
        >
          {leading ? <span className="shrink-0">{leading}</span> : null}
          <span className="min-w-0 truncate">{hasValue ? value : placeholder}</span>
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
