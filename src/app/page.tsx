import type { Metadata } from 'next';
import { getAPIClient } from '@/lib/api';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HomeContent } from '@/features/home/HomeContent';
import type { Property } from '@/lib/types';

/** Merge top-rated + distinguished, dedupe by id, then fill to `max` from the rest (by rating). */
function buildFeaturedPropertiesGrid(
  allProperties: Property[],
  topRated: Property[],
  distinguishedOffers: Property[],
  max = 6,
): Property[] {
  const seen = new Set<string>();
  const grid: Property[] = [];
  for (const p of [...topRated, ...distinguishedOffers]) {
    if (seen.has(p.id)) continue;
    seen.add(p.id);
    grid.push(p);
    if (grid.length >= max) return grid;
  }
  const remainder = [...allProperties]
    .filter((p) => !seen.has(p.id))
    .sort((a, b) => b.ratings.average - a.ratings.average);
  for (const p of remainder) {
    if (grid.length >= max) break;
    grid.push(p);
  }
  return grid;
}

export const metadata: Metadata = {
  title: 'Durrah | Find Your Perfect Property',
  description:
    'Search thousands of properties across Saudi Arabia — rentals, purchases, shops, and activities at Durrah Al-Arus.',
};

async function getHomeData(): Promise<{ featuredForGrid: Property[] }> {
  const api = getAPIClient();

  const [allProperties] = await Promise.all([
    api.searchProperties({}),
  ]);

  // Top rated: sort by rating desc, take top 3
  const topRated = [...allProperties]
    .sort((a, b) => b.ratings.average - a.ratings.average)
    .slice(0, 3);

  // Distinguished offers: rent/activity only — can return fewer than 3 if the catalog is small
  const distinguishedOffers = allProperties
    .filter((p) => p.category === 'rent' || p.category === 'activity')
    .sort((a, b) => b.ratings.count - a.ratings.count)
    .slice(0, 3);

  const featuredForGrid = buildFeaturedPropertiesGrid(
    allProperties,
    topRated,
    distinguishedOffers,
  );

  return { featuredForGrid };
}

export default async function HomePage() {
  const { featuredForGrid } = await getHomeData();

  return (
    <>
      <Header transparent />
      <HomeContent featuredForGrid={featuredForGrid} />
      <Footer />
    </>
  );
}
