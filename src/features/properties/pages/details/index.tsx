import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { env } from "@/config/env";
import { serverFetch, ServerFetchError } from "@/api/serverFetch";
import type { PropertyDetails } from "@/features/properties/type/propertyApiTypes";

interface Props {
  params: Promise<{ id: string }>;
}

export const revalidate = 3600;

const buildImageSrc = (image: string | null): string => {
  if (!image) {
    return "";
  }

  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  return `${env.apiBaseURL}${image.startsWith("/") ? image : `/${image}`}`;
};

const getPropertyDetails = async (id: string): Promise<PropertyDetails> => {
  return serverFetch<PropertyDetails>(`/api/property/${id}`);
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  try {
    const property = await getPropertyDetails(id);

    return {
      title: property.title,
      description: property.district
        ? `${property.district}, ${property.city}`
        : property.city,
    };
  } catch (error) {
    if (error instanceof ServerFetchError && error.status === 404) {
      return { title: "Property Not Found | Durrah" };
    }

    return { title: "Property Not Found | Durrah" };
  }
}

export default async function PropertyDetailsRoute({ params }: Props) {
  const { id } = await params;

  try {
    const property = await getPropertyDetails(id);
    const imageSrc = buildImageSrc(property.image);

    return (
      <section className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={property.title}
            className="h-80 w-full rounded-xl object-cover"
          />
        ) : null}

        <div className="space-y-3">
          <h1 className="text-3xl font-semibold text-text-dark">{property.title}</h1>
          <p className="text-lg font-medium text-text-body-dark">
            {property.price_per_day} SAR
          </p>
          <p className="text-sm text-text-body-dark">{property.total_area} m²</p>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-text-dark">Amenities</h2>
          <ul className="list-disc space-y-1 pl-5 text-text-body-dark">
            {property.amenities.map((amenity, index) => (
              <li key={`${amenity.title}-${index}`}>{amenity.title}</li>
            ))}
          </ul>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-text-dark">Description</h2>
          <div
            className="prose max-w-none text-text-body-dark"
            dangerouslySetInnerHTML={{ __html: property.description_html }}
          />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-text-dark">
            Cancellation Policy
          </h2>
          <div
            className="prose max-w-none text-text-body-dark"
            dangerouslySetInnerHTML={{ __html: property.cancellation_policy.text }}
          />
        </div>
      </section>
    );
  } catch (error) {
    if (error instanceof ServerFetchError && error.status === 404) {
      notFound();
    }

    throw error;
  }
}
