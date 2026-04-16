"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/contexts/AuthContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { OTPInput } from "@/features/auth/OTPInput";

type RegMethod = "email" | "phone";
type PhoneStep = "enter_phone" | "enter_otp";

const PASSWORD_MIN_LENGTH = 8;
const OTP_RESEND_SECONDS = 60;

function validatePassword(pw: string): string | null {
  if (pw.length < PASSWORD_MIN_LENGTH)
    return `Password must be at least ${PASSWORD_MIN_LENGTH} characters`;
  if (!/[a-zA-Z]/.test(pw)) return "Password must contain letters";
  if (!/\d/.test(pw)) return "Password must contain numbers";
  return null;
}

export default function RegisterPage() {
  const { register, sendOTP, loginWithOTP } = useAuth();
  const router = useRouter();

  const [method, setMethod] = useState<RegMethod>("email");

  // Shared
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Email fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Phone fields
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneStep, setPhoneStep] = useState<PhoneStep>("enter_phone");
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(0);

  React.useEffect(() => {
    if (countdown <= 0) return;
    const id = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [countdown]);

  const clearError = () => setError("");

  // ── Email registration ──────────────────────────────────────────────────────

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setPasswordError("");

    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    const pwErr = validatePassword(password);
    if (pwErr) {
      setPasswordError(pwErr);
      return;
    }

    setLoading(true);
    try {
      await register({ name: name.trim(), email: email.trim(), password });
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  // ── Phone registration ──────────────────────────────────────────────────────

  const handleSendOTP = async () => {
    clearError();
    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    if (!phoneNumber.trim()) {
      setError("Phone number is required");
      return;
    }
    setLoading(true);
    try {
      await sendOTP(phoneNumber.trim());
      setPhoneStep("enter_otp");
      setCountdown(OTP_RESEND_SECONDS);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    clearError();
    if (otp.length < 6) {
      setError("Please enter the complete OTP");
      return;
    }
    setLoading(true);
    try {
      await loginWithOTP(phoneNumber.trim(), otp);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid OTP");
      setOtp("");
    } finally {
      setLoading(false);
    }
  };

  const switchMethod = (m: RegMethod) => {
    setMethod(m);
    setError("");
    setPasswordError("");
    setPhoneStep("enter_phone");
    setOtp("");
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      {/* Invisible recaptcha container required by Firebase phone auth */}
      <div id="recaptcha-container" />

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Create an account
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Join Durrah to start booking properties
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          {/* Method switcher */}
          <div
            role="tablist"
            className="flex rounded-lg border border-gray-200 mb-6 overflow-hidden"
          >
            {(["email", "phone"] as RegMethod[]).map((m) => (
              <button
                key={m}
                role="tab"
                aria-selected={method === m}
                onClick={() => switchMethod(m)}
                className={[
                  "flex-1 py-2.5 text-sm font-medium transition-colors",
                  method === m
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50",
                ].join(" ")}
              >
                {m === "email" ? "Email & Password" : "Phone Number"}
              </button>
            ))}
          </div>

          {error && (
            <div
              role="alert"
              className="mb-4 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          {/* Email registration */}
          {method === "email" && (
            <form
              onSubmit={handleEmailRegister}
              className="flex flex-col gap-4"
              noValidate
            >
              <Input
                label="Full name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
              />
              <Input
                label="Email address"
                type="email"
                inputMode="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
              <Input
                label="Password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                errorText={passwordError}
                helperText="Min 8 characters, must include letters and numbers"
              />
              <Button type="submit" loading={loading} className="w-full">
                Create account
              </Button>
            </form>
          )}

          {/* Phone registration */}
          {method === "phone" && (
            <div className="flex flex-col gap-4">
              {phoneStep === "enter_phone" ? (
                <>
                  <Input
                    label="Full name"
                    type="text"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={loading}
                  />
                  <Input
                    label="Phone number"
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
                    Send OTP
                  </Button>
                </>
              ) : (
                <div className="flex flex-col gap-4 items-center">
                  <p className="text-sm text-gray-600 text-center">
                    Enter the code sent to{" "}
                    <span className="font-medium">{phoneNumber}</span>
                  </p>
                  <OTPInput value={otp} onChange={setOtp} disabled={loading} />
                  <Button
                    onClick={handleVerifyOTP}
                    loading={loading}
                    className="w-full"
                  >
                    Verify & Create Account
                  </Button>
                  <button
                    type="button"
                    disabled={countdown > 0 || loading}
                    onClick={handleSendOTP}
                    className="text-sm text-blue-600 hover:underline disabled:text-gray-400"
                  >
                    {countdown > 0 ? `Resend in ${countdown}s` : "Resend OTP"}
                  </button>
                </div>
              )}
            </div>
          )}

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="text-blue-600 hover:underline font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
