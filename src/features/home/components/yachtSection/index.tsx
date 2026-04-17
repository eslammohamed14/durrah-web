"use client";

import { useRouter } from "next/navigation";
import images from "@/constant/images";
import { ArrowRightIcon, SearchIcon, BeachesSectionIcon } from "@/assets/icons";
import { Button } from "@/components/ui/Button";
import { useLocale } from "@/lib/contexts/LocaleContext";
import { SectionTag } from "@/features/home/components/sectionTag";
import Image from "next/image";

export function YachtSection() {
  const router = useRouter();
  const { t } = useLocale();

  return (
    <section
      aria-labelledby="yacht-heading"
      className="relative overflow-hidden bg-[#FAFAFA] px-4 py-10 sm:px-6 sm:py-16 lg:px-16 xl:py-0"
    >
      {/* On xl+, restore the split background layout */}
      <div className="hidden xl:block xl:absolute xl:left-0 xl:top-0 xl:h-full xl:w-[708px] xl:bg-[#E8E8FF]" />
      <div className="hidden xl:block xl:absolute xl:left-0 xl:top-1/2 xl:w-[605px] xl:-translate-y-1/2 xl:opacity-40">
        <div className="h-[458px] w-[605px]">
          <Image
            src={images.yachtShape}
            alt="Yacht shape"
            width={605}
            height={458}
          />
        </div>
      </div>

      {/* Mobile / tablet: stacked layout */}
      <div className="relative z-10 mx-auto flex max-w-screen-2xl flex-col gap-8 xl:hidden">
        <div className="rounded-xl overflow-hidden bg-[#E8E8FF] p-8">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <SectionTag
                icon={<BeachesSectionIcon size={28} />}
                label={t("home.yachtTag")}
              />
              <h2
                id="yacht-heading"
                className="text-xl font-medium leading-[1.3] text-[#2A2F73] sm:text-[22px]"
              >
                {t("home.yachtHeadline")}
              </h2>
              <p className="text-sm font-normal leading-[1.6] text-[#5A5A5A] sm:text-[16px]">
                {t("home.yachtSubtitle")}
              </p>
            </div>
            <Button
              type="button"
              variant="primary"
              backgroundColor="#FF765E"
              onClick={() => {}}
              className="h-12 w-full rounded-lg px-4 text-base font-medium text-white shadow-none hover:!bg-[#e8614a] active:!bg-[#d45540] focus-visible:!ring-[#FF765E] sm:w-fit"
              leftIcon={<SearchIcon className="h-6 w-6" />}
              rightIcon={<ArrowRightIcon className="h-6 w-6" />}
            >
              {t("home.exploreMarina")}
            </Button>
          </div>
        </div>
        <div className="relative h-56 overflow-hidden rounded-xl sm:h-72">
          <Image
            src={images.property6}
            alt="Yacht marina"
            fill
            loading="lazy"
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </div>

      {/* Desktop: original absolute-positioned layout */}
      <div className="relative hidden h-[650px] xl:block">
        <div className="absolute left-[120px] top-1/2 z-10 w-[413px] -translate-y-1/2">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <SectionTag
                icon={<BeachesSectionIcon size={28} />}
                label={t("home.yachtTag")}
              />
              <h2
                id="yacht-heading-xl"
                className="text-[22px] font-medium leading-[1.3] text-[#2A2F73]"
                aria-hidden="true"
              >
                {t("home.yachtHeadline")}
              </h2>
              <p className="text-[16px] font-normal leading-[1.6] text-[#5A5A5A]">
                {t("home.yachtSubtitle")}
              </p>
            </div>
            <Button
              type="button"
              variant="primary"
              backgroundColor="#FF765E"
              onClick={() => {}}
              className="h-12 w-fit rounded-lg px-4 text-base font-medium text-white shadow-none hover:!bg-[#e8614a] active:!bg-[#d45540] focus-visible:!ring-[#FF765E]"
              leftIcon={<SearchIcon className="h-6 w-6" />}
              rightIcon={<ArrowRightIcon className="h-6 w-6" />}
            >
              {t("home.exploreMarina")}
            </Button>
          </div>
        </div>
        <div className="absolute left-[600px] top-1/2 h-[450px] w-[720px] -translate-y-1/2 overflow-hidden rounded-xl">
          <Image
            src={images.property6}
            alt="Yacht marina"
            fill
            loading="lazy"
            sizes="720px"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
