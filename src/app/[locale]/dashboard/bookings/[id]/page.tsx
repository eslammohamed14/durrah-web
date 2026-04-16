/**
 * Booking details page — CSR.
 * Requirements: 8.2, 8.3, 8.4
 */

"use client";

import { use } from "react";
import { useLocale } from "@/lib/contexts/LocaleContext";
import { DashboardLayout } from "@/features/dashboard/DashboardLayout";
import { BookingDetails } from "@/features/booking/BookingDetails";
import { getGuestNavItems } from "@/features/dashboard/dashboardNavItems";

interface BookingDetailsPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export default function BookingDetailsPage({
  params,
}: BookingDetailsPageProps) {
  const { id } = use(params);
  const { locale, t } = useLocale();
  const navItems = getGuestNavItems(locale, t);

  return (
    <DashboardLayout
      navItems={navItems}
      title={t("bookingDetails.title")}
      locale={locale}
    >
      <BookingDetails bookingId={id} />
    </DashboardLayout>
  );
}
