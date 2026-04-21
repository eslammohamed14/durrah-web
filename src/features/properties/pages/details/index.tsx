import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import PropertyDetailsPage from "@/features/properties/components/propertyDetailsPage";
import { getAPIClient } from "@/lib/api";

interface Props {
  params: Promise<{ id: string }>;
}

export const revalidate = 3600;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const api = getAPIClient();
  try {
    const property = await api.getProperty(id);
    return {
      title: property.title.en,
      description: property.description.en,
    };
  } catch {
    return { title: "Property Not Found | Durrah" };
  }
}

export default async function PropertyDetailsRoute({ params }: Props) {
  const { id } = await params;
  const api = getAPIClient();

  try {
    const property = await api.getProperty(id);
    const [owner, allProperties] = await Promise.all([
      api.getUserProfile(property.ownerId).catch(() => undefined),
      api.searchProperties({}).catch(() => []),
    ]);

    const similarProperties = (property.similarProperties || [])
      .map((similarId) => allProperties.find((item) => item.id === similarId))
      .filter((item): item is (typeof allProperties)[number] => Boolean(item));

    return (
      <>
        <Header />
        <PropertyDetailsPage
          property={property}
          ownerName={owner?.name}
          similarProperties={similarProperties}
        />
        <Footer />
      </>
    );
  } catch {
    notFound();
  }
}
