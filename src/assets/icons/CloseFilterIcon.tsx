import type { SVGProps } from "react";

export interface CloseFilterIconProps
  extends Omit<SVGProps<SVGSVGElement>, "width" | "height"> {
  size?: number;
  color?: string;
}

export function CloseFilterIcon({
  size = 14,
  color = "#262626",
  className,
  ...rest
}: CloseFilterIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
      {...rest}
    >
      <path
        d="M6.00195 18L18.002 6"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.002 18L6.00195 6"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
