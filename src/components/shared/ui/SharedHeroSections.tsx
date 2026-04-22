import Image from "next/image";
import type { Property } from "@/lib/types";
import { createTranslator } from "@/lib/utils/i18n";
import React from "react";

interface HeroSectionProps {
  allProperties: Property[] | [];
  t: ReturnType<typeof createTranslator>;
  // children is now a function that receives properties and returns a ReactNode
  children?: (props: { properties: Property[] }) => React.ReactNode;
  image: string;
  sectionClassName: string;
  contentClassName: string;
  headerText: string;
  paragraphText: string;
}

export const SharedHeroSection = ({
  allProperties,
  t,
  children,
  image,
  sectionClassName,
  contentClassName,
  headerText,
  paragraphText,
}: HeroSectionProps) => {
  return (
    <section
      aria-label="Hero"
      className={sectionClassName}
    >
      {/* Background Image */}
      <Image
        src={image}
        alt="Hero background"
        fill
        priority
        fetchPriority="high"
        sizes="100vw"
        className="object-cover"
        style={{ objectPosition: "40% 55%" }}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/25" aria-hidden="true" />

      {/* Content */}
      <div className={contentClassName}>
        <div className="flex justify-center flex-col gap-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <h1
              className="w-full max-w-[747px] text-3xl font-medium leading-[1.2] text-white sm:text-4xl md:text-5xl lg:text-[55px] lg:leading-[1.3]"
              style={{ textTransform: "capitalize" }}
            >
              {t(`${headerText}`)}
            </h1>
            <p className="w-full max-w-[384px] text-base font-medium leading-[1.3] text-white md:text-lg lg:text-xl">
              {t(`${paragraphText}`)}
            </p>
          </div>

          {/* Execute the children function and pass the data.
              We check if children is a function before calling it.
          */}
          {typeof children === "function" &&
            children({ properties: allProperties })}
        </div>
      </div>
    </section>
  );
};
