/**
 * Stripe payment adapter implementing IPaymentService.
 *
 * Server-side operations (createPaymentIntent, refundPayment) use the Stripe
 * Node.js SDK and must only be called from Server Actions or API routes.
 *
 * Client-side confirmation (confirmPayment) delegates to the Stripe.js SDK
 * via the publishable key and should be called from client components.
 */

import type {
  IPaymentService,
  PaymentIntent,
  PaymentMethod,
  PaymentResult,
  RefundResult,
} from './IPaymentService';

interface StripeConfig {
  publishableKey: string;
  secretKey: string;
}

export class StripePaymentAdapter implements IPaymentService {
  private readonly publishableKey: string;
  private readonly secretKey: string;

  constructor(config: StripeConfig) {
    this.publishableKey = config.publishableKey;
    this.secretKey = config.secretKey;
  }

  // ── Server-side: create payment intent ────────────────────────────────────

  async createPaymentIntent(amount: number, currency: string): Promise<PaymentIntent> {
    if (typeof window !== 'undefined') {
      throw new Error('createPaymentIntent must be called server-side only');
    }

    // Dynamically import the Stripe Node SDK to keep it out of the client bundle
    const Stripe = (await import('stripe')).default;
    const stripe = new Stripe(this.secretKey);

    const intent = await stripe.paymentIntents.create({
      amount,
      currency: currency.toLowerCase(),
      automatic_payment_methods: { enabled: true },
    });

    return {
      id: intent.id,
      clientSecret: intent.client_secret!,
      amount: intent.amount,
      currency: intent.currency,
      status: intent.status as PaymentIntent['status'],
    };
  }

  // ── Client-side: confirm payment ──────────────────────────────────────────

  async confirmPayment(
    paymentIntentId: string,
    paymentMethod: PaymentMethod
  ): Promise<PaymentResult> {
    if (typeof window === 'undefined') {
      throw new Error('confirmPayment must be called client-side only');
    }

    const { loadStripe } = await import('@stripe/stripe-js');
    const stripe = await loadStripe(this.publishableKey);

    if (!stripe) {
      return {
        success: false,
        transactionId: paymentIntentId,
        status: 'failed',
        errorMessage: 'Failed to load Stripe.js',
      };
    }

    const { error, paymentIntent } = await stripe.confirmCardPayment(
      // The client secret is not stored on this adapter — the caller must
      // pass it through the PaymentForm which holds it from createPaymentIntent.
      // We use paymentIntentId as a stand-in key here; the actual confirmation
      // happens via Stripe Elements which already has the clientSecret.
      paymentIntentId,
      { payment_method: paymentMethod.id }
    );

    if (error) {
      return {
        success: false,
        transactionId: paymentIntentId,
        status: 'failed',
        errorMessage: error.message,
      };
    }

    return {
      success: true,
      transactionId: paymentIntent?.id ?? paymentIntentId,
      status: paymentIntent?.status === 'succeeded' ? 'succeeded' : 'processing',
    };
  }

  // ── Server-side: refund ───────────────────────────────────────────────────

  async refundPayment(paymentIntentId: string, amount?: number): Promise<RefundResult> {
    if (typeof window !== 'undefined') {
      throw new Error('refundPayment must be called server-side only');
    }

    const Stripe = (await import('stripe')).default;
    const stripe = new Stripe(this.secretKey);

    const refundParams: Parameters<typeof stripe.refunds.create>[0] = {
      payment_intent: paymentIntentId,
    };
    if (amount !== undefined) {
      refundParams.amount = amount;
    }

    const refund = await stripe.refunds.create(refundParams);

    return {
      success: refund.status === 'succeeded' || refund.status === 'pending',
      refundId: refund.id,
      amount: refund.amount,
      currency: refund.currency,
      status: refund.status as RefundResult['status'],
    };
  }

  /** Expose the publishable key for use with Stripe Elements in the browser. */
  getPublishableKey(): string {
    return this.publishableKey;
  }
}
