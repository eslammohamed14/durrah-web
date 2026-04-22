import type { Locale, Property, PropertyHostType } from "@/lib/types";

export const SECTION_TITLE_CLASS =
  "text-[22px] font-semibold leading-[1.4] text-primary-blue-400";

/** Final UI — Unit Details Page "Host + Durrat" (Figma 1856:35675): white card, #F1F1F2 stroke, radius 12, pad 12×16. */
export const HOST_CARD_SHELL_CLASS =
  "rounded-xl border border-grey-50 bg-white px-3 py-4";

/** Vertical gap between section title and cards, and between stacked host cards (Figma itemSpacing 12). */
export const HOST_SECTION_STACK_CLASS = "space-y-3";

export function pick(
  record: Record<Locale, string> | undefined,
  locale: string,
): string {
  if (!record) return "";
  return record[locale as Locale] ?? record.en ?? "";
}

export function resolveHostType(host: Property["host"]): PropertyHostType {
  if (!host?.type) {
    if (host?.investorManagementCard?.chips?.length) return "investor";
    if (host?.ownerDetails) return "owner";
    if (host?.isOfficialUnit) return "durrat";
    return "durrat";
  }
  return host.type;
}

export function initials(name: string): string {
  const t = name.trim();
  if (!t) return "?";
  const parts = t.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0]!.charAt(0) + parts[1]!.charAt(0)).toUpperCase();
  }
  return t.charAt(0).toUpperCase();
}
