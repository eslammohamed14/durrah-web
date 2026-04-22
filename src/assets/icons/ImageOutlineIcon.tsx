import type { SVGProps } from "react";

export interface ImageOutlineIconProps extends Omit<
  SVGProps<SVGSVGElement>,
  "width" | "height"
> {
  size?: number;
}

export function ImageOutlineIcon({
  size = 24,
  className,
  ...rest
}: ImageOutlineIconProps) {
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
        d="M21.6799 16.96L18.5499 9.65001C17.4899 7.17001 15.5399 7.07001 14.2299 9.43001L12.3399 12.84C11.3799 14.57 9.58993 14.72 8.34993 13.17L8.12993 12.89C6.83993 11.27 5.01993 11.47 4.08993 13.32L2.36993 16.77C1.15993 19.17 2.90993 22 5.58993 22H18.3499C20.9499 22 22.6999 19.35 21.6799 16.96Z"
        stroke="#404040"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.96973 8C8.62658 8 9.96973 6.65685 9.96973 5C9.96973 3.34315 8.62658 2 6.96973 2C5.31287 2 3.96973 3.34315 3.96973 5C3.96973 6.65685 5.31287 8 6.96973 8Z"
        stroke="#404040"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
