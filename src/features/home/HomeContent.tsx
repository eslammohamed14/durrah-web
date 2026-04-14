"use client";

import type { Property } from "@/lib/types";
import { useLocale } from "@/lib/contexts/LocaleContext";
import { HeroSection } from "@/features/home/components/heroSection";
import { CompanyMetricsSection } from "@/features/home/components/companyMetrics";
import { PropertiesSection } from "@/features/home/components/PropertiesSection";
import { ActivitiesSection } from "@/features/home/components/activitiesSection";
import { CtaBannerSection } from "@/features/home/components/ctaBannerSection";
import { BeachesSection } from "@/features/home/components/beachesSection";
import { ShopsSection } from "@/features/home/components/shopsSection";
import { YachtSection } from "@/features/home/components/yachtSection";
import { BlogsSection } from "@/features/home/components/blogsSection";
import { SectionTag } from "@/features/home/components/sectionTag";

// ─── Props ────────────────────────────────────────────────────────────────────

interface HomeContentProps {
  featuredForGrid: Property[];
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function HomeContent({ featuredForGrid }: HomeContentProps) {
  const { t } = useLocale();

  return (
    <main id="main-content">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <HeroSection />

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
      <section
        aria-labelledby="instagram-heading"
        className="bg-[#FAFAFA] px-[120px] py-[100px]"
      >
        <div className="mx-auto flex max-w-[1200px] flex-col gap-10">
          {/* Header */}
          <div className="flex flex-col gap-4">
            <SectionTag
              icon={
                <svg
                  className="h-7 w-7 text-[#363C88]"
                  viewBox="0 0 28 28"
                  fill="none"
                  aria-hidden="true"
                >
                  <rect
                    x="4"
                    y="4"
                    width="20"
                    height="20"
                    rx="5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <circle
                    cx="14"
                    cy="14"
                    r="4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <circle cx="20" cy="8" r="1" fill="currentColor" />
                </svg>
              }
              label={t("home.instagramTag")}
            />
            <h2
              id="instagram-heading"
              className="text-2xl font-medium leading-[1.5] text-[#2A2F73]"
            >
              {t("home.instagramHeadline")}
            </h2>
            <p className="max-w-[875px] text-base text-[#5A5A5A]">
              {t("home.instagramSubtitle")}
            </p>
          </div>

          {/* Photo grid */}
          <div className="flex gap-3">
            {/* Left column */}
            <div className="flex flex-col gap-3">
              <div className="flex gap-3">
                <div className="h-[199px] w-[282px] overflow-hidden rounded-lg bg-gradient-to-br from-amber-300 to-orange-400" />
                <div className="h-[199px] w-[282px] overflow-hidden rounded-lg bg-gradient-to-br from-rose-300 to-pink-400" />
              </div>
              <div className="h-[411px] w-[318px] overflow-hidden rounded-lg bg-gradient-to-br from-teal-300 to-cyan-400" />
            </div>
            {/* Right column */}
            <div className="flex flex-col gap-3">
              <div className="h-[199px] w-[576px] overflow-hidden rounded-lg bg-gradient-to-br from-blue-300 to-indigo-400" />
              <div className="flex gap-3">
                <div className="h-[200px] w-[282px] overflow-hidden rounded-lg bg-gradient-to-br from-purple-300 to-violet-400" />
                <div className="h-[200px] w-[282px] overflow-hidden rounded-lg bg-gradient-to-br from-cyan-300 to-blue-400" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
