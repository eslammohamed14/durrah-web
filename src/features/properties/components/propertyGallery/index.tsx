"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { PropertyImage } from "@/lib/types";

interface PropertyGalleryProps {
  images: PropertyImage[];
  title: string;
}

function ChevronLeftIcon() {
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

export function PropertyGallery({ images, title }: PropertyGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const thumbnailRef = useRef<HTMLDivElement>(null);

  const openLightbox = useCallback((index: number) => {
    setActiveIndex(index);
    setLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => setLightboxOpen(false), []);
  const prev = useCallback(() => setActiveIndex((i) => (i - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setActiveIndex((i) => (i + 1) % images.length), [images.length]);

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

  useEffect(() => {
    if (!lightboxOpen || !thumbnailRef.current) return;
    const thumb = thumbnailRef.current.children[activeIndex] as HTMLElement | undefined;
    thumb?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [activeIndex, lightboxOpen]);

  if (!images.length) return null;
  const [primary, ...rest] = images;

  return (
    <>
      <div className="relative">
        <div className="grid h-[420px] grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-xl sm:h-[480px]">
          <button type="button" onClick={() => openLightbox(0)} className="relative col-span-2 row-span-2 overflow-hidden">
            <Image src={primary.url} alt={primary.alt || title} fill priority sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
          </button>
          {rest.slice(0, 4).map((img, i) => (
            <button key={img.id} type="button" onClick={() => openLightbox(i + 1)} className="relative overflow-hidden">
              <Image src={img.url} alt={img.alt || title} fill loading="lazy" sizes="(max-width: 768px) 50vw, 25vw" className="object-cover" />
            </button>
          ))}
        </div>
      </div>

      {lightboxOpen && (
        <div role="dialog" aria-modal="true" aria-label={`Photo gallery for ${title}`} className="fixed inset-0 z-50 flex flex-col bg-black">
          <div className="flex items-center justify-between px-4 py-3 text-white">
            <span className="text-sm font-medium">{activeIndex + 1} / {images.length}</span>
            <button type="button" onClick={closeLightbox} aria-label="Close gallery" className="rounded-full p-2 text-white">x</button>
          </div>
          <div className="relative flex flex-1 items-center justify-center px-12">
            <div className="relative h-full w-full max-h-[calc(100vh-180px)]">
              <Image src={images[activeIndex].url} alt={images[activeIndex].alt || `${title} — photo ${activeIndex + 1}`} fill priority sizes="100vw" className="object-contain" />
            </div>
            <button type="button" onClick={prev} aria-label="Previous photo" className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white"><ChevronLeftIcon /></button>
            <button type="button" onClick={next} aria-label="Next photo" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white"><ChevronRightIcon /></button>
          </div>
          <div ref={thumbnailRef} className="flex gap-2 overflow-x-auto px-4 py-3">
            {images.map((img, i) => (
              <button key={img.id} type="button" onClick={() => setActiveIndex(i)} className="relative h-16 w-24 shrink-0 overflow-hidden rounded-md">
                <Image src={img.url} alt={img.alt || `Thumbnail ${i + 1}`} fill loading="lazy" sizes="96px" className="object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
