"use client";

import { useState } from "react";
import PropertyHeroSection from "@/features/properties/components/propertyHeroSection";
import PropertyGalleryModal from "@/features/properties/components/propertyGalleryModal";
import type { Property } from "@/lib/types";

interface PropertyGalleryControllerProps {
  property: Property;
}

/**
 * Leaf Client Component: owns only the gallery open/index state.
 * Composes PropertyHeroSection (the trigger) and PropertyGalleryModal (the overlay)
 * so they can share the same state without polluting the RSC parent.
 */
export default function PropertyGalleryController({
  property,
}: PropertyGalleryControllerProps) {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  return (
    <>
      <PropertyHeroSection
        property={property}
        onOpenGallery={(index) => {
          setActiveImageIndex(index);
          setIsGalleryOpen(true);
        }}
      />
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
