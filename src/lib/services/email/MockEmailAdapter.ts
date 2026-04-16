/**
 * Mock email adapter — logs to console during development.
 * Swap with a real provider adapter in production.
 */

import type { IEmailService, SendEmailOptions } from "./IEmailService";
import { delay } from "@/lib/api/client";

export class MockEmailAdapter implements IEmailService {
  async sendEmail({
    to,
    template,
    data,
  }: SendEmailOptions): Promise<{ success: boolean }> {
    await delay(100);
    if (process.env.NODE_ENV !== "production") {
      console.log(`[MockEmail] → ${template} to ${to}`, data);
    }
    return { success: true };
  }
}
