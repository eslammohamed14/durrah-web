/**
 * Abstract email service interface.
 * Implement to swap email providers without changing application code.
 * Requirements: 28.1, 28.2, 28.3, 28.4, 28.5
 */

export type EmailTemplate =
  | "booking_confirmation"
  | "booking_cancellation"
  | "booking_updated"
  | "inquiry_received"
  | "inquiry_confirmation"
  | "ticket_update"
  | "password_reset";

export interface SendEmailOptions {
  to: string;
  template: EmailTemplate;
  data: Record<string, unknown>;
}

export interface IEmailService {
  sendEmail(options: SendEmailOptions): Promise<{ success: boolean }>;
}
