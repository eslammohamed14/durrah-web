"use server";

/**
 * Server actions for the checkout flow.
 * createPaymentIntent must run server-side to keep the Stripe secret key off the client.
 */

import { env } from "@/config/env";

export interface CreatePaymentIntentResult {
  clientSecret: string;
  paymentIntentId: string;
  publishableKey: string;
}

/**
 * Creates a Stripe PaymentIntent server-side.
 * @param amountSAR - Total amount in SAR (whole riyals)
 */
export async function createPaymentIntent(
  amountSAR: number,
): Promise<CreatePaymentIntentResult> {
  // In mock/dev mode, return a fake client secret so the UI can render
  if (!env.stripe.secretKey) {
    return {
      clientSecret: `pi_mock_${Date.now()}_secret_mock`,
      paymentIntentId: `pi_mock_${Date.now()}`,
      publishableKey: env.stripe.publishableKey ?? "pk_test_mock",
    };
  }

  const { getPaymentService } = await import("@/config/services");
  const paymentService = await getPaymentService();

  // Stripe amounts are in the smallest currency unit — SAR uses halalas (×100)
  const amountHalalas = Math.round(amountSAR * 100);
  const intent = await paymentService.createPaymentIntent(amountHalalas, "sar");

  return {
    clientSecret: intent.clientSecret,
    paymentIntentId: intent.id,
    publishableKey: env.stripe.publishableKey,
  };
}
