import type { SVGProps } from "react";

export interface PoolPremiumIconProps extends Omit<
  SVGProps<SVGSVGElement>,
  "width" | "height"
> {
  size?: number;
  waveColor?: string;
  accentColor?: string;
}

export function PoolPremiumIcon({
  size = 24,
  waveColor = "#2A2F73",
  accentColor = "#FF765E",
  className,
  ...rest
}: PoolPremiumIconProps) {
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
        d="M22 17.2943C21.2824 17.2943 20.9402 17.5363 20.5449 17.8153C20.1096 18.1212 19.6146 18.4708 18.6678 18.4708C17.7209 18.4708 17.2259 18.1212 16.7907 17.8153C16.3953 17.5363 16.0532 17.2943 15.3355 17.2943C14.6179 17.2943 14.2757 17.5363 13.8804 17.8153C13.4452 18.1212 12.9535 18.4708 12.0033 18.4708C11.0532 18.4708 10.5615 18.1212 10.1262 17.8153C9.7309 17.5363 9.3887 17.2943 8.6711 17.2943C7.95349 17.2943 7.6113 17.5363 7.21595 17.8153C6.78073 18.1212 6.28904 18.4708 5.33887 18.4708C4.3887 18.4708 3.89701 18.1212 3.46179 17.8153C3.0598 17.5363 2.71761 17.2943 2 17.2943"
        stroke={waveColor}
        strokeWidth="1.2"
        strokeMiterlimit={10}
        strokeLinecap="round"
      />
      <path
        d="M22 20.8237C21.2824 20.8237 20.9402 21.0658 20.5449 21.3448C20.1096 21.6507 19.6146 22.0002 18.6678 22.0002C17.7209 22.0002 17.2259 21.6507 16.7907 21.3448C16.3953 21.0658 16.0532 20.8237 15.3355 20.8237C14.6179 20.8237 14.2757 21.0658 13.8804 21.3448C13.4452 21.6507 12.9535 22.0002 12.0033 22.0002C11.0532 22.0002 10.5615 21.6507 10.1262 21.3448C9.7309 21.0658 9.3887 20.8237 8.6711 20.8237C7.95349 20.8237 7.6113 21.0658 7.21595 21.3448C6.78073 21.6507 6.28904 22.0002 5.33887 22.0002C4.3887 22.0002 3.89701 21.6507 3.46179 21.3448C3.0598 21.0658 2.71761 20.8237 2 20.8237"
        stroke={waveColor}
        strokeWidth="1.2"
        strokeMiterlimit={10}
        strokeLinecap="round"
      />
      <path
        d="M10 4.14286V3.5C10 2.67157 10.6716 2 11.5 2C12.3284 2 13 2.67157 13 3.5V14"
        stroke={accentColor}
        strokeWidth="1.2"
        strokeMiterlimit={10}
        strokeLinecap="round"
      />
      <path
        d="M4 4.22222V3.5C4 2.67157 4.67157 2 5.5 2C6.32843 2 7 2.67157 7 3.5V14"
        stroke={accentColor}
        strokeWidth="1.2"
        strokeMiterlimit={10}
        strokeLinecap="round"
      />
      <path
        d="M7 7H13"
        stroke={accentColor}
        strokeWidth="1.2"
        strokeMiterlimit={10}
        strokeLinecap="round"
      />
      <path
        d="M7 12H13"
        stroke={accentColor}
        strokeWidth="1.2"
        strokeMiterlimit={10}
        strokeLinecap="round"
      />
    </svg>
  );
}
