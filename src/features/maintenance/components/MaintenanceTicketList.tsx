"use client";

/**
 * MaintenanceTicketList — displays maintenance tickets with filters and actions.
 *
 * - Status indicators: Open, In Progress, Resolved, Closed
 * - Filter by status, category, and priority
 * - Action buttons: view details, add comment
 *
 * Requirements: 13.1, 13.2, 13.6
 */

import React, { useState, useMemo } from "react";
import type {
  MaintenanceTicket,
  TicketStatus,
  TicketCategory,
  TicketPriority,
} from "@/lib/types";
import { useLocale } from "@/lib/contexts/LocaleContext";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import type { BadgeVariant } from "@/components/ui/Badge";

// ── Constants ─────────────────────────────────────────────────────────────────

const STATUS_BADGE: Record<TicketStatus, BadgeVariant> = {
  open: "warning",
  in_progress: "info",
  resolved: "success",
  closed: "default",
};

const PRIORITY_BADGE: Record<TicketPriority, BadgeVariant> = {
  low: "success",
  medium: "warning",
  high: "error",
  emergency: "error",
};

const ALL_STATUSES: (TicketStatus | "all")[] = [
  "all",
  "open",
  "in_progress",
  "resolved",
  "closed",
];

const ALL_CATEGORIES: (TicketCategory | "all")[] = [
  "all",
  "hvac",
  "plumbing",
  "electrical",
  "appliances",
  "structural",
  "other",
];

const ALL_PRIORITIES: (TicketPriority | "all")[] = [
  "all",
  "low",
  "medium",
  "high",
  "emergency",
];

// ── Types ─────────────────────────────────────────────────────────────────────

export interface MaintenanceTicketListProps {
  tickets: MaintenanceTicket[];
  loading?: boolean;
  onViewDetails?: (ticketId: string) => void;
  onAddComment?: (ticketId: string) => void;
  /** Show status-change action (owner/admin only) */
  onUpdateStatus?: (ticketId: string, status: TicketStatus) => void;
  className?: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(d: Date | string): string {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// ── FilterBar ────────────────────────────────────────────────────────────────

interface FilterBarProps {
  statusFilter: TicketStatus | "all";
  categoryFilter: TicketCategory | "all";
  priorityFilter: TicketPriority | "all";
  onStatusChange: (v: TicketStatus | "all") => void;
  onCategoryChange: (v: TicketCategory | "all") => void;
  onPriorityChange: (v: TicketPriority | "all") => void;
}

function FilterBar({
  statusFilter,
  categoryFilter,
  priorityFilter,
  onStatusChange,
  onCategoryChange,
  onPriorityChange,
}: FilterBarProps) {
  const { t } = useLocale();

  return (
    <div className="flex flex-wrap gap-2">
      {/* Status */}
      <select
        value={statusFilter}
        onChange={(e) => onStatusChange(e.target.value as TicketStatus | "all")}
        aria-label={t("maintenance.status_open")}
        className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {ALL_STATUSES.map((s) => (
          <option key={s} value={s}>
            {s === "all"
              ? t("booking.allStatuses")
              : t(`maintenance.status_${s}`)}
          </option>
        ))}
      </select>

      {/* Category */}
      <select
        value={categoryFilter}
        onChange={(e) =>
          onCategoryChange(e.target.value as TicketCategory | "all")
        }
        aria-label={t("maintenance.category")}
        className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {ALL_CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {c === "all"
              ? t("maintenance.category")
              : t(`maintenance.category_${c}`)}
          </option>
        ))}
      </select>

      {/* Priority */}
      <select
        value={priorityFilter}
        onChange={(e) =>
          onPriorityChange(e.target.value as TicketPriority | "all")
        }
        aria-label={t("maintenance.priority")}
        className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {ALL_PRIORITIES.map((p) => (
          <option key={p} value={p}>
            {p === "all"
              ? t("maintenance.priority")
              : t(`maintenance.priority_${p}`)}
          </option>
        ))}
      </select>
    </div>
  );
}

// ── TicketCard ────────────────────────────────────────────────────────────────

interface TicketCardProps {
  ticket: MaintenanceTicket;
  onViewDetails?: (id: string) => void;
  onAddComment?: (id: string) => void;
  onUpdateStatus?: (id: string, status: TicketStatus) => void;
}

