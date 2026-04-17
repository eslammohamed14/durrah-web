"use client";

/**
 * SkipLink — visually-hidden skip-to-content link that becomes visible on focus.
 * Renders an anchor that jumps to `#main-content` (or a custom target).
 *
 * Requirements: 22.1, 22.4
 *
 * Usage: Place as the very first child of <body> in the root layout.
 *   <SkipLink />
 */

interface SkipLinkProps {
  /** The id of the element to skip to. Defaults to "main-content". */
  targetId?: string;
  /** Link label text. */
  label?: string;
}

export function SkipLink({
  targetId = "main-content",
  label = "Skip to main content",
}: SkipLinkProps) {
  return (
    <a
      href={`#${targetId}`}
      className={[
        "sr-only",
        "focus:not-sr-only",
        "focus:absolute",
        "focus:top-4",
        "focus:left-4",
        "focus:z-[9999]",
        "focus:px-4",
        "focus:py-2",
        "focus:rounded",
        "focus:bg-white",
        "focus:text-blue-700",
        "focus:font-semibold",
        "focus:shadow-lg",
        "focus:outline-none",
        "focus:ring-2",
        "focus:ring-blue-500",
      ].join(" ")}
    >
      {label}
    </a>
  );
}
