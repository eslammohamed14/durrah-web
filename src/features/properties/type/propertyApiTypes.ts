export type PropertyTypeGroup =
  | "residential"
  | "commercial"
  | "industrial"
  | "land";

export interface PropertyTypeItem {
  id: number;
  name: string;
  group: PropertyTypeGroup;
}

export interface PropertyTypesResponse {
  types: PropertyTypeItem[];
}

export interface AvailablePropertiesQuery {
  type?: string;
  start_date?: string;
  end_date?: string;
  page?: number;
  page_size?: number;
}

export interface PropertyCard {
  id: number;
  slug: string;
  title: string;
  images: string[];
  type: string;
  category: string;
  sale_lease_label: string;
  total_area: number;
  rooms: number;
  bathrooms: number;
  price_per_day: number;
  managed_by_durra: boolean;
}

export interface AvailablePropertiesResponse {
  properties: PropertyCard[];
  page: number;
  page_size: number;
  total: number;
  has_more: boolean;
}

export interface PropertyDetailsParams {
  slug: string;
}

export interface PropertyAmenity {
  title: string;
}

export interface PropertyCancellationPolicy {
  text: string;
}

export interface PropertyDetails {
  id: number;
  slug: string;
  title: string;
  image: string | null;
  gallery: string[];
  city: string;
  district: string;
  location_text?: string;
  latitude?: number;
  longitude?: number;
  property_type: string;
  description_html: string;
  cancellation_policy: PropertyCancellationPolicy;
  check_in_time_12h: string;
  check_out_time_12h: string;
  total_area: number;
  built_area?: number;
  price_per_day: number;
  price_per_week?: number;
  price_per_month?: number;
  bedrooms: number;
  bathrooms: number;
  guests: number;
  amenities: PropertyAmenity[];
}

export interface InvestorPortfolioQuery {
  page?: number;
  page_size?: number;
}

export interface InvestorDetails {
  id: number;
  name: string;
  image?: string | null;
  email?: string;
  phone?: string;
}

export interface InvestorPortfolioResponse {
  investor: InvestorDetails;
  properties: PropertyCard[];
  page: number;
  page_size: number;
  total: number;
  has_more: boolean;
}
