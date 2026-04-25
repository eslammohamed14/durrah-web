import { env } from "@/env";

/**
 * Resolves Odoo-style relative image paths (e.g. `/web/image/...`) to an
 * absolute URL using the API base URL. Leaves already-absolute URLs unchanged.
 */
export function getImageUrl(path: string | null | undefined): string {
  if (path == null || path === "") {
    return "";
  }

  const trimmed = path.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  const base = env.apiBaseURL.replace(/\/+$/, "");
  const segment = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return base ? `${base}${segment}` : segment;
}

/** Use with `next/image` `unoptimized` for local/public assets only. */
export function isLocalStaticImageSrc(url: string): boolean {
  return (
    Boolean(url) &&
    (url.startsWith("/") || url.startsWith("/_next/static/media/")) &&
    !url.startsWith("//")
  );
}
