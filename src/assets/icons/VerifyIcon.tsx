import type { SVGProps } from "react";

export interface VerifyIconProps
  extends Omit<SVGProps<SVGSVGElement>, "width" | "height"> {
  size?: number;
}

/** Circular verification badge used by auth success views. */
export function VerifyIcon({ size = 32, ...rest }: VerifyIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      {...rest}
    >
      <circle cx="16" cy="16" r="15.5" stroke="#E4E7EC" />
      <path
        d="M16 10L17.5 13.5L21 15L17.5 16.5L16 20L14.5 16.5L11 15L14.5 13.5L16 10Z"
        fill="#FF765E"
      />
      <path
        d="M16 10L17.5 13.5L21 15L17.5 16.5L16 20L14.5 16.5L11 15L14.5 13.5L16 10Z"
        stroke="#2A2F73"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}
