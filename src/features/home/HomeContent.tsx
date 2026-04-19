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
import { cookies } from "next/headers";
import {
  DEFAULT_LOCALE,
  isValidLocale,
  NEXT_LOCALE_COOKIE,
} from "@/config/i18n";
import { createTranslator, getBundledTranslations } from "@/lib/utils/i18n";

// ─── Props ────────────────────────────────────────────────────────────────────

interface HomeContentProps {
  featuredForGrid: Property[];
  allProperties: Property[];
}

// ─── Main Component ───────────────────────────────────────────────────────────

export async function HomeContent({
  featuredForGrid,
  allProperties,
}: HomeContentProps) {
  const localeCookie = (await cookies()).get(NEXT_LOCALE_COOKIE)?.value;
  const locale = isValidLocale(localeCookie) ? localeCookie : DEFAULT_LOCALE;
  const t = createTranslator(locale, getBundledTranslations(locale));

  return (
    <div className="relative overflow-x-hidden">
      <main id="main-content" className="relative z-0">
        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <HeroSection allProperties={allProperties} t={t} />

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
