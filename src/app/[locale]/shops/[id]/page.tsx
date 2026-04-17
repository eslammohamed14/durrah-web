/**
 * Shop Detail Page — SSR with complete shop info and InquiryForm.
 * Requirements: 27.4, 31.1, 31.2
 */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAPIClient } from "@/lib/api";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ShopDetailContent } from "@/features/shops/components/ShopDetailContent";

interface Props {
  params: Promise<{ id: string; locale: string }>;
}

// Revalidate every hour
export const revalidate = 3600;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const api = getAPIClient();

  try {
    const shop = await api.getProperty(id);
    const title = shop.title.en;
    const description = shop.description.en;
    const image = shop.images[0]?.url;

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
    };
  } catch {
    return { title: "Shop Not Found | Durrah" };
  }
}

function ShopStructuredData({
  shop,
}: {
  shop: Awaited<ReturnType<ReturnType<typeof getAPIClient>["getProperty"]>>;
}) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: shop.title.en,
    description: shop.description.en,
    image: shop.images.map((img) => img.url),
    address: {
      "@type": "PostalAddress",
      streetAddress: shop.location.address.en,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: shop.location.coordinates.lat,
      longitude: shop.location.coordinates.lng,
    },
    offers: {
      "@type": "Offer",
      price: shop.pricing.basePrice,
      priceCurrency: shop.pricing.currency,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export default async function ShopDetailPage({ params }: Props) {
  const { id } = await params;
  const api = getAPIClient();

  let shop;
  let owner;

  try {
    shop = await api.getProperty(id);
  } catch {
    notFound();
  }

  // Only render shop category pages here
  if (shop.category !== "shop") {
    notFound();
  }

  try {
    owner = await api.getUserProfile(shop.ownerId);
  } catch {
    // owner stays undefined
  }

  return (
    <>
      <ShopStructuredData shop={shop} />
      <Header />
      <ShopDetailContent shop={shop} ownerName={owner?.name} />
      <Footer />
    </>
  );
}
