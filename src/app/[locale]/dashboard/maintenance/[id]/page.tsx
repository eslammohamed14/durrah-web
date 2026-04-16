/**
 * Maintenance ticket details page — CSR.
 * Requirements: 13.1, 13.4, 13.5
 */

"use client";

import { use } from "react";
import { useLocale } from "@/lib/contexts/LocaleContext";
import { DashboardLayout } from "@/features/dashboard/DashboardLayout";
import { MaintenanceTicketDetails } from "@/features/maintenance/components/MaintenanceTicketDetails";
import { getGuestNavItems } from "@/features/dashboard/dashboardNavItems";

interface MaintenanceDetailsPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export default function MaintenanceDetailsPage({
  params,
}: MaintenanceDetailsPageProps) {
  const { id } = use(params);
  const { locale, t } = useLocale();
  const navItems = getGuestNavItems(locale, t);

  return (
    <DashboardLayout
      navItems={navItems}
      title={t("maintenance.ticketDetails")}
      locale={locale}
    >
      <MaintenanceTicketDetails ticketId={id} />
    </DashboardLayout>
  );
}
