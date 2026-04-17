import type { SVGProps } from "react";

export interface EyeSlashIconProps
  extends Omit<SVGProps<SVGSVGElement>, "width" | "height"> {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

/** Eye-slash icon used in auth password fields. */
export function EyeSlashIcon({
  size = 18,
  color = "#9CA3AF",
  strokeWidth: sw = 1.8,
  ...rest
}: EyeSlashIconProps) {
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
        d="M10.58 9.58008C10.216 9.94413 10.0115 10.4379 10.0115 10.9528C10.0115 11.4676 10.216 11.9614 10.58 12.3255C10.9441 12.6895 11.4379 12.894 11.9527 12.894C12.4676 12.894 12.9614 12.6895 13.3254 12.3255"
        stroke={color}
        strokeWidth={sw}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.6797 16.6799C15.2497 17.7699 13.6297 18.3599 11.9497 18.3599C9.07969 18.3599 6.40969 16.6399 4.55969 13.6599C3.82969 12.4899 3.82969 10.4999 4.55969 9.32988C5.19969 8.29988 5.94969 7.40988 6.76969 6.68988"
        stroke={color}
        strokeWidth={sw}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.5781 5.51C11.0281 5.4 11.4881 5.34 11.9481 5.34C14.8181 5.34 17.4881 7.06 19.3381 10.04C20.0681 11.21 20.0681 13.2 19.3381 14.37C19.0681 14.81 18.7681 15.22 18.4581 15.61"
        stroke={color}
        strokeWidth={sw}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.4688 11.33C14.4088 10.68 14.0388 10.07 13.3988 9.69995"
        stroke={color}
        strokeWidth={sw}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.5781 12.33L3.07812 19.83"
        stroke={color}
        strokeWidth={sw}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20.9181 3L13.3981 10.52"
        stroke={color}
        strokeWidth={sw}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
