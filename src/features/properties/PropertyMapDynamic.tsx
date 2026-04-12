/**
 * Dynamic import wrapper for PropertyMap.
 * Use this in Server Components or pages — it ensures mapbox-gl is never
 * included in the server bundle.
 *
 * Usage:
 *   import PropertyMapDynamic from '@/features/properties/PropertyMapDynamic';
 *   <PropertyMapDynamic coordinates={{ lat: 24.7, lng: 46.7 }} title="My Property" />
 */

import dynamic from 'next/dynamic';
import { Spinner } from '@/components/ui/Spinner';

const PropertyMapDynamic = dynamic(
  () => import('./PropertyMap'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full flex items-center justify-center bg-gray-100 rounded-lg" style={{ height: 400 }}>
        <Spinner size="lg" />
      </div>
    ),
  }
);

export default PropertyMapDynamic;
