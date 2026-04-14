/**
 * Environment variable validation and typed access.
 * All env vars are validated at module load time to catch misconfigurations early.
 */

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

function isEnvTrue(value: string | undefined): boolean {
  return value === "true" || value === "1";
}

const apiBaseURL = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").trim();

export const env = {
  // API
  apiBaseURL,
  /** Explicit opt-in: NEXT_PUBLIC_USE_MOCK_API=true */
  useMockAPI: isEnvTrue(process.env.NEXT_PUBLIC_USE_MOCK_API),

  // Service providers (default auth: mock when unset — no Firebase required for local dev)
  authProvider: (process.env.NEXT_PUBLIC_AUTH_PROVIDER ?? "").trim() || "mock",
  paymentProvider: process.env.NEXT_PUBLIC_PAYMENT_PROVIDER as string,
  mapProvider: process.env.NEXT_PUBLIC_MAP_PROVIDER as string,
  storageProvider: process.env.NEXT_PUBLIC_STORAGE_PROVIDER as string,
  emailProvider: process.env.NEXT_PUBLIC_EMAIL_PROVIDER as string,

  // Firebase
  firebase: {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY as string,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN as string,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID as string,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET as string,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID as string,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID as string,
  },

  // Stripe (rent & activity payments only)
  stripe: {
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string,
    secretKey: process.env.STRIPE_SECRET_KEY as string,
  },

  // Mapbox
  mapbox: {
    accessToken: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN as string,
  },

  // Locale & currency
  defaultCurrency: process.env.NEXT_PUBLIC_DEFAULT_CURRENCY as string,
} as const;

/**
 * Use the in-process mock API when explicitly enabled, or when no backend base URL is set
 * (local dev without a separate API server).
 */
export function usesMockApi(): boolean {
  return env.useMockAPI || env.apiBaseURL === "";
}

/**
 * Validates that all required env vars are present for production.
 * Call this during app initialization when not using the mock API.
 */
export function validateProductionEnv(): void {
  if (usesMockApi()) return;

  const required: string[] = [
    'NEXT_PUBLIC_API_BASE_URL',
  ];

  if (env.authProvider === 'firebase') {
    required.push(
      'NEXT_PUBLIC_FIREBASE_API_KEY',
      'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
      'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    );
  }

  if (env.paymentProvider === 'stripe') {
    required.push('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY');
  }

  if (env.mapProvider === 'mapbox') {
    required.push('NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN');
  }

  for (const key of required) {
    requireEnv(key);
  }
}
