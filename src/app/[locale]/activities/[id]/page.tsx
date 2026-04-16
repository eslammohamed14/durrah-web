/**
 * Activity Detail Page — SSR with complete activity info, availability and booking CTA.
 * Requirements: 26.4, 26.5
 */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAPIClient } from "@/lib/api";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ActivityDetailContent } from "@/features/activities/components/ActivityDetailContent";

interface Props {
  params: Promise<{ id: string; locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const api = getAPIClient();

  try {
    const activity = await api.getProperty(id);
    const title = activity.title.en;
    const description = activity.description.en;
    const image = activity.images[0]?.url;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: "website",
        ...(image && { images: [{ url: image, alt: title }] }),
      },
    };
  } catch {
    return { title: "Activity Not Found | Durrah" };
  }
}

function ActivityStructuredData({
  activity,
}: {
  activity: Awaited<ReturnType<ReturnType<typeof getAPIClient>["getProperty"]>>;
}) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: activity.title.en,
    description: activity.description.en,
    image: activity.images.map((img) => img.url),
    offers: {
      "@type": "Offer",
      price: activity.pricing.basePrice,
      priceCurrency: activity.pricing.currency,
      availability:
        activity.status === "active"
          ? "https://schema.org/InStock"
          : "https://schema.org/SoldOut",
    },
    ...(activity.ratings.count > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: activity.ratings.average,
        reviewCount: activity.ratings.count,
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

export default async function ActivityDetailPage({ params }: Props) {
  const { id } = await params;
  const api = getAPIClient();

  let activity;
  let reviews;
  let owner;

  try {
    [activity, reviews] = await Promise.all([
      api.getProperty(id),
      api.getPropertyReviews(id),
    ]);
  } catch {
    notFound();
  }

  // Only render activity category pages here
  if (activity.category !== "activity") {
    notFound();
  }

  try {
    owner = await api.getUserProfile(activity.ownerId);
  } catch {
    // owner stays undefined
  }

  return (
    <>
      <ActivityStructuredData activity={activity} />
      <Header />
      <ActivityDetailContent
        activity={activity}
        reviews={reviews}
        ownerName={owner?.name}
      />
      <Footer />
    </>
  );
}
