"use client";

import { useMemo } from "react";
import type { PropertyCard as ApiPropertyCard } from "@/features/properties/type/propertyApiTypes";
import { useLocale } from "@/lib/contexts/LocaleContext";
import Image from "next/image";
import { Link } from "@/navigation";
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
import { getImageUrl, isLocalStaticImageSrc } from "@/utils/getImageUrl";

export interface PropertyCardProps {
  property: ApiPropertyCard;
}

function normalizeTypeLabel(type?: string): string {
  if (!type) {
    return "";
  }

  return type
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function PropertyCard({ property }: PropertyCardProps) {
  const { t, locale, dir } = useLocale();
  const propertyHref = `/properties/${property.slug}`;
  const title = property.title;
  const galleryImages = useMemo(
    () =>
      property.images
        .map((image, index) => {
          const url = getImageUrl(image);
          return {
            id: `${property.slug}-${index}`,
            url,
            alt: property.title,
            unoptimized: isLocalStaticImageSrc(url),
          };
        })
        .filter((item) => item.url !== ""),
    [property.images, property.slug, property.title],
  );

  const badgeLabel = "";

  const typeLabel = normalizeTypeLabel(property.type);

  const basePrice = property.price_per_day;

  const currency = "SAR";
  const originalBasePrice: number | undefined = undefined;
  const hasOffer =
    typeof originalBasePrice === "number" && originalBasePrice > basePrice;

  const priceFormatter = useMemo(
    () => new Intl.NumberFormat(locale === "ar" ? "ar-SA" : "en-SA"),
    [locale],
  );
  const price = priceFormatter.format(basePrice);
  const originalPrice = priceFormatter.format(originalBasePrice ?? basePrice);

  const sqFtLabel = t("home.specSqFt", { n: property.total_area.toString() });

  const rooms = property.rooms;
  const bathrooms = property.bathrooms;

  const occupancyBadgeClass =
    property.category === "Family"
      ? "bg-[#EDE9FF] text-primary-blue-300"
      : "bg-[#FFF0E8] text-[#C45C3E]";

  return (
    <article className="flex min-w-0 w-full max-w-full flex-col overflow-hidden rounded-2xl border border-text-body-muted bg-white pb-4 shadow-[0_0_24px_0_rgba(0,0,0,0.06)]">
      <div className="relative h-[216px] min-h-[216px] min-w-0 overflow-hidden rounded-t-xl bg-gradient-to-br from-slate-300 to-slate-400">
        {galleryImages.length === 0 ? null : galleryImages.length > 1 ? (
          <ImageSwiper
            slides={galleryImages}
            dir={dir}
            fallbackAlt={title}
            imageSizes={DEFAULT_IMAGE_SWIPER_SIZES}
            imageQuality={65}
            slideHeightPx={216}
          />
        ) : (
          <Image
            src={galleryImages[0].url}
            alt={galleryImages[0].alt ?? title}
            fill
            className="object-cover"
            sizes={DEFAULT_IMAGE_SWIPER_SIZES}
            quality={65}
            loading="lazy"
            unoptimized={Boolean(galleryImages[0].unoptimized)}
          />
        )}
        {badgeLabel ? (
          <div className="pointer-events-none absolute bottom-2.5 left-2.5 z-10 flex w-[calc(100%-20px)] items-center">
            <span className="rounded-lg bg-primary-coral-400 px-2 py-1 text-xs font-medium text-white">
              {badgeLabel}
            </span>
          </div>
        ) : null}
        <div className="pointer-events-none absolute left-2.5 top-2.5 z-10 flex w-[calc(100%-20px)] items-center justify-between">
          <div className="flex items-center gap-2">
            {typeLabel ? (
              <span className="rounded-full bg-white px-2 py-1 text-xs font-medium text-grey-700">
                {typeLabel}
              </span>
            ) : null}
          </div>
          {hasOffer ? (
            <span className="rounded-full bg-white px-2 py-1 text-xs font-medium text-primary-coral-400">
              {t("home.offer")}
            </span>
          ) : null}
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
            {property.category != null ? (
              <span
                className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${occupancyBadgeClass}`}
              >
                {property.category === "Family"
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
              {price} {currency}
            </span>
            <span className="text-sm text-grey-600">
              / {t("property.perNight")}
            </span>
            {hasOffer ? (
              <span className="text-sm text-grey-300 line-through">
                {originalPrice} {currency}
              </span>
            ) : null}
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
