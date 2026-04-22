"use server";

import { env } from "@/config/env";

export interface CreatePaymentIntentResult {
  clientSecret: string;
  paymentIntentId: string;
  publishableKey: string;
}

export async function createPaymentIntent(
  amountSAR: number,
): Promise<CreatePaymentIntentResult> {
  if (!env.stripe.secretKey) {
    return {
      clientSecret: `pi_mock_${Date.now()}_secret_mock`,
      paymentIntentId: `pi_mock_${Date.now()}`,
      publishableKey: env.stripe.publishableKey ?? "pk_test_mock",
    };
  }

  const { getPaymentService } = await import("@/config/services");
  const paymentService = await getPaymentService();
  const amountHalalas = Math.round(amountSAR * 100);
  const intent = await paymentService.createPaymentIntent(amountHalalas, "sar");

  return {
    clientSecret: intent.clientSecret,
    paymentIntentId: intent.id,
    publishableKey: env.stripe.publishableKey,
  };
}
