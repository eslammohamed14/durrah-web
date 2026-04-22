import Image from "next/image";
import images from "@/constant/images";
import type { Property } from "@/lib/types";
import PropertyGalleryController from "@/features/properties/components/propertyGalleryController";
import PropertyAmenitiesSection from "@/features/properties/components/propertyAmenitiesSection";
import PropertyBookingSidebar from "@/features/properties/components/propertyBookingSidebar";
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

/**
 * Server Component: assembles the full property detail layout.
 * Gallery state lives in the PropertyGalleryController leaf Client Component.
 */
export default function PropertyDetailsPage({
  property,
  ownerName,
  similarProperties,
}: PropertyDetailsPageProps) {
  return (
    <>
      <div className="relative">
        <Image
          src={images.homeDecorativeWave}
          alt=""
          width={252}
          height={252}
          aria-hidden
          className="pointer-events-none absolute hidden lg:block ltr:-right-[168px] rtl:-left-[168px] top-[52%] z-20"
        />
        <main className="relative z-10 w-full space-y-10 bg-surface-primary px-4 pb-10 sm:px-6 lg:px-[120px]">
          {/* Client leaf: hero images + gallery modal share gallery-open state */}
          <PropertyGalleryController property={property} />

          <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_384px] lg:items-start">
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
    </>
  );
}
