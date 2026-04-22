import { getTranslations } from "next-intl/server";
import images from "@/constant/images";
import { InstagramSectionIcon } from "@/assets/icons";
import { SectionTag } from "@/features/home/components/sectionTag";
import { InstagramPhoto } from "./InstagramPhoto";

export async function InstagramSection() {
  const t = await getTranslations();

  return (
    <section
      aria-labelledby="instagram-heading"
      className="bg-background px-4 py-10 sm:px-6 sm:py-16 lg:px-16 xl:px-[120px] xl:py-[100px]"
    >
      <div className="mx-auto flex max-w-screen-2xl flex-col gap-8 xl:max-w-[1200px] xl:gap-10">
        <div className="flex flex-col gap-4">
          <SectionTag
            icon={<InstagramSectionIcon className="h-7 w-7" />}
            label={t("home.instagramTag")}
          />
          <h2
            id="instagram-heading"
            className="text-xl font-medium leading-[1.3] text-text-dark sm:text-[22px]"
          >
            {t("home.instagramHeadline")}
          </h2>
          <p className="max-w-[875px] text-sm leading-[1.6] text-text-body-dark sm:text-base">
            {t("home.instagramSubtitle")}
          </p>
        </div>

        {/* Mobile: 2-col grid; lg+: original mosaic layout */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:hidden">
          {[
            images.property1,
            images.property2,
            images.property3,
            images.property4,
            images.property5,
            images.property6,
          ].map((src, i) => (
            <div
              key={i}
              className="relative aspect-square overflow-hidden rounded-xl"
            >
              <InstagramPhoto
                imageUrl={src}
                widthClass="w-full"
                heightClass="h-full"
              />
            </div>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <div className="flex gap-3">
            <div className="flex w-[282px] flex-col gap-3">
              <InstagramPhoto imageUrl={images.property1} widthClass="w-[282px]" heightClass="h-[199px]" />
              <InstagramPhoto imageUrl={images.property2} widthClass="w-[282px]" heightClass="h-[199px]" />
            </div>
            <InstagramPhoto imageUrl={images.property3} widthClass="w-[318px]" heightClass="h-[411px]" />
          </div>

          <div className="flex w-[576px] flex-col gap-3">
            <InstagramPhoto imageUrl={images.property4} widthClass="w-[576px]" heightClass="h-[199px]" />
            <div className="flex gap-3">
              <InstagramPhoto imageUrl={images.property5} widthClass="w-[282px]" heightClass="h-[200px]" />
              <InstagramPhoto imageUrl={images.property6} widthClass="w-[282px]" heightClass="h-[200px]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
