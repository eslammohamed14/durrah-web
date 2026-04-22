import type { SVGProps } from "react";

export interface ArrowRightLineIconProps
  extends Omit<SVGProps<SVGSVGElement>, "width" | "height"> {
  size?: number;
  color?: string;
}

export function ArrowRightLineIcon({
  size = 24,
  color = "currentColor",
  className,
  ...rest
}: ArrowRightLineIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={["rtl-auto-flip", className].filter(Boolean).join(" ")}
      aria-hidden
      {...rest}
    >
      <path
        d="M14.4297 5.92969L20.4997 11.9997L14.4297 18.0697"
        stroke={color}
        strokeWidth="1.5"
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.5 12H20.33"
        stroke={color}
        strokeWidth="1.5"
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
