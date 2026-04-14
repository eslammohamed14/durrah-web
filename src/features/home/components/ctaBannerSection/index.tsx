"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { ArrowRightIcon } from "@/assets/icons";
import { useLocale } from "@/lib/contexts/LocaleContext";
import videos from "@/constant/videos";

export function CtaBannerSection() {
  const { t } = useLocale();
  const sectionRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const sectionElement = sectionRef.current;
    const videoElement = videoRef.current;

    if (!sectionElement || !videoElement) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!videoElement) {
          return;
        }

        if (entry.isIntersecting) {
          void videoElement.play().catch(() => {
            // Ignore autoplay rejections from restrictive browsers.
          });
          return;
        }

        videoElement.pause();
      },
      { threshold: 0.35 },
    );

    observer.observe(sectionElement);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="Browse all properties"
      className="bg-[#FAFAFA] px-[40px] py-[100px]"
    >
      <div className="mx-auto ">
        <div className="relative h-[730px] overflow-hidden rounded-[24px]">
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            src={videos.discoverVideo}
            muted
            loop
            playsInline
            preload="metadata"
          />
          <div className="absolute inset-0 bg-black/30" aria-hidden="true" />

          <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
            <div className="flex max-w-[620px] flex-col items-center gap-6">
              <h2 className="text-[22px] font-medium leading-[1.2] text-white text-center">
                {t("home.ctaHeadline")}
              </h2>
              <p className="text-[16px] font-normal max-w-[560px] text-center leading-[1.6] text-[#F0F1F3]">
                {t("home.ctaSubtitle")}
              </p>
              <Link
                href="/search"
                className="inline-flex min-w-[486px] items-center justify-between rounded-2xl bg-white/10 px-5 py-4 text-xl font-normal text-white backdrop-blur-[18px] transition-colors hover:bg-white/20"
              >
                <span>{t("home.browseAllProperties")}</span>
                <ArrowRightIcon className="h-6 w-6" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
