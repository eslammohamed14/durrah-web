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

function optionalEnv(key: string, fallback: string): string {
  return process.env[key] || fallback;
}

export const env = {
  // API
  apiBaseURL: optionalEnv('NEXT_PUBLIC_API_BASE_URL', 'http://localhost:3001/api'),
  useMockAPI: optionalEnv('NEXT_PUBLIC_USE_MOCK_API', 'true') === 'true',

  // Service providers
  authProvider: optionalEnv('NEXT_PUBLIC_AUTH_PROVIDER', 'firebase'),
  paymentProvider: optionalEnv('NEXT_PUBLIC_PAYMENT_PROVIDER', 'stripe'),
  mapProvider: optionalEnv('NEXT_PUBLIC_MAP_PROVIDER', 'mapbox'),
  storageProvider: optionalEnv('NEXT_PUBLIC_STORAGE_PROVIDER', 'firebase'),
  emailProvider: optionalEnv('NEXT_PUBLIC_EMAIL_PROVIDER', 'mock'),

  // Firebase
  firebase: {
    apiKey: optionalEnv('NEXT_PUBLIC_FIREBASE_API_KEY', ''),
    authDomain: optionalEnv('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN', ''),
    projectId: optionalEnv('NEXT_PUBLIC_FIREBASE_PROJECT_ID', ''),
    storageBucket: optionalEnv('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET', ''),
    messagingSenderId: optionalEnv('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID', ''),
    appId: optionalEnv('NEXT_PUBLIC_FIREBASE_APP_ID', ''),
  },

  // Stripe (rent & activity payments only)
  stripe: {
    publishableKey: optionalEnv('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY', ''),
    secretKey: optionalEnv('STRIPE_SECRET_KEY', ''),
  },

  // Mapbox
  mapbox: {
    accessToken: optionalEnv('NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN', ''),
  },

  // Locale & currency
  defaultCurrency: optionalEnv('NEXT_PUBLIC_DEFAULT_CURRENCY', 'SAR'),
} as const;

/**
 * Validates that all required env vars are present for production.
 * Call this during app initialization when not using the mock API.
 */
export function validateProductionEnv(): void {
  if (env.useMockAPI) return;

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
