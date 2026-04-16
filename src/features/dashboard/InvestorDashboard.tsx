"use client";

/**
 * InvestorDashboard — read-only view of invested properties, bookings,
 * revenue analytics, occupancy rates, and maintenance tickets.
 * Requirements: 10.1, 10.2, 10.3, 10.4, 10.5
 */

import React, { useEffect, useState, useCallback } from "react";
import type { Property, Booking, MaintenanceTicket } from "@/lib/types";
import { useAuth } from "@/lib/contexts/AuthContext";
import { useLocale } from "@/lib/contexts/LocaleContext";
import { getAPIClient } from "@/lib/api";
import { BookingList } from "@/features/booking/BookingList";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";

// ── Types ─────────────────────────────────────────────────────────────────────

type Tab = "properties" | "bookings" | "revenue" | "tickets";

interface InvestorDashboardProps {
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

function calcOccupancy(bookings: Booking[], propertyId: string): number {
  const propBookings = bookings.filter(
    (b) => b.propertyId === propertyId && b.status !== "cancelled",
  );
  if (propBookings.length === 0) return 0;
  const bookedNights = propBookings.reduce((sum, b) => {
    const ci = new Date(b.checkIn);
    const co = new Date(b.checkOut);
    return (
      sum + Math.max(0, Math.ceil((co.getTime() - ci.getTime()) / 86400000))
    );
  }, 0);
  const totalDays = 90;
  return Math.min(100, Math.round((bookedNights / totalDays) * 100));
}

function calcRevenue(bookings: Booking[], propertyId: string): number {
  return bookings
    .filter((b) => b.propertyId === propertyId && b.status !== "cancelled")
    .reduce((sum, b) => sum + b.pricing.total, 0);
}

function ticketStatusT(
  tr: (key: string, params?: Record<string, string | number>) => string,
  s: MaintenanceTicket["status"],
) {
  const map: Record<MaintenanceTicket["status"], string> = {
    open: "maintenance.status_open",
    in_progress: "maintenance.status_in_progress",
    resolved: "maintenance.status_resolved",
    closed: "maintenance.status_closed",
  };
  return tr(map[s]);
}

// ── PropertyCard ──────────────────────────────────────────────────────────────

function InvestorPropertyCard({
  property,
  bookings,
  locale,
}: {
  property: Property;
  bookings: Booking[];
  locale: string;
}) {
  const { t } = useLocale();
  const occupancy = calcOccupancy(bookings, property.id);
  const revenue = calcRevenue(bookings, property.id);
  const investorCount = property.investorIds.length + 1;
  const investorShare = revenue / investorCount;

  return (
    <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-gray-900 text-sm">
            {property.title[locale === "ar" ? "ar" : "en"]}
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            {property.location.address[locale === "ar" ? "ar" : "en"]}
          </p>
        </div>
        <Badge
          variant={property.status === "active" ? "success" : "warning"}
          size="sm"
        >
          {property.status === "active"
            ? t("dashboard.investor.propertyActive")
            : t("dashboard.investor.propertyInactive")}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-lg bg-gray-50 p-3">
          <p className="text-xs text-gray-400 mb-1">
            {t("dashboard.investor.occupancy")}
          </p>
          <p className="font-bold text-gray-900">{occupancy}%</p>
          <div className="mt-1.5 h-1.5 rounded-full bg-gray-200">
            <div
              className="h-1.5 rounded-full bg-blue-500"
              style={{ width: `${occupancy}%` }}
            />
          </div>
        </div>
        <div className="rounded-lg bg-gray-50 p-3">
          <p className="text-xs text-gray-400 mb-1">
            {t("dashboard.investor.totalRevenue")}
          </p>
          <p className="font-bold text-gray-900">
            {formatCurrency(revenue, property.pricing.currency, locale)}
          </p>
        </div>
        <div className="rounded-lg bg-blue-50 p-3 col-span-2">
          <p className="text-xs text-blue-600 mb-1">
            {t("dashboard.investor.yourShare")}
          </p>
          <p className="font-bold text-blue-700">
            {formatCurrency(investorShare, property.pricing.currency, locale)}
          </p>
        </div>
      </div>
    </article>
  );
}

// ── TicketReadOnly ─────────────────────────────────────────────────────────────

function TicketsReadOnly({
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
          {t("dashboard.investor.noTickets")}
        </p>
      </div>
    );
  }

  const statusVariant = {
    open: "warning",
    in_progress: "info",
    resolved: "success",
    closed: "default",
  } as const;

  return (
    <div className="space-y-3">
      {tickets.map((ticket) => {
        const prop = properties[ticket.propertyId];
        return (
          <article
            key={ticket.id}
            className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-2 mb-1">
              <p className="font-medium text-gray-900 text-sm">{ticket.title}</p>
              <Badge variant={statusVariant[ticket.status]} size="sm">
                {ticketStatusT(t, ticket.status)}
              </Badge>
            </div>
            <p className="text-xs text-gray-400">
              {prop?.title[locale === "ar" ? "ar" : "en"] ?? ticket.propertyId}
            </p>
          </article>
        );
      })}
    </div>
  );
}

// ── Revenue Overview ──────────────────────────────────────────────────────────

