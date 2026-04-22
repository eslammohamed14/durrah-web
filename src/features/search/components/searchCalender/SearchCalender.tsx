import { CalendarIcon } from "@/assets/icons/CalendarIcon";
import type { ComponentPropsWithoutRef } from "react";

export type SearchCalenderProps = {
  /** e.g. "16 Feb 2026 - 22 Feb 2026" (Figma Component 79, Property 1=Filled) */
  rangeLabel: string;
  className?: string;
} & Omit<ComponentPropsWithoutRef<"button">, "className" | "children" | "type">;

/**
 * Search date-range control shell from Figma node `1578:27190` (Component 79 / Filled).
 * Renders as a `button` when `onClick` (or other button handlers) is provided; otherwise a static `div`.
 */
export default function SearchCalender({
  rangeLabel,
  className = "",
  onClick,
  ...rest
}: SearchCalenderProps) {
  const interactive = typeof onClick === "function";
  const shellClass =
    "flex h-[42px] w-full max-w-80 shrink-0 items-center gap-2.5 rounded-xl bg-[#fafafa] px-3 py-2 text-left shadow-[0_0_24px_rgba(0,0,0,0.06)]";

  const body = (
    <>
      <span className="min-w-0 flex-1 truncate text-xs font-normal leading-[18px] text-black">
        {rangeLabel}
      </span>
      <span className="flex h-4 w-4 shrink-0 items-center justify-center text-grey-800">
        <CalendarIcon size={16} strokeWidth={1} aria-hidden />
      </span>
    </>
  );

  if (interactive) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`${shellClass} cursor-pointer transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-coral-400 focus-visible:ring-offset-2 ${className}`}
        {...rest}
      >
        {body}
      </button>
    );
  }

  return (
    <div className={`${shellClass} ${className}`} {...rest}>
      {body}
    </div>
  );
}
