"use client";

import Link from "next/link";
import type { Property } from "@/lib/types";
import { useLocale } from "@/lib/contexts/LocaleContext";
import { HeroSection } from "@/features/home/components/heroSection";
import { CompanyMetricsSection } from "@/features/home/components/companyMetrics";

// ─── Icons ────────────────────────────────────────────────────────────────────

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 12H19M19 12L13 6M19 12L13 18"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  );
}

// ─── Section Tag ──────────────────────────────────────────────────────────────

function SectionTag({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-[80px] border border-[#C4C7EB] px-4 py-2.5">
      <span className="flex h-7 w-7 items-center justify-center">{icon}</span>
      <span className="text-sm font-normal text-[#363C88]/90 uppercase tracking-wide">
        {label}
      </span>
    </div>
  );
}

// ─── Primary Button ───────────────────────────────────────────────────────────

function PrimaryBtn({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex h-12 items-center gap-2.5 rounded-lg bg-[#FF765E] px-4 text-base font-medium text-white transition-colors hover:bg-[#e8614a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF765E] focus-visible:ring-offset-2 ${className}`}
    >
      {children}
    </Link>
  );
}

// ─── Property Card ────────────────────────────────────────────────────────────

function PropertyCardFigma({ property }: { property: Property }) {
  const { t, locale } = useLocale();
  const title = property.title[locale] || property.title.en;
  const isForSale = property.category === "buy";
  const badgeLabel = isForSale ? t("home.forSale") : t("home.forRent");
  const badgeBg = isForSale ? "bg-[#2A2F73]" : "bg-[#FF765E]";
  const typeLabel = property.type
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  const price = new Intl.NumberFormat(
    locale === "ar" ? "ar-SA" : "en-SA",
  ).format(property.pricing.basePrice);
  const originalPrice = new Intl.NumberFormat(
    locale === "ar" ? "ar-SA" : "en-SA",
  ).format(Math.round(property.pricing.basePrice * 1.27));

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-[#F1F1F2] bg-white pb-4 shadow-[0_0_24px_0_rgba(0,0,0,0.06)]">
      {/* Image area */}
      <div className="relative h-[216px] rounded-t-xl bg-gradient-to-br from-slate-300 to-slate-400">
        {/* Top badges row */}
        <div className="absolute left-2.5 top-2.5 flex items-center justify-between w-[calc(100%-20px)]">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-white px-2 py-1 text-xs font-medium text-[#404040]">
              {typeLabel}
            </span>
            <span className="flex items-center gap-1 rounded-full bg-white px-2 py-1 text-xs font-medium text-[#FF765E]">
              {t("home.offer")}
              <svg
                className="h-[18px] w-[18px]"
                viewBox="0 0 18 18"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M9 3.75V14.25M3.75 9H14.25"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </div>
          <span
            className={`rounded-lg px-2 py-1 text-xs font-medium text-white ${badgeBg}`}
          >
            {badgeLabel}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-3 px-3 pt-3">
        {/* Title + rating */}
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-[#262626] leading-tight">
            {title}
          </h3>
          <div className="flex items-center gap-1">
            <StarIcon className="h-4 w-4 text-[#FFCC00]" />
            <span className="text-xs text-[#8B8B8C]">
              {property.ratings.average.toFixed(1)}
            </span>
          </div>
        </div>

        {/* Specs row */}
        <div className="flex items-center gap-3.5 text-xs text-[#727272]">
          <div className="flex items-center gap-1.5 border-r border-[#D9D9D9] pr-2">
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M4 8h16M4 8v10a1 1 0 001 1h14a1 1 0 001-1V8M4 8V6a1 1 0 011-1h14a1 1 0 011 1v2"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <span>4,200 sq.ft.</span>
          </div>
          <div className="flex items-center gap-1.5 border-r border-[#D9D9D9] pr-2">
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M3 12h18M3 12V8a2 2 0 012-2h14a2 2 0 012 2v4M3 12v6h18v-6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <span>5 Bed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M4 12h16M4 12V8a2 2 0 012-2h12a2 2 0 012 2v4M4 12v6a1 1 0 001 1h14a1 1 0 001-1v-6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <span>5 Bath</span>
          </div>
        </div>
      </div>

      {/* Price row */}
      <div className="mt-3 flex items-center justify-between px-3">
        <div className="flex items-center gap-2">
          <span className="text-[22px] font-semibold text-[#2A2F73]">
            {price} SAR
          </span>
          <span className="text-sm text-[#A6A6A6] line-through">
            {originalPrice} SAR
          </span>
        </div>
        <button
          type="button"
          aria-label={t("home.saveProperty")}
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F4F4F4] text-[#2A2F73] transition-colors hover:bg-[#e8e8e8]"
        >
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </article>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface HomeContentProps {
  topRated: Property[];
  distinguishedOffers: Property[];
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function HomeContent({
  topRated,
  distinguishedOffers,
}: HomeContentProps) {
  const { t } = useLocale();
  // Combine for the properties grid (up to 6)
  const propertiesGrid = [...topRated, ...distinguishedOffers].slice(0, 6);

  return (
    <main id="main-content">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <HeroSection />

      {/* ── Company Metrics ───────────────────────────────────────────────── */}
      <CompanyMetricsSection />

      {/* ── Properties Section ────────────────────────────────────────────── */}
      <section
        aria-labelledby="properties-heading"
        className="bg-[#FAFAFA] px-[120px] py-[100px]"
      >
        <div className="mx-auto flex max-w-[1200px] flex-col gap-10">
          {/* Header row */}
          <div className="flex items-end gap-4">
            <div className="flex flex-1 flex-col gap-4">
              <div className="flex items-end justify-between">
                <div className="flex flex-col gap-4">
                  <SectionTag
                    icon={
                      <svg
                        className="h-7 w-7 text-[#363C88]"
                        viewBox="0 0 28 28"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M14 3.5L3.5 12.25V24.5H10.5V17.5H17.5V24.5H24.5V12.25L14 3.5Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    }
                    label={t("home.findYourSpace")}
                  />
                  <div className="flex items-end justify-between w-[1200px]">
                    <h2
                      id="properties-heading"
                      className="text-2xl font-medium text-[#2A2F73]"
                    >
                      {t("home.propertiesHeadline")}
                    </h2>
                  </div>
                </div>
              </div>
              <p className="max-w-[875px] text-base font-normal text-[#5A5A5A]">
                {t("home.propertiesSubtitle")}
              </p>
            </div>
            <PrimaryBtn href="/search" className="shrink-0">
              {t("home.viewAllProperties")}
              <ArrowRightIcon className="h-6 w-6" />
            </PrimaryBtn>
          </div>

          {/* Cards grid */}
          <div className="flex flex-col gap-6">
            {/* Row 1 */}
            <div className="flex gap-6">
              {propertiesGrid.slice(0, 3).map((p) => (
                <div key={p.id} className="flex-1">
                  <PropertyCardFigma property={p} />
                </div>
              ))}
            </div>
            {/* Row 2 */}
            {propertiesGrid.length > 3 && (
              <div className="flex gap-6">
                {propertiesGrid.slice(3, 6).map((p) => (
                  <div key={p.id} className="flex-1">
                    <PropertyCardFigma property={p} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Activities Section ────────────────────────────────────────────── */}
      <section
        aria-labelledby="activities-heading"
        className="bg-[#F0E9E4] px-[120px] py-[100px]"
      >
        <div className="mx-auto flex max-w-[1200px] flex-col gap-10">
          {/* Header */}
          <div className="flex items-end gap-4">
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
                      d="M14 4L4 14l10 10 10-10L14 4z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                }
                label={t("home.activitiesTag")}
              />
              <h2
                id="activities-heading"
                className="text-2xl font-medium leading-[1.5] text-[#2A2F73]"
              >
                {t("home.activitiesHeadline")}
              </h2>
              <p className="max-w-[875px] text-base text-[#5A5A5A]">
                {t("home.activitiesSubtitle")}
              </p>
            </div>
            <PrimaryBtn href="/search?category=activity" className="shrink-0">
              {t("home.viewAllActivities")}
              <ArrowRightIcon className="h-6 w-6" />
            </PrimaryBtn>
          </div>

          {/* Activity image layout */}
          <div className="relative h-[411px] w-full overflow-hidden rounded-xl">
            {/* Main large image */}
            <div className="absolute left-0 top-0 h-full w-[765px] overflow-hidden rounded-xl bg-gradient-to-br from-blue-400 to-cyan-600">
              <div className="absolute bottom-0 left-0 right-0 h-[294px] bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-6 left-6">
                <p className="text-xl font-medium text-white">
                  {t("home.activityCompanyName")}
                </p>
                <p className="mt-2 max-w-[409px] text-sm text-white/90">
                  {t("home.activityCompanyDesc")}
                </p>
                <Link
                  href="/search?category=activity"
                  className="mt-4 inline-flex items-center gap-2 rounded-lg border border-white px-6 py-4 text-base font-medium text-white transition-colors hover:bg-white/10"
                >
                  {t("home.explore")}
                  <ArrowRightIcon className="h-6 w-6" />
                </Link>
              </div>
            </div>
            {/* Side image */}
            <div className="absolute right-0 top-0 h-full w-[410px] overflow-hidden rounded-xl bg-gradient-to-br from-teal-400 to-blue-500" />
          </div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────────────────── */}
      <section
        aria-label="Browse all properties"
        className="relative h-[800px] overflow-hidden bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1440&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-black/25" aria-hidden="true" />
        <div className="relative flex h-full items-center justify-center">
          <div className="flex flex-col items-center gap-8 text-center">
            <h2
              className="text-xl font-medium leading-[1.3] text-white"
              style={{ textTransform: "capitalize" }}
            >
              {t("home.ctaHeadline")}
            </h2>
            <p className="max-w-[486px] text-base text-[#F0F1F3]">
              {t("home.ctaSubtitle")}
            </p>
            <Link
              href="/search"
              className="flex items-center gap-6 rounded-2xl bg-white/10 px-3 py-4 text-sm text-white backdrop-blur-[18px] transition-colors hover:bg-white/20"
            >
              <span>{t("home.browseAllProperties")}</span>
              <ArrowRightIcon className="h-6 w-6" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Beaches Section ──────────────────────────────────────────────── */}
      <section
        aria-labelledby="beaches-heading"
        className="bg-[#E8E8FF] px-[120px] py-[100px]"
      >
        <div className="mx-auto flex max-w-[1200px] flex-col gap-6">
          {/* Header */}
          <div className="flex items-end gap-4">
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
                      d="M4 20c4-8 16-8 20 0M14 4v4M6 8l2 2M22 8l-2 2"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                }
                label={t("home.beachesTag")}
              />
              <h2
                id="beaches-heading"
                className="text-2xl font-medium leading-[1.5] text-[#2A2F73]"
              >
                {t("home.beachesHeadline")}
              </h2>
              <p className="max-w-[875px] text-base text-[#5A5A5A]">
                {t("home.beachesSubtitle")}
              </p>
            </div>
          </div>

          {/* Beach gallery — overlapping cards */}
          <div className="relative h-[475px] w-full">
            {/* Background blurred cards */}
            <div className="absolute left-0 top-7 h-[383px] w-[274px] overflow-hidden rounded-lg bg-gradient-to-br from-blue-300 to-cyan-400 opacity-30 blur-[5px]" />
            <div className="absolute right-0 top-7 h-[383px] w-[274px] overflow-hidden rounded-lg bg-gradient-to-br from-teal-300 to-blue-400 opacity-30 blur-[5px]" />
            {/* Side cards */}
            <div className="absolute left-[179px] top-3.5 h-[383px] w-[296px] overflow-hidden rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 opacity-30 blur-[4px]" />
            <div className="absolute right-[179px] top-3.5 h-[383px] w-[296px] overflow-hidden rounded-lg bg-gradient-to-br from-blue-400 to-indigo-500 opacity-30 blur-[4px]" />
            {/* Center featured card */}
            <div className="absolute left-[441px] top-0 h-[411px] w-[318px] overflow-hidden rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600">
              <div className="absolute bottom-0 left-0 right-0 h-[294px] bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 rounded-2xl bg-white/10 p-3 backdrop-blur-[18px]">
                <p className="text-base font-semibold text-white">
                  {t("home.beachName")}
                </p>
                <p className="mt-1 text-xs text-white/90">
                  {t("home.beachDesc")}
                </p>
                <button
                  type="button"
                  className="mt-2 flex items-center gap-2 text-sm text-white"
                >
                  {t("home.explore")} <ArrowRightIcon className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Shops Section ────────────────────────────────────────────────── */}
      <section
        aria-labelledby="shops-heading"
        className="bg-[#FAFAFA] px-[120px] py-[100px]"
      >
        <div className="mx-auto flex max-w-[1440px] items-center gap-12">
          {/* Image grid */}
          <div className="relative h-[450px] w-[583px] shrink-0">
            <div className="absolute left-[13px] top-0 h-full w-[570px] overflow-hidden rounded-2xl">
              <div className="flex h-full flex-col gap-2">
                <div className="flex flex-1 gap-2">
                  <div className="w-[308px] overflow-hidden rounded-tl-2xl bg-gradient-to-br from-amber-300 to-orange-400" />
                  <div className="flex-1 overflow-hidden rounded-tr-2xl bg-gradient-to-br from-rose-300 to-pink-400" />
                </div>
                <div className="flex flex-1 gap-2">
                  <div className="w-[176px] overflow-hidden rounded-bl-2xl bg-gradient-to-br from-purple-300 to-indigo-400" />
                  <div className="flex-1 overflow-hidden rounded-br-2xl bg-gradient-to-br from-teal-300 to-cyan-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Text content */}
          <div className="flex flex-col gap-6">
            <SectionTag
              icon={
                <svg
                  className="h-7 w-7 text-[#363C88]"
                  viewBox="0 0 28 28"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M4 7h20M4 7v14a1 1 0 001 1h14a1 1 0 001-1V7M4 7l2-4h16l2 4M10 11v6M14 11v6M18 11v6"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              }
              label={t("home.shopsTag")}
            />
            <h2
              id="shops-heading"
              className="text-2xl font-medium leading-[1.5] text-[#2A2F73]"
            >
              {t("home.shopsHeadline")}
            </h2>
            <p className="text-base text-[#727272]">
              {t("home.shopsSubtitle1")}
            </p>
            <p className="text-base text-[#727272]">
              {t("home.shopsSubtitle2")}
            </p>
            <PrimaryBtn href="/search?category=shop">
              {t("home.browseShops")}
              <ArrowRightIcon className="h-6 w-6" />
            </PrimaryBtn>
          </div>
        </div>
      </section>

      {/* ── Yacht Parking ────────────────────────────────────────────────── */}
      <section
        aria-labelledby="yacht-heading"
        className="flex h-[650px] items-stretch bg-[#FAFAFA]"
      >
        {/* Left: image/color block */}
        <div className="relative w-[708px] shrink-0 overflow-hidden bg-[#E8E8FF]">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-200 to-indigo-300 opacity-50" />
        </div>

        {/* Right: content */}
        <div className="flex flex-1 flex-col justify-end gap-6 px-[120px] py-[147px]">
          <SectionTag
            icon={
              <svg
                className="h-7 w-7 text-[#363C88]"
                viewBox="0 0 28 28"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M4 20l6-12 4 8 4-6 6 10H4z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            }
            label={t("home.yachtTag")}
          />
          <h2
            id="yacht-heading"
            className="text-2xl font-medium leading-[1.5] text-[#2A2F73]"
          >
            {t("home.yachtHeadline")}
          </h2>
          <p className="text-base text-[#5A5A5A]">{t("home.yachtSubtitle")}</p>
          <PrimaryBtn href="/search">
            {t("home.exploreMarina")}
            <ArrowRightIcon className="h-6 w-6" />
          </PrimaryBtn>
        </div>
      </section>

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
            <PrimaryBtn href="/blogs" className="shrink-0">
              {t("home.viewAllBlogs")}
              <ArrowRightIcon className="h-6 w-6" />
            </PrimaryBtn>
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
