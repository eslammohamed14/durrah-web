"use client";

import { useCallback } from "react";
import { useRouter } from "@/navigation";

const SESSION_KEY = "durrah:password-reset-from-login";

/** Call when the user opens forgot-password from the login screen. */
export function markPasswordResetFlowStartedFromLogin() {
  try {
    sessionStorage.setItem(SESSION_KEY, "1");
  } catch {
    // quota / private mode
  }
}

/**
 * Returns to login without a duplicate `/auth/login` history entry when the
 * flow was started from login (`markPasswordResetFlowStartedFromLogin`).
 * Otherwise uses `replace` (e.g. deep-linked reset pages).
 */
export function useBackToLoginFromPasswordResetFlow() {
  const router = useRouter();

  return useCallback(() => {
    let fromLogin = false;
    try {
      fromLogin = sessionStorage.getItem(SESSION_KEY) === "1";
      if (fromLogin) {
        sessionStorage.removeItem(SESSION_KEY);
      }
    } catch {
      try {
        sessionStorage.removeItem(SESSION_KEY);
      } catch {
        // ignore
      }
    }

    if (fromLogin) {
      router.back();
      return;
    }

    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch {
      // ignore
    }
    router.replace("/auth/login");
  }, [router]);
}
