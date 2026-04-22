import type { SVGProps } from "react";

/** Vuesax linear tag-2 — used for discount / offer lines (Figma booking card). */
export interface DiscountIconProps extends Omit<
  SVGProps<SVGSVGElement>,
  "width" | "height"
> {
  size?: number;
  strokeColor?: string;
}

export function DiscountIcon({
  size = 22,
  strokeColor = "#3E7D3E",
  className,
  ...rest
}: DiscountIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
      {...rest}
    >
      <path
        d="M4.03769 14.2325L8.19019 18.385C9.89519 20.09 12.6635 20.09 14.3777 18.385L18.4019 14.3608C20.1069 12.6558 20.1069 9.8875 18.4019 8.17334L14.2402 4.03C13.3694 3.15917 12.1685 2.69167 10.9402 2.75584L6.35686 2.97584C4.52353 3.05834 3.06603 4.51584 2.97436 6.34L2.75436 10.9233C2.69936 12.1608 3.16686 13.3617 4.03769 14.2325Z"
        stroke={strokeColor}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.9235 11.2075C10.1892 11.2075 11.2152 10.1815 11.2152 8.91581C11.2152 7.65016 10.1892 6.62415 8.9235 6.62415C7.65785 6.62415 6.63184 7.65016 6.63184 8.91581C6.63184 10.1815 7.65785 11.2075 8.9235 11.2075Z"
        stroke={strokeColor}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      <path
        d="M12.1318 15.7908L15.7985 12.1241"
        stroke={strokeColor}
        strokeWidth={1.5}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
