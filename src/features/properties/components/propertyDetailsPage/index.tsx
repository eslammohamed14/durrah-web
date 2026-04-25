import Image from "next/image";
import images from "@/constant/images";
import PropertyGalleryController from "@/features/properties/components/propertyGalleryController";
import PropertyAmenitiesSection from "@/features/properties/components/propertyAmenitiesSection";
import PropertyInfoSection from "@/features/properties/components/propertyInfoSection";
import type { PropertyDetails } from "@/features/properties/type/propertyApiTypes";

interface PropertyDetailsPageProps {
  property: PropertyDetails;
  //similarProperties: Property[];
}

export default function PropertyDetailsPage({
  property,
  //similarProperties,
}: PropertyDetailsPageProps) {
  return (
    <>
      <div className="relative">
        <div className="pointer-events-none absolute inset-0 hidden overflow-x-hidden lg:block">
          <Image
            src={images.homeDecorativeWave}
            alt=""
            width={252}
            height={252}
            aria-hidden
            className="absolute top-[52%] z-20 ltr:-right-[168px] rtl:-left-[168px]"
          />
        </div>
        <main className="relative z-10 w-full space-y-10 bg-surface-primary px-4 pb-10 sm:px-6 lg:px-[120px]">
          {/* Client leaf: hero images + gallery modal share gallery-open state */}
          <PropertyGalleryController property={property} />

          <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_384px] lg:items-start">
            <div className="space-y-8">
              <PropertyInfoSection property={property} />
              <PropertyAmenitiesSection property={property} />
              {/* <PropertyHostSection property={property} ownerName={ownerName} /> */}
              {/* <PropertyLocationSection property={property} /> */}
              {/* <PropertyPoliciesSection property={property} /> */}
            </div>
            {/* <div className="h-fit lg:sticky lg:top-24">
              <PropertyBookingSidebar property={property} />
            </div> */}
          </section>
        </main>
      </div>

      {/*<PropertySimilarSection properties={similarProperties} />*/}
    </>
  );
}
