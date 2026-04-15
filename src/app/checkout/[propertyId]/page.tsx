/**
 * Checkout page — Rent & Activity properties only.
 *
 * Guard: redirects to /properties/[id] (inquiry form) if category is 'buy' or 'shop'.
 * Fetches property server-side, then renders the client-side CheckoutContent.
 *
 * Requirements: 7.1–7.9
 */

import { redirect, notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAPIClient } from "@/lib/api";
import { CheckoutPageClient } from "./CheckoutPageClient";

interface Props {
  params: Promise<{ propertyId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { propertyId } = await params;
  try {
    const api = getAPIClient();
    const property = await api.getProperty(propertyId);
    return {
      title: `Checkout — ${property.title.en}`,
      robots: { index: false },
    };
  } catch {
    return { title: "Checkout" };
  }
}

export default async function CheckoutPage({ params }: Props) {
  const { propertyId } = await params;

  let property;
  try {
    const api = getAPIClient();
    property = await api.getProperty(propertyId);
  } catch {
    notFound();
  }

  // Guard: buy and shop properties use the inquiry flow, not checkout
  if (property.category === "buy" || property.category === "shop") {
    redirect(`/properties/${propertyId}`);
  }

  return <CheckoutPageClient property={property} />;
}
