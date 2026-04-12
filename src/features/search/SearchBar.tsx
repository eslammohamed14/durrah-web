'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from '@/lib/contexts/LocaleContext';
import { Button } from '@/components/ui/Button';
import type { PropertyCategory } from '@/lib/types';

const CATEGORIES: PropertyCategory[] = ['rent', 'buy', 'shop', 'activity'];

interface GuestCount {
  adults: number;
  children: number;
}

export function SearchBar() {
  const { t } = useLocale();
  const router = useRouter();

  const [activeCategory, setActiveCategory] = useState<PropertyCategory>('rent');
  const [location, setLocation] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState<GuestCount>({ adults: 1, children: 0 });
  const [guestPickerOpen, setGuestPickerOpen] = useState(false);

  const showDates = activeCategory === 'rent' || activeCategory === 'activity';
  const showGuests = activeCategory === 'rent' || activeCategory === 'activity';

  function handleSearch() {
    const params = new URLSearchParams({ category: activeCategory });
    if (location.trim()) params.set('location', location.trim());
    if (showDates && checkIn) params.set('checkIn', checkIn);
    if (showDates && checkOut) params.set('checkOut', checkOut);
    if (showGuests && (guests.adults > 1 || guests.children > 0)) {
      params.set('adults', String(guests.adults));
      params.set('children', String(guests.children));
    }
    router.push(`/search?${params.toString()}`);
  }

  const totalGuests = guests.adults + guests.children;

  return (
    <div className="w-full rounded-2xl bg-white shadow-xl ring-1 ring-gray-200">
      {/* Category tabs */}
      <div className="flex border-b border-gray-200 px-2 pt-2" role="tablist" aria-label={t('common.search')}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            role="tab"
            aria-selected={activeCategory === cat}
            onClick={() => setActiveCategory(cat)}
            className={[
              'flex-1 rounded-t-lg px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-inset',
              activeCategory === cat
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
            ].join(' ')}
          >
            {t(`categories.${cat}`)}
          </button>
        ))}
      </div>

      {/* Search fields */}
      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-end">
        {/* Location */}
        <div className="flex-1">
          <label htmlFor="search-location" className="mb-1 block text-xs font-medium text-gray-500 uppercase tracking-wide">
            {t('search.location')}
          </label>
          <input
            id="search-location"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder={t('home.searchPlaceholder')}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            autoComplete="off"
          />
        </div>

        {/* Date range — only for rent/activity */}
        {showDates && (
          <>
            <div className="sm:w-36">
              <label htmlFor="search-checkin" className="mb-1 block text-xs font-medium text-gray-500 uppercase tracking-wide">
                {t('search.checkIn')}
              </label>
              <input
                id="search-checkin"
                type="date"
                value={checkIn}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => { setCheckIn(e.target.value); if (checkOut && e.target.value >= checkOut) setCheckOut(''); }}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="sm:w-36">
              <label htmlFor="search-checkout" className="mb-1 block text-xs font-medium text-gray-500 uppercase tracking-wide">
                {t('search.checkOut')}
              </label>
              <input
                id="search-checkout"
                type="date"
                value={checkOut}
                min={checkIn || new Date().toISOString().split('T')[0]}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </>
        )}

        {/* Guest count — only for rent/activity */}
        {showGuests && (
          <div className="relative sm:w-36">
            <label className="mb-1 block text-xs font-medium text-gray-500 uppercase tracking-wide">
              {t('search.guests')}
            </label>
            <button
              type="button"
              onClick={() => setGuestPickerOpen((v) => !v)}
              aria-haspopup="true"
              aria-expanded={guestPickerOpen}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-left text-sm text-gray-900 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {totalGuests} {t('search.guests').toLowerCase()}
            </button>
            {guestPickerOpen && (
              <div className="absolute bottom-full left-0 z-20 mb-2 w-56 rounded-xl border border-gray-200 bg-white p-4 shadow-lg">
                <GuestRow
                  label={t('search.adults')}
                  value={guests.adults}
                  min={1}
                  onDecrement={() => setGuests((g) => ({ ...g, adults: Math.max(1, g.adults - 1) }))}
                  onIncrement={() => setGuests((g) => ({ ...g, adults: g.adults + 1 }))}
                />
                <GuestRow
                  label={t('search.children')}
                  value={guests.children}
                  min={0}
                  onDecrement={() => setGuests((g) => ({ ...g, children: Math.max(0, g.children - 1) }))}
                  onIncrement={() => setGuests((g) => ({ ...g, children: g.children + 1 }))}
                />
                <button
                  type="button"
                  onClick={() => setGuestPickerOpen(false)}
                  className="mt-3 w-full rounded-lg bg-blue-600 py-1.5 text-sm font-medium text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  {t('common.apply')}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Search button */}
        <Button onClick={handleSearch} size="md" className="shrink-0 sm:self-end">
          <SearchIcon className="h-4 w-4" />
          {t('common.search')}
        </Button>
      </div>
    </div>
  );
}

function GuestRow({ label, value, min, onDecrement, onIncrement }: {
  label: string; value: number; min: number;
  onDecrement: () => void; onIncrement: () => void;
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-gray-700">{label}</span>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onDecrement}
          disabled={value <= min}
          aria-label={`Decrease ${label}`}
          className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-300 text-gray-600 transition-colors hover:border-gray-400 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <span aria-hidden="true">−</span>
        </button>
        <span className="w-4 text-center text-sm font-medium">{value}</span>
        <button
          type="button"
          onClick={onIncrement}
          aria-label={`Increase ${label}`}
          className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-300 text-gray-600 transition-colors hover:border-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <span aria-hidden="true">+</span>
        </button>
      </div>
    </div>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
  );
}
