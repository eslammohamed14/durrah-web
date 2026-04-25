"use client";

import { useCallback, useState } from "react";
import PropertyHeroSection from "@/features/properties/components/propertyHeroSection";
import PropertyGalleryModal from "@/features/properties/components/propertyGalleryModal";
import type { PropertyDetails } from "@/features/properties/type/propertyApiTypes";

interface PropertyGalleryControllerProps {
  property: PropertyDetails;
}

export default function PropertyGalleryController({
  property,
}: PropertyGalleryControllerProps) {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const handleOpenGallery = useCallback((index: number) => {
    setActiveImageIndex(index);
    setIsGalleryOpen(true);
  }, []);

  const handleCloseGallery = useCallback(() => setIsGalleryOpen(false), []);

  return (
    <>
      <PropertyHeroSection
        property={property}
        onOpenGallery={handleOpenGallery}
      />
      <PropertyGalleryModal
        isOpen={isGalleryOpen}
        onClose={handleCloseGallery}
        images={property.images}
        initialSlide={activeImageIndex}
        title={property.title}
      />
    </>
  );
}
