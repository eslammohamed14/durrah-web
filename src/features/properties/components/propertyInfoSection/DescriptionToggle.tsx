"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

const CLAMP_LENGTH = 260;

interface DescriptionToggleProps {
  description: string;
}

export function DescriptionToggle({ description }: DescriptionToggleProps) {
  const t = useTranslations();
  const [expanded, setExpanded] = useState(false);
  const shouldClamp = description.length > CLAMP_LENGTH;

  const visibleDescription =
    shouldClamp && !expanded
      ? `${description.slice(0, CLAMP_LENGTH).trimEnd()}..`
      : description;

  return (
    <p className="text-[18px] leading-[1.6] text-grey-600">
      {visibleDescription}{" "}
      {shouldClamp ? (
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="text-[18px] font-semibold leading-[1.4] text-primary-blue-400"
        >
          {expanded
            ? t("propertyDetails.readLess")
            : t("propertyDetails.readMore")}
        </button>
      ) : null}
    </p>
  );
}
