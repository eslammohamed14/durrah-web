/**
 * Guest dashboard page — CSR.
 * Requirements: 9.1, 9.3, 9.4, 9.5, 31.6
 */

"use client";

import { useLocale } from "@/lib/contexts/LocaleContext";
import { DashboardLayout } from "@/features/dashboard/DashboardLayout";
import { GuestDashboard } from "@/features/dashboard/GuestDashboard";
import { getGuestNavItems } from "@/features/dashboard/dashboardNavItems";

export default function GuestDashboardPage() {
  const { locale } = useLocale();
  const isAr = locale === "ar";
  const navItems = getGuestNavItems(locale, isAr);

  return (
    <DashboardLayout
      navItems={navItems}
      title={isAr ? "لوحة تحكم الضيف" : "Guest Dashboard"}
      locale={locale}
    >
      <GuestDashboard locale={locale} />
    </DashboardLayout>
  );
}
