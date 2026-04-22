"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { ArrowNormalDown, ArrowNormalUp } from "@/assets/icons";

interface CollapseSectionProps {
  title: string;
  content: ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export default function CollapseSection({
  title,
  content,
  defaultOpen = false,
  className,
}: CollapseSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={["border-b border-border-default py-4", className ?? ""].join(" ")}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-center justify-between gap-3 text-left"
      >
        <h3 className="text-[28px] font-semibold leading-[1.4] text-primary-blue-400">
          {title}
        </h3>
        {isOpen ? (
          <ArrowNormalUp size={24} color="#FF765E" />
        ) : (
          <ArrowNormalDown size={24} color="#262626" />
        )}
      </button>
      {isOpen ? <div className="mt-3">{content}</div> : null}
    </div>
  );
}