function TicketCard({
  ticket,
  onViewDetails,
  onAddComment,
  onUpdateStatus,
}: TicketCardProps) {
  const { t } = useLocale();

  return (
    <article
      className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
      aria-label={ticket.title}
    >
      {/* Header */}
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-gray-900">
            {ticket.title}
          </h3>
          <p className="mt-0.5 text-xs text-gray-400">
            #{ticket.id} · {formatDate(ticket.createdAt)}
          </p>
        </div>
        <Badge variant={STATUS_BADGE[ticket.status]} size="sm">
          {t(`maintenance.status_${ticket.status}`)}
        </Badge>
      </div>

      {/* Category + Priority row */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
          {t(`maintenance.category_${ticket.category}`)}
        </span>
        <Badge variant={PRIORITY_BADGE[ticket.priority]} size="sm">
          {t(`maintenance.priority_${ticket.priority}`)}
        </Badge>
      </div>

      {/* Description */}
      <p className="mb-3 line-clamp-2 text-xs text-gray-500">
        {ticket.description}
      </p>

      {/* Image count */}
      {ticket.images.length > 0 && (
        <p className="mb-3 flex items-center gap-1 text-xs text-gray-400">
          <svg
            className="h-3.5 w-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
            />
          </svg>
          {ticket.images.length} photo{ticket.images.length !== 1 ? "s" : ""}
        </p>
      )}

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-2">
        {onViewDetails && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(ticket.id)}
          >
            {t("common.view")}
          </Button>
        )}
        {onAddComment && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onAddComment(ticket.id)}
          >
            {t("maintenance.addComment")}
          </Button>
        )}
        {onUpdateStatus && ticket.status !== "closed" && (
          <select
            value={ticket.status}
            onChange={(e) =>
              onUpdateStatus(ticket.id, e.target.value as TicketStatus)
            }
            aria-label={`Change status for ${ticket.title}`}
            className="ms-auto rounded-lg border border-gray-300 bg-white px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {(
              ["open", "in_progress", "resolved", "closed"] as TicketStatus[]
            ).map((s) => (
              <option key={s} value={s}>
                {t(`maintenance.status_${s}`)}
              </option>
            ))}
          </select>
        )}
      </div>
    </article>
  );
}

// ── MaintenanceTicketList ──────────────────────────────────────────────────────

export function MaintenanceTicketList({
  tickets,
  loading = false,
  onViewDetails,
  onAddComment,
  onUpdateStatus,
  className = "",
}: MaintenanceTicketListProps) {
  const { t } = useLocale();

  const [statusFilter, setStatusFilter] = useState<TicketStatus | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState<TicketCategory | "all">(
    "all",
  );
  const [priorityFilter, setPriorityFilter] = useState<TicketPriority | "all">(
    "all",
  );

  const filtered = useMemo(
    () =>
      tickets.filter((tk) => {
        if (statusFilter !== "all" && tk.status !== statusFilter) return false;
        if (categoryFilter !== "all" && tk.category !== categoryFilter)
          return false;
        if (priorityFilter !== "all" && tk.priority !== priorityFilter)
          return false;
        return true;
      }),
    [tickets, statusFilter, categoryFilter, priorityFilter],
  );

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Filters */}
      <FilterBar
        statusFilter={statusFilter}
        categoryFilter={categoryFilter}
        priorityFilter={priorityFilter}
        onStatusChange={setStatusFilter}
        onCategoryChange={setCategoryFilter}
        onPriorityChange={setPriorityFilter}
      />

      {/* Result count */}
      {tickets.length > 0 && (
        <p className="text-xs text-gray-400">
          {filtered.length} / {tickets.length}{" "}
          {t("maintenance.title").toLowerCase()}
        </p>
      )}

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="rounded-xl border-2 border-dashed border-gray-200 py-12 text-center">
          <p className="text-sm text-gray-400">{t("maintenance.noTickets")}</p>
        </div>
      )}

      {/* Ticket cards */}
      <div className="space-y-3">
        {filtered.map((ticket) => (
          <TicketCard
            key={ticket.id}
            ticket={ticket}
            onViewDetails={onViewDetails}
            onAddComment={onAddComment}
            onUpdateStatus={onUpdateStatus}
          />
        ))}
      </div>
    </div>
  );
}
