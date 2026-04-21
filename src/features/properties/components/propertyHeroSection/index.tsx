"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
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
        <h1 className="text-[40px] font-semibold leading-[1.4] text-grey-800">{title}</h1>
        <div className="mt-1 flex flex-wrap items-center gap-3 text-[19px] leading-[1.5] text-grey-700">
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
      </div>

      <div className="grid h-[420px] grid-cols-1 gap-4 lg:h-[611px] lg:grid-cols-[893px_291px]">
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
