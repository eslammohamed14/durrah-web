import type { SVGProps } from "react";

export interface SeaViewPremiumIconProps extends Omit<
  SVGProps<SVGSVGElement>,
  "width" | "height"
> {
  size?: number;
  waveColor?: string;
  accentColor?: string;
}

export function SeaViewPremiumIcon({
  size = 24,
  waveColor = "#2A2F73",
  accentColor = "#FF765E",
  className,
  ...rest
}: SeaViewPremiumIconProps) {
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
        d="M15.3337 11.3333C15.3337 9.49238 13.8413 8 12.0003 8C10.1594 8 8.66699 9.49238 8.66699 11.3333"
        stroke={accentColor}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 4V5.33333"
        stroke={accentColor}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.81348 6.14709L7.76014 7.09376"
        stroke={accentColor}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.66699 11.3334H6.00033"
        stroke={accentColor}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18 11.3334H19.3333"
        stroke={accentColor}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.2402 7.09376L17.1869 6.14709"
        stroke={accentColor}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22 14.6666C21.2824 14.6666 20.9402 14.9409 20.5449 15.2571C20.1096 15.6038 19.6146 16 18.6678 16C17.7209 16 17.2259 15.6038 16.7907 15.2571C16.3953 14.9409 16.0532 14.6666 15.3355 14.6666C14.6179 14.6666 14.2757 14.9409 13.8804 15.2571C13.4452 15.6038 12.9535 16 12.0033 16C11.0532 16 10.5615 15.6038 10.1262 15.2571C9.7309 14.9409 9.3887 14.6666 8.6711 14.6666C7.95349 14.6666 7.6113 14.9409 7.21595 15.2571C6.78073 15.6038 6.28904 16 5.33887 16C4.3887 16 3.89701 15.6038 3.46179 15.2571C3.0598 14.9409 2.71761 14.6666 2 14.6666"
        stroke={waveColor}
        strokeWidth="1.2"
        strokeMiterlimit={10}
        strokeLinecap="round"
      />
      <path
        d="M22 18.6666C21.2824 18.6666 20.9402 18.9409 20.5449 19.2571C20.1096 19.6038 19.6146 20 18.6678 20C17.7209 20 17.2259 19.6038 16.7907 19.2571C16.3953 18.9409 16.0532 18.6666 15.3355 18.6666C14.6179 18.6666 14.2757 18.9409 13.8804 19.2571C13.4452 19.6038 12.9535 20 12.0033 20C11.0532 20 10.5615 19.6038 10.1262 19.2571C9.7309 18.9409 9.3887 18.6666 8.6711 18.6666C7.95349 18.6666 7.6113 18.9409 7.21595 19.2571C6.78073 19.6038 6.28904 20 5.33887 20C4.3887 20 3.89701 19.6038 3.46179 19.2571C3.0598 18.9409 2.71761 18.6666 2 18.6666"
        stroke={waveColor}
        strokeWidth="1.2"
        strokeMiterlimit={10}
        strokeLinecap="round"
      />
    </svg>
  );
}
