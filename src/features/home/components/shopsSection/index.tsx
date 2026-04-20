"use client";

import { useRouter } from "@/lib/navigation";
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
      className="bg-background px-4 py-10 sm:px-6 sm:py-16 lg:px-16 xl:px-[120px] xl:py-[100px]"
    >
      <div className="mx-auto flex max-w-screen-2xl flex-col items-center gap-8 xl:max-w-[1200px] xl:flex-row xl:gap-12">
        <div className="w-full xl:flex-1">
          <ShopGallery />
        </div>

        <div className="flex w-full flex-col justify-end gap-6 xl:w-[588px]">
          <div className="flex flex-col gap-4">
            <SectionTag
              icon={<BuildingColoredIcon size={28} />}
              label={t("home.shopsTag")}
            />
            <h2
              id="shops-heading"
              className="text-xl font-medium leading-[1.3] text-text-dark sm:text-[22px]"
            >
              {t("home.shopsHeadline")}
            </h2>
            <p className="text-sm font-normal leading-[1.6] text-text-body-dark sm:text-[16px]">
              {t("home.shopsSubtitle1")}
            </p>
            <p className="text-sm font-normal leading-[1.6] text-text-body-dark sm:text-[16px]">
              {t("home.shopsSubtitle2")}
            </p>
          </div>

          <Button
            type="button"
            variant="primary"
            backgroundColor="#FF765E"
            onClick={() => router.push("/search?category=shop")}
            className="h-12 w-full rounded-lg px-4 text-base font-medium text-white shadow-none hover:!bg-[#e8614a] active:!bg-[#d45540] focus-visible:!ring-primary-coral-400 sm:w-fit"
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
