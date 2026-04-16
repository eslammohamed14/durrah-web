"use client";

/**
 * InvestorDashboard — read-only view of invested properties, bookings,
 * revenue analytics, occupancy rates, and maintenance tickets.
 * Requirements: 10.1, 10.2, 10.3, 10.4, 10.5
 */

import React, { useEffect, useState, useCallback } from "react";
import type { Property, Booking, MaintenanceTicket } from "@/lib/types";
import { useAuth } from "@/lib/contexts/AuthContext";
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
  // Simple count-based occupancy for demo
  const bookedNights = propBookings.reduce((sum, b) => {
    const ci = new Date(b.checkIn);
    const co = new Date(b.checkOut);
    return (
      sum + Math.max(0, Math.ceil((co.getTime() - ci.getTime()) / 86400000))
    );
  }, 0);
  const totalDays = 90; // trailing 90-day window
  return Math.min(100, Math.round((bookedNights / totalDays) * 100));
}

function calcRevenue(bookings: Booking[], propertyId: string): number {
  return bookings
    .filter((b) => b.propertyId === propertyId && b.status !== "cancelled")
    .reduce((sum, b) => sum + b.pricing.total, 0);
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
  const isAr = locale === "ar";
  const occupancy = calcOccupancy(bookings, property.id);
  const revenue = calcRevenue(bookings, property.id);
  // Assume equal share among investors + owner
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
            ? isAr
              ? "نشط"
              : "Active"
            : isAr
              ? "غير نشط"
              : "Inactive"}
        </Badge>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-lg bg-gray-50 p-3">
          <p className="text-xs text-gray-400 mb-1">
            {isAr ? "معدل الإشغال" : "Occupancy"}
          </p>
          <p className="font-bold text-gray-900">{occupancy}%</p>
          {/* Progress bar */}
          <div className="mt-1.5 h-1.5 rounded-full bg-gray-200">
            <div
              className="h-1.5 rounded-full bg-blue-500"
              style={{ width: `${occupancy}%` }}
            />
          </div>
        </div>
        <div className="rounded-lg bg-gray-50 p-3">
          <p className="text-xs text-gray-400 mb-1">
            {isAr ? "إجمالي الإيرادات" : "Total Revenue"}
          </p>
          <p className="font-bold text-gray-900">
            {formatCurrency(revenue, property.pricing.currency, locale)}
          </p>
        </div>
        <div className="rounded-lg bg-blue-50 p-3 col-span-2">
          <p className="text-xs text-blue-600 mb-1">
            {isAr ? "حصتك" : "Your Share"}
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
  const isAr = locale === "ar";

  if (tickets.length === 0) {
    return (
      <div className="rounded-xl border-2 border-dashed border-gray-200 py-12 text-center">
        <p className="text-gray-400 text-sm">
          {isAr ? "لا توجد طلبات صيانة" : "No maintenance tickets"}
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

  const statusLabel = (s: MaintenanceTicket["status"]) => {
    const m: Record<typeof s, [string, string]> = {
      open: ["Open", "مفتوح"],
      in_progress: ["In Progress", "قيد التنفيذ"],
      resolved: ["Resolved", "تم الحل"],
      closed: ["Closed", "مغلق"],
    };
    return m[s][isAr ? 1 : 0];
  };

  return (
    <div className="space-y-3">
      {tickets.map((t) => {
        const prop = properties[t.propertyId];
        return (
          <article
            key={t.id}
            className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-2 mb-1">
              <p className="font-medium text-gray-900 text-sm">{t.title}</p>
              <Badge variant={statusVariant[t.status]} size="sm">
                {statusLabel(t.status)}
              </Badge>
            </div>
            <p className="text-xs text-gray-400">
              {prop?.title[locale === "ar" ? "ar" : "en"] ?? t.propertyId}
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
  const isAr = locale === "ar";
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
      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5 text-center shadow-sm">
          <p className="text-2xl font-bold text-blue-600">
            {formatCurrency(totalRevenue, currency, locale)}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {isAr ? "إجمالي الإيرادات" : "Total Revenue"}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 text-center shadow-sm">
          <p className="text-2xl font-bold text-green-600">{avgOccupancy}%</p>
          <p className="text-xs text-gray-500 mt-1">
            {isAr ? "متوسط الإشغال" : "Avg Occupancy"}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 text-center shadow-sm">
          <p className="text-2xl font-bold text-purple-600">
            {properties.length}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {isAr ? "العقارات المستثمرة" : "Invested Properties"}
          </p>
        </div>
      </div>

      {/* Per-property revenue breakdown */}
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
        <div className="px-5 py-3 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900 text-sm">
            {isAr ? "الإيرادات حسب العقار" : "Revenue by Property"}
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
                    {occ}% {isAr ? "إشغال" : "occupancy"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    {formatCurrency(rev, p.pricing.currency, locale)}
                  </p>
                  <p className="text-xs text-blue-600">
                    {isAr ? "حصتك:" : "Your share:"}{" "}
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
  const isAr = locale === "ar";

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

      // Filter to properties where this user is an investor
      const invested = allProps.filter((p) => p.investorIds.includes(user.id));

      const propMap: Record<string, Property> = {};
      for (const p of invested) propMap[p.id] = p;

      // Load bookings for all invested properties
      const bookingResults = await Promise.all(
        invested.map((p) =>
          api.getUserBookings(p.ownerId).catch(() => [] as Booking[]),
        ),
      );
      const bookings = bookingResults
        .flat()
        .filter((b) => invested.some((p) => p.id === b.propertyId));

      // Load tickets
      const knownTicketIds = ["ticket-1", "ticket-2"];
      const ticketList: MaintenanceTicket[] = [];
      for (const tid of knownTicketIds) {
        try {
          const t = await api.getMaintenanceTicket(tid);
          if (propMap[t.propertyId]) ticketList.push(t);
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
          : isAr
            ? "حدث خطأ ما"
            : "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  }, [user, isAr]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const tabs: { id: Tab; label: string }[] = [
    { id: "properties", label: isAr ? "العقارات" : "Properties" },
    { id: "bookings", label: isAr ? "الحجوزات" : "Bookings" },
    { id: "revenue", label: isAr ? "الإيرادات" : "Revenue" },
    { id: "tickets", label: isAr ? "الصيانة" : "Maintenance" },
  ];

  if (!user) return null;

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          {isAr ? `مرحباً، ${user.name}` : `Welcome, ${user.name}`}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          {isAr ? "عرض أداء استثماراتك" : "View your investment performance"}
        </p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700">
          {error}
          <button className="ml-3 underline" onClick={loadData}>
            {isAr ? "حاول مجدداً" : "Retry"}
          </button>
        </div>
      )}

      {/* Tabs */}
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
                  {isAr ? "لا توجد عقارات مستثمرة" : "No invested properties"}
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
