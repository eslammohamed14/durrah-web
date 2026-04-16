"use client";

/**
 * useSubmitTicket — encapsulates ticket creation API call.
 *
 * - Calls createMaintenanceTicket on the API client
 * - Associates ticket with the authenticated user (handled server-side via token)
 * - Returns submission state and the created ticket on success
 *
 * Requirements: 12.5, 12.6, 12.7
 */

import { useState, useCallback } from "react";
import type { MaintenanceTicket } from "@/lib/types";
import type { MaintenanceTicketFormData } from "../components/MaintenanceTicketForm";
import { getAPIClient } from "@/lib/api";

interface UseSubmitTicketReturn {
  submitting: boolean;
  error: string | null;
  createdTicket: MaintenanceTicket | null;
  submit: (data: MaintenanceTicketFormData) => Promise<MaintenanceTicket>;
  reset: () => void;
}

export function useSubmitTicket(): UseSubmitTicketReturn {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdTicket, setCreatedTicket] = useState<MaintenanceTicket | null>(
    null,
  );

  const submit = useCallback(
    async (data: MaintenanceTicketFormData): Promise<MaintenanceTicket> => {
      setSubmitting(true);
      setError(null);

      try {
        const api = getAPIClient();
        const ticket = await api.createMaintenanceTicket({
          propertyId: data.propertyId,
          category: data.category,
          priority: data.priority,
          title: data.title,
          description: data.description,
          images: data.imageUrls,
        });

        setCreatedTicket(ticket);
        return ticket;
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "Failed to create ticket";
        setError(msg);
        throw err;
      } finally {
        setSubmitting(false);
      }
    },
    [],
  );

  const reset = useCallback(() => {
    setError(null);
    setCreatedTicket(null);
  }, []);

  return { submitting, error, createdTicket, submit, reset };
}
