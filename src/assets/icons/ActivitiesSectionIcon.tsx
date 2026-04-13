import type { SVGProps } from "react";

export interface ActivitiesSectionIconProps extends Omit<
  SVGProps<SVGSVGElement>,
  "width" | "height"
> {
  size?: number;
  accentColor?: string;
  primaryColor?: string;
}

export function ActivitiesSectionIcon({
  size = 28,
  accentColor = "#FE5805",
  primaryColor = "#2A2F73",
  className,
  ...rest
}: ActivitiesSectionIconProps) {
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
        d="M18 6L18 11"
        stroke={accentColor}
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
      />
      <path
        d="M18 19V20C18 21.6569 16.6569 23 15 23"
        stroke={accentColor}
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
      />
      <path
        d="M20 11H8C5.79086 11 4 12.7939 4 15.0031C4 17.2088 5.78811 19 7.99385 19C9.70964 19 11.2337 17.9041 11.7799 16.2776L12.0638 15.4323C12.543 14.0053 14.5615 14.0053 15.0407 15.4323L15.2053 15.9225C15.8228 17.7612 17.5456 19 19.4852 19H20C22.2091 19 24 17.2091 24 15C24 12.7909 22.2091 11 20 11Z"
        stroke={primaryColor}
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
      />
    </svg>
  );
}
