"use client";

import Image from "next/image";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

export const DEFAULT_IMAGE_SWIPER_SIZES =
  "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px";

/** Minimal slide shape; callers may pass richer objects (e.g. `PropertyImage`). */
export interface ImageSwiperSlide {
  id: string;
  url: string;
  alt?: string;
}

export interface ImageSwiperProps {
  slides: ImageSwiperSlide[];
  dir: "ltr" | "rtl";
  /** Used when a slide has no `alt`. */
  fallbackAlt: string;
  imageSizes?: string;
  /** Fixed slide height in pixels (matches gallery area). */
  slideHeightPx?: number;
}

export function ImageSwiper({
  slides,
  dir,
  fallbackAlt,
  imageSizes = DEFAULT_IMAGE_SWIPER_SIZES,
  slideHeightPx = 216,
}: ImageSwiperProps) {
  const h = `${slideHeightPx}px`;

  return (
    <Swiper
      modules={[Navigation, Pagination]}
      dir={dir}
      slidesPerView={1}
      spaceBetween={0}
      navigation
      pagination={{ clickable: true }}
      className="image-swiper h-full min-w-0 w-full max-w-full"
    >
      {slides.map((slide) => (
        <SwiperSlide key={slide.id} className="!min-w-0" style={{ height: h }}>
          <div
            className="relative min-w-0 w-full max-w-full"
            style={{ height: h }}
          >
            <Image
              src={slide.url}
              alt={slide.alt ?? fallbackAlt}
              fill
              className="object-cover"
              sizes={imageSizes}
            />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
