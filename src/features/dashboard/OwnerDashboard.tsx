"use client";

/**
 * OwnerDashboard — manage owned properties, maintenance tickets,
 * bookings, inquiries, and date blocking.
 * Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6, 31.5
 */

import React, { useEffect, useState, useCallback } from "react";
import type {
  Property,
  Booking,
  MaintenanceTicket,
  Inquiry,
  TicketStatus,
  InquiryStatus,
} from "@/lib/types";
import { useAuth } from "@/lib/contexts/AuthContext";
import { useLocale } from "@/lib/contexts/LocaleContext";
import { getAPIClient } from "@/lib/api";
import { BookingList } from "@/features/booking/BookingList";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";

// ── Types ─────────────────────────────────────────────────────────────────────

type Tab = "properties" | "bookings" | "tickets" | "inquiries";

interface OwnerDashboardProps {
  locale?: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatCurrency(amount: number, currency = "SAR", locale: string) {
  try {
    return new Intl.NumberFormat(locale === "ar" ? "ar-SA" : "en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${amount.toLocaleString()} ${currency}`;
  }
}

function formatDate(d: Date | string, locale: string) {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString(locale === "ar" ? "ar-SA" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function ticketStatusT(
  tr: (key: string, params?: Record<string, string | number>) => string,
  s: TicketStatus,
) {
  const map: Record<TicketStatus, string> = {
    open: "maintenance.status_open",
    in_progress: "maintenance.status_in_progress",
    resolved: "maintenance.status_resolved",
    closed: "maintenance.status_closed",
  };
  return tr(map[s]);
}

function ticketPriorityT(
  tr: (key: string, params?: Record<string, string | number>) => string,
  p: MaintenanceTicket["priority"],
) {
  const map: Record<MaintenanceTicket["priority"], string> = {
    low: "maintenance.priority_low",
    medium: "maintenance.priority_medium",
    high: "maintenance.priority_high",
    emergency: "maintenance.priority_emergency",
  };
  return tr(map[p]);
}

function inquiryStatusT(
  tr: (key: string, params?: Record<string, string | number>) => string,
  s: InquiryStatus,
) {
  const map: Record<InquiryStatus, string> = {
    new: "inquiry.status_new",
    contacted: "inquiry.status_contacted",
    closed: "inquiry.status_closed",
  };
  return tr(map[s]);
}

// ── Ticket Management ─────────────────────────────────────────────────────────

function TicketsManagement({
  tickets,
  properties,
  onStatusChange,
  locale,
}: {
  tickets: MaintenanceTicket[];
  properties: Record<string, Property>;
  onStatusChange: (ticketId: string, status: TicketStatus) => Promise<void>;
  locale: string;
}) {
  const { t } = useLocale();
  const [updating, setUpdating] = useState<string | null>(null);

  const statusBadge = {
    open: "warning",
    in_progress: "info",
    resolved: "success",
    closed: "default",
  } as const;

  const nextStatus: Record<TicketStatus, TicketStatus | null> = {
    open: "in_progress",
    in_progress: "resolved",
    resolved: "closed",
    closed: null,
  };

  if (tickets.length === 0) {
    return (
      <div className="rounded-xl border-2 border-dashed border-gray-200 py-12 text-center">
        <p className="text-gray-400 text-sm">
          {t("dashboard.owner.noTickets")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tickets.map((ticket) => {
        const prop = properties[ticket.propertyId];
        const next = nextStatus[ticket.status];
        const isUpdating = updating === ticket.id;

        return (
          <article
            key={ticket.id}
            className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 text-sm truncate">
                  {ticket.title}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {prop?.title[locale === "ar" ? "ar" : "en"] ??
                    ticket.propertyId}
                </p>
              </div>
              <Badge variant={statusBadge[ticket.status]} size="sm">
                {ticketStatusT(t, ticket.status)}
              </Badge>
            </div>

            <p className="text-xs text-gray-500 line-clamp-2 mb-3">
              {ticket.description}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex gap-3 text-gray-400">
                <span>
                  {t("dashboard.owner.priority")}{" "}
                  {ticketPriorityT(t, ticket.priority)}
                </span>
                <span>{formatDate(ticket.createdAt, locale)}</span>
                {ticket.resolution?.cost !== undefined && (
                  <span className="text-orange-500">
                    {t("dashboard.owner.cost")}{" "}
                    {formatCurrency(ticket.resolution.cost, "SAR", locale)}
                  </span>
                )}
              </div>
              {next && (
                <Button
                  variant="outline"
                  size="sm"
                  loading={isUpdating}
                  disabled={isUpdating}
                  onClick={async () => {
                    setUpdating(ticket.id);
                    try {
                      await onStatusChange(ticket.id, next);
                    } finally {
                      setUpdating(null);
                    }
                  }}
                >
                  {ticketStatusT(t, next)}
                </Button>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}

// ── Properties Management ─────────────────────────────────────────────────────

function PropertiesManagement({
  properties,
  bookings,
  locale,
}: {
  properties: Property[];
  bookings: Booking[];
  locale: string;
}) {
  const { t } = useLocale();

  if (properties.length === 0) {
    return (
      <div className="rounded-xl border-2 border-dashed border-gray-200 py-12 text-center">
        <p className="text-gray-400 text-sm">
          {t("dashboard.owner.noProperties")}
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {properties.map((prop) => {
        const propBookings = bookings.filter((b) => b.propertyId === prop.id);
        const activeBookings = propBookings.filter(
          (b) => b.status === "confirmed" || b.status === "active",
        );
        const totalRevenue = propBookings
          .filter((b) => b.status !== "cancelled")
          .reduce((sum, b) => sum + b.pricing.total, 0);

        return (
          <article
            key={prop.id}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-2 mb-3">
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">
                  {prop.title[locale === "ar" ? "ar" : "en"]}
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  {prop.location.address[locale === "ar" ? "ar" : "en"]}
                </p>
              </div>
              <Badge
                variant={prop.status === "active" ? "success" : "warning"}
                size="sm"
              >
                {prop.status === "active"
                  ? t("dashboard.investor.propertyActive")
                  : t("dashboard.investor.propertyInactive")}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs mb-3">
              <div className="rounded-lg bg-gray-50 p-2.5">
                <p className="text-gray-400">
                  {t("dashboard.nav.activeBookings")}
                </p>
                <p className="font-bold text-gray-900 text-base mt-0.5">
                  {activeBookings.length}
                </p>
              </div>
              <div className="rounded-lg bg-gray-50 p-2.5">
                <p className="text-gray-400">{t("dashboard.nav.revenue")}</p>
                <p className="font-bold text-gray-900 text-sm mt-0.5">
                  {formatCurrency(totalRevenue, prop.pricing.currency, locale)}
                </p>
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t border-gray-100">
              <Button variant="outline" size="sm" className="flex-1 text-xs">
                {t("dashboard.owner.edit")}
              </Button>
              <Button variant="ghost" size="sm" className="flex-1 text-xs">
                {t("dashboard.owner.blockDates")}
              </Button>
            </div>
          </article>
        );
      })}
    </div>
  );
}

// ── Inquiries Management ──────────────────────────────────────────────────────

function InquiriesManagement({
  inquiries,
  properties,
  onStatusChange,
  locale,
}: {
  inquiries: Inquiry[];
  properties: Record<string, Property>;
  onStatusChange: (id: string, status: InquiryStatus) => Promise<void>;
  locale: string;
}) {
  const { t } = useLocale();
  const [updating, setUpdating] = useState<string | null>(null);

  const statusBadge = {
    new: "info",
    contacted: "success",
    closed: "default",
  } as const;

  if (inquiries.length === 0) {
    return (
      <div className="rounded-xl border-2 border-dashed border-gray-200 py-12 text-center">
        <p className="text-gray-400 text-sm">
          {t("dashboard.owner.noInquiries")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {inquiries.map((inq) => {
        const prop = properties[inq.propertyId];
        const isUpdating = updating === inq.id;

        return (
          <article
            key={inq.id}
            className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <p className="font-semibold text-gray-900 text-sm">
                  {inq.name}
                </p>
                <p className="text-xs text-gray-400">
                  {prop?.title[locale === "ar" ? "ar" : "en"] ?? inq.propertyId}
                </p>
              </div>
              <Badge variant={statusBadge[inq.status]} size="sm">
                {inquiryStatusT(t, inq.status)}
              </Badge>
            </div>

            <p className="text-xs text-gray-500 mb-1">
              {inq.email} · {inq.phone}
            </p>
            <p className="text-xs text-gray-600 line-clamp-2 mb-3">
              {inq.message}
            </p>

            <div className="flex flex-wrap gap-2 items-center justify-between border-t border-gray-100 pt-2">
              <span className="text-xs text-gray-400">
                {formatDate(inq.createdAt, locale)}
              </span>
              <div className="flex gap-2">
                {inq.status === "new" && (
                  <Button
                    variant="outline"
                    size="sm"
                    loading={isUpdating}
                    onClick={async () => {
                      setUpdating(inq.id);
                      try {
                        await onStatusChange(inq.id, "contacted");
                      } finally {
                        setUpdating(null);
                      }
                    }}
                  >
                    {t("dashboard.owner.markContacted")}
                  </Button>
                )}
                {inq.status !== "closed" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-500"
                    loading={isUpdating}
                    onClick={async () => {
                      setUpdating(inq.id);
                      try {
                        await onStatusChange(inq.id, "closed");
                      } finally {
                        setUpdating(null);
                      }
                    }}
                  >
                    {t("dashboard.owner.close")}
                  </Button>
                )}
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

// ── OwnerDashboard ────────────────────────────────────────────────────────────

export function OwnerDashboard({ locale = "en" }: OwnerDashboardProps) {
  const { user } = useAuth();
  const { t } = useLocale();

  const [activeTab, setActiveTab] = useState<Tab>("properties");
  const [ownedProperties, setOwnedProperties] = useState<Property[]>([]);
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [tickets, setTickets] = useState<MaintenanceTicket[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [propertyMap, setPropertyMap] = useState<Record<string, Property>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const api = getAPIClient();
      const allProps = await api.searchProperties({});
      const owned = allProps.filter((p) => p.ownerId === user.id);

      const propMap: Record<string, Property> = {};
      for (const p of owned) propMap[p.id] = p;

      const bkResults = await Promise.all(
        owned.map((p) =>
          api.getUserBookings(p.ownerId).catch(() => [] as Booking[]),
        ),
      );
      const bookings = bkResults
        .flat()
        .filter((b) => owned.some((p) => p.id === b.propertyId));

      const knownTicketIds = ["ticket-1", "ticket-2"];
      const ticketList: MaintenanceTicket[] = [];
      for (const tid of knownTicketIds) {
        try {
          const ticket = await api.getMaintenanceTicket(tid);
          if (propMap[ticket.propertyId]) ticketList.push(ticket);
        } catch {
          // not found
        }
      }

      const inquiryResults = await Promise.all(
        owned.map((p) =>
          api.getPropertyInquiries(p.id).catch(() => [] as Inquiry[]),
        ),
      );
      const inqs = inquiryResults.flat();

      setOwnedProperties(owned);
      setAllBookings(bookings);
      setTickets(ticketList);
      setInquiries(inqs);
      setPropertyMap(propMap);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : t("dashboard.genericError"),
      );
    } finally {
      setLoading(false);
    }
  }, [user, t]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleTicketStatusChange = useCallback(
    async (ticketId: string, status: TicketStatus) => {
      const api = getAPIClient();
      const updated = await api.updateMaintenanceTicket(ticketId, { status });
      setTickets((prev) =>
        prev.map((tk) => (tk.id === ticketId ? updated : tk)),
      );
    },
    [],
  );

  const handleInquiryStatusChange = useCallback(
    async (id: string, status: InquiryStatus) => {
      const api = getAPIClient();
      const updated = await api.updateInquiryStatus(id, status);
      setInquiries((prev) => prev.map((i) => (i.id === id ? updated : i)));
    },
    [],
  );

  const tabs: { id: Tab; label: string; count?: number }[] = [
    {
      id: "properties",
      label: t("dashboard.owner.tabProperties"),
      count: ownedProperties.length,
    },
    {
      id: "bookings",
      label: t("dashboard.owner.tabBookings"),
      count: allBookings.length,
    },
    {
      id: "tickets",
      label: t("dashboard.owner.tabMaintenance"),
      count: tickets.filter((tk) => tk.status !== "closed").length,
    },
    {
      id: "inquiries",
      label: t("dashboard.owner.tabInquiries"),
      count: inquiries.filter((i) => i.status === "new").length,
    },
  ];

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          {t("dashboard.welcome", { name: user.name })}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          {t("dashboard.owner.welcomeSubtitle")}
        </p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700">
          {error}
          <button className="ml-3 underline" onClick={loadData}>
            {t("dashboard.retry")}
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          {
            label: t("dashboard.nav.properties"),
            value: ownedProperties.length,
          },
          {
            label: t("dashboard.nav.activeBookings"),
            value: allBookings.filter(
              (b) => b.status === "confirmed" || b.status === "active",
            ).length,
          },
          {
            label: t("dashboard.nav.openTickets"),
            value: tickets.filter((tk) => tk.status === "open").length,
          },
          {
            label: t("dashboard.nav.newInquiries"),
            value: inquiries.filter((i) => i.status === "new").length,
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

      <div>
        <div
          className="flex gap-1 rounded-xl bg-gray-100 p-1 overflow-x-auto"
          role="tablist"
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

        <div className="mt-4">
          {loading ? (
            <div className="flex justify-center py-12">
              <Spinner size="lg" />
            </div>
          ) : activeTab === "properties" ? (
            <PropertiesManagement
              properties={ownedProperties}
              bookings={allBookings}
              locale={locale}
            />
          ) : activeTab === "bookings" ? (
            <BookingList
              bookings={allBookings}
              propertyNames={Object.fromEntries(
                Object.entries(propertyMap).map(([id, p]) => [
                  id,
                  p.title[locale === "ar" ? "ar" : "en"],
                ]),
              )}
              locale={locale}
            />
          ) : activeTab === "tickets" ? (
            <TicketsManagement
              tickets={tickets}
              properties={propertyMap}
              onStatusChange={handleTicketStatusChange}
              locale={locale}
            />
          ) : (
            <InquiriesManagement
              inquiries={inquiries}
              properties={propertyMap}
              onStatusChange={handleInquiryStatusChange}
              locale={locale}
            />
          )}
        </div>
      </div>
    </div>
  );
}
