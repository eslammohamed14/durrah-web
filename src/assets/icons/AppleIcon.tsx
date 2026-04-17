import type { SVGProps } from "react";

export interface AppleIconProps
  extends Omit<SVGProps<SVGSVGElement>, "width" | "height"> {
  size?: number;
  color?: string;
}

export function AppleIcon({
  size = 16,
  color = "currentColor",
  ...rest
}: AppleIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      {...rest}
    >
      <path
        d="M16.37 12.25C16.38 10.41 17.87 9.52 17.94 9.48C17.1 8.24 15.79 8.07 15.32 8.05C14.2 7.94 13.12 8.72 12.55 8.72C11.97 8.72 11.09 8.07 10.14 8.09C8.9 8.11 7.74 8.82 7.1 9.94C5.79 12.2 6.76 15.55 8.03 17.37C8.66 18.26 9.39 19.25 10.34 19.22C11.25 19.18 11.6 18.64 12.71 18.64C13.81 18.64 14.14 19.22 15.09 19.2C16.08 19.18 16.7 18.31 17.31 17.4C18.04 16.38 18.34 15.38 18.35 15.33C18.33 15.32 16.35 14.56 16.37 12.25Z"
        fill={color}
      />
      <path
        d="M14.59 6.9C15.1 6.29 15.45 5.45 15.35 4.61C14.61 4.64 13.69 5.12 13.16 5.71C12.69 6.24 12.27 7.11 12.39 7.92C13.22 7.98 14.06 7.5 14.59 6.9Z"
        fill={color}
      />
    </svg>
  );
}
