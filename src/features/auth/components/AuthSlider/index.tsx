"use client";

import Image from "next/image";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { authVisualMock } from "../../utils/mockData";

export type AuthSliderPaginationVariant = "default" | "verifyEmail";

export type AuthSliderProps = {
  title: string;
  subtitle: string;
  imageAlt: string;
  /** Matches Figma “Verify Your Email” left panel (coral pill + small dots). */
  paginationVariant?: AuthSliderPaginationVariant;
};

export default function AuthSlider({
  title,
  subtitle,
  imageAlt,
  paginationVariant = "default",
}: AuthSliderProps) {
  const { sliderImages } = authVisualMock;
  const isVerifyEmail = paginationVariant === "verifyEmail";
  const paginationElClass = isVerifyEmail
    ? "auth-slider-pagination-verify-email"
    : "auth-slider-pagination";
  const bulletClass = isVerifyEmail
    ? "auth-slider-dot-verify-email"
    : "auth-slider-dot";
  const bulletActiveClass = isVerifyEmail
    ? "auth-slider-dot-verify-email-active"
    : "auth-slider-dot-active";

  return (
    // ✅ inline style — cannot be overridden by Swiper's injected CSS
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
      }}
      className="bg-black"
    >
      <style>{`
        .auth-slider-dot {
          display: inline-block;
          height: 6px;
          width: 6px;
          border-radius: 9999px;
          background-color: rgba(255, 255, 255, 0.6);
          transition: all 0.3s ease;
          cursor: pointer;
        }
        .auth-slider-dot:hover {
          background-color: rgba(255, 255, 255, 1);
        }
        .auth-slider-dot-active {
          width: 44px !important;
          background-color: #ff765e !important;
          opacity: 1 !important;
        }
        .auth-slider-dot-verify-email {
          display: inline-block;
          height: 8px;
          width: 8px;
          border-radius: 9999px;
          background-color: rgba(255, 255, 255, 0.85);
          transition: all 0.3s ease;
          cursor: pointer;
        }
        .auth-slider-dot-verify-email:hover {
          background-color: rgba(255, 255, 255, 1);
        }
        .auth-slider-dot-verify-email-active {
          width: 92px !important;
          height: 8px !important;
          border-radius: 32px !important;
          background-color: #ff765e !important;
          opacity: 1 !important;
        }
        /* ✅ Force Swiper's own elements to fill the container */
        .auth-swiper,
        .auth-swiper .swiper-wrapper,
        .auth-swiper .swiper-slide {
          height: 100% !important;
          width: 100% !important;
        }
      `}</style>

      <Swiper
        modules={[Pagination, Autoplay]}
        slidesPerView={1}
        loop
        speed={800}
        grabCursor
        autoplay={{ delay: 4500, disableOnInteraction: false }}
        pagination={{
          el: `.${paginationElClass}`,
          clickable: true,
          bulletClass,
          bulletActiveClass,
        }}
        // ✅ custom class so our CSS selector is scoped
        className="auth-swiper"
        // ✅ inline style as backup — belt AND suspenders
        style={{ width: "100%", height: "100%" }}
      >
        {sliderImages.map((image, idx) => (
          <SwiperSlide
            key={`${image}-${idx}`}
            // ✅ inline style on slide — fill needs a positioned parent with real height
            style={{ position: "relative", width: "100%", height: "100%" }}
          >
            <Image
              src={image}
              alt={imageAlt}
              fill
              priority={idx === 0}
              loading="eager" // ✅ fixes LCP warning
              sizes="50vw"
              className="object-cover object-center"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Gradient overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          top: "auto",
          height: "60%",
          background:
            "linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.4), transparent)",
          zIndex: 10,
          pointerEvents: "none",
        }}
        aria-hidden
      />

      {/* Text + dots pinned to bottom */}
      <div
        style={{
          position: "absolute",
          bottom: "10px",
          left: 0,
          right: 0,
          zIndex: 20,
          padding: "0 2.5rem 3.5rem",
          pointerEvents: "none",
        }}
      >
        <div style={{ maxWidth: "28rem", pointerEvents: "auto" }}>
          <h2
            className={
              isVerifyEmail
                ? "text-[48px] font-semibold leading-[1.4] tracking-tight text-white capitalize"
                : "text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-[2.5rem] lg:leading-[1.1]"
            }
          >
            {title}
          </h2>
          <p
            className={
              isVerifyEmail
                ? "mt-2 text-[18px] font-normal leading-relaxed text-white"
                : "mt-2 text-[18px] leading-relaxed text-white lg:text-base"
            }
          >
            {subtitle}
          </p>
        </div>
        <div
          className={paginationElClass}
          style={{
            marginTop: "1rem",
            display: "flex",
            alignItems: "center",
            gap: isVerifyEmail ? "9px" : "0.5rem",
            pointerEvents: "auto",
          }}
          aria-label="Slider pagination"
        />
      </div>
    </div>
  );
}
