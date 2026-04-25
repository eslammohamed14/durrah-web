import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";
import { serverFetch, ServerFetchError } from "@/api/serverFetch";
import type { PropertyDetails } from "@/features/properties/type/propertyApiTypes";
import { mapPropertyDetails } from "@/features/properties/utils/propertyApiMapper";
import { stripHtml } from "@/lib/utils/stripHtml";
import { Footer } from "@/components/layout/Footer";
import PropertyDetailsPage from "../../components/propertyDetailsPage";
import { Header } from "@/components/layout/Header";

interface Props {
  params: Promise<{ id: string }>;
}

export const revalidate = 3600;

const getPropertyDetails = cache(async (id: string): Promise<PropertyDetails> => {
  const locale = (await getLocale()) as "en" | "ar";
  const property = await serverFetch<PropertyDetails>(`/api/property/${id}`);
  return mapPropertyDetails(property, locale);
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  try {
    const property = await getPropertyDetails(id);

    return {
      title: property.title,
      description: stripHtml(property.description_html),
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
  let property: PropertyDetails;

  try {
    property = await getPropertyDetails(id);
  } catch (error) {
    if (error instanceof ServerFetchError && error.status === 404) {
      notFound();
    }

    throw error;
  }

  return (
    <>
      <Header />
      <div className="bg-surface-primary">
        <PropertyDetailsPage
          property={property}
          //similarProperties={similarProperties}
        />
      </div>
      <Footer />
    </>
  );
}
