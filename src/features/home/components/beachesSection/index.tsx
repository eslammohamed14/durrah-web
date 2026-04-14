"use client";

import { useMemo } from "react";
import { BeachesSectionIcon } from "@/assets/icons";
import images from "@/constant/images";
import { useLocale } from "@/lib/contexts/LocaleContext";
import { SectionTag } from "@/features/home/components/sectionTag";
import { BeachesSlider } from "./BeachesSlider";

export function BeachesSection() {
  const { t } = useLocale();

  const beachItems = useMemo(
    () => [
      {
        id: "beach-1",
        name: t("home.beachName"),
        description: t("home.beachDesc"),
        imageUrl: images.property1,
        href: "/search?category=rent",
        exploreLabel: t("home.explore"),
      },
      {
        id: "beach-2",
        name: t("home.beachName"),
        description: t("home.beachDesc"),
        imageUrl: images.property2,
        href: "/search?category=rent",
        exploreLabel: t("home.explore"),
      },
      {
        id: "beach-3",
        name: t("home.beachName"),
        description: t("home.beachDesc"),
        imageUrl: images.property3,
        href: "/search?category=rent",
        exploreLabel: t("home.explore"),
      },
      {
        id: "beach-4",
        name: t("home.beachName"),
        description: t("home.beachDesc"),
        imageUrl: images.property4,
        href: "/search?category=rent",
        exploreLabel: t("home.explore"),
      },
      {
        id: "beach-5",
        name: t("home.beachName"),
        description: t("home.beachDesc"),
        imageUrl: images.property5,
        href: "/search?category=rent",
        exploreLabel: t("home.explore"),
      },
    ],
    [t],
  );

  return (
    <section
      aria-labelledby="beaches-heading"
      className="overflow-hidden bg-[#E8E8FF] px-[120px] py-[100px]"
    >
      <div className="mx-auto flex max-w-[1260px] flex-col gap-10">
        <div className="flex items-end gap-4">
          <div className="flex flex-1 flex-col gap-4">
            <SectionTag
              icon={<BeachesSectionIcon />}
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

        <BeachesSlider items={beachItems} />
      </div>
    </section>
  );
}
