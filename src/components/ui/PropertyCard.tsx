"use client";

import type { Property, PropertyImage } from "@/lib/types";
import { useLocale } from "@/lib/contexts/LocaleContext";
import Image from "next/image";
import dynamic from "next/dynamic";
import { Link } from "@/navigation";
import {
  ArrowRightIcon,
  BathroomIcon,
  BedIcon,
  DimensionIcon,
} from "@/assets/icons";
import { DEFAULT_IMAGE_SWIPER_SIZES } from "@/components/ui/ImageSwiper";

// Swiper has DOM-dependent initialization — must be client-only
const ImageSwiper = dynamic(
  () => import("@/components/ui/ImageSwiper").then((m) => m.ImageSwiper),
  { ssr: false },
);

const SQ_M_TO_SQ_FT = 10.7639;

export interface PropertyCardProps {
  property: Property;
}

function sortedImages(images: PropertyImage[]) {
  return [...images].sort((a, b) => a.order - b.order);
}

export function PropertyCard({ property }: PropertyCardProps) {
  const { t, locale, dir } = useLocale();
  const propertyHref = `/properties/${property.id}`;
  const title = property.title[locale] || property.title.en;
  const galleryImages = sortedImages(property.images);
  const isForSale = property.category === "buy";
  const badgeLabel = isForSale ? t("home.forSale") : t("home.forRent");
  const badgeBg = isForSale ? "bg-text-dark" : "bg-primary-coral-400";
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
      ? "bg-[#EDE9FF] text-primary-blue-300"
      : "bg-[#FFF0E8] text-[#C45C3E]";

  return (
    <article className="flex min-w-0 w-full max-w-full flex-col overflow-hidden rounded-2xl border border-text-body-muted bg-white pb-4 shadow-[0_0_24px_0_rgba(0,0,0,0.06)]">
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
            <span className="rounded-full bg-white px-2 py-1 text-xs font-medium text-grey-700">
              {typeLabel}
            </span>
          </div>
          <span className="rounded-full bg-white px-2 py-1 text-xs font-medium text-primary-coral-400">
            {t("home.offer")}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-3 px-3 pt-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <Link href={propertyHref} className="group transition-colors">
              <h3 className="text-xl font-semibold leading-tight text-grey-800 transition-colors group-hover:text-primary-blue-400">
                {title}
              </h3>
            </Link>
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

        <div className="flex items-center text-xs text-grey-500">
          <div className="flex items-center gap-1.5 border-r border-grey-100 pr-3.5">
            <DimensionIcon className="shrink-0 text-grey-500" />
            <span>{sqFtLabel}</span>
          </div>
          <div className="flex items-center gap-1.5 border-r border-grey-100 px-3.5">
            <BedIcon className="shrink-0 text-grey-500" />
            <span>{rooms != null ? t("home.specBed", { n: rooms }) : "—"}</span>
          </div>
          <div className="flex items-center gap-1.5 border-r border-grey-100 pl-3.5 pr-3.5">
            <BathroomIcon className="shrink-0 text-grey-500" />
            <span>
              {bathrooms != null ? t("home.specBath", { n: bathrooms }) : "—"}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-3 border-t border-[#E8E8E8] px-3 pt-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[22px] font-semibold text-text-dark">
              {price} SAR
            </span>
            <span className="text-sm text-grey-300 line-through">
              {originalPrice} SAR
            </span>
          </div>
          <Link
            href={propertyHref}
            aria-label={t("home.viewPropertyDetails")}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F4F4F4] text-text-dark transition-colors hover:bg-[#e8e8e8]"
          >
            <ArrowRightIcon />
          </Link>
        </div>
      </div>
    </article>
  );
}
