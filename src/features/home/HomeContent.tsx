import { getTranslations } from "next-intl/server";
import { getAPIClient } from "@/lib/api";
import type { Property } from "@/lib/types";
import { HeroSection } from "@/features/home/components/heroSection";
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

// ─── Data Fetching ────────────────────────────────────────────────────────────

async function getHomeData(): Promise<{
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

  return { allProperties };
}

// ─── Main Component ───────────────────────────────────────────────────────────

/**
 * Async RSC — fetches its own data so the parent page can wrap it in <Suspense>,
 * letting the Header and Footer stream to the client while this resolves.
 */
export async function HomeContent() {
  const [t, { allProperties }] = await Promise.all([
    getTranslations(),
    getHomeData(),
  ]);

  return (
    <div className="relative overflow-x-hidden">
      <main id="main-content" className="relative z-0">
        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <HeroSection allProperties={allProperties} t={t} />

        {/* ── Company Metrics ───────────────────────────────────────────────── */}
        <CompanyMetricsSection />

        {/* ── Properties Section ────────────────────────────────────────────── */}
        <PropertiesSection />

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
