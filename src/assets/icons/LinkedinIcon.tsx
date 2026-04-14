import type { SVGProps } from "react";

export interface LinkedinIconProps extends Omit<
  SVGProps<SVGSVGElement>,
  "width" | "height"
> {
  size?: number;
  color?: string;
}

export function LinkedinIcon({
  size = 24,
  color = "#2A2F73",
  className,
  ...rest
}: LinkedinIconProps) {
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
      <path d="M24 0V24H0V0H24Z" fill="white" fillOpacity="0.01" />
      <path
        d="M8 8H8.00195M8 11V16M11 10V12.0003M11 12.0003V16M11 12.0003C11 11.5003 11.9169 10.217 13 10.0004C14.3807 9.72429 16 10.5004 16 12.0003V16.0003M11.5 20.5H12.5C16.2712 20.5 18.1569 20.5 19.3284 19.3284C20.5 18.1569 20.5 16.2712 20.5 12.5V11.5C20.5 7.72876 20.5 5.84315 19.3284 4.67157C18.1569 3.5 16.2712 3.5 12.5 3.5H11.5C7.72876 3.5 5.84315 3.5 4.67157 4.67157C3.5 5.84315 3.5 7.72876 3.5 11.5V12.5C3.5 16.2712 3.5 18.1569 4.67157 19.3284C5.84315 20.5 7.72876 20.5 11.5 20.5Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
