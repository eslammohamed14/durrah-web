'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useLocale } from '@/lib/contexts/LocaleContext';

const NAV_LINKS = [
  { key: 'home', href: '/' },
  { key: 'thingsToDo', href: '/search?category=activity', hasDropdown: true },
  { key: 'stay', href: '/search?category=rent' },
  { key: 'offers', href: '/search?category=rent&offers=true' },
  { key: 'company', href: '/about', hasDropdown: true },
] as const;

interface HeaderProps {
  transparent?: boolean;
}

export function Header({ transparent = false }: HeaderProps) {
  const { locale, setLocale, t, dir } = useLocale();
  const [mobileOpen, setMobileOpen] = useState(false);

  const user = null;

  const baseClasses = transparent
    ? 'absolute top-0 left-0 right-0 z-50 border-b border-white/15'
    : 'sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm';

  const bgClasses = transparent
    ? 'bg-white/10 backdrop-blur-[18px]'
    : 'bg-white';

  const textClasses = transparent ? 'text-white' : 'text-[#2A2F73]';
  const linkClasses = transparent
    ? 'text-white/90 hover:text-white'
    : 'text-[#2A2F73] hover:text-[#2A2F73]/80';

  return (
    <header className={baseClasses}>
      <div className={`${bgClasses} w-full`}>
        <div className="mx-auto flex h-[88px] max-w-[1440px] items-center justify-between px-[120px]">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2"
            aria-label="Durrah — home"
          >
            <span className={`text-2xl font-bold tracking-tight ${textClasses}`}>
              DURRAT
            </span>
          </Link>

          {/* Desktop nav */}
          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-8 md:flex"
            dir={dir}
          >
            {NAV_LINKS.map(({ key, href, hasDropdown }) => (
              <div key={key} className="flex items-center gap-1">
                <Link
                  href={href}
                  className={`text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${linkClasses} ${key === 'home' ? 'border-b border-current pb-1' : ''}`}
                >
                  {t(`nav.${key}`)}
                </Link>
                {hasDropdown && (
                  <svg className={`h-[18px] w-[18px] ${transparent ? 'text-white/70' : 'text-[#2A2F73]/70'}`} viewBox="0 0 18 18" fill="none" aria-hidden="true">
                    <path d="M4.5 6.75L9 11.25L13.5 6.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-6">
            {/* Language toggle */}
            <div className={`flex items-center gap-1 rounded-full px-2 py-1 ${transparent ? 'bg-white/10 backdrop-blur-[18px]' : 'bg-gray-100'}`}>
              <button
                type="button"
                onClick={() => setLocale('en')}
                aria-pressed={locale === 'en'}
                className={`rounded-full px-[17px] py-1 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 ${
                  locale === 'en'
                    ? transparent ? 'bg-white text-[#FF765E]' : 'bg-[#2A2F73] text-white'
                    : transparent ? 'text-white/70 hover:text-white' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLocale('ar')}
                aria-pressed={locale === 'ar'}
                className={`rounded-full px-[17px] py-1 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 ${
                  locale === 'ar'
                    ? transparent ? 'bg-white text-[#FF765E]' : 'bg-[#2A2F73] text-white'
                    : transparent ? 'text-white/70 hover:text-white' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                AR
              </button>
            </div>

            {/* Auth buttons */}
            <div className="hidden items-center gap-2 md:flex">
              <Link
                href="/login"
                className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${transparent ? 'border-white text-white hover:bg-white/10' : 'border-[#2A2F73] text-[#2A2F73] hover:bg-gray-50'}`}
              >
                {t('nav.login')}
              </Link>
              <Link
                href="/auth/register"
                className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${transparent ? 'bg-white text-[#FF765E] hover:bg-white/90' : 'bg-[#2A2F73] text-white hover:bg-[#2A2F73]/90'}`}
              >
                {t('nav.signUp')}
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              type="button"
              aria-label={mobileOpen ? t('common.close') : 'Open menu'}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              onClick={() => setMobileOpen((v) => !v)}
              className={`inline-flex items-center justify-center rounded-lg p-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 md:hidden ${transparent ? 'text-white hover:bg-white/10' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              {mobileOpen ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav
          id="mobile-menu"
          aria-label="Mobile navigation"
          className="border-t border-gray-200 bg-white px-4 pb-4 pt-2 md:hidden"
        >
          <ul className="flex flex-col gap-1" role="list">
            {NAV_LINKS.map(({ key, href }) => (
              <li key={key}>
                <Link
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-[#2A2F73] transition-colors hover:bg-gray-100"
                >
                  {t(`nav.${key}`)}
                </Link>
              </li>
            ))}
            <li className="mt-2 flex gap-2 border-t border-gray-100 pt-2">
              <Link href="/auth/login" onClick={() => setMobileOpen(false)} className="flex-1 rounded-lg border border-[#2A2F73] px-3 py-2 text-center text-sm font-medium text-[#2A2F73]">
                {t('nav.login')}
              </Link>
              <Link href="/auth/register" onClick={() => setMobileOpen(false)} className="flex-1 rounded-lg bg-[#2A2F73] px-3 py-2 text-center text-sm font-medium text-white">
                {t('nav.signUp')}
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
