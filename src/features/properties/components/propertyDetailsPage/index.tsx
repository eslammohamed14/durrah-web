"use client";

import { useState } from "react";
import Image from "next/image";
import images from "@/constant/images";
import type { Property } from "@/lib/types";
import PropertyAmenitiesSection from "@/features/properties/components/propertyAmenitiesSection";
import PropertyBookingSidebar from "@/features/properties/components/propertyBookingSidebar";
import PropertyGalleryModal from "@/features/properties/components/propertyGalleryModal";
import PropertyHeroSection from "@/features/properties/components/propertyHeroSection";
import PropertyHostSection from "@/features/properties/components/propertyHostSection";
import PropertyInfoSection from "@/features/properties/components/propertyInfoSection";
import PropertyLocationSection from "@/features/properties/components/propertyLocationSection";
import PropertyPoliciesSection from "@/features/properties/components/propertyPoliciesSection";
import PropertySimilarSection from "@/features/properties/components/propertySimilarSection";

interface PropertyDetailsPageProps {
  property: Property;
  ownerName?: string;
  similarProperties: Property[];
}

export default function PropertyDetailsPage({
  property,
  ownerName,
  similarProperties,
}: PropertyDetailsPageProps) {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  return (
    <>
      <div className="relative">
        <Image
          src={images.homeDecorativeWave}
          alt=""
          width={252}
          height={252}
          aria-hidden
          className="pointer-events-none absolute hidden lg:block ltr:-right-[178px] rtl:-left-[128px] top-[52%] z-0"
        />
        <main className="relative z-10 mx-auto max-w-[1200px] space-y-10 bg-surface-primary px-4 pb-10 sm:px-6 lg:px-0">
          <PropertyHeroSection
            property={property}
            onOpenGallery={(index) => {
              setActiveImageIndex(index);
              setIsGalleryOpen(true);
            }}
          />

          <section className="grid gap-6 lg:grid-cols-[792px_384px] lg:items-start">
            <div className="space-y-8">
              <PropertyInfoSection property={property} />
              <PropertyAmenitiesSection property={property} />
              <PropertyHostSection property={property} ownerName={ownerName} />
              <PropertyLocationSection property={property} />
              <PropertyPoliciesSection property={property} />
            </div>
            <div className="h-fit lg:sticky lg:top-24">
              <PropertyBookingSidebar property={property} />
            </div>
          </section>
        </main>
      </div>

      <PropertySimilarSection properties={similarProperties} />

      <PropertyGalleryModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        images={property.images}
        initialSlide={activeImageIndex}
        title={property.title.en}
      />
    </>
  );
}
