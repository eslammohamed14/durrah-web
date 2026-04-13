import type { SVGProps } from "react";

export interface InstagramSectionIconProps extends Omit<
  SVGProps<SVGSVGElement>,
  "width" | "height"
> {
  size?: number;
  primaryColor?: string;
  accentColor?: string;
}

export function InstagramSectionIcon({
  size = 28,
  primaryColor = "#2A2F73",
  accentColor = "#FF765E",
  className,
  ...rest
}: InstagramSectionIconProps) {
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
        d="M2.91675 13.9998C2.91675 8.77511 2.91675 6.16274 4.53986 4.53962C6.16299 2.9165 8.77535 2.9165 14.0001 2.9165C19.2248 2.9165 21.8372 2.9165 23.4603 4.53962C25.0834 6.16274 25.0834 8.77511 25.0834 13.9998C25.0834 19.2245 25.0834 21.8369 23.4603 23.4601C21.8372 25.0832 19.2248 25.0832 14.0001 25.0832C8.77535 25.0832 6.16299 25.0832 4.53986 23.4601C2.91675 21.8369 2.91675 19.2245 2.91675 13.9998Z"
        stroke={primaryColor}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M19.25 14C19.25 16.8995 16.8995 19.25 14 19.25C11.1005 19.25 8.75 16.8995 8.75 14C8.75 11.1005 11.1005 8.75 14 8.75C16.8995 8.75 19.25 11.1005 19.25 14Z"
        stroke={accentColor}
        strokeWidth="1.5"
      />
      <path
        d="M20.4258 7.5835H20.4153"
        stroke={accentColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
