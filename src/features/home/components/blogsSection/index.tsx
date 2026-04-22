import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/navigation";
import images from "@/constant/images";
import { ArrowRightIcon, BlogsSectionIcon } from "@/assets/icons";
import { SectionTag } from "@/features/home/components/sectionTag";
import { BlogGridItem } from "./BlogGridItem";
import { FeaturedBlogCard } from "./FeaturedBlogCard";

/**
 * Home — Concept 1 blogs block from Figma **Final UI** → `489:5399` ("Blogs - 3").
 * @see https://www.figma.com/design/XKx3FF4Xw6ZpvooyvB71Kn/Durrah-Property?node-id=489-5399
 */
export async function BlogsSection() {
  const t = await getTranslations();
  const locale = await getLocale();
  const headlineCaps = locale === "ar" ? "" : "capitalize";

  return (
    <section
      aria-labelledby="blogs-heading"
      className="bg-background px-4 py-10 sm:px-6 sm:py-14 md:px-10 lg:px-16 lg:py-16 xl:px-[120px]"
    >
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-10">
        <header className="flex w-full flex-col gap-10 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex min-w-0 flex-1 flex-col gap-4">
            <SectionTag
              icon={<BlogsSectionIcon className="h-7 w-7" />}
              label={t("home.blogsTag")}
            />
            <h2
              id="blogs-heading"
              className={[
                "max-w-[983px] text-[22px] font-medium leading-[1.3] text-text-dark",
                headlineCaps,
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {t("home.blogsHeadline")}
            </h2>
          </div>

          {/* Link styled as a button — no client JS needed for navigation */}
          <Link
            href="/blogs"
            className="inline-flex h-12 w-full shrink-0 items-center justify-center gap-2.5 rounded-lg bg-[#FF765E] px-4 py-4 text-base font-medium text-white transition hover:bg-[#e86a54] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF765E] focus-visible:ring-offset-2 active:bg-[#d45540] sm:w-[177px]"
          >
            {t("home.viewAllBlogs")}
            <ArrowRightIcon size={24} className="shrink-0" aria-hidden />
          </Link>
        </header>

        <div className="flex w-full flex-col gap-3 lg:flex-row lg:items-start">
          <div className="flex min-w-0 flex-1 flex-col gap-3">
            <div className="flex w-full gap-3">
              <BlogGridItem imageUrl={images.property1} badge="Resorts" />
              <BlogGridItem imageUrl={images.property2} badge="Restaurants" />
            </div>
            <div className="flex w-full gap-3">
              <BlogGridItem imageUrl={images.property3} badge="Restaurants" />
              <BlogGridItem imageUrl={images.property4} badge="Resorts" />
            </div>
          </div>

          <div className="flex w-full shrink-0 flex-col gap-6 self-stretch lg:w-[690px] lg:max-w-[690px]">
            <FeaturedBlogCard
              imageUrl={images.property5}
              title={t("home.blogFeaturedTitle")}
              discoverLabel={t("home.discoverMore")}
              category={t("home.blogFeaturedCategory")}
              date={t("home.blogFeaturedDate")}
              readTime={t("home.blogFeaturedReadTime")}
            />
            <p className="w-full text-base font-normal leading-[1.6] text-grey-600">
              {t("home.blogFeaturedExcerpt")}
              <Link
                href="/blogs"
                className="font-semibold leading-[1.5] text-[#2a2f73] underline-offset-2 hover:underline"
              >
                {t("home.blogReadMore")}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
