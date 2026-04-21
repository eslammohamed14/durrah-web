/**
 * 404 Not Found page for [locale] routes.
 * Requirements: 21.4
 */

import Link from "next/link";
import { getTranslations, getLocale } from "next-intl/server";

export default async function NotFoundPage() {
  const t = await getTranslations();
  const locale = await getLocale();

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-4 text-8xl font-bold text-gray-200" aria-hidden="true">
        404
      </div>
      <h1 className="mb-2 text-2xl font-semibold text-gray-900">
        {t("errors.notFound")}
      </h1>
      <p className="mb-6 text-sm text-gray-500">{t("errors.notFoundHint")}</p>
      <Link
        href={`/${locale}`}
        className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
      >
        {t("errors.backHome")}
      </Link>
    </div>
  );
}
