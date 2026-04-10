/**
 * Abstract payment service interface.
 * Implement this interface to swap payment providers (Stripe → PayPal, etc.)
 * without changing application code.
 *
 * NOTE: Payment processing applies only to Rent and Activity bookings.
 * Buy and Shop properties use the Inquiry flow instead.
 */

export interface PaymentIntent {
  id: string;
  clientSecret: string;
  amount: number; // in smallest currency unit (e.g. halalas for SAR)
  currency: string;
  status:
    | 'requires_payment_method'
    | 'requires_confirmation'
    | 'processing'
    | 'succeeded'
    | 'canceled';
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'bank_transfer';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
}

export interface PaymentResult {
  success: boolean;
  transactionId: string;
  status: 'succeeded' | 'failed' | 'processing';
  errorMessage?: string;
}

export interface RefundResult {
  success: boolean;
  refundId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'succeeded' | 'failed';
}

export interface IPaymentService {
  /**
   * Create a payment intent on the server side.
   * @param amount - Amount in smallest currency unit (e.g. halalas for SAR)
   * @param currency - ISO 4217 currency code (e.g. 'sar')
   */
  createPaymentIntent(amount: number, currency: string): Promise<PaymentIntent>;

  /**
   * Confirm a payment intent with a payment method.
   * @param paymentIntentId - The ID of the payment intent to confirm
   * @param paymentMethod - The payment method to use
   */
  confirmPayment(paymentIntentId: string, paymentMethod: PaymentMethod): Promise<PaymentResult>;

  /**
   * Refund a payment, optionally partially.
   * @param paymentIntentId - The ID of the original payment intent
   * @param amount - Amount to refund in smallest currency unit; omit for full refund
   */
  refundPayment(paymentIntentId: string, amount?: number): Promise<RefundResult>;
}
