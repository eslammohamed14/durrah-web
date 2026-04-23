const FALLBACK_API_BASE_URL = "http://localhost:3001";

if (
  process.env.NODE_ENV === "production" &&
  !process.env.NEXT_PUBLIC_API_BASE_URL
) {
  throw new Error(
    "NEXT_PUBLIC_API_BASE_URL must be set in production. " +
      "Add it to your .env.production or hosting environment."
  );
}

export const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? FALLBACK_API_BASE_URL,
  timeout: 15_000,
  headers: {
    "Content-Type": "application/json",
  },
} as const;
