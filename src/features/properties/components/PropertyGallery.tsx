"use client";

/**
 * PropertyGallery — responsive image grid with lightbox, keyboard navigation,
 * thumbnail strip, lazy loading, and swipe gestures for mobile.
 * Requirements: 24.1–24.6
 */

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { PropertyImage } from "@/lib/types";

interface PropertyGalleryProps {
  images: PropertyImage[];
  title: string;
}

function ChevronLeftIcon() {
  return (
    <svg
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
      />
    </svg>
  );
}

export function PropertyGallery({ images, title }: PropertyGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const thumbnailRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  const openLightbox = useCallback((index: number) => {
    setActiveIndex(index);
    setLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
  }, []);

  const prev = useCallback(() => {
    setActiveIndex((i) => (i - 1 + images.length) % images.length);
  }, [images.length]);

  const next = useCallback(() => {
    setActiveIndex((i) => (i + 1) % images.length);
  }, [images.length]);

  // Keyboard navigation
  useEffect(() => {
    if (!lightboxOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxOpen, closeLightbox, prev, next]);

  // Focus trap: move focus to close button when lightbox opens
  useEffect(() => {
    if (lightboxOpen) {
      closeBtnRef.current?.focus();
    }
  }, [lightboxOpen]);

  // Scroll active thumbnail into view
  useEffect(() => {
    if (!lightboxOpen || !thumbnailRef.current) return;
    const thumb = thumbnailRef.current.children[activeIndex] as
      | HTMLElement
      | undefined;
    thumb?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [activeIndex, lightboxOpen]);

  // Touch / swipe handlers
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
    touchStartX.current = null;
  };

  if (!images.length) return null;

  const [primary, ...rest] = images;

  return (
    <>
      {/* ── Grid ── */}
      <div className="relative">
        <div className="grid grid-cols-4 grid-rows-2 gap-2 rounded-xl overflow-hidden h-[420px] sm:h-[480px]">
          {/* Primary large image */}
          <button
            type="button"
            onClick={() => openLightbox(0)}
            className="col-span-2 row-span-2 relative overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-inset"
            aria-label={`View photo 1 of ${images.length}: ${primary.alt || title}`}
          >
            <Image
              src={primary.url}
              alt={primary.alt || title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover hover:scale-105 transition-transform duration-300"
            />
          </button>

          {/* Secondary images (up to 4) */}
          {rest.slice(0, 4).map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => openLightbox(i + 1)}
              className="relative overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-inset"
              aria-label={`View photo ${i + 2} of ${images.length}: ${img.alt || title}`}
            >
              <Image
                src={img.url}
                alt={img.alt || title}
                fill
                loading="lazy"
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover hover:scale-105 transition-transform duration-300"
              />
              {/* Overlay on last visible tile if more images exist */}
              {i === 3 && images.length > 5 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">
                    +{images.length - 5}
                  </span>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* "Show all photos" button */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={() => openLightbox(0)}
            className="absolute bottom-4 right-4 flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-medium text-gray-800 shadow-md hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <GridIcon />
            Show all photos
          </button>
        )}
      </div>

      {/* ── Lightbox ── */}
      {lightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Photo gallery for ${title}`}
          className="fixed inset-0 z-50 flex flex-col bg-black"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 text-white">
            <span className="text-sm font-medium">
              {activeIndex + 1} / {images.length}
            </span>
            <button
              ref={closeBtnRef}
              type="button"
              onClick={closeLightbox}
              aria-label="Close gallery"
              className="rounded-full p-2 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <XIcon />
            </button>
          </div>

          {/* Main image */}
          <div className="relative flex-1 flex items-center justify-center px-12">
            <div className="relative w-full h-full max-h-[calc(100vh-180px)]">
              <Image
                src={images[activeIndex].url}
                alt={
                  images[activeIndex].alt ||
                  `${title} — photo ${activeIndex + 1}`
                }
                fill
                priority
                sizes="100vw"
                className="object-contain"
              />
            </div>

            {/* Prev / Next arrows */}
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={prev}
                  aria-label="Previous photo"
                  className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <ChevronLeftIcon />
                </button>
                <button
                  type="button"
                  onClick={next}
                  aria-label="Next photo"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <ChevronRightIcon />
                </button>
              </>
            )}
          </div>

          {/* Thumbnail strip */}
          <div
            ref={thumbnailRef}
            className="flex gap-2 overflow-x-auto px-4 py-3 scrollbar-hide"
            role="list"
            aria-label="Photo thumbnails"
          >
            {images.map((img, i) => (
              <button
                key={img.id}
                type="button"
                role="listitem"
                onClick={() => setActiveIndex(i)}
                aria-label={`Go to photo ${i + 1}`}
                aria-current={i === activeIndex ? "true" : undefined}
                className={[
                  "relative h-16 w-24 shrink-0 overflow-hidden rounded-md transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white",
                  i === activeIndex
                    ? "ring-2 ring-white opacity-100"
                    : "opacity-50 hover:opacity-75",
                ].join(" ")}
              >
                <Image
                  src={img.url}
                  alt={img.alt || `Thumbnail ${i + 1}`}
                  fill
                  loading="lazy"
                  sizes="96px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
