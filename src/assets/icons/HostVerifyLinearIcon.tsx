import type { SVGProps } from "react";

export interface HostVerifyLinearIconProps extends Omit<
  SVGProps<SVGSVGElement>,
  "width" | "height"
> {
  size?: number;
  strokeColor?: string;
}

/** Vuesax linear verify — host trust / official badges. */
export function HostVerifyLinearIcon({
  size = 16,
  strokeColor = "#29A36A",
  className,
  ...rest
}: HostVerifyLinearIconProps) {
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
        d="M5.58691 8.00005L7.19358 9.61339L10.4136 6.38672"
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.16691 1.6335C7.62691 1.24017 8.38025 1.24017 8.84691 1.6335L9.90025 2.54017C10.1002 2.7135 10.4736 2.8535 10.7402 2.8535H11.8736C12.5802 2.8535 13.1602 3.4335 13.1602 4.14017V5.2735C13.1602 5.5335 13.3002 5.9135 13.4736 6.1135L14.3802 7.16683C14.7736 7.62683 14.7736 8.38017 14.3802 8.84684L13.4736 9.90017C13.3002 10.1002 13.1602 10.4735 13.1602 10.7402V11.8735C13.1602 12.5802 12.5802 13.1602 11.8736 13.1602H10.7402C10.4802 13.1602 10.1002 13.3002 9.90025 13.4735L8.84691 14.3802C8.38691 14.7735 7.63358 14.7735 7.16691 14.3802L6.11358 13.4735C5.91358 13.3002 5.54025 13.1602 5.27358 13.1602H4.12025C3.41358 13.1602 2.83358 12.5802 2.83358 11.8735V10.7335C2.83358 10.4735 2.69358 10.1002 2.52691 9.90017L1.62691 8.84017C1.24025 8.38017 1.24025 7.6335 1.62691 7.1735L2.52691 6.1135C2.69358 5.9135 2.83358 5.54017 2.83358 5.28017V4.1335C2.83358 3.42683 3.41358 2.84683 4.12025 2.84683H5.27358C5.53358 2.84683 5.91358 2.70683 6.11358 2.5335L7.16691 1.6335Z"
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
