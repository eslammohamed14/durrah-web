"use client";

/**
 * LoginForm — handles both phone/OTP and email/password sign-in.
 * Rendered inside the /auth/login page.
 */

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/contexts/AuthContext";
import { useLocale } from "@/lib/contexts/LocaleContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { OTPInput } from "./OTPInput";

type AuthTab = "phone" | "email";
type PhoneStep = "enter_phone" | "enter_otp";

const OTP_RESEND_SECONDS = 60;

export function LoginForm() {
  const { loginWithOTP, loginWithEmail, sendOTP } = useAuth();
  const { t } = useLocale();
  const router = useRouter();

  const [tab, setTab] = useState<AuthTab>("phone");

  // Phone/OTP state
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneStep, setPhoneStep] = useState<PhoneStep>("enter_phone");
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(0);

  // Email/password state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Shared state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Countdown timer for OTP resend
  useEffect(() => {
    if (countdown <= 0) return;
    const id = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [countdown]);

  const clearError = () => setError("");

  // ── Phone flow ──────────────────────────────────────────────────────────────

  const handleSendOTP = async () => {
    clearError();
    if (!phoneNumber.trim()) {
      setError(t("auth.phoneRequired"));
      return;
    }
    setLoading(true);
    try {
      await sendOTP(phoneNumber.trim());
      setPhoneStep("enter_otp");
      setCountdown(OTP_RESEND_SECONDS);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("auth.otpSendFailed"));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    clearError();
    if (otp.length < 6) {
      setError(t("auth.otpIncomplete"));
      return;
    }
    setLoading(true);
    try {
      await loginWithOTP(phoneNumber.trim(), otp);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : t("auth.otpInvalid"));
      setOtp("");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setOtp("");
    await handleSendOTP();
  };

  // ── Email flow ──────────────────────────────────────────────────────────────

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    if (!email.trim() || !password) {
      setError(t("auth.emailPasswordRequired"));
      return;
    }
    setLoading(true);
    try {
      await loginWithEmail(email.trim(), password);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : t("auth.loginFailed"));
    } finally {
      setLoading(false);
    }
  };

  // ── Tab switch ──────────────────────────────────────────────────────────────

  const switchTab = (next: AuthTab) => {
    setTab(next);
    setError("");
    setPhoneStep("enter_phone");
    setOtp("");
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Invisible recaptcha container required by Firebase phone auth */}
      <div id="recaptcha-container" />

      {/* Tab switcher */}
      <div
        role="tablist"
        className="flex rounded-lg border border-gray-200 mb-6 overflow-hidden"
      >
        {(["phone", "email"] as AuthTab[]).map((t_) => (
          <button
            key={t_}
            role="tab"
            aria-selected={tab === t_}
            onClick={() => switchTab(t_)}
            className={[
              "flex-1 py-2.5 text-sm font-medium transition-colors",
              tab === t_
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-50",
            ].join(" ")}
          >
            {t_ === "phone" ? t("auth.phoneOTP") : t("auth.emailPassword")}
          </button>
        ))}
      </div>

      {/* Error banner */}
      {error && (
        <div
          role="alert"
          className="mb-4 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {/* Phone / OTP panel */}
      {tab === "phone" && (
        <div role="tabpanel">
          {phoneStep === "enter_phone" ? (
            <div className="flex flex-col gap-4">
              <Input
                label={t("auth.phoneNumber")}
                type="tel"
                inputMode="tel"
                placeholder="+966 5X XXX XXXX"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                disabled={loading}
                dir="ltr"
              />
              <Button
                onClick={handleSendOTP}
                loading={loading}
                className="w-full"
              >
                {t("auth.sendOTP")}
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-4 items-center">
              <p className="text-sm text-gray-600 text-center">
                {t("auth.otpSentTo")}{" "}
                <span className="font-medium">{phoneNumber}</span>
              </p>
              <OTPInput
                value={otp}
                onChange={setOtp}
                disabled={loading}
                aria-label={t("auth.otpLabel")}
              />
              <Button
                onClick={handleVerifyOTP}
                loading={loading}
                className="w-full"
              >
                {t("auth.verify")}
              </Button>
              <button
                type="button"
                disabled={countdown > 0 || loading}
                onClick={handleResendOTP}
                className="text-sm text-blue-600 hover:underline disabled:text-gray-400 disabled:no-underline"
              >
                {countdown > 0
                  ? `${t("auth.resendIn")} ${countdown}s`
                  : t("auth.resendOTP")}
              </button>
              <button
                type="button"
                onClick={() => {
                  setPhoneStep("enter_phone");
                  setOtp("");
                  clearError();
                }}
                className="text-sm text-gray-500 hover:underline"
              >
                {t("auth.changePhone")}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Email / password panel */}
      {tab === "email" && (
        <form
          role="tabpanel"
          onSubmit={handleEmailLogin}
          className="flex flex-col gap-4"
          noValidate
        >
          <Input
            label={t("auth.email")}
            type="email"
            inputMode="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
          <Input
            label={t("auth.password")}
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
          <div className="flex justify-end">
            <Link
              href="/auth/reset-password"
              className="text-sm text-blue-600 hover:underline"
            >
              {t("auth.forgotPassword")}
            </Link>
          </div>
          <Button type="submit" loading={loading} className="w-full">
            {t("auth.signIn")}
          </Button>
        </form>
      )}

      {/* Register link */}
      <p className="mt-6 text-center text-sm text-gray-600">
        {t("auth.noAccount")}{" "}
        <Link
          href="/auth/register"
          className="text-blue-600 hover:underline font-medium"
        >
          {t("auth.register")}
        </Link>
      </p>
    </div>
  );
}
