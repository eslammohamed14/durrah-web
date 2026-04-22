import type { ReactNode } from "react";
import { HostVerifyLinearIcon } from "@/assets/icons";

export function HostTrustPill({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex max-w-[min(100%,280px)] shrink-0 items-center gap-1.5 rounded-full border border-[#C2E5D5] bg-[#E9F5F0] px-2.5 py-1.5 text-left text-[11px] font-medium leading-none text-[#29A36A] sm:max-w-none sm:text-[12px] ${className}`}
    >
      <span className="flex h-4 w-4 shrink-0 items-center justify-center">
        <HostVerifyLinearIcon size={16} className="block" />
      </span>
      <span className="min-w-0 leading-snug">{children}</span>
    </span>
  );
}
