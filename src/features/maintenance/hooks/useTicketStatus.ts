"use client";

/**
 * useTicketStatus — handles ticket status updates with in-app + email notifications.
 *
 * - Updates ticket status via API
 * - Triggers in-app notification refresh
 * - Sends email notification to ticket owner
 *
 * Requirements: 13.3, 28.3
 */

import { useState, useCallback } from "react";
import type { MaintenanceTicket, TicketStatus } from "@/lib/types";
import { getAPIClient } from "@/lib/api";
import { sendTicketStatusEmail } from "@/lib/services/email/sendTicketEmail";

interface UseTicketStatusOptions {
  /** Called after a successful status update — use to refresh notification list */
  onNotificationRefresh?: () => void;
}

interface UseTicketStatusReturn {
  updating: boolean;
  error: string | null;
  updateStatus: (
    ticket: MaintenanceTicket,
    newStatus: TicketStatus,
    userEmail?: string,
    userName?: string,
  ) => Promise<MaintenanceTicket>;
}

export function useTicketStatus({
  onNotificationRefresh,
}: UseTicketStatusOptions = {}): UseTicketStatusReturn {
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateStatus = useCallback(
    async (
      ticket: MaintenanceTicket,
      newStatus: TicketStatus,
      userEmail?: string,
      userName?: string,
    ): Promise<MaintenanceTicket> => {
      setUpdating(true);
      setError(null);

      try {
        const api = getAPIClient();
        const updated = await api.updateMaintenanceTicket(ticket.id, {
          status: newStatus,
        });

        // Fire email notification (non-blocking — don't fail the update if email fails)
        if (userEmail && userName) {
          sendTicketStatusEmail(updated, userEmail, userName).catch(() => {
            // silent — notifications are non-critical
          });
        }

        // Refresh in-app notifications
        onNotificationRefresh?.();

        return updated;
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "Failed to update ticket status";
        setError(msg);
        throw err;
      } finally {
        setUpdating(false);
      }
    },
    [onNotificationRefresh],
  );

  return { updating, error, updateStatus };
}
