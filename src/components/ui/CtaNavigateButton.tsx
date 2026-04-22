"use client";

import type { ReactNode } from "react";
import { useRouter } from "@/navigation";
import { Button } from "./Button";

export interface CtaNavigateButtonProps {
  href: string;
  children: ReactNode;
  className?: string;
  rightIcon?: ReactNode;
}

export function CtaNavigateButton({
  href,
  children,
  className = "",
  rightIcon,
}: CtaNavigateButtonProps) {
  const router = useRouter();

  return (
    <Button
      type="button"
      variant="primary"
      backgroundColor="#FF765E"
      className={`h-12 rounded-lg px-4 text-base font-medium text-white shadow-none hover:!bg-[#e8614a] active:!bg-[#d45540] focus-visible:!ring-primary-coral-400 disabled:!bg-primary-coral-400/50 ${className}`}
      rightIcon={rightIcon}
      onClick={() => router.push(href)}
    >
      {children}
    </Button>
  );
}
