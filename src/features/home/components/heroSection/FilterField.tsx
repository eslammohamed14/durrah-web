"use client";

import type { ReactNode } from "react";
import { ArrowDownIcon, ArrowUpIcon, CalendarIcon } from "@/assets/icons";

export type FilterFieldTrailing = "chevron" | "calendar" | "dualChevron";

export interface FilterFieldProps {
  label: string;
  placeholder: string;
  /** Single chevron (select), calendar (dates), or up+down chevrons (e.g. guests). */
  trailing: FilterFieldTrailing;
  /** Extra classes for chevron icons (e.g. `text-[#000000]`). */
  chevronClassName?: string;
}

function DualChevrons({ iconClassName }: { iconClassName?: string }) {
  const cls = iconClassName ?? "text-[#000000]";
  return (
    <div
      className="flex shrink-0 flex-col items-center justify-center leading-none"
      aria-hidden
    >
      <ArrowUpIcon size={12} className={cls} />
      <ArrowDownIcon size={12} className={cls} />
    </div>
  );
}

export function FilterField({
  label,
  placeholder,
  trailing,
  chevronClassName,
}: FilterFieldProps) {
  let right: ReactNode;
  switch (trailing) {
    case "calendar":
      right = <CalendarIcon />;
      break;
    case "dualChevron":
      right = <DualChevrons iconClassName={chevronClassName} />;
      break;
    case "chevron":
    default: {
      const chevronCls = ["h-4 w-4 shrink-0", chevronClassName]
        .filter(Boolean)
        .join(" ");
      right = <ArrowDownIcon className={chevronCls} />;
      break;
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-2">
      <label className="text-xs font-normal text-[#F5F4F2]">{label}</label>
      <div className="flex h-[42px] items-center gap-2.5 rounded-xl bg-white px-3 py-2">
        <span className="flex-1 text-xs text-[#8B8B8C]">{placeholder}</span>
        {right}
      </div>
    </div>
  );
}
