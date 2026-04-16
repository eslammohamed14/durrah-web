/**
 * Investor dashboard page — CSR.
 * Requirements: 10.1, 10.2, 10.3, 10.4, 10.5
 */

"use client";

import { useLocale } from "@/lib/contexts/LocaleContext";
import { DashboardLayout } from "@/features/dashboard/DashboardLayout";
import { InvestorDashboard } from "@/features/dashboard/InvestorDashboard";
import { getInvestorNavItems } from "@/features/dashboard/dashboardNavItems";

export default function InvestorDashboardPage() {
  const { locale } = useLocale();
  const isAr = locale === "ar";
  const navItems = getInvestorNavItems(locale, isAr);

  return (
    <DashboardLayout
      navItems={navItems}
      title={isAr ? "لوحة تحكم المستثمر" : "Investor Dashboard"}
      locale={locale}
    >
      <InvestorDashboard locale={locale} />
    </DashboardLayout>
  );
}
