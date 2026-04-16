/**
 * Profile management page — CSR.
 * Requirements: 9.2
 */

"use client";

import { useLocale } from "@/lib/contexts/LocaleContext";
import { useRouter } from "@/lib/navigation";
import { DashboardLayout } from "@/features/dashboard/DashboardLayout";
import { ProfileContent } from "@/features/dashboard/ProfileContent";
import { getSharedNavItems } from "@/features/dashboard/dashboardNavItems";

export default function ProfilePage() {
  const { locale, setLocale, t } = useLocale();
  const router = useRouter();
  const navItems = getSharedNavItems(locale, t);

  function handleLocaleChange(newLocale: "en" | "ar") {
    setLocale(newLocale);
    // Navigate to the same page with the new locale
    router.replace("/dashboard/profile", { locale: newLocale });
  }

  return (
    <DashboardLayout
      navItems={navItems}
      title={t("dashboard.profilePageTitle")}
      locale={locale}
    >
      <ProfileContent locale={locale} onLocaleChange={handleLocaleChange} />
    </DashboardLayout>
  );
}
