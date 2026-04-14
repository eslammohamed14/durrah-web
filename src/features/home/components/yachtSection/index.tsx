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
      className="relative h-[650px] overflow-hidden bg-[#FAFAFA] pr-[120px]"
    >
      <div className="absolute left-0 top-0 h-full w-[708px] bg-[#E8E8FF]" />

      <div className="absolute left-0 top-1/2 w-[605px] -translate-y-1/2 opacity-40">
        <div className="h-[458px] w-[605px] ">
          <Image
            src={images.yachtShape}
            alt="Yacht shape"
            width={605}
            height={458}
          />
        </div>
      </div>

      <div className="absolute left-[120px] top-1/2 z-10 w-[413px] -translate-y-1/2">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <SectionTag
              icon={<BeachesSectionIcon size={28} />}
              label={t("home.yachtTag")}
            />
            <h2
              id="yacht-heading"
              className="text-[22px] font-medium leading-[1.3] text-[#2A2F73]"
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
            onClick={() => {}} //router.push("/search")
            className="h-12 w-fit rounded-lg px-4 text-base font-medium text-white shadow-none hover:!bg-[#e8614a] active:!bg-[#d45540] focus-visible:!ring-[#FF765E]"
            leftIcon={<SearchIcon className="h-6 w-6" />}
            rightIcon={<ArrowRightIcon className="h-6 w-6" />}
          >
            {t("home.exploreMarina")}
          </Button>
        </div>
      </div>

      <div className="absolute left-[600px] top-1/2 h-[450px] w-[720px] -translate-y-1/2 overflow-hidden rounded-xl">
        <img
          src={images.property6}
          alt="Yacht marina"
          className="h-full w-full object-cover"
        />
      </div>
    </section>
  );
}
