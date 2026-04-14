"use client";

import images from "@/constant/images";
import { InstagramSectionIcon } from "@/assets/icons";
import { useLocale } from "@/lib/contexts/LocaleContext";
import { SectionTag } from "@/features/home/components/sectionTag";
import { InstagramPhoto } from "./InstagramPhoto";

export function InstagramSection() {
  const { t } = useLocale();

  return (
    <section
      aria-labelledby="instagram-heading"
      className="bg-[#FAFAFA] px-[120px] py-[100px]"
    >
      <div className="mx-auto flex max-w-[1200px] flex-col gap-10">
        <div className="flex flex-col gap-4">
          <SectionTag
            icon={<InstagramSectionIcon className="h-7 w-7" />}
            label={t("home.instagramTag")}
          />
          <h2
            id="instagram-heading"
            className="text-[22px] font-medium leading-[1.3] text-[#2A2F73]"
          >
            {t("home.instagramHeadline")}
          </h2>
          <p className="max-w-[875px] text-base leading-[1.6] text-[#5A5A5A]">
            {t("home.instagramSubtitle")}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex gap-3">
            <div className="flex w-[282px] flex-col gap-3">
              <InstagramPhoto
                imageUrl={images.property1}
                widthClass="w-[282px]"
                heightClass="h-[199px]"
              />
              <InstagramPhoto
                imageUrl={images.property2}
                widthClass="w-[282px]"
                heightClass="h-[199px]"
              />
            </div>
            <InstagramPhoto
              imageUrl={images.property3}
              widthClass="w-[318px]"
              heightClass="h-[411px]"
            />
          </div>

          <div className="flex w-[576px] flex-col gap-3">
            <InstagramPhoto
              imageUrl={images.property4}
              widthClass="w-[576px]"
              heightClass="h-[199px]"
            />
            <div className="flex gap-3">
              <InstagramPhoto
                imageUrl={images.property5}
                widthClass="w-[282px]"
                heightClass="h-[200px]"
              />
              <InstagramPhoto
                imageUrl={images.property6}
                widthClass="w-[282px]"
                heightClass="h-[200px]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
