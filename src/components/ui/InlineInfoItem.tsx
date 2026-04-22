import type { ReactNode } from "react";

interface InlineInfoItemProps {
  icon: ReactNode;
  text: ReactNode;
  showDivider?: boolean;
  className?: string;
}

export default function InlineInfoItem({
  icon,
  text,
  showDivider = false,
  className,
}: InlineInfoItemProps) {
  return (
    <div
      className={[
        "flex items-center gap-1.5 text-grey-600",
        showDivider ? "border-e border-grey-100 pe-3.5" : "",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {icon}
      <span>{text}</span>
    </div>
  );
}
