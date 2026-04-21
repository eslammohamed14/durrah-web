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
    <section className="space-y-4">
      <div>
        <h1 className="text-3xl font-semibold text-text-dark sm:text-5xl">{title}</h1>
        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-grey-600 sm:text-base">
          <span>{property.ratings.average.toFixed(1)}</span>
          <span className="h-1 w-1 rounded-full bg-grey-500" />
          <span>{t(`categories.${property.category}`)}</span>
          <span className="h-1 w-1 rounded-full bg-grey-500" />
          <span>{address}</span>
        </div>
      </div>

      <div className="grid h-[420px] grid-cols-1 gap-4 lg:h-[611px] lg:grid-cols-[1fr_291px]">
        <button
          type="button"
          onClick={() => onOpenGallery(0)}
          className="relative overflow-hidden rounded-2xl"
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
              className="relative overflow-hidden rounded-2xl"
            >
              <Image
                src={image.url}
                alt={image.alt || `${title} ${idx + 2}`}
                fill
                sizes="291px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
