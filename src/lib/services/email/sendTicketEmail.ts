/**
 * Maintenance ticket email helpers.
 * Sends ticket confirmation and status change notifications.
 * Requirements: 13.3, 28.3
 */

import type { MaintenanceTicket } from "@/lib/types";
import { MockEmailAdapter } from "./MockEmailAdapter";

// Shared instance — swap with a real adapter in production
const emailService = new MockEmailAdapter();

/**
 * Sends a confirmation email when a ticket is first created.
 * Requirements: 12.6
 */
export async function sendTicketConfirmationEmail(
  ticket: MaintenanceTicket,
  userEmail: string,
  userName: string,
): Promise<void> {
  await emailService.sendEmail({
    to: userEmail,
    template: "ticket_update",
    data: {
      ticketId: ticket.id,
      userName,
      ticketTitle: ticket.title,
      category: ticket.category,
      priority: ticket.priority,
      status: ticket.status,
      createdAt: ticket.createdAt,
      type: "confirmation",
    },
  });
}

/**
 * Sends a status change notification when a ticket status is updated.
 * Requirements: 13.3, 28.3
 */
export async function sendTicketStatusEmail(
  ticket: MaintenanceTicket,
  userEmail: string,
  userName: string,
): Promise<void> {
  await emailService.sendEmail({
    to: userEmail,
    template: "ticket_update",
    data: {
      ticketId: ticket.id,
      userName,
      ticketTitle: ticket.title,
      category: ticket.category,
      priority: ticket.priority,
      status: ticket.status,
      updatedAt: ticket.updatedAt,
      resolution: ticket.resolution,
      type: "status_change",
    },
  });
}
