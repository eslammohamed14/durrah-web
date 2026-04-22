"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { FreeMode, Keyboard, Navigation, Thumbs } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper/types";
import { ArrowLeftIcon, ArrowRightIcon, CloseSquareIcon } from "@/assets/icons";
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
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const isLocalStaticImage = (url?: string) =>
    Boolean(url) && (url!.startsWith("/") || url!.startsWith("/_next/static/media/"));

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
    <div className="fixed inset-0 z-[70] bg-[#00000033] px-3 py-5 sm:px-8 sm:py-8">
      <div className="absolute inset-0" aria-hidden="true" onClick={onClose} />
      <div className="relative mx-auto flex h-full w-full max-w-[1135px] flex-col">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close gallery"
          className="absolute right-[42px] top-[42px] z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/20 text-white backdrop-blur-sm transition-colors hover:bg-black/35"
        >
          <CloseSquareIcon size={24} />
        </button>

        <div className="min-h-0 flex-1 overflow-hidden rounded-2xl bg-transparent p-0">
          <div className="relative h-[calc(100%-150px)] min-h-[320px] overflow-hidden rounded-t-2xl">
            <button
              type="button"
              className="gallery-modal-prev absolute left-3 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-grey-700 shadow-[0_4px_20px_rgba(0,0,0,0.2)] transition-colors hover:bg-white"
              aria-label="Previous image"
            >
              <ArrowLeftIcon size={24} />
            </button>
            <button
              type="button"
              className="gallery-modal-next absolute right-3 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-grey-700 shadow-[0_4px_20px_rgba(0,0,0,0.2)] transition-colors hover:bg-white"
              aria-label="Next image"
            >
              <ArrowRightIcon size={24} />
            </button>
            <Swiper
              modules={[Navigation, Thumbs, Keyboard]}
              navigation={{
                prevEl: ".gallery-modal-prev",
                nextEl: ".gallery-modal-next",
              }}
              keyboard={{ enabled: true }}
              loop
              initialSlide={initialSlide}
              thumbs={{
                swiper:
                  thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
              }}
              className="h-full w-full"
            >
              {images.map((image, index) => (
                <SwiperSlide key={image.id}>
                  <div className="relative h-full w-full overflow-hidden">
                    <Image
                      src={image.url}
                      alt={image.alt || `${title} ${index + 1}`}
                      fill
                      sizes="100vw"
                      className="object-cover"
                      priority={index === initialSlide}
                      quality={65}
                      unoptimized={isLocalStaticImage(image.url)}
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          <div className="rounded-b-2xl bg-white p-3 pt-2">
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
                  <div className="relative h-[138px] w-full overflow-hidden rounded-xl border border-white transition-all hover:border-primary-blue-300">
                    <Image
                      src={image.url}
                      alt={image.alt || `${title} ${index + 1}`}
                      fill
                      sizes="220px"
                      className="object-cover"
                      quality={65}
                      unoptimized={isLocalStaticImage(image.url)}
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </div>
  );
}
