/**
 * Owner dashboard page — CSR.
 * Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6, 31.5
 */

"use client";

import { useLocale } from "@/lib/contexts/LocaleContext";
import { DashboardLayout } from "@/features/dashboard/DashboardLayout";
import { OwnerDashboard } from "@/features/dashboard/OwnerDashboard";
import { getOwnerNavItems } from "@/features/dashboard/dashboardNavItems";

export default function OwnerDashboardPage() {
  const { locale } = useLocale();
  const isAr = locale === "ar";
  const navItems = getOwnerNavItems(locale, isAr);

  return (
    <DashboardLayout
      navItems={navItems}
      title={isAr ? "لوحة تحكم المالك" : "Owner Dashboard"}
      locale={locale}
    >
      <OwnerDashboard locale={locale} />
    </DashboardLayout>
  );
}
