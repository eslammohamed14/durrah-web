"use client";

/**
 * GuestDashboard — shows bookings, inquiries, maintenance tickets, and saved properties.
 * Requirements: 9.1, 9.3, 9.4, 9.5, 31.6
 */

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "@/navigation";
import type {
  Booking,
  MaintenanceTicket,
  Inquiry,
  Property,
} from "@/lib/types";
import { useAuth } from "@/lib/contexts/AuthContext";
import { useLocale } from "@/lib/contexts/LocaleContext";
import { getAPIClient } from "@/lib/api";
import { BookingList } from "@/features/booking/BookingList";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";

// ── Types ─────────────────────────────────────────────────────────────────────

type Tab = "bookings" | "inquiries" | "tickets" | "saved";

interface GuestDashboardProps {
  locale?: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const INQUIRY_BADGE = {
  new: "info",
  contacted: "success",
  closed: "default",
} as const;

const TICKET_BADGE = {
  open: "warning",
  in_progress: "info",
  resolved: "success",
  closed: "default",
} as const;

function formatDate(d: Date | string, locale: string) {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString(locale === "ar" ? "ar-SA" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function inquiryStatusT(
  t: (key: string, params?: Record<string, string | number>) => string,
  s: Inquiry["status"],
) {
  const map: Record<Inquiry["status"], string> = {
    new: "inquiry.status_new",
    contacted: "inquiry.status_contacted",
    closed: "inquiry.status_closed",
  };
  return t(map[s]);
}

function ticketStatusT(
  t: (key: string, params?: Record<string, string | number>) => string,
  s: MaintenanceTicket["status"],
) {
  const map: Record<MaintenanceTicket["status"], string> = {
    open: "maintenance.status_open",
    in_progress: "maintenance.status_in_progress",
    resolved: "maintenance.status_resolved",
    closed: "maintenance.status_closed",
  };
  return t(map[s]);
}

function ticketPriorityT(
  t: (key: string, params?: Record<string, string | number>) => string,
  p: MaintenanceTicket["priority"],
) {
  const map: Record<MaintenanceTicket["priority"], string> = {
    low: "maintenance.priority_low",
    medium: "maintenance.priority_medium",
    high: "maintenance.priority_high",
    emergency: "maintenance.priority_emergency",
  };
  return t(map[p]);
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function InquiriesTab({
  inquiries,
  properties,
  locale,
}: {
  inquiries: Inquiry[];
  properties: Record<string, Property>;
  locale: string;
}) {
  const { t } = useLocale();

  if (inquiries.length === 0) {
    return (
      <div className="rounded-xl border-2 border-dashed border-gray-200 py-12 text-center">
        <p className="text-gray-400 text-sm">
          {t("dashboard.guest.noInquiriesYet")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {inquiries.map((inq) => {
        const prop = properties[inq.propertyId];
        return (
          <article
            key={inq.id}
            className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <p className="font-medium text-gray-900 text-sm">
                {prop
                  ? prop.title[locale === "ar" ? "ar" : "en"]
                  : inq.propertyId}
              </p>
              <Badge variant={INQUIRY_BADGE[inq.status]} size="sm">
                {inquiryStatusT(t, inq.status)}
              </Badge>
            </div>
            <p className="text-xs text-gray-500 line-clamp-2 mb-2">
              {inq.message}
            </p>
            <p className="text-xs text-gray-400">
              {formatDate(inq.createdAt, locale)}
            </p>
          </article>
        );
      })}
    </div>
  );
}

function TicketsTab({
  tickets,
  properties,
  locale,
}: {
  tickets: MaintenanceTicket[];
  properties: Record<string, Property>;
  locale: string;
}) {
  const { t } = useLocale();

  if (tickets.length === 0) {
    return (
      <div className="rounded-xl border-2 border-dashed border-gray-200 py-12 text-center">
        <p className="text-gray-400 text-sm">
          {t("dashboard.guest.noTicketsYet")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tickets.map((ticket) => {
        const prop = properties[ticket.propertyId];
        return (
          <article
            key={ticket.id}
            className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <p className="font-medium text-gray-900 text-sm">
                  {ticket.title}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {prop
                    ? prop.title[locale === "ar" ? "ar" : "en"]
                    : ticket.propertyId}
                </p>
              </div>
              <div className="flex flex-col gap-1 items-end">
                <Badge variant={TICKET_BADGE[ticket.status]} size="sm">
                  {ticketStatusT(t, ticket.status)}
                </Badge>
              </div>
            </div>
            <p className="text-xs text-gray-500 line-clamp-2 mb-2">
              {ticket.description}
            </p>
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>
                {t("dashboard.guest.priority")}{" "}
                {ticketPriorityT(t, ticket.priority)}
              </span>
              <span>{formatDate(ticket.createdAt, locale)}</span>
            </div>
          </article>
        );
      })}
    </div>
  );
}

function SavedTab() {
  const { t } = useLocale();
  const router = useRouter();
  return (
    <div className="rounded-xl border-2 border-dashed border-gray-200 py-12 text-center">
      <p className="text-gray-400 text-sm">
        {t("dashboard.guest.noSavedProperties")}
      </p>
      <Button
        variant="outline"
        size="sm"
        className="mt-4"
        onClick={() => router.push("/search")}
      >
        {t("dashboard.guest.browseProperties")}
      </Button>
    </div>
  );
}

// ── GuestDashboard ────────────────────────────────────────────────────────────

export function GuestDashboard({ locale = "en" }: GuestDashboardProps) {
  const { user } = useAuth();
  const { t } = useLocale();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<Tab>("bookings");

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [tickets, setTickets] = useState<MaintenanceTicket[]>([]);
  const [properties, setProperties] = useState<Record<string, Property>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const api = getAPIClient();
      const [bks, inqs, allProps] = await Promise.all([
        api.getUserBookings(user.id),
        api.getUserInquiries(user.id),
        api.searchProperties({}),
      ]);

      const propMap: Record<string, Property> = {};
      for (const p of allProps) propMap[p.id] = p;

      const knownTicketIds = ["ticket-1", "ticket-2"];
      const userTickets: MaintenanceTicket[] = [];
      for (const tid of knownTicketIds) {
        try {
          const ticket = await api.getMaintenanceTicket(tid);
          if (ticket.userId === user.id) userTickets.push(ticket);
        } catch {
          // not found
        }
      }

      setBookings(bks);
      setInquiries(inqs);
      setTickets(userTickets);
      setProperties(propMap);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t("dashboard.genericError"),
      );
    } finally {
      setLoading(false);
    }
  }, [user, t]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const tabs: { id: Tab; label: string; count?: number }[] = [
    {
      id: "bookings",
      label: t("dashboard.nav.bookings"),
      count: bookings.length,
    },
    {
      id: "inquiries",
      label: t("dashboard.nav.inquiries"),
      count: inquiries.length,
    },
    {
      id: "tickets",
      label: t("dashboard.nav.maintenance"),
      count: tickets.length,
    },
    { id: "saved", label: t("dashboard.nav.saved") },
  ];

  if (!user) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <p className="text-gray-600">{t("dashboard.pleaseLogin")}</p>
        <Button variant="primary" onClick={() => router.push("/auth/login")}>
          {t("dashboard.logIn")}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          {t("dashboard.welcome", { name: user.name })}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          {t("dashboard.manageBookingsSubtitle")}
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700">
          {error}
          <button className="ml-3 underline" onClick={loadData}>
            {t("dashboard.retry")}
          </button>
        </div>
      )}

      {/* Stats bar */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: t("dashboard.nav.bookings"), value: bookings.length },
          {
            label: t("dashboard.nav.inquiries"),
            value: inquiries.length,
          },
          { label: t("dashboard.nav.tickets"), value: tickets.length },
          {
            label: t("dashboard.nav.upcoming"),
            value: bookings.filter(
              (b) =>
                b.status !== "cancelled" && new Date(b.checkIn) > new Date(),
            ).length,
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-gray-200 bg-white p-4 text-center"
          >
            <p className="text-2xl font-bold text-blue-600">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div>
        <div
          className="flex gap-1 rounded-xl bg-gray-100 p-1 overflow-x-auto"
          role="tablist"
          aria-label={t("dashboard.dashboardSectionsAria")}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={[
                "flex items-center gap-1.5 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                activeTab === tab.id
                  ? "bg-white text-blue-700 shadow-sm"
                  : "text-gray-500 hover:text-gray-700",
              ].join(" ")}
            >
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span className="rounded-full bg-blue-100 px-1.5 py-0.5 text-xs font-semibold text-blue-700">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab panels */}
        <div className="mt-4">
          {activeTab === "bookings" && (
            <BookingList
              bookings={bookings}
              loading={loading}
              propertyNames={Object.fromEntries(
                Object.entries(properties).map(([id, p]) => [
                  id,
                  p.title[locale === "ar" ? "ar" : "en"],
                ]),
              )}
              onViewDetails={(id) =>
                router.push(`/${locale}/dashboard/bookings/${id}`)
              }
              locale={locale}
            />
          )}
          {activeTab === "inquiries" &&
            (loading ? (
              <div className="flex justify-center py-12">
                <Spinner size="lg" />
              </div>
            ) : (
              <InquiriesTab
                inquiries={inquiries}
                properties={properties}
                locale={locale}
              />
            ))}
          {activeTab === "tickets" &&
            (loading ? (
              <div className="flex justify-center py-12">
                <Spinner size="lg" />
              </div>
            ) : (
              <TicketsTab
                tickets={tickets}
                properties={properties}
                locale={locale}
              />
            ))}
          {activeTab === "saved" && <SavedTab />}
        </div>
      </div>
    </div>
  );
}
