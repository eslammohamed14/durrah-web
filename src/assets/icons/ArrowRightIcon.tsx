import type { SVGProps } from "react";

/**
 * Vuesax linear arrow-right.
 */
export interface ArrowRightIconProps extends Omit<
  SVGProps<SVGSVGElement>,
  "width" | "height"
> {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export function ArrowRightIcon({
  size = 24,
  color = "currentColor",
  strokeWidth: sw = 2,
  className,
  ...rest
}: ArrowRightIconProps) {
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
        d="M8.90991 19.92L15.4299 13.4C16.1999 12.63 16.1999 11.37 15.4299 10.6L8.90991 4.07996"
        stroke={color}
        strokeWidth={sw}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
