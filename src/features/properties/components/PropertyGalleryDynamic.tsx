/**
 * Dynamic import wrapper for PropertyGallery.
 * Defers the gallery (including its event listeners and state) until it is
 * needed on the client, reducing initial JS parse work.
 */

import dynamic from "next/dynamic";
import { GallerySkeleton } from "@/components/ui/Skeleton";

const PropertyGalleryDynamic = dynamic(
  () =>
    import("./PropertyGallery").then((m) => ({ default: m.PropertyGallery })),
  {
    ssr: false,
    loading: () => <GallerySkeleton />,
  },
);

export default PropertyGalleryDynamic;
