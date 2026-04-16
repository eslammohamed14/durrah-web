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
  const { locale, t } = useLocale();
  const navItems = getGuestNavItems(locale, t);

  return (
    <DashboardLayout
      navItems={navItems}
      title={t("dashboard.guestDashboard")}
      locale={locale}
    >
      <GuestDashboard locale={locale} />
    </DashboardLayout>
  );
}
