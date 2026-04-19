"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowLeftIcon } from "@/assets/icons";
import images from "@/constant/images";
import { Button } from "@/components/ui/Button";
import { Link } from "@/lib/navigation";

const OTP_LEN = 4;
const RESEND_SECONDS = 30;

export type VerifyEmailFormSectionProps = {
  /** Shown in the instruction line; falls back to a neutral placeholder. */
  email?: string;
};

/** Verify-email flow — layout and tokens from Figma `807:5307` “Verify Your Email”. */
export default function VerifyEmailFormSection({
  email: emailProp,
}: VerifyEmailFormSectionProps) {
  const t = useTranslations("auth.verifyEmailPage");
  const tAuth = useTranslations("auth");
  const [digits, setDigits] = useState<string[]>(() =>
    Array.from({ length: OTP_LEN }, () => ""),
  );
  const [resendSeconds, setResendSeconds] = useState(RESEND_SECONDS);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const displayEmail =
    emailProp?.trim() ||
    t("placeholderEmail");

  const code = digits.join("");
  const isComplete = code.length === OTP_LEN;

  useEffect(() => {
    const id = window.setInterval(() => {
      setResendSeconds((s) => (s <= 0 ? 0 : s - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  const setDigitAt = useCallback((index: number, raw: string) => {
    const ch = raw.replace(/\D/g, "").slice(-1);
    setDigits((prev) => {
      const next = [...prev];
      next[index] = ch;
      return next;
    });
    if (ch && index < OTP_LEN - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }, []);

  const onKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key !== "Backspace") return;
      if (digits[index]) return;
      if (index > 0) {
        e.preventDefault();
        inputRefs.current[index - 1]?.focus();
      }
    },
    [digits],
  );

  const onPaste = useCallback((e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LEN);
    if (!text) return;
    const next = Array.from({ length: OTP_LEN }, (_, i) => text[i] ?? "");
    setDigits(next);
    const focusIndex = Math.min(text.length, OTP_LEN - 1);
    inputRefs.current[focusIndex]?.focus();
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isComplete) return;
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 500));
    setIsSubmitting(false);
  };

  const canResend = resendSeconds === 0;

  return (
    <section className="w-full">
      <Image
        src={images.durrahLogoBlue}
        alt={tAuth("layout.logoAlt")}
        width={177}
        height={57}
        priority
        className="h-auto w-[177px] max-w-full"
      />

      <div className="mt-4 space-y-1">
        <h1 className="text-[32px] font-medium capitalize leading-[1.4] tracking-tight text-durrah-blue">
          {t("title")}
        </h1>
        <p className="text-base font-normal leading-relaxed text-grey-500">
          {t("description", { email: displayEmail })}
        </p>
      </div>

      <form className="mt-8 space-y-6" onSubmit={onSubmit} noValidate>
        <div className="flex w-full justify-center gap-4">
          {digits.map((d, i) => (
            <div key={i} className="size-[86px] shrink-0">
              <input
                ref={(el) => {
                  inputRefs.current[i] = el;
                }}
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={1}
                value={d}
                placeholder="-"
                aria-label={t("digitAriaLabel", { n: i + 1 })}
                onChange={(e) => setDigitAt(i, e.target.value)}
                onKeyDown={(e) => onKeyDown(i, e)}
                onPaste={i === 0 ? onPaste : undefined}
                className="size-full rounded-lg border border-grey-100 bg-white text-center text-base text-[#101828] placeholder:text-grey-200 focus:border-grey-100 focus:outline-none focus:ring-0 focus-visible:outline-none"
              />
            </div>
          ))}
        </div>

        <p className="text-center text-xs leading-normal text-grey-400">
          <span>{t("resendPrefix")}</span>{" "}
          {canResend ? (
            <button
              type="button"
              className="font-bold text-durrah-coral hover:underline"
              onClick={() => setResendSeconds(RESEND_SECONDS)}
            >
              {t("resendCta")}
            </button>
          ) : (
            <span className="font-bold text-grey-600">
              {t("resendCountdown", { seconds: resendSeconds })}
            </span>
          )}
        </p>

        <div className="space-y-4">
          <Button
            type="submit"
            loading={isSubmitting}
            disabled={!isComplete || isSubmitting}
            variant="primary"
            backgroundColor={isComplete ? "#ff765e" : "#d9d9d9"}
            style={{
              color: isComplete ? "#ffffff" : "#a6a6a6",
            }}
            className={[
              "h-12 w-full rounded-lg border-0 text-base font-medium",
              isComplete
                ? "hover:opacity-95 focus-visible:ring-primary-coral-400"
                : "cursor-not-allowed hover:opacity-100",
            ].join(" ")}
          >
            {t("verifyCode")}
          </Button>

          <Link
            href="/auth/login"
            className="flex h-12 w-full flex-row items-center justify-center gap-2.5 rounded-lg text-base font-medium text-grey-700 hover:bg-grey-50 rtl:flex-row-reverse"
          >
            <ArrowLeftIcon size={24} className="shrink-0 text-grey-700" />
            <span className="capitalize">{t("backToLogin")}</span>
          </Link>
        </div>
      </form>
    </section>
  );
}
