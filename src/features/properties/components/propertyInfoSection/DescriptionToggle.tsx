"use client";

import { useMemo, useState } from "react";
import DOMPurify from "isomorphic-dompurify";
import { useTranslations } from "next-intl";
import { stripHtml } from "@/lib/utils/stripHtml";

const CLAMP_LENGTH = 260;

interface DescriptionToggleProps {
  descriptionHtml: string;
}

export function DescriptionToggle({ descriptionHtml }: DescriptionToggleProps) {
  const t = useTranslations();
  const [expanded, setExpanded] = useState(false);
  const sanitizedHtml = useMemo(
    () => DOMPurify.sanitize(descriptionHtml),
    [descriptionHtml],
  );
  const plainText = useMemo(() => stripHtml(sanitizedHtml), [sanitizedHtml]);
  const shouldClamp = plainText.length > CLAMP_LENGTH;

  const visibleText =
    shouldClamp && !expanded
      ? `${plainText.slice(0, CLAMP_LENGTH).trimEnd()}..`
      : plainText;

  return (
    <div className="text-[18px] leading-[1.6] text-grey-600">
      <div
        dangerouslySetInnerHTML={{
          __html: shouldClamp && !expanded ? visibleText : sanitizedHtml,
        }}
      />{" "}
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
    </div>
  );
}
