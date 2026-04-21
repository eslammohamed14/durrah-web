"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { FreeMode, Keyboard, Navigation, Thumbs } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper/types";
import type { PropertyImage } from "@/lib/types";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";

interface PropertyGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: PropertyImage[];
  initialSlide?: number;
  title: string;
}

export default function PropertyGalleryModal({
  isOpen,
  onClose,
  images,
  initialSlide = 0,
  title,
}: PropertyGalleryModalProps) {
  const t = useTranslations();
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || images.length === 0) return null;

  return (
    <div className="fixed inset-0 z-[70] bg-black/85 px-3 py-6 sm:px-8 sm:py-10">
      <div
        className="absolute inset-0"
        aria-hidden="true"
        onClick={onClose}
      />
      <div className="relative mx-auto flex h-full w-full max-w-[1135px] flex-col">
        <button
          type="button"
          onClick={onClose}
          className="mb-3 self-end rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/20"
        >
          {t("common.close")}
        </button>

        <div className="relative min-h-0 flex-1 overflow-hidden rounded-2xl bg-black/40 p-2 sm:p-4">
          <Swiper
            modules={[Navigation, Thumbs, Keyboard]}
            navigation
            keyboard={{ enabled: true }}
            loop
            initialSlide={initialSlide}
            thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
            className="h-full w-full"
          >
            {images.map((image, index) => (
              <SwiperSlide key={image.id}>
                <div className="relative h-full min-h-[320px] w-full">
                  <Image
                    src={image.url}
                    alt={image.alt || `${title} ${index + 1}`}
                    fill
                    sizes="100vw"
                    className="object-contain"
                    priority={index === initialSlide}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="mt-3 rounded-2xl bg-white/10 p-3">
          <Swiper
            onSwiper={setThumbsSwiper}
            modules={[FreeMode, Thumbs]}
            spaceBetween={10}
            slidesPerView={5}
            freeMode
            watchSlidesProgress
            className="w-full"
            breakpoints={{
              0: { slidesPerView: 3 },
              640: { slidesPerView: 4 },
              1024: { slidesPerView: 5 },
            }}
          >
            {images.map((image, index) => (
              <SwiperSlide key={`${image.id}-thumb`}>
                <div className="relative h-20 w-full overflow-hidden rounded-xl border border-white/20">
                  <Image
                    src={image.url}
                    alt={image.alt || `${title} ${index + 1}`}
                    fill
                    sizes="220px"
                    className="object-cover"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
}
