import type { Metadata } from "next";
import { Suspense } from "react";
import { getAPIClient } from "@/lib/api";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import SearchHeroSection from "@/features/search/components/searchHeroSection";
import { SearchResults } from "@/features/search/SearchResults";
import { Spinner } from "@/components/ui/Spinner";
import images from "@/constant/images";

import type {
  PropertyCategory,
  PropertyType,
  SearchFilters,
} from "@/lib/types";
import { getTranslations } from "next-intl/server";
import { SharedHeroSection } from "@/components/shared/ui/SharedHeroSections";

// Search results are always dynamic — filtered by URL params
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Search Properties | Durrah",
  description:
    "Search and filter properties across all categories — rent, buy, shops, and activities at Durrah Al-Arus.",
  openGraph: {
    title: "Search Properties | Durrah",
    description:
      "Search and filter properties across all categories — rent, buy, shops, and activities at Durrah Al-Arus.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Search Properties | Durrah",
    description:
      "Search and filter properties across all categories — rent, buy, shops, and activities at Durrah Al-Arus.",
  },
};

interface SearchPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function parseSearchParams(
  params: Record<string, string | string[] | undefined>
): SearchFilters {
  const get = (key: string) => {
    const v = params[key];
    return Array.isArray(v) ? v[0] : v;
  };
  const getAll = (key: string): string[] => {
    const v = params[key];
    if (!v) return [];
    return Array.isArray(v) ? v : [v];
  };

  const category = get("category") as PropertyCategory | undefined;
  const types = getAll("type") as PropertyType[];
  const location = get("location");
  const rooms = get("rooms") ? Number(get("rooms")) : undefined;
  const beachView = get("beachView") === "true" ? true : undefined;
  const priceMin = get("priceMin") ? Number(get("priceMin")) : undefined;
  const priceMax = get("priceMax") ? Number(get("priceMax")) : undefined;
  const amenities = getAll("amenity");
  const sortBy = get("sortBy") as SearchFilters["sortBy"] | undefined;

  return {
    ...(category && { category }),
    ...(types.length && { type: types }),
    ...(location && { location }),
    ...(rooms !== undefined && { rooms }),
    ...(beachView !== undefined && { beachView }),
    ...(priceMin !== undefined || priceMax !== undefined
      ? { priceRange: { min: priceMin ?? 0, max: priceMax ?? 100000 } }
      : {}),
    ...(amenities.length && { amenities }),
    ...(sortBy && { sortBy }),
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const filters = parseSearchParams(params);

  const api = getAPIClient();
  const properties = await api.searchProperties(filters);
  const t = await getTranslations();

  return (
    <>
      <Header transparent />
      <main>
        {/* <SearchHeroSection t={t} /> */}
        <SharedHeroSection allProperties={[]} image={images.searchHero} t={t} />
        <Suspense
          fallback={
            <div className="flex min-h-[60vh] items-center justify-center">
              <Spinner size="lg" />
            </div>
          }
        >
          <SearchResults initialProperties={properties} />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
