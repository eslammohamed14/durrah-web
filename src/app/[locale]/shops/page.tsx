/**
 * Shops Listing Page — SSR with shop cards, filters by size, location, price.
 * Requirements: 27.1, 27.2, 27.3, 27.5
 */

import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { getAPIClient } from "@/lib/api";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ShopsContent } from "@/features/shops/components/ShopsContent";
import { Spinner } from "@/components/ui/Spinner";

// Revalidate every hour — shop data changes infrequently
export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();
  return {
    title: t("shops.pageTitle"),
    description: t("shops.pageDescription"),
    openGraph: {
      title: t("shops.pageTitle"),
      description: t("shops.pageDescription"),
      type: "website",
    },
    twitter: {
      card: "summary",
      title: t("shops.pageTitle"),
      description: t("shops.pageDescription"),
    },
  };
}

export default async function ShopsPage() {
  const api = getAPIClient();
  const shops = await api.searchProperties({ category: "shop" });

  return (
    <>
      <Header />
      <Suspense
        fallback={
          <div className="flex min-h-[60vh] items-center justify-center">
            <Spinner size="lg" />
          </div>
        }
      >
        <ShopsContent initialShops={shops} />
      </Suspense>
      <Footer />
    </>
  );
}
