import type { SVGProps } from "react";

export interface MapIconProps
  extends Omit<SVGProps<SVGSVGElement>, "width" | "height"> {
  width?: number;
  height?: number;
  color?: string;
}

export function MapIcon({
  width = 17,
  height = 15,
  color = "#404040",
  className,
  ...rest
}: MapIconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 17 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
      {...rest}
    >
      <path
        d="M5.8501 0.599976V12.6M5.8501 0.599976L0.600098 2.09998V14.1L5.8501 12.6M5.8501 0.599976L10.3501 2.09998M5.8501 12.6L10.3501 14.1M10.3501 2.09998V14.1M10.3501 2.09998L15.6001 0.599976V12.6L10.3501 14.1"
        stroke={color}
        strokeWidth="1.2"
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
