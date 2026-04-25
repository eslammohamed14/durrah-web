import type { PropertyDetails } from "@/features/properties/type/propertyApiTypes";

export type SupportedPropertyLocale = "en" | "ar";

export function resolveApiString(
  value: unknown,
  locale: SupportedPropertyLocale,
  _depth = 0,
): string {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  if (value == null || typeof value !== "object" || _depth > 3) return "";

  const obj = value as Record<string, unknown>;
  if (typeof obj.title === "string") return obj.title;
  if (obj.title && typeof obj.title === "object") {
    return resolveApiString(obj.title, locale, _depth + 1);
  }
  if (typeof obj[locale] === "string") return obj[locale];
  if (typeof obj.en === "string") return obj.en;
  if (typeof obj.ar === "string") return obj.ar;
  return "";
}

export function mapPropertyDetails(
  raw: PropertyDetails,
  locale: SupportedPropertyLocale,
): PropertyDetails {
  return {
    ...raw,
    title: resolveApiString(raw.title, locale),
    description_html: resolveApiString(raw.description_html, locale),
    investor_name: resolveApiString(raw.investor_name, locale),
    type: resolveApiString(raw.type, locale),
    category: resolveApiString(raw.category, locale),
    sale_lease_label: resolveApiString(raw.sale_lease_label, locale),
    location: {
      ...raw.location,
      sector: resolveApiString(raw.location?.sector, locale),
      beach: resolveApiString(raw.location?.beach, locale),
      street: resolveApiString(raw.location?.street, locale),
      country: resolveApiString(raw.location?.country, locale),
    },
    cancellation_policy: {
      ...raw.cancellation_policy,
      type: resolveApiString(raw.cancellation_policy?.type, locale),
      text: resolveApiString(raw.cancellation_policy?.text, locale),
    },
    terms_and_conditions: resolveApiString(raw.terms_and_conditions, locale),
    fees: {
      ...raw.fees,
      note: resolveApiString(raw.fees?.note, locale),
    },
    amenities: (raw.amenities ?? []).map((amenity) => ({
      ...amenity,
      title: resolveApiString(amenity.title, locale),
    })),
  };
}
