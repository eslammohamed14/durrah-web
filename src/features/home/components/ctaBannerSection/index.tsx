"use client";

import { Link } from "@/navigation";
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
      className="bg-background px-4 py-8 sm:px-6 sm:py-10 lg:px-10 xl:px-[40px] xl:py-[50px]"
    >
      <div className="mx-auto max-w-screen-2xl">
        <div
          className="relative overflow-hidden rounded-2xl"
          style={{ height: "clamp(320px, 50vw, 730px)" }}
        >
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

          <div className="absolute inset-0 flex items-center justify-center px-4 text-center sm:px-6">
            <div className="flex w-full max-w-[620px] flex-col items-center gap-4 sm:gap-6">
              <h2 className="text-lg font-medium leading-[1.2] text-white sm:text-[22px] sm:text-center">
                {t("home.ctaHeadline")}
              </h2>
              <p className="max-w-[560px] text-center text-sm font-normal leading-[1.6] text-[#F0F1F3] sm:text-[16px]">
                {t("home.ctaSubtitle")}
              </p>
              <Link
                href="/"
                className="inline-flex w-full items-center justify-between rounded-2xl bg-white/10 px-4 py-3 text-base font-normal text-white backdrop-blur-[18px] transition-colors hover:bg-white/20 sm:px-5 sm:py-4 sm:text-xl lg:min-w-[486px]"
              >
                <span>{t("home.browseAllProperties")}</span>
                <ArrowRightIcon className="h-6 w-6 shrink-0" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
