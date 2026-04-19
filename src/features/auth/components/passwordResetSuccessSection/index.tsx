"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { VerifyIcon } from "@/assets/icons";
import images from "@/constant/images";
import { useBackToLoginFromPasswordResetFlow } from "../../hooks/useBackToLoginFromPasswordResetFlow";

/** Password reset success — Figma `807:5499` “New Password Reset Successfully”. */
export default function PasswordResetSuccessSection() {
  const t = useTranslations("auth.passwordResetSuccessPage");
  const tAuth = useTranslations("auth");
  const backToLogin = useBackToLoginFromPasswordResetFlow();

  return (
    <section className="flex w-full flex-col items-center">
      <Image
        src={images.durrahLogoBlue}
        alt={tAuth("layout.logoAlt")}
        width={177}
        height={57}
        priority
        className="h-auto w-[177px] max-w-full"
      />

      <div className="mt-16 flex w-full flex-col items-center gap-6">
        <div className="flex w-full flex-col items-center gap-4 text-center">
          <div
            className="flex size-[75px] shrink-0 items-center justify-center rounded-full border border-primary-coral-50 bg-white p-2.5"
            aria-hidden
          >
            <VerifyIcon size={32} />
          </div>
          <h1 className="w-full text-[40px] font-semibold capitalize leading-normal tracking-tight text-durrah-blue">
            {t("title")}
          </h1>
          <p className="w-full max-w-md text-lg font-normal leading-relaxed text-grey-500">
            {t("message")}
          </p>
        </div>

        <button
          type="button"
          onClick={backToLogin}
          className="inline-flex h-12 w-full items-center justify-center rounded-lg bg-primary-coral-400 text-base font-medium capitalize text-white transition-opacity hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-coral-400 focus-visible:ring-offset-2"
        >
          {t("backToLogin")}
        </button>
      </div>
    </section>
  );
}
