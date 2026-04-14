import type { SVGProps } from "react";

export interface DimensionIconProps extends Omit<
  SVGProps<SVGSVGElement>,
  "width" | "height"
> {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export function DimensionIcon({
  size = 18,
  color = "currentColor",
  strokeWidth: sw = 1.1,
  className,
  ...rest
}: DimensionIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
      {...rest}
    >
      <path
        d="M6 3H3M3 3V6M3 3L6.75 6.75M12 3H15M15 3V6M15 3L11.25 6.75M6 15H3M3 15V12M3 15L6.75 11.25M12 15H15M15 15V12M15 15L11.25 11.25"
        stroke={color}
        strokeWidth={sw}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
