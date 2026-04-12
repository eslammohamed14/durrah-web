import type { SVGProps } from "react";

/**
 * Vuesax bold arrow-down (solid).
 */
export interface ArrowSolidDownIconProps
  extends Omit<SVGProps<SVGSVGElement>, "width" | "height"> {
  size?: number;
  color?: string;
}

export function ArrowSolidDownIcon({
  size = 16,
  color = "currentColor",
  className,
  ...rest
}: ArrowSolidDownIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
      {...rest}
    >
      <path
        d="M11.8762 6.20337L9.78931 8.28931L8.47681 9.60278C8.21637 9.86322 7.79096 9.86322 7.53052 9.60278L4.1311 6.20337H11.8762Z"
        fill={color}
        stroke={color}
        strokeWidth={1.5}
      />
    </svg>
  );
}
