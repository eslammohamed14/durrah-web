"use client";

import { useEffect, useRef, useState } from "react";
// NOTE: createPortal renders into document.body to escape any ancestor stacking context.
import { createPortal } from "react-dom";
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

function isLocalStaticImage(url?: string): boolean {
  return (
    Boolean(url) &&
    (url!.startsWith("/") || url!.startsWith("/_next/static/media/"))
  );
}

export default function PropertyGalleryModal({
  isOpen,
  onClose,
  images,
  initialSlide = 0,
  title,
}: PropertyGalleryModalProps) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const prevOpen = useRef(false);

  // Keyboard: Escape to close
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  // Lock body scroll while open so the page doesn't scroll behind the modal
  useEffect(() => {
    if (isOpen === prevOpen.current) return;
    prevOpen.current = isOpen;

    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflowY = "scroll";
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflowY = "";
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || "0") * -1);
      }
    }
  }, [isOpen]);

  // isOpen always starts as false (useState in PropertyGalleryController),
  // so document.body is never accessed during SSR.
  if (!isOpen || images.length === 0) return null;

  /**
   * Render into document.body via a Portal so this element sits at the top
   * of the DOM stacking context — above any ancestor with z-index (including
   * the Header at z-50 and the page <main> at z-10).
   */
  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${title} gallery`}
      className="fixed inset-0 z-[9999] flex flex-col bg-black/75 px-3 py-5 sm:px-8 sm:py-8"
    >
      {/* Backdrop click to close */}
      <div className="absolute inset-0" aria-hidden="true" onClick={onClose} />

      {/* Modal content — relative so z-20 children stack above backdrop */}
      <div className="relative mx-auto flex h-full w-full max-w-[1135px] flex-col">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close gallery"
          className="absolute right-5 top-5 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60 sm:right-5 sm:top-5"
        >
          <CloseSquareIcon size={24} />
        </button>

        {/* Main content — flex column so the thumb strip never overflows */}
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl">
          {/* Main swiper — grows to fill remaining space */}
          <div className="relative min-h-0 flex-1 overflow-hidden rounded-t-2xl">
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
                      sizes="(max-width: 640px) 100vw, 1135px"
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

          {/* Thumbnail strip — fixed height, never overflows */}
          <div className="shrink-0 rounded-b-2xl bg-white px-3 pb-3 pt-2">
            <Swiper
              onSwiper={setThumbsSwiper}
              modules={[FreeMode, Thumbs]}
              spaceBetween={10}
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
                  <div className="relative h-[120px] w-full overflow-hidden rounded-xl border-2 border-transparent transition-all hover:border-primary-blue-300 sm:h-[138px]">
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
    </div>,
    document.body,
  );
}
