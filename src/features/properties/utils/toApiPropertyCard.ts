import type { Property } from "@/lib/types";
import type { PropertyCard as ApiPropertyCard } from "@/features/properties/type/propertyApiTypes";

export function toApiPropertyCard(property: Property): ApiPropertyCard {
  return {
    id: Number(property.id) || 0,
    slug: property.id,
    title: property.title.en || property.title.ar || "Property",
    images: property.images.map((img) => img.url),
    type: property.type,
    category: property.category,
    sale_lease_label: property.category === "buy" ? "For Sale" : "For Rent",
    total_area: property.specifications.size ?? 0,
    rooms: property.specifications.rooms ?? 0,
    bathrooms: property.specifications.bathrooms ?? 0,
    price_per_day: property.pricing.basePrice ?? 0,
    managed_by_durra: property.host?.type === "durrat",
  };
}
