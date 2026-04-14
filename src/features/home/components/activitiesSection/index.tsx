"use client";

import { useLocale } from "@/lib/contexts/LocaleContext";
import { ActivitiesSectionIcon, ArrowRightIcon } from "@/assets/icons";
import { CtaNavigateButton } from "@/components/ui/CtaNavigateButton";
import { SectionTag } from "@/features/home/components/sectionTag";
import { ActivityItem } from "./ActivityItem";
import images from "@/constant/images";

export interface ActivitiesSectionProps {
  /** Optional image URL for the featured (left) card */
  featuredImageUrl?: string;
  /** Optional image URL for the plain (right) card */
  plainImageUrl?: string;
}

export function ActivitiesSection({
  featuredImageUrl,
  plainImageUrl,
}: ActivitiesSectionProps) {
  const { t } = useLocale();

  return (
    <section
      aria-labelledby="activities-heading"
      className="bg-[#F0E9E4] px-[120px] py-[100px]"
    >
      <div className="mx-auto flex max-w-[1200px] flex-col gap-10">
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="flex items-end gap-4">
          <div className="flex flex-1 flex-col gap-4">
            <SectionTag
              icon={<ActivitiesSectionIcon />}
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

          <CtaNavigateButton
            href="/search?category=activity"
            className="shrink-0"
            rightIcon={<ArrowRightIcon className="h-6 w-6" />}
          >
            {t("home.viewAllActivities")}
          </CtaNavigateButton>
        </div>

        {/* ── Cards ──────────────────────────────────────────────────────── */}
        <div className="flex h-[411px] gap-4">
          {/* Featured card — wider, shows text + explore button overlay */}
          <div className="flex-[1.85]">
            <ActivityItem
              featured
              imageUrl={featuredImageUrl ?? images.activity1}
              imageAlt={t("home.activityCompanyName")}
              name={t("home.activityCompanyName")}
              description={t("home.activityCompanyDesc")}
              href="/search?category=activity"
              exploreLabel={t("home.explore")}
            />
          </div>

          {/* Plain card — narrower, image only */}
          <div className="flex-1">
            <ActivityItem
              imageUrl={plainImageUrl ?? images.activity2}
              imageAlt={t("home.activitiesTag")}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
