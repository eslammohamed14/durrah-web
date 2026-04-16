import images from "@/constant/images";
import Image from "next/image";

/**
 * Decorative wave motif from Figma "Home - Concept 1" (Group 41984 / 41985 / 41986).
 * Three instances along the right edge, aligned to a 1440px artboard with slight bleed.
 * @see https://www.figma.com/design/XKx3FF4Xw6ZpvooyvB71Kn/Durrah-Property-%F0%9F%8F%96%EF%B8%8F?node-id=244-3870
 */

/** Vertical positions as % of total home frame height (7526px in Figma). */
const DECORATION_TOPS = [28.77, 62.01, 91.27] as const;

export function HomeDecorativeRightEdge() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-[1] overflow-visible"
      aria-hidden
    >
      <div className="relative mx-auto h-full w-full max-w-[1440px]">
        {DECORATION_TOPS.map((top) => (
          <Image
            key={top}
            src={images.homeDecorativeWave}
            alt=""
            width={252}
            height={252}
            className="absolute hidden w-[252px] max-w-[17.5vw] ltr:-right-[347px] rtl:-left-[347px] lg:block"
            style={{ top: `${top}%` }}
          />
        ))}
      </div>
    </div>
  );
}
