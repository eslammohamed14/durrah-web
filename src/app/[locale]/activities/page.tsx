/**
 * Activities Listing Page — SSR with activity cards, filters.
 * Requirements: 26.1, 26.2, 26.3
 */

import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { getAPIClient } from "@/lib/api";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ActivitiesContent } from "@/features/activities/components/ActivitiesContent";
import { Spinner } from "@/components/ui/Spinner";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();
  return {
    title: t("activities.pageTitle"),
    description: t("activities.pageDescription"),
  };
}

export default async function ActivitiesPage() {
  const api = getAPIClient();
  const activities = await api.searchProperties({ category: "activity" });

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
        <ActivitiesContent initialActivities={activities} />
      </Suspense>
      <Footer />
    </>
  );
}
