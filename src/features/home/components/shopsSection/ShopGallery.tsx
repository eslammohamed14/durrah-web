import Image from "next/image";
import { Xshap } from "@/assets/icons";
import images from "@/constant/images";

export function ShopGallery() {
  return (
    <div className="relative h-[450px] w-[583px] shrink-0">
      <div className="absolute left-[13px] top-0 h-full w-[570px]">
        <div className="absolute left-0 top-0 h-[139px] w-[166px] rounded-tl-2xl bg-text-dark" />
        <div className="absolute bottom-0 right-[-10] h-[139px] w-[166px] rounded-br-2xl bg-primary-coral-400" />
        <Xshap size={59} className="absolute left-0 bottom-0 z-10" />

        <div className="absolute left-[29px] top-[12px] flex w-[538px] flex-col gap-2">
          <div className="flex w-full gap-2">
            <div className="relative h-[257px] w-[308px] overflow-hidden rounded-tl-xl">
              <Image
                src={images.property1}
                alt="Shop exterior"
                fill
                loading="lazy"
                sizes="308px"
                className="object-cover"
              />
            </div>
            <div className="relative h-[256px] w-[222px] overflow-hidden rounded-tr-2xl">
              <Image
                src={images.property2}
                alt="Shop interior"
                fill
                loading="lazy"
                sizes="222px"
                className="object-cover"
              />
            </div>
          </div>
          <div className="flex w-full gap-2">
            <div className="relative h-[153px] w-[176px] overflow-hidden rounded-bl-2xl">
              <Image
                src={images.property3}
                alt="Shop products"
                fill
                loading="lazy"
                sizes="176px"
                className="object-cover"
              />
            </div>
            <div className="relative h-[153px] flex-1 overflow-hidden rounded-br-2xl">
              <Image
                src={images.property4}
                alt="Retail storefront"
                fill
                loading="lazy"
                sizes="(max-width: 1200px) 50vw, 222px"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
