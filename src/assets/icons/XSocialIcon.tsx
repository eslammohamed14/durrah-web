import type { SVGProps } from "react";

export interface XSocialIconProps extends Omit<
  SVGProps<SVGSVGElement>,
  "width" | "height"
> {
  size?: number;
  color?: string;
}

export function XSocialIcon({
  size = 24,
  color = "#2A2F73",
  className,
  ...rest
}: XSocialIconProps) {
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
        d="M3 21L10.548 13.452M10.548 13.452L3 3H8L13.452 10.548M10.548 13.452L16 21H21L13.452 10.548M21 3L13.452 10.548"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
