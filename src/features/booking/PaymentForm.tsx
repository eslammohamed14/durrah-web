'use client';

/**
 * PaymentForm component — wraps Stripe Elements for secure card input.
 *
 * Usage:
 *   1. Parent creates a PaymentIntent server-side and passes `clientSecret`.
 *   2. This component renders the Stripe CardElement and handles confirmation.
 *   3. On success, `onSuccess` is called with the Stripe PaymentIntent ID.
 *
 * Security: card data never touches our servers — it goes directly to Stripe.
 * We store only the last 4 digits returned by Stripe after confirmation.
 */

import React, { useState, useCallback } from 'react';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { loadStripe, type Stripe as StripeInstance } from '@stripe/stripe-js';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';

// ── Stripe singleton ──────────────────────────────────────────────────────────

let stripePromise: ReturnType<typeof loadStripe> | null = null;

function getStripe(publishableKey: string): ReturnType<typeof loadStripe> {
  if (!stripePromise) {
    stripePromise = loadStripe(publishableKey);
  }
  return stripePromise;
}

// ── Types ─────────────────────────────────────────────────────────────────────

export interface PaymentFormProps {
  /** Stripe publishable key — passed from server config */
  publishableKey: string;
  /** Client secret from a server-created PaymentIntent */
  clientSecret: string;
  /** Total amount in display format (e.g. "1,250 SAR") — shown to user */
  displayAmount: string;
  /** Called when payment succeeds with the Stripe PaymentIntent ID */
  onSuccess: (transactionId: string) => void;
  /** Called when payment fails with a user-friendly error message */
  onError?: (message: string) => void;
  /** Disable the form (e.g. while parent is processing) */
  disabled?: boolean;
}

// ── Inner form (must be inside <Elements>) ────────────────────────────────────

interface InnerFormProps {
  clientSecret: string;
  displayAmount: string;
  onSuccess: (transactionId: string) => void;
  onError?: (message: string) => void;
  disabled?: boolean;
}

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '16px',
      color: '#374151', // gray-700
      fontFamily: 'inherit',
      '::placeholder': { color: '#9ca3af' }, // gray-400
    },
    invalid: {
      color: '#ef4444', // red-500
      iconColor: '#ef4444',
    },
  },
  hidePostalCode: false,
};

function InnerPaymentForm({
  clientSecret,
  displayAmount,
  onSuccess,
  onError,
  disabled = false,
}: InnerFormProps) {
  const stripe = useStripe();
  const elements = useElements();

  const [cardError, setCardError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const isDisabled = disabled || processing || !stripe || !elements;

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!stripe || !elements) return;

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) return;

      setProcessing(true);
      setCardError(null);

      try {
        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
          payment_method: { card: cardElement },
        });

        if (error) {
          const msg = error.message ?? 'Payment failed. Please try again.';
          setCardError(msg);
          onError?.(msg);
          setRetryCount((c) => c + 1);
        } else if (paymentIntent?.status === 'succeeded') {
          onSuccess(paymentIntent.id);
        } else {
          const msg = 'Payment is processing. You will be notified once confirmed.';
          setCardError(msg);
          onError?.(msg);
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'An unexpected error occurred.';
        setCardError(msg);
        onError?.(msg);
        setRetryCount((c) => c + 1);
      } finally {
        setProcessing(false);
      }
    },
    [stripe, elements, clientSecret, onSuccess, onError]
  );

  const handleRetry = useCallback(() => {
    setCardError(null);
    elements?.getElement(CardElement)?.clear();
  }, [elements]);

  return (
    <form onSubmit={handleSubmit} noValidate aria-label="Payment form">
      {/* Card input */}
      <div className="mb-4">
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          Card details
        </label>
        <div
          className={[
            'rounded-md border px-3 py-3 shadow-sm transition-colors',
            cardError
              ? 'border-red-500 focus-within:ring-2 focus-within:ring-red-500'
              : 'border-gray-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500',
          ].join(' ')}
        >
          <CardElement options={CARD_ELEMENT_OPTIONS} />
        </div>

        {cardError && (
          <p role="alert" className="mt-1.5 text-xs text-red-500">
            {cardError}
          </p>
        )}
      </div>

      {/* Security note */}
      <p className="mb-4 flex items-center gap-1.5 text-xs text-gray-500">
        <LockIcon />
        Your payment is secured by Stripe. We never store your full card number.
      </p>

      {/* Actions */}
      <div className="flex flex-col gap-2">
        {cardError && retryCount > 0 ? (
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="md"
              className="flex-1"
              onClick={handleRetry}
              disabled={processing}
            >
              Try again
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              className="flex-1"
              disabled={isDisabled}
              loading={processing}
            >
              {processing ? 'Processing…' : `Pay ${displayAmount}`}
            </Button>
          </div>
        ) : (
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={isDisabled}
            loading={processing}
          >
            {processing ? 'Processing…' : `Pay ${displayAmount}`}
          </Button>
        )}
      </div>
    </form>
  );
}

// ── Public component (wraps Elements provider) ────────────────────────────────

export function PaymentForm({
  publishableKey,
  clientSecret,
  displayAmount,
  onSuccess,
  onError,
  disabled,
}: PaymentFormProps) {
  const stripe = getStripe(publishableKey);

  return (
    <Elements stripe={stripe} options={{ clientSecret }}>
      <InnerPaymentForm
        clientSecret={clientSecret}
        displayAmount={displayAmount}
        onSuccess={onSuccess}
        onError={onError}
        disabled={disabled}
      />
    </Elements>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function LockIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="h-3.5 w-3.5 shrink-0"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z"
        clipRule="evenodd"
      />
    </svg>
  );
}
