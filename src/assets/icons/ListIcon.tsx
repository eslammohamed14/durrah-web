import type { SVGProps } from "react";

export interface ListIconProps
  extends Omit<SVGProps<SVGSVGElement>, "width" | "height"> {
  size?: number;
  color?: string;
}

export function ListIcon({
  size = 18,
  color = "#404040",
  className,
  ...rest
}: ListIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
      {...rest}
    >
      <path
        d="M6.74902 4.82755H15.0025"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.0025 9.00003H6.74902"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.74902 13.1725H15.0025"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.37271 4.45239C3.16552 4.45239 2.99756 4.62036 2.99756 4.82755C2.99756 5.03474 3.16552 5.20271 3.37271 5.20271C3.57991 5.20271 3.74787 5.03474 3.74787 4.82755C3.74787 4.62036 3.57991 4.45239 3.37271 4.45239"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.37271 8.62488C3.16552 8.62488 2.99756 8.79284 2.99756 9.00003C2.99756 9.20723 3.16552 9.37519 3.37271 9.37519C3.57991 9.37519 3.74787 9.20723 3.74787 9.00003C3.74787 8.79284 3.57991 8.62488 3.37271 8.62488"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.37271 12.7974C3.16552 12.7974 2.99756 12.9653 2.99756 13.1725C2.99756 13.3797 3.16552 13.5477 3.37271 13.5477C3.57991 13.5477 3.74787 13.3797 3.74787 13.1725C3.74787 12.9653 3.57991 12.7974 3.37271 12.7974"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
