import type { SVGProps } from "react";

/**
 * Vuesax bold arrow-up (solid).
 */
export interface ArrowSolidUpIconProps
  extends Omit<SVGProps<SVGSVGElement>, "width" | "height"> {
  size?: number;
  color?: string;
}

export function ArrowSolidUpIcon({
  size = 16,
  color = "currentColor",
  className,
  ...rest
}: ArrowSolidUpIconProps) {
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
        d="M7.52979 6.39697C7.7902 6.13656 8.21563 6.13661 8.47607 6.39697L9.78174 7.7085L9.78271 7.71045L11.8696 9.79639H4.13037L7.52979 6.39697Z"
        fill={color}
        stroke={color}
        strokeWidth={1.5}
      />
    </svg>
  );
}
