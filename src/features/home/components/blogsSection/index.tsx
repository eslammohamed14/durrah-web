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
      className="bg-background px-4 py-10 sm:px-6 sm:py-16 lg:px-8 xl:px-[30px] xl:py-[100px]"
    >
      <div className="mx-auto flex max-w-screen-2xl flex-col gap-8 xl:max-w-[1200px] xl:gap-10">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-10">
          <div className="flex flex-1 flex-col gap-4">
            <SectionTag
              icon={<BlogsSectionIcon className="h-7 w-7" />}
              label={t("home.blogsTag")}
            />
            <h2
              id="blogs-heading"
              className="text-xl font-medium leading-[1.3] text-text-dark sm:text-[22px]"
            >
              {t("home.blogsHeadline")}
            </h2>
          </div>

          <Button
            type="button"
            variant="primary"
            backgroundColor="#FF765E"
            onClick={() => router.push("/blogs")}
            className="h-12 w-full rounded-lg px-4 text-base font-medium text-white shadow-none hover:!bg-[#e8614a] active:!bg-[#d45540] focus-visible:!ring-primary-coral-400 sm:w-fit"
            rightIcon={<ArrowRightIcon size={24} />}
          >
            {t("home.viewAllBlogs")}
          </Button>
        </header>

        {/* Blog grid — stacked on mobile, side-by-side on lg+ */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:gap-3">
          <div className="grid grid-cols-2 gap-3 lg:w-[498px] lg:flex-none lg:flex-col">
            <div className="flex gap-3">
              <BlogGridItem imageUrl={images.property1} badge="Resorts" />
              <BlogGridItem imageUrl={images.property2} badge="Restaurants" />
            </div>
            <div className="flex gap-3">
              <BlogGridItem imageUrl={images.property3} badge="Restaurants" />
              <BlogGridItem imageUrl={images.property4} badge="Resorts" />
            </div>
          </div>

          <div className="flex flex-col gap-4 lg:w-[690px] lg:flex-none lg:gap-6">
            <FeaturedBlogCard
              imageUrl={images.property5}
              title={t("home.blogFeaturedTitle")}
              discoverLabel={t("home.discoverMore")}
            />
            <p className="text-sm leading-[1.6] text-text-body-dark sm:text-base">
              {t("home.blogFeaturedExcerpt")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
