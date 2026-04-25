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
  type: string;
  text: string;
}

export interface PropertyLocation {
  latitude?: number;
  longitude?: number;
  sector: string;
  beach: string;
  street: string;
  country: string;
}

export interface PropertyFee {
  administration: number;
  sector: number;
  note: string;
}
export interface PropertyDetails {
  id: number;
  slug: string;
  title: string;
  description_html: string;
  images: string[];
  price_per_day: number;
  license_number: string;
  investor_name: string;
  rooms: number;
  bathrooms: number;
  amenities: PropertyAmenity[];
  total_area: number;
  category: string;
  category_key: string;
  type: string;
  sale_lease_label: string;
  managed_by_durra: boolean;
  location: PropertyLocation;
  cancellation_policy: PropertyCancellationPolicy;
  terms_and_conditions: string;
  check_in_time: number;
  check_in_time_12h: string;
  check_out_time: number;
  check_out_time_12h: string;
  fees: PropertyFee;
}

export interface InvestorPortfolioQuery {
  page?: number;
  page_size?: number;
}

export interface InvestorDetails {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  properties: PropertyCard[];
}

export interface InvestorPortfolioResponse {
  investor: InvestorDetails;
  properties: PropertyCard[];
  page: number;
  page_size: number;
  total: number;
  has_more: boolean;
}
