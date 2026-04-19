"use client";

import Image from "next/image";
import { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { ArrowLeftIcon, EyeSlashIcon } from "@/assets/icons";
import images from "@/constant/images";
import { Button } from "@/components/ui/Button";
import { useRouter } from "@/lib/navigation";
import { useBackToLoginFromPasswordResetFlow } from "../../hooks/useBackToLoginFromPasswordResetFlow";
import {
  createNewPasswordSchema,
  type CreateNewPasswordFormValues,
} from "../../utils/validations";

/** Create new password — Figma `807:5437` “Create New Password”. */
export default function CreateNewPasswordFormSection() {
  const t = useTranslations("auth.createNewPasswordPage");
  const tAuth = useTranslations("auth");
  const router = useRouter();
  const backToLogin = useBackToLoginFromPasswordResetFlow();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<CreateNewPasswordFormValues>({
    resolver: yupResolver(createNewPasswordSchema),
    mode: "onChange",
    defaultValues: { password: "", confirmPassword: "" },
  });

  const canSubmit = isValid;

  const onSubmit = async () => {
    await new Promise((r) => setTimeout(r, 400));
    router.replace("/auth/password-reset-success");
  };

  return (
    <section className="flex w-full flex-col gap-8">
      <div className="space-y-4">
        <Image
          src={images.durrahLogoBlue}
          alt={tAuth("layout.logoAlt")}
          width={177}
          height={57}
          priority
          className="h-auto w-[177px] max-w-full"
        />

        <div className="space-y-1">
          <h1 className="text-[32px] font-medium capitalize leading-[1.4] tracking-tight text-durrah-blue">
            {t("title")}
          </h1>
          <p className="text-base font-normal leading-relaxed text-grey-500">
            {t("subtitle")}
          </p>
        </div>
      </div>

      <form
        className="flex flex-col gap-6"
        noValidate
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="space-y-4">
          <div className="space-y-1">
            <label
              htmlFor="create-password"
              className="block text-sm font-medium leading-normal text-grey-700"
            >
              {t("passwordLabel")}
              <span className="text-danger" aria-hidden>
                {" "}
                *
              </span>
            </label>
            <div className="relative">
              <input
                id="create-password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder={t("passwordPlaceholder")}
                aria-invalid={errors.password ? "true" : undefined}
                className={[
                  "block h-12 w-full rounded-lg border bg-white px-3 pe-10 text-base text-[#101828]",
                  "placeholder:text-grey-200 focus:outline-none focus:ring-0 focus-visible:outline-none",
                  errors.password
                    ? "border-red-500 focus:border-red-500"
                    : "border-grey-100 focus:border-grey-100",
                ].join(" ")}
                {...register("password")}
              />
              <button
                type="button"
                tabIndex={-1}
                className="absolute end-3 top-1/2 -translate-y-1/2 text-grey-500 hover:text-grey-700"
                aria-pressed={showPassword}
                aria-label={t("togglePasswordVisibility")}
                onClick={() => setShowPassword((v) => !v)}
              >
                <EyeSlashIcon className="pointer-events-none" />
              </button>
            </div>
            {errors.password ? (
              <p className="text-xs text-red-500" role="alert">
                {tAuth(errors.password.message as string)}
              </p>
            ) : null}
          </div>

          <div className="space-y-1">
            <label
              htmlFor="create-password-confirm"
              className="block text-sm font-medium leading-normal text-grey-700"
            >
              {t("confirmPasswordLabel")}
              <span className="text-grey-700" aria-hidden>
                {" "}
                *
              </span>
            </label>
            <div className="relative">
              <input
                id="create-password-confirm"
                type={showConfirm ? "text" : "password"}
                autoComplete="new-password"
                placeholder={t("confirmPasswordPlaceholder")}
                aria-invalid={errors.confirmPassword ? "true" : undefined}
                className={[
                  "block h-12 w-full rounded-lg border bg-white px-3 pe-10 text-base text-[#101828]",
                  "placeholder:text-grey-200 focus:outline-none focus:ring-0 focus-visible:outline-none",
                  errors.confirmPassword
                    ? "border-red-500 focus:border-red-500"
                    : "border-grey-100 focus:border-grey-100",
                ].join(" ")}
                {...register("confirmPassword")}
              />
              <button
                type="button"
                tabIndex={-1}
                className="absolute end-3 top-1/2 -translate-y-1/2 text-grey-500 hover:text-grey-700"
                aria-pressed={showConfirm}
                aria-label={t("toggleConfirmPasswordVisibility")}
                onClick={() => setShowConfirm((v) => !v)}
              >
                <EyeSlashIcon className="pointer-events-none" />
              </button>
            </div>
            {errors.confirmPassword ? (
              <p className="text-xs text-red-500" role="alert">
                {tAuth(errors.confirmPassword.message as string)}
              </p>
            ) : null}
          </div>
        </div>

        <div className="space-y-4">
          <Button
            type="submit"
            loading={isSubmitting}
            disabled={!canSubmit || isSubmitting}
            variant="primary"
            backgroundColor={canSubmit ? "#ff765e" : "#d9d9d9"}
            style={{
              color: canSubmit ? "#ffffff" : "#a6a6a6",
            }}
            className={[
              "h-12 w-full rounded-lg border-0 text-base font-medium capitalize",
              canSubmit
                ? "hover:opacity-95 focus-visible:ring-primary-coral-400"
                : "cursor-not-allowed hover:opacity-100",
            ].join(" ")}
          >
            {t("submit")}
          </Button>

          <button
            type="button"
            onClick={backToLogin}
            className="flex h-12 w-full flex-row items-center justify-center gap-2.5 rounded-lg text-base font-medium text-grey-700 hover:bg-grey-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-grey-200 focus-visible:ring-offset-2 rtl:flex-row-reverse"
          >
            <ArrowLeftIcon size={24} className="shrink-0 text-grey-700" />
            <span className="capitalize">{t("backToLogin")}</span>
          </button>
        </div>
      </form>
    </section>
  );
}
