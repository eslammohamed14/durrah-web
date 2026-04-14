import type { SVGProps } from "react";

export interface PropertySectionIconProps extends Omit<
  SVGProps<SVGSVGElement>,
  "width" | "height"
> {
  size?: number;
  accentColor?: string;
  primaryColor?: string;
}

export function PropertySectionIcon({
  size = 28,
  accentColor = "#FF765E",
  primaryColor = "#2A2F73",
  className,
  ...rest
}: PropertySectionIconProps) {
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
        d="M4.19769 4.19833H23.8027V23.802H4.19769V4.19833ZM0 28H28V0H0V28Z"
        fill={accentColor}
      />
      <path
        d="M21.0177 12.6431H9.77889V9.80884H7.03931V18.2165H9.77851V15.3811H18.2486V18.2165H20.9874V15.3811H21.0177V12.6431Z"
        fill={primaryColor}
      />
    </svg>
  );
}
