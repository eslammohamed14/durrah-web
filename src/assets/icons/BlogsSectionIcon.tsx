import type { SVGProps } from "react";

const figmaBlogsIconSrc =
  "https://www.figma.com/api/mcp/asset/d8fb38dc-b5f9-4935-9da5-797e5225b5de";

export interface BlogsSectionIconProps extends Omit<
  SVGProps<SVGSVGElement>,
  "width" | "height"
> {
  size?: number;
}

export function BlogsSectionIcon({
  size = 28,
  className,
  ...rest
}: BlogsSectionIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
      {...rest}
    >
      <image
        href={figmaBlogsIconSrc}
        width="28"
        height="28"
        preserveAspectRatio="xMidYMid meet"
      />
    </svg>
  );
}
