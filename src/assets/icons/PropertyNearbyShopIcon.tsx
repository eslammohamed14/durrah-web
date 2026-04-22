import type { SVGProps } from "react";

export interface PropertyNearbyShopIconProps
  extends Omit<SVGProps<SVGSVGElement>, "width" | "height"> {
  size?: number;
  color?: string;
}

export function PropertyNearbyShopIcon({
  size = 20,
  color = "currentColor",
  className,
  ...rest
}: PropertyNearbyShopIconProps) {
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
        d="M2.50781 9.34973V13.0914C2.50781 16.8331 4.00781 18.3331 7.74948 18.3331H12.2411C15.9828 18.3331 17.4828 16.8331 17.4828 13.0914V9.34973"
        stroke={color}
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.99975 9.99996C11.5247 9.99996 12.6497 8.75829 12.4997 7.23329L11.9497 1.66663H8.05808L7.49975 7.23329C7.34975 8.75829 8.47475 9.99996 9.99975 9.99996Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.2587 9.99996C16.942 9.99996 18.1753 8.63329 18.0087 6.95829L17.7753 4.66663C17.4753 2.49996 16.642 1.66663 14.4587 1.66663H11.917L12.5003 7.50829C12.642 8.88329 13.8837 9.99996 15.2587 9.99996Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.69966 9.99996C6.07466 9.99996 7.31632 8.88329 7.44966 7.50829L7.63299 5.66663L8.03299 1.66663H5.49133C3.30799 1.66663 2.47466 2.49996 2.17466 4.66663L1.94966 6.95829C1.78299 8.63329 3.01632 9.99996 4.69966 9.99996Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.0003 14.1666C8.60866 14.1666 7.91699 14.8583 7.91699 16.25V18.3333H12.0837V16.25C12.0837 14.8583 11.392 14.1666 10.0003 14.1666Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
