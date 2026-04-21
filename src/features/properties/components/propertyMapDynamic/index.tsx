import dynamic from "next/dynamic";
import { MapSkeleton } from "@/components/ui/Skeleton";

const PropertyMapDynamic = dynamic(() => import("../propertyMap"), {
  ssr: false,
  loading: () => <MapSkeleton height={400} />,
});

export default PropertyMapDynamic;
