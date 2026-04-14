import type { SVGProps } from "react";

/**
 * Vuesax linear calendar-2.
 */
export interface CalendarIconProps extends Omit<
  SVGProps<SVGSVGElement>,
  "width" | "height"
> {
  size?: number;
  color?: string;
  /** Stroke width for linear paths (source SVG uses implicit 1). */
  strokeWidth?: number;
}

export function CalendarIcon({
  size = 16,
  color = "currentColor",
  strokeWidth: sw = 1,
  className,
  ...rest
}: CalendarIconProps) {
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
        d="M5.33325 1.33337V3.33337"
        stroke={color}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={sw}
      />
      <path
        d="M10.6667 1.33337V3.33337"
        stroke={color}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={sw}
      />
      <path
        d="M2.33325 6.06006H13.6666"
        stroke={color}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={sw}
      />
      <path
        d="M14 5.66671V11.3334C14 13.3334 13 14.6667 10.6667 14.6667H5.33333C3 14.6667 2 13.3334 2 11.3334V5.66671C2 3.66671 3 2.33337 5.33333 2.33337H10.6667C13 2.33337 14 3.66671 14 5.66671Z"
        stroke={color}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={sw}
      />
      <path
        d="M7.99691 9.13338H8.0029"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={sw}
      />
      <path
        d="M5.52962 9.13338H5.53561"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={sw}
      />
      <path
        d="M5.52962 11.1334H5.53561"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={sw}
      />
    </svg>
  );
}
