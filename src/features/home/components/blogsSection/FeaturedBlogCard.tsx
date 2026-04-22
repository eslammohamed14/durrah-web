import { Link } from "@/navigation";
import { ArrowRightIcon } from "@/assets/icons";
import Image from "next/image";

interface FeaturedBlogCardProps {
  imageUrl: string;
  title: string;
  discoverLabel: string;
  category: string;
  date: string;
  readTime: string;
  href?: string;
}

/** Matches Figma `489:5419`–`489:5430` — 690×379, 8px radius, bottom gradient 240px, meta #f1f1f2, title 20px medium. */
export function FeaturedBlogCard({
  imageUrl,
  title,
  discoverLabel,
  category,
  date,
  readTime,
  href = "/blogs",
}: FeaturedBlogCardProps) {
  return (
    <article className="w-full max-w-[690px]">
      <div className="relative aspect-[690/379] w-full min-h-[220px] overflow-hidden rounded-lg lg:aspect-auto lg:h-[379px]">
        <Image
          src={imageUrl}
          alt={title}
          fill
          sizes="(max-width: 1023px) 100vw, 690px"
          className="object-cover"
          priority={false}
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[240px] bg-gradient-to-t from-[rgba(30,30,30,0.8)] to-transparent"
          aria-hidden
        />

        <span className="absolute start-4 top-4 z-[1] flex h-6 items-center rounded-full bg-white px-2 py-1 text-xs font-medium leading-4 text-grey-700">
          {category}
        </span>

        <div className="absolute inset-x-4 bottom-4 z-[1] flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex min-w-0 flex-1 flex-col gap-3">
            <div className="flex items-center gap-2 text-xs font-medium leading-4 text-[#f1f1f2]">
              <span>{date}</span>
              <span
                className="size-1 shrink-0 rounded-full bg-[#f1f1f2]"
                aria-hidden
              />
              <span>{readTime}</span>
            </div>
            <p className="text-[20px] font-medium leading-6 text-white">
              {title}
            </p>
          </div>

          <Link
            href={href}
            className="inline-flex h-12 w-full shrink-0 items-center justify-center gap-2.5 rounded-lg border border-white px-4 text-base font-medium text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent sm:w-[175px]"
          >
            <span>{discoverLabel}</span>
            <ArrowRightIcon size={24} className="shrink-0" />
          </Link>
        </div>
      </div>
    </article>
  );
}
