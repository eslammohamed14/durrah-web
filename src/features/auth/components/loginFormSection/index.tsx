"use client";

import Image from "next/image";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/navigation";
import { markPasswordResetFlowStartedFromLogin } from "../../hooks/useBackToLoginFromPasswordResetFlow";
import images from "@/constant/images";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { AppleIcon, EyeSlashIcon, GoogleIcon } from "@/assets/icons";
import { loginSchema, type LoginFormValues } from "../../utils/validations";

/** Login form section matching the Figma screenshot structure. */
export default function LoginFormSection() {
  const t = useTranslations("auth");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async () => {
    // Mock submit only for UI state validation.
    await new Promise((resolve) => setTimeout(resolve, 500));
  };

  return (
    <section className="w-full">
      <Image
        src={images.durrahLogoBlue}
        alt={t("layout.logoAlt")}
        width={145}
        height={42}
        priority
        className="h-auto w-[145px]"
      />

      <h1 className="mt-6 text-[44px] font-semibold leading-[1.05] tracking-[-0.02em] text-durrah-blue">
        {t("loginPage.title")}
      </h1>
      <p className="mt-2 text-sm text-[#667085]">{t("loginPage.subtitle")}</p>

      <form
        className="mt-7 space-y-4"
        noValidate
        onSubmit={handleSubmit(onSubmit)}
      >
        <Input
          type="email"
          autoComplete="email"
          placeholder={t("loginPage.emailPlaceholder")}
          label={t("loginPage.emailLabel")}
          errorText={
            errors.email ? t(errors.email.message as string) : undefined
          }
          {...register("email")}
          className="h-11 rounded-lg border-[#D0D5DD] bg-white text-sm"
        />

        <div className="space-y-1">
          <label
            htmlFor="password"
            className="text-sm font-medium text-[#344054]"
          >
            {t("loginPage.passwordLabel")}
          </label>
          <div className="relative">
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder={t("loginPage.passwordPlaceholder")}
              aria-invalid={errors.password ? "true" : undefined}
              className={[
                "block h-11 w-full rounded-lg border bg-white px-3 pe-10 text-sm text-[#101828]",
                "placeholder:text-[#98A2B3] focus:outline-none focus:ring-0 focus-visible:outline-none",
                errors.password
                  ? "border-red-500 focus:border-red-500 focus:ring-0"
                  : "border-[#D0D5DD] focus:border-[#D0D5DD] focus:ring-0",
              ].join(" ")}
              {...register("password")}
            />
            <EyeSlashIcon className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2" />
          </div>
          {errors.password ? (
            <p className="text-xs text-red-500" role="alert">
              {t(errors.password.message as string)}
            </p>
          ) : null}
        </div>

        <div className="flex items-center justify-between gap-4 pt-1">
          <label className="inline-flex items-center gap-2 text-xs text-[#667085]">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-[#D0D5DD] text-durrah-coral focus:ring-durrah-coral"
              {...register("rememberMe")}
            />
            {t("loginPage.rememberMe")}
          </label>
          <Link
            href="/auth/reset-password"
            className="text-xs text-durrah-coral hover:underline"
            onClick={() => markPasswordResetFlowStartedFromLogin()}
          >
            {t("forgotPassword")}
          </Link>
        </div>

        <Button
          type="submit"
          loading={isSubmitting}
          backgroundColor="#FF765E"
          className="mt-2 h-11 w-full rounded-lg text-sm font-semibold text-white hover:opacity-95 focus-visible:ring-primary-coral-400"
        >
          {t("signIn")}
        </Button>

        <div className="grid grid-cols-2 gap-2 pt-3">
          <button
            type="button"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-[#EAECF0] bg-white px-3 text-xs text-[#344054]"
          >
            <AppleIcon size={24} />
            <span>{t("loginPage.apple")}</span>
          </button>
          <button
            type="button"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-[#EAECF0] bg-white px-3 text-xs text-[#344054]"
          >
            <GoogleIcon size={24} />
            <span>{t("loginPage.google")}</span>
          </button>
        </div>

        <p className="pt-1 text-center text-xs text-[#667085]">
          {t("noAccount")}{" "}
          <Link
            href="/auth/register"
            className="font-semibold text-durrah-coral hover:underline"
          >
            {t("register")}
          </Link>
        </p>
      </form>
    </section>
  );
}
