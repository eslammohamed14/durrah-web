import { getTranslations } from "next-intl/server";
import { getAPIClient } from "@/lib/api";
import type { Property } from "@/lib/types";
import { CompanyMetricsSection } from "@/features/home/components/companyMetrics";
import { PropertiesSection } from "@/features/home/components/PropertiesSection";
import { ActivitiesSection } from "@/features/home/components/activitiesSection";
import { CtaBannerSection } from "@/features/home/components/ctaBannerSection";
import { BeachesSection } from "@/features/home/components/beachesSection";
import { ShopsSection } from "@/features/home/components/shopsSection";
import { YachtSection } from "@/features/home/components/yachtSection";
import { BlogsSection } from "@/features/home/components/blogsSection";
import { InstagramSection } from "@/features/home/components/instagramSection";
import { HomeDecorativeRightEdge } from "@/features/home/components/homeDecorativeRightEdge";
import { SharedHeroSection } from "@/components/shared/ui/SharedHeroSections";
import images from "@/constant/images";
import { FilterContainer } from "./components/heroSection/filter-container";

// ─── Data Fetching ────────────────────────────────────────────────────────────

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

// ─── Main Component ───────────────────────────────────────────────────────────

/**
 * Async RSC — fetches its own data so the parent page can wrap it in <Suspense>,
 * letting the Header and Footer stream to the client while this resolves.
 */
export async function HomeContent() {
  const [t, { featuredForGrid, allProperties }] = await Promise.all([
    getTranslations(),
    getHomeData(),
  ]);

  return (
    <div className="relative overflow-x-hidden">
      <main id="main-content" className="relative z-0">
        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <SharedHeroSection
          allProperties={allProperties}
          headerText="home.heroHeadline"
          paragraphText="home.heroSubheadline"
          sectionClassName="relative flex min-h-[560px] flex-col pb-[30px] sm:min-h-[700px] lg:min-h-[948px]"
          contentClassName="relative mx-auto mt-auto w-full max-w-[1540px] px-4 pb-0 sm:px-6 lg:px-8 x"
          t={t}
          image={images.durrahHomeHero}
        >
          {({ properties }) => <FilterContainer allProperties={properties} />}
        </SharedHeroSection>

        {/* ── Company Metrics ───────────────────────────────────────────────── */}
        <CompanyMetricsSection />

        {/* ── Properties Section ────────────────────────────────────────────── */}
        <PropertiesSection properties={featuredForGrid} />

        {/* ── Activities Section ────────────────────────────────────────────── */}
        <ActivitiesSection />

        {/* ── CTA Banner ───────────────────────────────────────────────────── */}
        <CtaBannerSection />

        {/* ── Beaches Section ──────────────────────────────────────────────── */}
        <BeachesSection />

        {/* ── Shops Section ────────────────────────────────────────────────── */}
        <ShopsSection />

        {/* ── Yacht Parking ────────────────────────────────────────────────── */}
        <YachtSection />

        {/* ── Blogs Section ────────────────────────────────────────────────── */}
        <BlogsSection />

        {/* ── Instagram Section ─────────────────────────────────────────────── */}
        <InstagramSection />
      </main>
      <HomeDecorativeRightEdge />
    </div>
  );
}
