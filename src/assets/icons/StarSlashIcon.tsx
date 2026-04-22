import type { SVGProps } from "react";

export interface StarSlashIconProps extends Omit<
  SVGProps<SVGSVGElement>,
  "width" | "height"
> {
  size?: number;
}

export function StarSlashIcon({
  size = 18,
  className,
  ...rest
}: StarSlashIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
      {...rest}
    >
      <path
        d="M10.2977 2.63224L11.6177 5.27224C11.7977 5.63974 12.2777 5.99224 12.6827 6.05974L15.0752 6.45724C16.6052 6.71224 16.9652 7.82224 15.8627 8.91724L14.0027 10.7772C13.6877 11.0922 13.5152 11.6997 13.6127 12.1347L14.1452 14.4372C14.5652 16.2597 13.5977 16.9647 11.9852 16.0122L9.74268 14.6847C9.33768 14.4447 8.67018 14.4447 8.25768 14.6847L6.01518 16.0122C4.41018 16.9647 3.43518 16.2522 3.85518 14.4372L4.38768 12.1347C4.48518 11.6997 4.31268 11.0922 3.99768 10.7772L2.13768 8.91724C1.04268 7.82224 1.39518 6.71224 2.92518 6.45724L5.31768 6.05974C5.71518 5.99224 6.19518 5.63974 6.37518 5.27224L7.69518 2.63224C8.41518 1.19974 9.58518 1.19974 10.2977 2.63224Z"
        fill="#FFC107"
      />
    </svg>
  );
}
