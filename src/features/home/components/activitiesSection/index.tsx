"use client";

import { useMemo, useState } from "react";
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
  const [activeIndex, setActiveIndex] = useState(0);

  const activityCards = useMemo(
    () => [
      {
        imageUrl: featuredImageUrl ?? images.activity1,
        imageAlt: t("home.activityCompanyName"),
        name: t("home.activityCompanyName"),
        description: t("home.activityCompanyDesc"),
      },
      {
        imageUrl: plainImageUrl ?? images.activity2,
        imageAlt: t("home.activityCompanyNameAlt"),
        name: t("home.activityCompanyNameAlt"),
        description: t("home.activityCompanyDescAlt"),
      },
    ],
    [featuredImageUrl, plainImageUrl, t],
  );

  return (
    <section
      aria-labelledby="activities-heading"
      className="bg-[#F0E9E4] px-4 py-10 sm:px-6 sm:py-16 lg:px-16 xl:px-[120px] xl:py-[100px]"
    >
      <div className="mx-auto flex max-w-screen-2xl flex-col gap-8 xl:max-w-[1200px] xl:gap-10">
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex flex-1 flex-col gap-4">
            <SectionTag
              icon={<ActivitiesSectionIcon />}
              label={t("home.activitiesTag")}
            />
            <h2
              id="activities-heading"
              className="text-xl font-medium leading-[1.5] text-[#2A2F73] sm:text-2xl"
            >
              {t("home.activitiesHeadline")}
            </h2>
            <p className="max-w-[875px] text-sm text-[#5A5A5A] sm:text-base">
              {t("home.activitiesSubtitle")}
            </p>
          </div>

          <CtaNavigateButton
            href="/search?category=activity"
            className="shrink-0 self-start sm:self-auto"
            rightIcon={<ArrowRightIcon className="h-6 w-6" />}
          >
            {t("home.viewAllActivities")}
          </CtaNavigateButton>
        </div>

        {/* ── Cards ──────────────────────────────────────────────────────── */}
        <div className="flex h-[280px] gap-3 sm:h-[340px] lg:h-[411px] lg:gap-4">
          {activityCards.map((card, index) => {
            const isActive = index === activeIndex;
            return (
              <div
                key={card.imageAlt}
                className={[
                  "h-full transition-all duration-300 ease-in-out",
                  isActive ? "flex-[1.85]" : "flex-1",
                ].join(" ")}
              >
                <ActivityItem
                  featured={isActive}
                  imageUrl={card.imageUrl}
                  imageAlt={card.imageAlt}
                  name={card.name}
                  description={card.description}
                  href="/search?category=activity"
                  exploreLabel={t("home.explore")}
                  onClick={() => setActiveIndex(index)}
                  className="cursor-pointer"
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
