import type { Metadata } from 'next';
import { getAPIClient } from '@/lib/api';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HomeContent } from '@/components/features/home/HomeContent';
import type { Property } from '@/lib/types';

export const metadata: Metadata = {
  title: 'Durrah | Find Your Perfect Property',
  description:
    'Search thousands of properties across Saudi Arabia — rentals, purchases, shops, and activities at Durrah Al-Arus.',
};

async function getHomeData(): Promise<{ topRated: Property[]; distinguishedOffers: Property[] }> {
  const api = getAPIClient();

  const [allProperties] = await Promise.all([
    api.searchProperties({}),
  ]);

  // Top rated: sort by rating desc, take top 3
  const topRated = [...allProperties]
    .sort((a, b) => b.ratings.average - a.ratings.average)
    .slice(0, 3);

  // Distinguished offers: rent/activity with beach view or high rating, take up to 3
  const distinguishedOffers = allProperties
    .filter((p) => p.category === 'rent' || p.category === 'activity')
    .sort((a, b) => b.ratings.count - a.ratings.count)
    .slice(0, 3);

  return { topRated, distinguishedOffers };
}

export default async function HomePage() {
  const { topRated, distinguishedOffers } = await getHomeData();

  return (
    <>
      <Header />
      <HomeContent topRated={topRated} distinguishedOffers={distinguishedOffers} />
      <Footer />
    </>
  );
}
