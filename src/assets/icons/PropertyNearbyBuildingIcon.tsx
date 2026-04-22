import type { SVGProps } from "react";

export interface PropertyNearbyBuildingIconProps
  extends Omit<SVGProps<SVGSVGElement>, "width" | "height"> {
  size?: number;
  color?: string;
}

export function PropertyNearbyBuildingIcon({
  size = 20,
  color = "currentColor",
  className,
  ...rest
}: PropertyNearbyBuildingIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
      {...rest}
    >
      <path
        d="M0.833008 18.3334H19.1663"
        stroke={color}
        strokeWidth="1.1"
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.4834 18.3417V14.625"
        stroke={color}
        strokeWidth="1.5"
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.5003 9.07471C15.4837 9.07471 14.667 9.89138 14.667 10.9081V12.7997C14.667 13.8163 15.4837 14.633 16.5003 14.633C17.517 14.633 18.3337 13.8163 18.3337 12.7997V10.9081C18.3337 9.89138 17.517 9.07471 16.5003 9.07471Z"
        stroke={color}
        strokeWidth="1.5"
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M1.75 18.3332V5.02486C1.75 3.34986 2.58338 2.50818 4.24171 2.50818H9.43336C11.0917 2.50818 11.9167 3.34986 11.9167 5.02486V18.3332"
        stroke={color}
        strokeWidth="1.5"
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.83301 6.875H8.95802"
        stroke={color}
        strokeWidth="1.5"
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.83301 10H8.95802"
        stroke={color}
        strokeWidth="1.5"
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.875 18.3334V15.2084"
        stroke={color}
        strokeWidth="1.5"
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
