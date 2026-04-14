/**
 * Property Details Page — SSR with dynamic metadata and JSON-LD structured data.
 * Requirements: 4.10, 19.1, 19.2, 19.3
 */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAPIClient } from "@/lib/api";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PropertyPageContent } from "@/features/properties/components/PropertyPageContent";

interface Props {
  params: Promise<{ id: string }>;
}

// ── Metadata ──────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const api = getAPIClient();

  let property;
  try {
    property = await api.getProperty(id);
  } catch {
    return { title: "Property Not Found | Durrah" };
  }

  const title = property.title.en;
  const description = property.description.en;
  const image = property.images[0]?.url;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      ...(image && { images: [{ url: image, alt: title }] }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(image && { images: [image] }),
    },
    alternates: {
      languages: {
        en: `/properties/${id}`,
        ar: `/properties/${id}`,
      },
    },
  };
}

// ── JSON-LD structured data ───────────────────────────────────────────────────

function PropertyStructuredData({
  property,
}: {
  property: Awaited<ReturnType<ReturnType<typeof getAPIClient>["getProperty"]>>;
}) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: property.title.en,
    description: property.description.en,
    image: property.images.map((img) => img.url),
    offers: {
      "@type": "Offer",
      price: property.pricing.basePrice,
      priceCurrency: property.pricing.currency,
      availability:
        property.status === "active"
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
    ...(property.ratings.count > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: property.ratings.average,
        reviewCount: property.ratings.count,
        bestRating: 5,
        worstRating: 1,
      },
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function PropertyPage({ params }: Props) {
  const { id } = await params;
  const api = getAPIClient();

  let property;
  let reviews;
  let owner;

  try {
    [property, reviews] = await Promise.all([
      api.getProperty(id),
      api.getPropertyReviews(id),
    ]);
  } catch {
    notFound();
  }

  // Fetch owner name (best-effort — don't fail the page if unavailable)
  try {
    owner = await api.getUserProfile(property.ownerId);
  } catch {
    // owner stays undefined
  }

  return (
    <>
      <PropertyStructuredData property={property} />
      <Header />
      <PropertyPageContent
        property={property}
        reviews={reviews}
        ownerName={owner?.name}
      />
      <Footer />
    </>
  );
}
