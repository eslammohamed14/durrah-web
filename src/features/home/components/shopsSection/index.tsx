"use client";

import { useRouter } from "next/navigation";
import {
  ArrowRightIcon,
  BuildingColoredIcon,
  SearchIcon,
} from "@/assets/icons";
import { Button } from "@/components/ui/Button";
import { useLocale } from "@/lib/contexts/LocaleContext";
import { SectionTag } from "@/features/home/components/sectionTag";
import { ShopGallery } from "./ShopGallery";

export function ShopsSection() {
  const router = useRouter();
  const { t } = useLocale();

  return (
    <section
      aria-labelledby="shops-heading"
      className="bg-[#FAFAFA] px-[120px] py-[100px]"
    >
      <div className="mx-auto flex max-w-[1200px] items-center gap-12">
        <ShopGallery />

        <div className="flex w-[588px] flex-col justify-end gap-6">
          <div className="flex flex-col gap-4">
            <SectionTag
              icon={<BuildingColoredIcon size={28} />}
              label={t("home.shopsTag")}
            />
            <h2
              id="shops-heading"
              className="text-[22px] font-medium leading-[1.3] text-[#2A2F73]"
            >
              {t("home.shopsHeadline")}
            </h2>
            <p className="text-[16px] font-normal leading-[1.6] text-[#5A5A5A]">
              {t("home.shopsSubtitle1")}
            </p>
            <p className="text-[16px] font-normal leading-[1.6] text-[#5A5A5A]">
              {t("home.shopsSubtitle2")}
            </p>
          </div>

          <Button
            type="button"
            variant="primary"
            backgroundColor="#FF765E"
            onClick={() => router.push("/search?category=shop")}
            className="h-12 w-fit rounded-lg px-4 text-base font-medium text-white shadow-none hover:!bg-[#e8614a] active:!bg-[#d45540] focus-visible:!ring-[#FF765E]"
            leftIcon={<SearchIcon className="h-6 w-6" />}
            rightIcon={<ArrowRightIcon className="h-6 w-6" />}
          >
            {t("home.browseShops")}
          </Button>
        </div>
      </div>
    </section>
  );
}
