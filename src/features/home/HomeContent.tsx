"use client";

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

// ─── Props ────────────────────────────────────────────────────────────────────

interface HomeContentProps {
  featuredForGrid: Property[];
  allProperties: Property[];
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function HomeContent({
  featuredForGrid,
  allProperties,
}: HomeContentProps) {
  return (
    <main id="main-content">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <HeroSection allProperties={allProperties} />

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
  );
}
