"use client";

import Link from "next/link";
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
import { CtaNavigateButton } from "@/components/ui/CtaNavigateButton";
import { SectionTag } from "@/features/home/components/sectionTag";
import { ArrowRightIcon } from "@/assets/icons";

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
      <section
        aria-labelledby="blogs-heading"
        className="bg-[#FAFAFA] px-[120px] py-[100px]"
      >
        <div className="mx-auto flex max-w-[1440px] flex-col gap-10">
          {/* Header */}
          <div className="flex items-end gap-10">
            <div className="flex flex-1 flex-col gap-4">
              <SectionTag
                icon={
                  <svg
                    className="h-7 w-7 text-[#363C88]"
                    viewBox="0 0 28 28"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M9 5H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                }
                label={t("home.blogsTag")}
              />
              <h2
                id="blogs-heading"
                className="text-2xl font-medium leading-[1.5] text-[#2A2F73]"
              >
                {t("home.blogsHeadline")}
              </h2>
            </div>
            <CtaNavigateButton
              href="/blogs"
              className="shrink-0"
              rightIcon={<ArrowRightIcon className="h-6 w-6" />}
            >
              {t("home.viewAllBlogs")}
            </CtaNavigateButton>
          </div>

          {/* Blog grid */}
          <div className="flex gap-3">
            {/* Left: 2x2 small cards */}
            <div className="flex flex-col gap-3">
              <div className="flex gap-3">
                <div className="relative h-[277px] flex-1 overflow-hidden rounded-lg bg-gradient-to-br from-amber-300 to-orange-400">
                  <span className="absolute left-4 top-4 rounded-full bg-white px-2 py-1 text-xs font-medium text-[#404040]">
                    Resorts
                  </span>
                </div>
                <div className="relative h-[277px] flex-1 overflow-hidden rounded-lg bg-gradient-to-br from-rose-300 to-pink-400">
                  <span className="absolute left-4 top-4 rounded-full bg-white px-2 py-1 text-xs font-medium text-[#404040]">
                    Restaurants
                  </span>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="relative h-[277px] flex-1 overflow-hidden rounded-lg bg-gradient-to-br from-teal-300 to-cyan-400">
                  <span className="absolute left-4 top-4 rounded-full bg-white px-2 py-1 text-xs font-medium text-[#404040]">
                    Restaurants
                  </span>
                </div>
                <div className="relative h-[277px] flex-1 overflow-hidden rounded-lg bg-gradient-to-br from-purple-300 to-indigo-400">
                  <span className="absolute left-4 top-4 rounded-full bg-white px-2 py-1 text-xs font-medium text-[#404040]">
                    Resorts
                  </span>
                </div>
              </div>
            </div>

            {/* Right: featured blog */}
            <div className="flex flex-col gap-6">
              {/* Featured image */}
              <div className="relative h-[379px] w-[690px] overflow-hidden rounded-lg bg-gradient-to-br from-blue-400 to-indigo-600">
                <div className="absolute bottom-0 left-0 right-0 h-[240px] bg-gradient-to-t from-black/80 to-transparent" />
                <span className="absolute left-4 top-4 rounded-full bg-white px-2 py-1 text-xs font-medium text-[#404040]">
                  Resorts
                </span>
                <div className="absolute bottom-[92px] left-[15px] right-[15px]">
                  <div className="flex items-center gap-2 text-xs text-[#F1F1F2]">
                    <span>Jan 24, 2025</span>
                    <span className="h-1 w-1 rounded-full bg-[#F1F1F2]" />
                    <span>10 mins read</span>
                  </div>
                  <p className="mt-3 text-xl font-medium text-white">
                    {t("home.blogFeaturedTitle")}
                  </p>
                </div>
                <div className="absolute bottom-[15px] left-[15px]">
                  <Link
                    href="/blogs"
                    className="inline-flex h-12 w-[175px] items-center justify-center gap-2.5 rounded-lg border border-white text-base font-medium text-white transition-colors hover:bg-white/10"
                  >
                    {t("home.discoverMore")}
                    <ArrowRightIcon className="h-6 w-6" />
                  </Link>
                </div>
              </div>
              {/* Blog excerpt */}
              <p className="text-base text-[#727272] line-clamp-3">
                {t("home.blogFeaturedExcerpt")}
              </p>
            </div>
          </div>
        </div>
      </section>

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
