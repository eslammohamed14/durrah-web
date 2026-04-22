import { redirect, notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAPIClient } from "@/lib/api";
import { CheckoutPageClient } from "@/features/checkout/components/CheckoutPageClient";

interface Props {
  params: Promise<{ locale: string; propertyId: string }>;
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
  const { locale, propertyId } = await params;

  let property;
  try {
    const api = getAPIClient();
    property = await api.getProperty(propertyId);
  } catch {
    notFound();
  }

  if (property.category === "buy" || property.category === "shop") {
    redirect(`/${locale}/properties/${propertyId}`);
  }

  return <CheckoutPageClient property={property} />;
}
