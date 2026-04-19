import Link from "next/link";
import { ArrowRightIcon, SearchIcon } from "@/assets/icons";
import Image from "next/image";

interface FeaturedBlogCardProps {
  imageUrl: string;
  title: string;
  discoverLabel: string;
}

export function FeaturedBlogCard({
  imageUrl,
  title,
  discoverLabel,
}: FeaturedBlogCardProps) {
  return (
    <article className="flex flex-col gap-6">
      <div className="relative h-[379px] w-[690px] overflow-hidden rounded-lg">
        <Image
          src={imageUrl}
          alt={title}
          width={690}
          height={379}
          className="object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 h-[240px] bg-gradient-to-t from-black/80 to-transparent" />

        <span className="absolute left-4 top-4 rounded-3xl bg-white px-2 py-1 text-xs font-medium leading-4 text-grey-700">
          Resorts
        </span>

        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
          <div className="flex flex-1 flex-col gap-3">
            <div className="flex items-center gap-2 text-xs font-medium leading-4 text-text-body-muted">
              <span>Jan 24, 2025</span>
              <span className="h-1 w-1 rounded-full bg-text-body-muted" />
              <span>10 mins read</span>
            </div>
            <p className="text-[22px] font-medium leading-[1.3] text-white">
              {title}
            </p>
          </div>

          <Link
            href="/" //blogs
            className="inline-flex h-12 w-[185px] items-center justify-center gap-2.5 rounded-lg border border-white px-4 text-base font-medium text-white transition-colors hover:bg-white/10"
          >
            <span>{discoverLabel}</span>
            <ArrowRightIcon size={24} />
          </Link>
        </div>
      </div>
    </article>
  );
}
