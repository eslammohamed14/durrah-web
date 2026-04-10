'use client';

import Link from 'next/link';
import { useLocale } from '@/lib/contexts/LocaleContext';

const CATEGORY_LINKS = [
  { key: 'rent', href: '/search?category=rent' },
  { key: 'buy', href: '/search?category=buy' },
  { key: 'shops', href: '/search?category=shop' },
  { key: 'activities', href: '/search?category=activity' },
] as const;

const ACCOUNT_LINKS = [
  { key: 'login', href: '/auth/login' },
  { key: 'register', href: '/auth/register' },
  { key: 'dashboard', href: '/dashboard' },
] as const;

export function Footer() {
  const { t } = useLocale();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <Link href="/" className="text-xl font-bold text-blue-600">
              Durrah
            </Link>
            <p className="mt-3 text-sm text-gray-500">
              {t('home.heroSubtitle')}
            </p>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900">
              {t('search.filters')}
            </h3>
            <ul className="mt-4 space-y-2" role="list">
              {CATEGORY_LINKS.map(({ key, href }) => (
                <li key={key}>
                  <Link
                    href={href}
                    className="text-sm text-gray-500 transition-colors hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                  >
                    {t(`nav.${key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900">
              {t('nav.profile')}
            </h3>
            <ul className="mt-4 space-y-2" role="list">
              {ACCOUNT_LINKS.map(({ key, href }) => (
                <li key={key}>
                  <Link
                    href={href}
                    className="text-sm text-gray-500 transition-colors hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                  >
                    {t(`nav.${key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900">
              Contact
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-gray-500" role="list">
              <li>
                <a
                  href="mailto:info@durrah.sa"
                  className="transition-colors hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                >
                  info@durrah.sa
                </a>
              </li>
              <li>
                <a
                  href="tel:+966500000000"
                  className="transition-colors hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                >
                  +966 50 000 0000
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 border-t border-gray-200 pt-6 text-center text-xs text-gray-400">
          © {year} Durrah. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
