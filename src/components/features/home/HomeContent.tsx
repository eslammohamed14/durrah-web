'use client';

import Link from 'next/link';
import { useLocale } from '@/lib/contexts/LocaleContext';
import { SearchBar } from '@/components/features/search/SearchBar';
import { PropertyCard } from '@/components/features/properties/PropertyCard';
import type { Property, PropertyCategory } from '@/lib/types';

// ─── Category icons ───────────────────────────────────────────────────────────

const CATEGORY_ICONS: Record<PropertyCategory, React.ReactNode> = {
  rent: (
    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
  ),
  buy: (
    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  shop: (
    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
    </svg>
  ),
  activity: (
    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
    </svg>
  ),
};

const CATEGORY_COLORS: Record<PropertyCategory, string> = {
  rent: 'bg-blue-50 text-blue-600',
  buy: 'bg-emerald-50 text-emerald-600',
  shop: 'bg-amber-50 text-amber-600',
  activity: 'bg-purple-50 text-purple-600',
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface HomeContentProps {
  topRated: Property[];
  distinguishedOffers: Property[];
}

// ─── Component ────────────────────────────────────────────────────────────────

export function HomeContent({ topRated, distinguishedOffers }: HomeContentProps) {
  const { t } = useLocale();

  return (
    <main id="main-content">
      {/* Hero */}
      <section
        aria-label="Hero"
        className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 py-20 sm:py-28"
      >
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white/5 blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-white/5 blur-3xl" aria-hidden="true" />

        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">
            {t('home.heroTitle')}
          </h1>
          <p className="mt-4 text-lg text-blue-100 sm:text-xl">
            {t('home.heroSubtitle')}
          </p>
          <div className="mt-10">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* Advertisement banner */}
      <section aria-label="Advertisement" className="bg-gradient-to-r from-amber-400 to-orange-400 py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-lg font-semibold text-white">
            🌊 Exclusive Durrah Al-Arus beachfront properties — limited availability
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 space-y-20">
        {/* Browse by Property Type */}
        <section aria-labelledby="browse-heading">
          <h2 id="browse-heading" className="text-2xl font-bold text-gray-900 sm:text-3xl">
            {t('home.browseByType')}
          </h2>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {(['rent', 'buy', 'shop', 'activity'] as PropertyCategory[]).map((cat) => (
              <Link
                key={cat}
                href={`/search?category=${cat}`}
                className={[
                  'group flex flex-col items-center gap-3 rounded-2xl p-6 transition-all hover:scale-105 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
                  CATEGORY_COLORS[cat],
                ].join(' ')}
              >
                {CATEGORY_ICONS[cat]}
                <span className="text-sm font-semibold">{t(`categories.${cat}`)}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Top Rated */}
        {topRated.length > 0 && (
          <section aria-labelledby="top-rated-heading">
            <div className="flex items-center justify-between">
              <h2 id="top-rated-heading" className="text-2xl font-bold text-gray-900 sm:text-3xl">
                {t('home.topRated')}
              </h2>
              <Link
                href="/search?sortBy=rating"
                className="text-sm font-medium text-blue-600 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
              >
                {t('common.view')} →
              </Link>
            </div>
            <ul className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3" role="list">
              {topRated.map((property) => (
                <li key={property.id}>
                  <PropertyCard property={property} variant="grid" />
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Advertisement mid-page */}
        <section aria-label="Advertisement" className="overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-center text-white">
          <p className="text-xl font-bold">Invest in Durrah Al-Arus</p>
          <p className="mt-2 text-blue-100">Premium investment opportunities with high ROI in Saudi Arabia&apos;s premier coastal resort</p>
          <Link
            href="/search?category=buy"
            className="mt-4 inline-block rounded-lg bg-white px-6 py-2.5 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-blue-600"
          >
            {t('categories.buy')}
          </Link>
        </section>

        {/* Distinguished Offers */}
        {distinguishedOffers.length > 0 && (
          <section aria-labelledby="offers-heading">
            <div className="flex items-center justify-between">
              <h2 id="offers-heading" className="text-2xl font-bold text-gray-900 sm:text-3xl">
                {t('home.distinguishedOffers')}
              </h2>
              <Link
                href="/search"
                className="text-sm font-medium text-blue-600 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
              >
                {t('common.view')} →
              </Link>
            </div>
            <ul className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3" role="list">
              {distinguishedOffers.map((property) => (
                <li key={property.id}>
                  <PropertyCard property={property} variant="grid" />
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </main>
  );
}
