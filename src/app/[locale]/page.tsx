import type { Metadata } from "next";
import { getAPIClient } from "@/lib/api";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HomeContent } from "@/features/home/HomeContent";
import type { Property } from "@/lib/types";

/** Merge top-rated + distinguished, dedupe by id, then fill to `max` from the rest (by rating). */
function buildFeaturedPropertiesGrid(
  allProperties: Property[],
  topRated: Property[],
  distinguishedOffers: Property[],
  max = 6,
): Property[] {
  const seen = new Set<string>();
  const grid: Property[] = [];
  for (const p of [...topRated, ...distinguishedOffers]) {
    if (seen.has(p.id)) continue;
    seen.add(p.id);
    grid.push(p);
    if (grid.length >= max) return grid;
  }
  const remainder = [...allProperties]
    .filter((p) => !seen.has(p.id))
    .sort((a, b) => b.ratings.average - a.ratings.average);
  for (const p of remainder) {
    if (grid.length >= max) break;
    grid.push(p);
  }
  return grid;
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://durrah.sa";

// Revalidate the home page every hour (ISR)
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Durrah | Find Your Perfect Property",
  description:
    "Search thousands of properties across Saudi Arabia — rentals, purchases, shops, and activities at Durrah Al-Arus.",
  openGraph: {
    title: "Durrah | Find Your Perfect Property",
    description:
      "Search thousands of properties across Saudi Arabia — rentals, purchases, shops, and activities at Durrah Al-Arus.",
    url: BASE_URL,
    siteName: "Durrah",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Durrah | Find Your Perfect Property",
    description:
      "Search thousands of properties across Saudi Arabia — rentals, purchases, shops, and activities at Durrah Al-Arus.",
  },
};

function WebsiteStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Durrah",
    url: BASE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${BASE_URL}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

async function getHomeData(): Promise<{
  featuredForGrid: Property[];
  allProperties: Property[];
}> {
  const api = getAPIClient();
  let allProperties: Property[] = [];

  try {
    allProperties = await api.searchProperties({});
  } catch (error) {
    // Keep the homepage available even if upstream API is temporarily unavailable.
    console.error("[HomePage] Failed to load properties:", error);
  }

  const topRated = [...allProperties]
    .sort((a, b) => b.ratings.average - a.ratings.average)
    .slice(0, 3);

  const distinguishedOffers = allProperties
    .filter((p) => p.category === "rent" || p.category === "activity")
    .sort((a, b) => b.ratings.count - a.ratings.count)
    .slice(0, 3);

  const featuredForGrid = buildFeaturedPropertiesGrid(
    allProperties,
    topRated,
    distinguishedOffers,
  );

  return { featuredForGrid, allProperties };
}

export default async function HomePage() {
  const { featuredForGrid, allProperties } = await getHomeData();

  return (
    <>
      <WebsiteStructuredData />
      <Header transparent />
      <HomeContent
        featuredForGrid={featuredForGrid}
        allProperties={allProperties}
      />
      <Footer />
    </>
  );
}