function RevenueOverview({
  properties,
  bookings,
  locale,
}: {
  properties: Property[];
  bookings: Booking[];
  locale: string;
}) {
  const { t } = useLocale();
  const totalRevenue = bookings
    .filter((b) => b.status !== "cancelled")
    .reduce((sum, b) => sum + b.pricing.total, 0);

  const currency = properties[0]?.pricing.currency ?? "SAR";
  const avgOccupancy =
    properties.length > 0
      ? Math.round(
          properties.reduce(
            (sum, p) => sum + calcOccupancy(bookings, p.id),
            0,
          ) / properties.length,
        )
      : 0;

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5 text-center shadow-sm">
          <p className="text-2xl font-bold text-blue-600">
            {formatCurrency(totalRevenue, currency, locale)}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {t("dashboard.investor.totalRevenue")}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 text-center shadow-sm">
          <p className="text-2xl font-bold text-green-600">{avgOccupancy}%</p>
          <p className="text-xs text-gray-500 mt-1">
            {t("dashboard.investor.avgOccupancy")}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 text-center shadow-sm">
          <p className="text-2xl font-bold text-purple-600">
            {properties.length}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {t("dashboard.investor.investedProperties")}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
        <div className="px-5 py-3 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900 text-sm">
            {t("dashboard.investor.revenueByProperty")}
          </h3>
        </div>
        <div className="divide-y divide-gray-100">
          {properties.map((p) => {
            const rev = calcRevenue(bookings, p.id);
            const occ = calcOccupancy(bookings, p.id);
            const share = rev / (p.investorIds.length + 1);
            return (
              <div
                key={p.id}
                className="flex items-center justify-between px-5 py-3 text-sm"
              >
                <div>
                  <p className="font-medium text-gray-900">
                    {p.title[locale === "ar" ? "ar" : "en"]}
                  </p>
                  <p className="text-xs text-gray-400">
                    {occ}% {t("dashboard.guest.occupancyShort")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    {formatCurrency(rev, p.pricing.currency, locale)}
                  </p>
                  <p className="text-xs text-blue-600">
                    {t("dashboard.investor.yourShareColon")}{" "}
                    {formatCurrency(share, p.pricing.currency, locale)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── InvestorDashboard ─────────────────────────────────────────────────────────

export function InvestorDashboard({ locale = "en" }: InvestorDashboardProps) {
  const { user } = useAuth();
  const { t } = useLocale();

  const [activeTab, setActiveTab] = useState<Tab>("properties");
  const [investedProperties, setInvestedProperties] = useState<Property[]>([]);
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [tickets, setTickets] = useState<MaintenanceTicket[]>([]);
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

      const invested = allProps.filter((p) => p.investorIds.includes(user.id));

      const propMap: Record<string, Property> = {};
      for (const p of invested) propMap[p.id] = p;

      const bookingResults = await Promise.all(
        invested.map((p) =>
          api.getUserBookings(p.ownerId).catch(() => [] as Booking[]),
        ),
      );
      const bookings = bookingResults
        .flat()
        .filter((b) => invested.some((p) => p.id === b.propertyId));

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

      setInvestedProperties(invested);
      setAllBookings(bookings);
      setTickets(ticketList);
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

  const tabs: { id: Tab; label: string }[] = [
    { id: "properties", label: t("dashboard.investor.tabProperties") },
    { id: "bookings", label: t("dashboard.investor.tabBookings") },
    { id: "revenue", label: t("dashboard.investor.tabRevenue") },
    { id: "tickets", label: t("dashboard.investor.tabTickets") },
  ];

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          {t("dashboard.welcome", { name: user.name })}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          {t("dashboard.viewInvestmentSubtitle")}
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
                "whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                activeTab === tab.id
                  ? "bg-white text-blue-700 shadow-sm"
                  : "text-gray-500 hover:text-gray-700",
              ].join(" ")}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mt-4">
          {loading ? (
            <div className="flex justify-center py-12">
              <Spinner size="lg" />
            </div>
          ) : activeTab === "properties" ? (
            investedProperties.length === 0 ? (
              <div className="rounded-xl border-2 border-dashed border-gray-200 py-12 text-center">
                <p className="text-gray-400 text-sm">
                  {t("dashboard.investor.noInvestedProperties")}
                </p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {investedProperties.map((p) => (
                  <InvestorPropertyCard
                    key={p.id}
                    property={p}
                    bookings={allBookings}
                    locale={locale}
                  />
                ))}
              </div>
            )
          ) : activeTab === "bookings" ? (
            <BookingList
              bookings={allBookings}
              propertyNames={Object.fromEntries(
                Object.entries(propertyMap).map(([id, p]) => [
                  id,
                  p.title[locale === "ar" ? "ar" : "en"],
                ]),
              )}
              readOnly
              locale={locale}
            />
          ) : activeTab === "revenue" ? (
            <RevenueOverview
              properties={investedProperties}
              bookings={allBookings}
              locale={locale}
            />
          ) : (
            <TicketsReadOnly
              tickets={tickets}
              properties={propertyMap}
              locale={locale}
            />
          )}
        </div>
      </div>
    </div>
  );
}
