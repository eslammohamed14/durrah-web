"use client";

import { useRouter } from "next/navigation";
import images from "@/constant/images";
import { ArrowRightIcon, BlogsSectionIcon } from "@/assets/icons";
import { Button } from "@/components/ui/Button";
import { useLocale } from "@/lib/contexts/LocaleContext";
import { SectionTag } from "@/features/home/components/sectionTag";
import { BlogGridItem } from "./BlogGridItem";
import { FeaturedBlogCard } from "./FeaturedBlogCard";

export function BlogsSection() {
  const router = useRouter();
  const { t } = useLocale();

  return (
    <section
      aria-labelledby="blogs-heading"
      className="bg-[#FAFAFA] px-[120px] py-[100px]"
    >
      <div className="mx-auto flex max-w-[1200px] flex-col gap-10">
        <header className="flex items-end gap-10">
          <div className="flex flex-1 flex-col gap-4">
            <SectionTag
              icon={<BlogsSectionIcon className="h-7 w-7" />}
              label={t("home.blogsTag")}
            />
            <h2
              id="blogs-heading"
              className="text-[22px] font-medium leading-[1.3] text-[#2A2F73]"
            >
              {t("home.blogsHeadline")}
            </h2>
          </div>

          <Button
            type="button"
            variant="primary"
            backgroundColor="#FF765E"
            onClick={() => router.push("/blogs")}
            className="h-12 w-fit rounded-lg px-4 text-base font-medium text-white shadow-none hover:!bg-[#e8614a] active:!bg-[#d45540] focus-visible:!ring-[#FF765E]"
            rightIcon={<ArrowRightIcon size={24} />}
          >
            {t("home.viewAllBlogs")}
          </Button>
        </header>

        <div className="flex items-start gap-3">
          <div className="flex w-[498px] flex-col gap-3">
            <div className="flex gap-3">
              <BlogGridItem imageUrl={images.property1} badge="Resorts" />
              <BlogGridItem imageUrl={images.property2} badge="Restaurants" />
            </div>
            <div className="flex gap-3">
              <BlogGridItem imageUrl={images.property3} badge="Restaurants" />
              <BlogGridItem imageUrl={images.property4} badge="Resorts" />
            </div>
          </div>

          <div className="flex w-[690px] flex-col gap-6">
            <FeaturedBlogCard
              imageUrl={images.property5}
              title={t("home.blogFeaturedTitle")}
              discoverLabel={t("home.discoverMore")}
            />
            <p className="text-base leading-[1.6] text-[#5A5A5A]">
              {t("home.blogFeaturedExcerpt")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
