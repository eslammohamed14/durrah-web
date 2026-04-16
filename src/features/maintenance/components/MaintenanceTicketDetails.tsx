"use client";

/**
 * MaintenanceTicketDetails — full ticket view with timeline, comments, and resolution.
 *
 * - Complete ticket information display
 * - Status history / timeline
 * - Comment section
 * - Resolution section (when resolved/closed)
 *
 * Requirements: 13.1, 13.4, 13.5
 */

import React, { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import type { MaintenanceTicket, TicketStatus } from "@/lib/types";
import { useLocale } from "@/lib/contexts/LocaleContext";
import { useAuth } from "@/lib/contexts/AuthContext";
import { getAPIClient } from "@/lib/api";
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

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(d: Date | string): string {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ── InfoRow ───────────────────────────────────────────────────────────────────

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-500 shrink-0">{label}</span>
      <span className="text-sm font-medium text-gray-900 text-end">
        {value}
      </span>
    </div>
  );
}

// ── CommentList ───────────────────────────────────────────────────────────────

interface CommentListProps {
  ticket: MaintenanceTicket;
  onAddComment: (content: string) => Promise<void>;
  submittingComment: boolean;
}

function CommentList({
  ticket,
  onAddComment,
  submittingComment,
}: CommentListProps) {
  const { t } = useLocale();
  const [commentText, setCommentText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = commentText.trim();
    if (!trimmed) return;
    await onAddComment(trimmed);
    setCommentText("");
    textareaRef.current?.focus();
  };

  return (
    <section aria-labelledby="comments-heading">
      <h3
        id="comments-heading"
        className="mb-3 text-sm font-semibold text-gray-800"
      >
        {t("maintenance.comments")}
        {ticket.comments.length > 0 && (
          <span className="ms-1.5 rounded-full bg-gray-100 px-1.5 py-0.5 text-xs text-gray-500">
            {ticket.comments.length}
          </span>
        )}
      </h3>

      {/* Comments */}
      {ticket.comments.length === 0 ? (
        <p className="text-xs text-gray-400 italic mb-4">No comments yet.</p>
      ) : (
        <div className="mb-4 space-y-3">
          {ticket.comments.map((comment) => (
            <div key={comment.id} className="rounded-lg bg-gray-50 p-3">
              <p className="text-sm text-gray-800">{comment.content}</p>
              <p className="mt-1 text-xs text-gray-400">
                {formatDate(comment.createdAt)}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Add comment form */}
      <form onSubmit={handleSubmit} className="space-y-2">
        <textarea
          ref={textareaRef}
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          rows={3}
          placeholder={t("maintenance.addComment")}
          className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label={t("maintenance.addComment")}
        />
        <Button
          type="submit"
          variant="outline"
          size="sm"
          loading={submittingComment}
          disabled={!commentText.trim() || submittingComment}
        >
          {t("maintenance.addComment")}
        </Button>
      </form>
    </section>
  );
}

// ── StatusTimeline ────────────────────────────────────────────────────────────

function StatusTimeline({ ticket }: { ticket: MaintenanceTicket }) {
  const { t } = useLocale();

  // Build timeline events from the ticket data
  const events: { label: string; date: Date | string; active: boolean }[] = [
    {
      label: t("maintenance.status_open"),
      date: ticket.createdAt,
      active: true,
    },
    {
      label: t("maintenance.status_in_progress"),
      date: ticket.updatedAt,
      active: ["in_progress", "resolved", "closed"].includes(ticket.status),
    },
    {
      label: t("maintenance.status_resolved"),
      date: ticket.resolution?.resolvedAt ?? ticket.updatedAt,
      active: ["resolved", "closed"].includes(ticket.status),
    },
    {
      label: t("maintenance.status_closed"),
      date: ticket.updatedAt,
      active: ticket.status === "closed",
    },
  ];

  return (
    <section aria-labelledby="timeline-heading">
      <h3
        id="timeline-heading"
        className="mb-3 text-sm font-semibold text-gray-800"
      >
        Status History
      </h3>
      <ol className="relative border-s border-gray-200 ps-4 space-y-4">
        {events.map((event, idx) => (
          <li key={idx} className="flex items-start gap-3">
            <span
              className={[
                "absolute -start-1.5 mt-1 h-3 w-3 rounded-full border-2 border-white",
                event.active ? "bg-blue-500" : "bg-gray-300",
              ].join(" ")}
              aria-hidden="true"
            />
            <div>
              <p
                className={[
                  "text-sm font-medium",
                  event.active ? "text-gray-900" : "text-gray-400",
                ].join(" ")}
              >
                {event.label}
              </p>
              {event.active && (
                <p className="text-xs text-gray-400">
                  {formatDate(event.date)}
                </p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

// ── MaintenanceTicketDetails ──────────────────────────────────────────────────

export interface MaintenanceTicketDetailsProps {
  ticketId: string;
}

export function MaintenanceTicketDetails({
  ticketId,
}: MaintenanceTicketDetailsProps) {
  const { t } = useLocale();
  const { user } = useAuth();
  const router = useRouter();

  const [ticket, setTicket] = useState<MaintenanceTicket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submittingComment, setSubmittingComment] = useState(false);

  const loadTicket = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const api = getAPIClient();
      const data = await api.getMaintenanceTicket(ticketId);
      setTicket(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("errors.generic"));
    } finally {
      setLoading(false);
    }
  }, [ticketId, t]);

  useEffect(() => {
    loadTicket();
  }, [loadTicket]);

  const handleAddComment = useCallback(
    async (content: string) => {
      if (!ticket) return;
      setSubmittingComment(true);
      try {
        const api = getAPIClient();
        const comment = await api.addTicketComment(ticket.id, content);
        setTicket((prev) =>
          prev ? { ...prev, comments: [...prev.comments, comment] } : prev,
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : t("errors.generic"));
      } finally {
        setSubmittingComment(false);
      }
    },
    [ticket, t],
  );

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="rounded-lg bg-red-50 border border-red-200 p-6 text-center">
        <p className="text-sm text-red-700 mb-4">
          {error ?? t("errors.notFound")}
        </p>
        <Button variant="outline" size="sm" onClick={loadTicket}>
          {t("common.retry")}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700"
        aria-label={t("common.back")}
      >
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        {t("common.back")}
      </button>

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">{ticket.title}</h1>
          <p className="mt-1 text-sm text-gray-400">
            #{ticket.id} · {formatDate(ticket.createdAt)}
          </p>
        </div>
        <Badge variant={STATUS_BADGE[ticket.status]} size="md">
          {t(`maintenance.status_${ticket.status}`)}
        </Badge>
      </div>

      {/* Details card */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <InfoRow
          label={t("maintenance.category")}
          value={t(`maintenance.category_${ticket.category}`)}
        />
        <InfoRow
          label={t("maintenance.priority")}
          value={t(`maintenance.priority_${ticket.priority}`)}
        />
        <InfoRow
          label={t("maintenance.description")}
          value={ticket.description}
        />
        {ticket.assignedTo && (
          <InfoRow label="Assigned to" value={ticket.assignedTo} />
        )}
      </div>

      {/* Images */}
      {ticket.images.length > 0 && (
        <section aria-labelledby="images-heading">
          <h3
            id="images-heading"
            className="mb-3 text-sm font-semibold text-gray-800"
          >
            {t("maintenance.attachPhotos")}
          </h3>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
            {ticket.images.map((url, idx) => (
              <a
                key={idx}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="block aspect-square overflow-hidden rounded-lg border border-gray-200 hover:opacity-90 transition-opacity"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt={`Ticket image ${idx + 1}`}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Resolution */}
      {ticket.resolution && (
        <div className="rounded-xl border border-green-200 bg-green-50 p-5">
          <h3 className="mb-3 text-sm font-semibold text-green-800">
            {t("maintenance.resolution")}
          </h3>
          <div className="space-y-2 text-sm text-green-700">
            <p>{ticket.resolution.notes}</p>
            {ticket.resolution.cost !== undefined && (
              <p>Cost: {ticket.resolution.cost.toLocaleString()} SAR</p>
            )}
            <p className="text-xs text-green-500">
              Resolved: {formatDate(ticket.resolution.resolvedAt)}
            </p>
          </div>
        </div>
      )}

      {/* Status timeline */}
      <StatusTimeline ticket={ticket} />

      {/* Comments */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <CommentList
          ticket={ticket}
          onAddComment={handleAddComment}
          submittingComment={submittingComment}
        />
      </div>
    </div>
  );
}
