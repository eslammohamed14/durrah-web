"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import {
  HeartOutlineIcon,
  ImageOutlineIcon,
  ShareOutlineIcon,
  StarSlashIcon,
} from "@/assets/icons";
import type { Property } from "@/lib/types";

interface PropertyHeroSectionProps {
  property: Property;
  onOpenGallery: (index: number) => void;
}

export default function PropertyHeroSection({
  property,
  onOpenGallery,
}: PropertyHeroSectionProps) {
  const locale = useLocale();
  const t = useTranslations();
  const title = property.title[locale as "en" | "ar"] || property.title.en;
  const address =
    property.location.address[locale as "en" | "ar"] || property.location.address.en;

  return (
    <section className="space-y-4 pt-10">
      <div className="space-y-1">
        <h1 className="text-[40px] font-medium leading-[1.4] text-primary-blue-400">
          {title}
        </h1>
        <div className="mt-1 flex items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2 text-[18px] leading-[1.6] text-grey-700">
            <StarSlashIcon size={18} />
            <span>{property.ratings.average.toFixed(1)}</span>
            <span className="h-1 w-1 rounded-full bg-grey-500" />
            <span>{t(`categories.${property.category}`)}</span>
            {property.card?.status && (
              <>
                <span className="h-1 w-1 rounded-full bg-grey-500" />
                <span>{property.card.status === "family" ? "Family" : "Single"}</span>
              </>
            )}
            <span className="h-1 w-1 rounded-full bg-grey-500" />
            <span>{property.amenities[0] || address}</span>
          </div>
          <div className="hidden items-center gap-2 sm:flex">
            <button
              type="button"
              className="inline-flex h-[42px] w-[42px] items-center justify-center rounded-full bg-white"
              aria-label="Add to favorites"
            >
              <HeartOutlineIcon size={24} />
            </button>
            <button
              type="button"
              className="inline-flex h-[42px] w-[42px] items-center justify-center rounded-full bg-white"
              aria-label="Share property"
            >
              <ShareOutlineIcon size={24} />
            </button>
          </div>
        </div>
      </div>

      <div className="grid h-[420px] grid-cols-1 gap-4 lg:h-[611px] lg:grid-cols-[minmax(0,1fr)_291px]">
        <button
          type="button"
          onClick={() => onOpenGallery(0)}
          className="relative overflow-hidden rounded-xl"
        >
          <Image
            src={property.images[0]?.url}
            alt={property.images[0]?.alt || title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 893px"
            className="object-cover"
          />
          <span className="absolute bottom-5 right-5 hidden h-[42px] items-center gap-2 rounded-[24px] bg-white px-3 py-1 text-[14px] font-medium leading-[1.5] text-grey-700 lg:inline-flex">
            {t("common.viewAllImages")}
            <ImageOutlineIcon size={24} />
          </span>
        </button>
        <div className="hidden gap-4 lg:grid lg:grid-rows-3">
          {property.images.slice(1, 4).map((image, idx) => (
            <button
              key={image.id}
              type="button"
              onClick={() => onOpenGallery(idx + 1)}
              className="relative overflow-hidden rounded-xl"
            >
              <Image
                src={image.url}
                alt={image.alt || `${title} ${idx + 2}`}
                fill
                sizes="291px"
                className="object-cover"
              />
              {idx === 2 && property.images.length > 4 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-[20px] font-semibold leading-[1.5] text-white">
                  + {property.images.length} Photos
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
