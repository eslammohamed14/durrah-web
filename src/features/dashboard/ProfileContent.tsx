"use client";

/**
 * ProfileContent — allows user to update name, email, phone,
 * language preference, and notification preferences.
 * Requirements: 9.2
 */

import React, { useState, useEffect, useCallback } from "react";
import type { NotificationPreferences } from "@/lib/types";
import { useAuth } from "@/lib/contexts/AuthContext";
import { useLocale } from "@/lib/contexts/LocaleContext";
import { getAPIClient } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Spinner } from "@/components/ui/Spinner";

interface ProfileContentProps {
  locale?: string;
  onLocaleChange?: (locale: "en" | "ar") => void;
}

type SaveState = "idle" | "saving" | "saved" | "error";

export function ProfileContent({
  locale = "en",
  onLocaleChange,
}: ProfileContentProps) {
  const { user } = useAuth();
  const { t } = useLocale();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [preferredLocale, setPreferredLocale] = useState<"en" | "ar">(
    locale as "en" | "ar",
  );
  const [notifications, setNotifications] = useState<NotificationPreferences>({
    email: true,
    inApp: true,
    bookingUpdates: true,
    maintenanceUpdates: true,
    reviewAlerts: false,
    systemAlerts: true,
  });

  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    email?: string;
  }>({});

  // Populate form from user
  useEffect(() => {
    if (!user) return;
    setName(user.name ?? "");
    setEmail(user.email ?? "");
    setPhone(user.phoneNumber ?? "");
    setPreferredLocale(user.preferences.language);
    setNotifications(user.preferences.notifications);
  }, [user]);

  const validate = useCallback((): boolean => {
    const errs: typeof fieldErrors = {};
    if (!name.trim()) {
      errs.name = t("dashboard.profile.nameRequired");
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = t("dashboard.profile.invalidEmail");
    }
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  }, [name, email, t]);

  const handleSave = useCallback(async () => {
    if (!user) return;
    if (!validate()) return;

    setSaveState("saving");
    setErrorMsg("");
    try {
      const api = getAPIClient();
      await api.updateUserProfile(user.id, {
        name: name.trim(),
        email: email.trim() || undefined,
        phoneNumber: phone.trim() || undefined,
        preferences: {
          language: preferredLocale,
          notifications,
        },
      });

      // Switch locale if changed
      if (preferredLocale !== locale && onLocaleChange) {
        onLocaleChange(preferredLocale);
      }

      setSaveState("saved");
      setTimeout(() => setSaveState("idle"), 3000);
    } catch (err) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : t("dashboard.profile.saveFailed"),
      );
      setSaveState("error");
    }
  }, [
    user,
    name,
    email,
    phone,
    preferredLocale,
    notifications,
    locale,
    onLocaleChange,
    validate,
    t,
  ]);

  if (!user) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  const isSaving = saveState === "saving";

  const notificationRows: [keyof NotificationPreferences, string][] = [
    ["email", t("dashboard.profile.emailNotifications")],
    ["inApp", t("dashboard.profile.inAppNotifications")],
    ["bookingUpdates", t("dashboard.profile.bookingUpdates")],
    ["maintenanceUpdates", t("dashboard.profile.maintenanceUpdates")],
    ["reviewAlerts", t("dashboard.profile.reviewAlerts")],
    ["systemAlerts", t("dashboard.profile.systemAlerts")],
  ];

  return (
    <div className="max-w-xl space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          {t("dashboard.profile.title")}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          {t("dashboard.profile.subtitle")}
        </p>
      </div>

      {/* Personal info */}
      <section className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
        <h3 className="font-semibold text-gray-900 text-sm">
          {t("dashboard.profile.personalInfo")}
        </h3>

        <Input
          label={t("auth.name")}
          type="text"
          autoComplete="name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setFieldErrors((p) => ({ ...p, name: "" }));
          }}
          errorText={fieldErrors.name}
          validationState={fieldErrors.name ? "error" : "default"}
          required
        />

        <Input
          label={t("auth.email")}
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setFieldErrors((p) => ({ ...p, email: "" }));
          }}
          errorText={fieldErrors.email}
          validationState={fieldErrors.email ? "error" : "default"}
        />

        <Input
          label={t("auth.phoneNumber")}
          type="tel"
          autoComplete="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </section>

      {/* Language preference */}
      <section className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
        <h3 className="font-semibold text-gray-900 text-sm">
          {t("dashboard.profile.languagePreference")}
        </h3>
        <div className="flex gap-3">
          {(["en", "ar"] as const).map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => setPreferredLocale(lang)}
              className={[
                "flex-1 rounded-lg border-2 py-3 text-sm font-medium transition-colors",
                preferredLocale === lang
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-200 text-gray-600 hover:border-gray-300",
              ].join(" ")}
            >
              {lang === "en"
                ? t("dashboard.profile.langEnglish")
                : t("dashboard.profile.langArabic")}
            </button>
          ))}
        </div>
      </section>

      {/* Notification preferences */}
      <section className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
        <h3 className="font-semibold text-gray-900 text-sm">
          {t("dashboard.profile.notificationPreferences")}
        </h3>
        <div className="space-y-3">
          {notificationRows.map(([key, label]) => (
            <label
              key={key}
              className="flex cursor-pointer items-center justify-between gap-4"
            >
              <span className="text-sm text-gray-700">{label}</span>
              {/* Toggle */}
              <button
                type="button"
                role="switch"
                aria-checked={notifications[key]}
                onClick={() =>
                  setNotifications((prev) => ({ ...prev, [key]: !prev[key] }))
                }
                className={[
                  "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                  notifications[key] ? "bg-blue-600" : "bg-gray-200",
                ].join(" ")}
              >
                <span
                  className={[
                    "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                    notifications[key] ? "translate-x-5" : "translate-x-0",
                  ].join(" ")}
                />
              </button>
            </label>
          ))}
        </div>
      </section>

      {/* Save */}
      {errorMsg && (
        <p role="alert" className="text-sm text-red-600">
          {errorMsg}
        </p>
      )}

      <div className="flex items-center gap-3">
        <Button
          variant="primary"
          size="md"
          loading={isSaving}
          disabled={isSaving}
          onClick={handleSave}
        >
          {isSaving
            ? t("dashboard.profile.saving")
            : t("dashboard.profile.saveChanges")}
        </Button>
        {saveState === "saved" && (
          <p className="text-sm text-green-600">
            {t("dashboard.profile.savedSuccess")}
          </p>
        )}
      </div>
    </div>
  );
}
