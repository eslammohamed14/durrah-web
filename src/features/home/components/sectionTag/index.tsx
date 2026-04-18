import type { ReactNode } from "react";

export interface SectionTagProps {
  icon: ReactNode;
  label: string;
}

export function SectionTag({ icon, label }: SectionTagProps) {
  return (
    <div className="inline-flex w-fit items-center gap-3 rounded-[80px] border border-border-accent px-4 py-2.5">
      <span className="flex h-7 w-7 items-center justify-center">{icon}</span>
      <span className="text-sm font-normal text-primary-blue-300/90 uppercase tracking-wide">
        {label}
      </span>
    </div>
  );
}
