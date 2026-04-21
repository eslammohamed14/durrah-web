import dynamic from "next/dynamic";
import { GallerySkeleton } from "@/components/ui/Skeleton";

const PropertyGalleryDynamic = dynamic(() => import("../propertyGallery").then((m) => ({ default: m.PropertyGallery })), {
  ssr: false,
  loading: () => <GallerySkeleton />,
});

export default PropertyGalleryDynamic;
