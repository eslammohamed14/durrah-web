/**
 * Dynamic sitemap generation.
 * Includes all public URLs: home, search, property details, activities, shops.
 * Requirements: 19.4
 */

import type { MetadataRoute } from "next";
import { getAPIClient } from "@/lib/api";
import { SUPPORTED_LOCALES } from "@/config/i18n";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://durrah.sa";

function localeUrls(path: string): MetadataRoute.Sitemap[number]["alternates"] {
  const languages: Record<string, string> = {};
  for (const locale of SUPPORTED_LOCALES) {
    languages[locale] = `${BASE_URL}/${locale}${path}`;
  }
  return { languages };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const api = getAPIClient();

  // Static public pages
  const staticRoutes: MetadataRoute.Sitemap = [
    ...SUPPORTED_LOCALES.map((locale) => ({
      url: `${BASE_URL}/${locale}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1.0,
      alternates: localeUrls(""),
    })),
    {
      url: `${BASE_URL}/search`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
      alternates: localeUrls("/search"),
    },
    ...SUPPORTED_LOCALES.map((locale) => ({
      url: `${BASE_URL}/${locale}/activities`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
      alternates: localeUrls("/activities"),
    })),
    ...SUPPORTED_LOCALES.map((locale) => ({
      url: `${BASE_URL}/${locale}/shops`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
      alternates: localeUrls("/shops"),
    })),
  ];

  // Deduplicate static routes by URL
  const seen = new Set<string>();
  const uniqueStaticRoutes = staticRoutes.filter((r) => {
    if (seen.has(r.url)) return false;
    seen.add(r.url);
    return true;
  });

  // Dynamic property pages
  let propertyRoutes: MetadataRoute.Sitemap = [];
  let activityRoutes: MetadataRoute.Sitemap = [];
  let shopRoutes: MetadataRoute.Sitemap = [];

  try {
    const allProperties = await api.searchProperties({});

    propertyRoutes = allProperties
      .filter((p) => p.category === "rent" || p.category === "buy")
      .map((p) => ({
        url: `${BASE_URL}/properties/${p.id}`,
        lastModified: new Date(p.updatedAt),
        changeFrequency: "weekly" as const,
        priority: 0.7,
        alternates: localeUrls(`/properties/${p.id}`),
      }));

    activityRoutes = allProperties
      .filter((p) => p.category === "activity")
      .flatMap((p) =>
        SUPPORTED_LOCALES.map((locale) => ({
          url: `${BASE_URL}/${locale}/activities/${p.id}`,
          lastModified: new Date(p.updatedAt),
          changeFrequency: "weekly" as const,
          priority: 0.7,
          alternates: localeUrls(`/activities/${p.id}`),
        })),
      );

    shopRoutes = allProperties
      .filter((p) => p.category === "shop")
      .flatMap((p) =>
        SUPPORTED_LOCALES.map((locale) => ({
          url: `${BASE_URL}/${locale}/shops/${p.id}`,
          lastModified: new Date(p.updatedAt),
          changeFrequency: "weekly" as const,
          priority: 0.7,
          alternates: localeUrls(`/shops/${p.id}`),
        })),
      );
  } catch {
    // If API is unavailable during build, return only static routes
  }

  // Deduplicate dynamic routes
  const allDynamic = [...propertyRoutes, ...activityRoutes, ...shopRoutes];
  const uniqueDynamic = allDynamic.filter((r) => {
    if (seen.has(r.url)) return false;
    seen.add(r.url);
    return true;
  });

  return [...uniqueStaticRoutes, ...uniqueDynamic];
}
