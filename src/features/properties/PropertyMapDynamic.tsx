/**
 * Dynamic import wrapper for PropertyMap.
 * Use this in Server Components or pages — it ensures mapbox-gl is never
 * included in the server bundle.
 *
 * Usage:
 *   import PropertyMapDynamic from '@/features/properties/PropertyMapDynamic';
 *   <PropertyMapDynamic coordinates={{ lat: 24.7, lng: 46.7 }} title="My Property" />
 */

import dynamic from "next/dynamic";
import { MapSkeleton } from "@/components/ui/Skeleton";

const PropertyMapDynamic = dynamic(() => import("./PropertyMap"), {
  ssr: false,
  loading: () => <MapSkeleton height={400} />,
});

export default PropertyMapDynamic;
