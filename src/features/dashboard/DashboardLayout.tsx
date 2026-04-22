"use client";

/**
 * DashboardLayout — shared shell for all dashboard pages.
 * Provides sidebar navigation, mobile nav, and a content area.
 */

import React, { useState } from "react";
import { Link, usePathname } from "@/navigation";
import { useAuth } from "@/lib/contexts/AuthContext";
import { useLocale } from "@/lib/contexts/LocaleContext";
import { Spinner } from "@/components/ui/Spinner";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  navItems: NavItem[];
  title: string;
  locale?: string;
}

function MenuIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className="h-6 w-6"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
      />
    </svg>
  );
}

function XIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className="h-6 w-6"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
}

export function DashboardLayout({
  children,
  navItems,
  title,
  locale = "en",
}: DashboardLayoutProps) {
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const { t } = useLocale();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isRtl = locale === "ar";

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const sidebar = (
    <nav className="flex flex-col gap-1 p-4" aria-label={title}>
      {/* User info */}
      {user && (
        <div className="mb-4 px-2">
          <p className="font-semibold text-gray-900 text-sm truncate">
            {user.name}
          </p>
          <p className="text-xs text-gray-400 truncate">
            {user.email ?? user.phoneNumber}
          </p>
        </div>
      )}

      {navItems.map((item) => {
        const active =
          pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            className={[
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-blue-50 text-blue-700"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
            ].join(" ")}
            aria-current={active ? "page" : undefined}
          >
            <span className="h-5 w-5 shrink-0">{item.icon}</span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:border-r lg:border-gray-200 lg:bg-white">
        <div className="flex h-14 items-center border-b border-gray-200 px-6">
          <h1 className="font-bold text-gray-900 text-base">{title}</h1>
        </div>
        {sidebar}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={[
          "fixed inset-y-0 z-50 w-64 bg-white shadow-xl transition-transform duration-300 lg:hidden",
          isRtl ? "right-0" : "left-0",
          mobileOpen
            ? "translate-x-0"
            : isRtl
              ? "translate-x-full"
              : "-translate-x-full",
        ].join(" ")}
      >
        <div className="flex h-14 items-center justify-between border-b border-gray-200 px-4">
          <h2 className="font-bold text-gray-900 text-sm">{title}</h2>
          <button
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100"
            aria-label={t("dashboard.layout.closeMenu")}
          >
            <XIcon />
          </button>
        </div>
        {sidebar}
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Mobile header */}
        <header className="flex h-14 items-center gap-3 border-b border-gray-200 bg-white px-4 lg:hidden">
          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100"
            aria-label={t("dashboard.layout.openMenu")}
          >
            <MenuIcon />
          </button>
          <span className="font-semibold text-gray-900 text-sm">{title}</span>
        </header>

        <main className="flex-1 overflow-auto p-4 lg:p-8" id="main-content">
          {children}
        </main>
      </div>
    </div>
  );
}
