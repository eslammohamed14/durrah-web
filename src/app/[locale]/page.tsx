import { Suspense } from "react";
import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HomeContent } from "@/features/home/HomeContent";

// ISR: re-generate at most once per hour
export const revalidate = 3600;

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://durrah.sa";

export const metadata: Metadata = {
  title: "Durrah | Find Your Perfect Property",
  description:
    "Search thousands of properties across Saudi Arabia — rentals, purchases, shops, and activities at Durrah Al-Arus.",
  openGraph: {
    title: "Durrah | Find Your Perfect Property",
    description:
      "Search thousands of properties across Saudi Arabia — rentals, purchases, shops, and activities at Durrah Al-Arus.",
    url: BASE_URL,
    siteName: "Durrah",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Durrah | Find Your Perfect Property",
    description:
      "Search thousands of properties across Saudi Arabia — rentals, purchases, shops, and activities at Durrah Al-Arus.",
  },
};

function WebsiteStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Durrah",
    url: BASE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${BASE_URL}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

/**
 * Hero-height skeleton shown while HomeContent resolves its data fetch.
 * Lets <Header> and <Footer> stream to the browser immediately, improving
 * perceived TTFB and allowing the browser to start loading the hero image.
 */
function HomeContentSkeleton() {
  return (
    <div className="relative overflow-x-hidden animate-pulse">
      {/* Hero placeholder */}
      <div className="relative flex min-h-[560px] flex-col bg-slate-800 sm:min-h-[700px] lg:min-h-[948px]" />
      {/* Metrics placeholder */}
      <div className="bg-background px-4 py-10 sm:px-6 md:py-16">
        <div className="mx-auto grid max-w-screen-2xl grid-cols-2 gap-8 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className="h-6 w-6 rounded bg-slate-200" />
              <div className="h-8 w-16 rounded bg-slate-200" />
              <div className="h-4 w-24 rounded bg-slate-200" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Page is NOT async — it doesn't fetch data itself.
 * Data fetching happens inside <HomeContent> (async RSC) within the Suspense
 * boundary, so the Header and Footer HTML stream to the client immediately.
 */
export default function HomePage() {
  return (
    <>
      <WebsiteStructuredData />
      <Header transparent />
      <Suspense fallback={<HomeContentSkeleton />}>
        <HomeContent />
      </Suspense>
      <Footer />
    </>
  );
}
