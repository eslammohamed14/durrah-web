"use client";

import { Link, usePathname } from "@/navigation";
import { useLocale } from "@/lib/contexts/LocaleContext";

const NAV_ITEMS = [
  { key: "rent", href: "/" }, //search?category=rent
  { key: "buy", href: "/" }, //search?category=buy
  { key: "shops", href: "/" }, //search?category=shop
  { key: "activities", href: "/" }, //search?category=activity
] as const;

export function Navigation() {
  const { t } = useLocale();
  const pathname = usePathname();

  return (
    <nav aria-label="Main navigation">
      <ul className="flex items-center gap-1" role="list">
        {NAV_ITEMS.map(({ key, href }) => {
          const isActive = pathname.startsWith(href.split("?")[0]);
          return (
            <li key={key}>
              <Link
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={[
                  "rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                ].join(" ")}
              >
                {t(`nav.${key}`)}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
