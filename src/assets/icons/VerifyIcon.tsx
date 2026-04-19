import type { SVGProps } from "react";

export interface VerifyIconProps
  extends Omit<SVGProps<SVGSVGElement>, "width" | "height"> {
  size?: number;
}

/** Vuesax linear verify — matches `vuesax/linear/verify.svg`. */
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
      <path
        d="M11.1733 16L14.3867 19.2266L20.8267 12.7733"
        stroke="#FF765E"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.3333 3.26706C15.2533 2.4804 16.76 2.4804 17.6933 3.26706L19.8 5.0804C20.2 5.42706 20.9467 5.70706 21.48 5.70706H23.7467C25.16 5.70706 26.32 6.86706 26.32 8.2804V10.5471C26.32 11.0671 26.6 11.8271 26.9467 12.2271L28.76 14.3337C29.5467 15.2537 29.5467 16.7604 28.76 17.6937L26.9467 19.8004C26.6 20.2004 26.32 20.9471 26.32 21.4804V23.7471C26.32 25.1604 25.16 26.3204 23.7467 26.3204H21.48C20.96 26.3204 20.2 26.6004 19.8 26.9471L17.6933 28.7604C16.7733 29.5471 15.2667 29.5471 14.3333 28.7604L12.2267 26.9471C11.8267 26.6004 11.08 26.3204 10.5467 26.3204H8.24001C6.82667 26.3204 5.66667 25.1604 5.66667 23.7471V21.4671C5.66667 20.9471 5.38667 20.2004 5.05334 19.8004L3.25334 17.6804C2.48001 16.7604 2.48001 15.2671 3.25334 14.3471L5.05334 12.2271C5.38667 11.8271 5.66667 11.0804 5.66667 10.5604V8.26706C5.66667 6.85373 6.82667 5.69373 8.24001 5.69373H10.5467C11.0667 5.69373 11.8267 5.41373 12.2267 5.06706L14.3333 3.26706Z"
        stroke="#2A2F73"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
