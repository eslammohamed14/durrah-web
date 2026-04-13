import type { SVGProps } from "react";

export interface BeachesSectionIconProps extends Omit<
  SVGProps<SVGSVGElement>,
  "width" | "height"
> {
  size?: number;
  color?: string;
}

export function BeachesSectionIcon({
  size = 28,
  color = "#363C88",
  className,
  ...rest
}: BeachesSectionIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
      {...rest}
    >
      <path
        d="M4 20c4-8 16-8 20 0M14 4v4M6 8l2 2M22 8l-2 2"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
