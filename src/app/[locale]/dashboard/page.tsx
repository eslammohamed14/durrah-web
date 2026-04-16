/**
 * Dashboard hub — routes to role-specific dashboards.
 * If user has one role, redirects directly.
 * If user has multiple roles, shows a role selector.
 *
 * Requirements: 10.6, 11.7
 */

"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "@/lib/contexts/LocaleContext";
import { useAuth } from "@/lib/contexts/AuthContext";
import { Spinner } from "@/components/ui/Spinner";
import { Button } from "@/components/ui/Button";
import type { UserRole } from "@/lib/types";

// ── Role card data ────────────────────────────────────────────────────────────

function getRoleConfig(
  locale: string,
  t: (key: string, params?: Record<string, string | number>) => string,
) {
  return {
    guest: {
      label: t("dashboard.roleGuest"),
      description: t("dashboard.pickerGuestDescription"),
      href: `/${locale}/dashboard/guest`,
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          className="h-8 w-8"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
          />
        </svg>
      ),
    },
    investor: {
      label: t("dashboard.roleInvestor"),
      description: t("dashboard.pickerInvestorDescription"),
      href: `/${locale}/dashboard/investor`,
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          className="h-8 w-8"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941"
          />
        </svg>
      ),
    },
    owner: {
      label: t("dashboard.roleOwner"),
      description: t("dashboard.pickerOwnerDescription"),
      href: `/${locale}/dashboard/owner`,
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          className="h-8 w-8"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
          />
        </svg>
      ),
    },
  } satisfies Record<
    UserRole,
    { label: string; description: string; href: string; icon: React.ReactNode }
  >;
}

// ── DashboardHub ──────────────────────────────────────────────────────────────

export default function DashboardHubPage() {
  const { locale, t } = useLocale();
  const { user, loading } = useAuth();
  const router = useRouter();

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!loading && !user) {
      router.replace(`/${locale}/auth/login`);
    }
  }, [loading, user, locale, router]);

  // Auto-redirect when user has exactly one role
  React.useEffect(() => {
    if (!user) return;
    if (user.roles.length === 1) {
      router.replace(`/${locale}/dashboard/${user.roles[0]}`);
    }
  }, [user, locale, router]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  // Single role — show spinner while redirecting
  if (user.roles.length === 1) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  // Multiple roles — show selector
  const roleConfig = getRoleConfig(locale, t);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-16">
      <div className="w-full max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            {t("dashboard.welcome", { name: user.name })}
          </h1>
          <p className="mt-2 text-gray-500 text-sm">
            {t("dashboard.chooseDashboardHint")}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {user.roles.map((role) => {
            const config = roleConfig[role];
            return (
              <button
                key={role}
                onClick={() => router.push(config.href)}
                className="group flex flex-col items-center rounded-2xl border-2 border-gray-200 bg-white p-6 text-center shadow-sm transition-all hover:border-blue-500 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition-colors">
                  {config.icon}
                </span>
                <h2 className="mb-2 font-bold text-gray-900">{config.label}</h2>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {config.description}
                </p>
              </button>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/${locale}/dashboard/profile`)}
          >
            {t("dashboard.profileSettings")}
          </Button>
        </div>
      </div>
    </div>
  );
}
