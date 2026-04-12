"use client";

import type { Property, PropertyImage } from "@/lib/types";
import { useLocale } from "@/lib/contexts/LocaleContext";
import Image from "next/image";
import {
  ArrowRightIcon,
  BathroomIcon,
  BedIcon,
  DimensionIcon,
} from "@/assets/icons";
import {
  DEFAULT_IMAGE_SWIPER_SIZES,
  ImageSwiper,
} from "@/components/ui/ImageSwiper";

const SQ_M_TO_SQ_FT = 10.7639;

function ChevronRightButtonIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M10 8l6 4-6 4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  );
}

export interface PropertyCardProps {
  property: Property;
}

function sortedImages(images: PropertyImage[]) {
  return [...images].sort((a, b) => a.order - b.order);
}

export function PropertyCard({ property }: PropertyCardProps) {
  const { t, locale, dir } = useLocale();
  const title = property.title[locale] || property.title.en;
  const galleryImages = sortedImages(property.images);
  const isForSale = property.category === "buy";
  const badgeLabel = isForSale ? t("home.forSale") : t("home.forRent");
  const badgeBg = isForSale ? "bg-[#2A2F73]" : "bg-[#FF765E]";
  const typeLabel = property.type
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  const price = new Intl.NumberFormat(
    locale === "ar" ? "ar-SA" : "en-SA",
  ).format(property.pricing.basePrice);
  const originalPrice = new Intl.NumberFormat(
    locale === "ar" ? "ar-SA" : "en-SA",
  ).format(Math.round(property.pricing.basePrice * 1.27));

  const sqFt = Math.round(property.specifications.size * SQ_M_TO_SQ_FT);
  const sqFtFmt = new Intl.NumberFormat(
    locale === "ar" ? "ar-SA" : "en-SA",
  ).format(sqFt);
  const sqFtLabel = t("home.specSqFt", { n: sqFtFmt });
  const rooms = property.specifications.rooms;
  const bathrooms = property.specifications.bathrooms;
  const cardStatus = property.card?.status;
  const occupancyBadgeClass =
    cardStatus === "family"
      ? "bg-[#EDE9FF] text-[#363C88]"
      : "bg-[#FFF0E8] text-[#C45C3E]";

  return (
    <article className="flex min-w-0 w-full max-w-full flex-col overflow-hidden rounded-2xl border border-[#F1F1F2] bg-white pb-4 shadow-[0_0_24px_0_rgba(0,0,0,0.06)]">
      <div className="relative h-[216px] min-h-[216px] min-w-0 overflow-hidden rounded-t-xl bg-gradient-to-br from-slate-300 to-slate-400">
        {galleryImages.length === 0 ? null : galleryImages.length === 1 ? (
          <Image
            src={galleryImages[0].url}
            alt={galleryImages[0].alt ?? title}
            fill
            className="object-cover"
            sizes={DEFAULT_IMAGE_SWIPER_SIZES}
          />
        ) : (
          <ImageSwiper slides={galleryImages} dir={dir} fallbackAlt={title} />
        )}
        <div className="pointer-events-none absolute bottom-2.5 left-2.5 z-10 flex w-[calc(100%-20px)] items-center">
          <span
            className={`rounded-lg px-2 py-1 text-xs font-medium text-white ${badgeBg}`}
          >
            {badgeLabel}
          </span>
        </div>
        <div className="pointer-events-none absolute left-2.5 top-2.5 z-10 flex w-[calc(100%-20px)] items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-white px-2 py-1 text-xs font-medium text-[#404040]">
              {typeLabel}
            </span>
          </div>
          <span className="rounded-full bg-white px-2 py-1 text-xs font-medium text-[#FF765E]">
            {t("home.offer")}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-3 px-3 pt-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <h3 className="text-xl font-semibold leading-tight text-[#262626]">
              {title}
            </h3>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            {cardStatus != null ? (
              <span
                className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${occupancyBadgeClass}`}
              >
                {cardStatus === "family"
                  ? t("home.cardStatusFamily")
                  : t("home.cardStatusSingle")}
              </span>
            ) : null}
          </div>
        </div>

        <div className="flex items-center text-xs text-[#727272]">
          <div className="flex items-center gap-1.5 border-r border-[#D9D9D9] pr-3.5">
            <DimensionIcon className="shrink-0 text-[#727272]" />
            <span>{sqFtLabel}</span>
          </div>
          <div className="flex items-center gap-1.5 border-r border-[#D9D9D9] px-3.5">
            <BedIcon className="shrink-0 text-[#727272]" />
            <span>{rooms != null ? t("home.specBed", { n: rooms }) : "—"}</span>
          </div>
          <div className="flex items-center gap-1.5 border-r border-[#D9D9D9] pl-3.5 pr-3.5">
            <BathroomIcon className="shrink-0 text-[#727272]" />
            <span>
              {bathrooms != null ? t("home.specBath", { n: bathrooms }) : "—"}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-3 border-t border-[#E8E8E8] px-3 pt-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[22px] font-semibold text-[#2A2F73]">
              {price} SAR
            </span>
            <span className="text-sm text-[#A6A6A6] line-through">
              {originalPrice} SAR
            </span>
          </div>
          <button
            type="button"
            aria-label={t("home.viewPropertyDetails")}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F4F4F4] text-[#2A2F73] transition-colors hover:bg-[#e8e8e8]"
          >
            <ArrowRightIcon />
          </button>
        </div>
      </div>
    </article>
  );
}
