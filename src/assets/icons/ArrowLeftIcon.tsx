import type { SVGProps } from "react";

/** Vuesax-style linear arrow-left (mirrored arrow-right). */
export interface ArrowLeftIconProps extends Omit<
  SVGProps<SVGSVGElement>,
  "width" | "height"
> {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export function ArrowLeftIcon({
  size = 24,
  color = "currentColor",
  strokeWidth: sw = 2,
  className,
  ...rest
}: ArrowLeftIconProps) {
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
        d="M15.0901 19.92L8.57009 13.4C7.80009 12.63 7.80009 11.37 8.57009 10.6L15.0901 4.07996"
        stroke={color}
        strokeWidth={sw}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
