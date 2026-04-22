"use client";

import Image from "next/image";
import { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, useWatch } from "react-hook-form";
import { useLocale, useTranslations } from "next-intl";
import { EyeSlashIcon } from "@/assets/icons";
import images from "@/constant/images";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PhoneNumberInput } from "@/components/ui/PhoneNumberInput";
import { Link } from "@/navigation";
import AuthSocialButtons from "../authSocialButtons";
import {
  registerSchema,
  type RegisterFormValues,
} from "../../utils/validations";

/**
 * Sign up — Final UI Figma `1807:32058` (“Sign Up” on page “Final UI ✨”).
 * @see https://www.figma.com/design/XKx3FF4Xw6ZpvooyvB71Kn/Durrah-Property-%F0%9F%8F%96%EF%B8%8F?node-id=1807-32058
 */
export default function RegisterFormSection() {
  const t = useTranslations("auth.registerPage");
  const tAuth = useTranslations("auth");
  const locale = useLocale();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    setValue,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      nationalId: "",
      password: "",
      phoneCountry: "SA",
      phone: "",
      termsAccepted: false,
    },
  });

  const phoneCountry =
    useWatch({ control, name: "phoneCountry", defaultValue: "SA" }) ?? "SA";

  const onSubmit = async () => {
    await new Promise((r) => setTimeout(r, 500));
  };

  const fieldShell = "space-y-1";
  const labelClass =
    "flex min-h-[27px] items-center text-sm font-medium leading-normal text-grey-700";
  const inputShell =
    "h-12 rounded-lg border-grey-100 bg-white text-base text-[#101828] placeholder:text-grey-200 focus:border-grey-100 focus:ring-0 focus-visible:outline-none";

  return (
    <section className="flex w-full flex-col gap-8">
      <div className="flex flex-col gap-4">
        <Link
          href="/"
          replace
          aria-label={tAuth("layout.logoAlt")}
          className="w-fit focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-blue-400"
        >
          <Image
            src={images.durrahLogoBlue}
            alt={tAuth("layout.logoAlt")}
            width={177}
            height={57}
            priority
            className="h-auto w-[177px] max-w-full"
          />
        </Link>

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
        <div className="flex flex-col gap-4">
          <div className={fieldShell}>
            <label
              htmlFor="register-full-name"
              className={labelClass}
              id="register-full-name-label"
            >
              <span>{t("fullNameLabel")}</span>
              <span className="text-danger" aria-hidden>
                {" "}
                *
              </span>
            </label>
            <Input
              id="register-full-name"
              autoComplete="name"
              placeholder={t("fullNamePlaceholder")}
              errorText={
                errors.fullName
                  ? tAuth(errors.fullName.message as string)
                  : undefined
              }
              {...register("fullName")}
              className={inputShell}
              aria-labelledby="register-full-name-label"
            />
          </div>

          <div className={fieldShell}>
            <label
              htmlFor="register-email"
              className={labelClass}
              id="register-email-label"
            >
              <span>{t("emailLabel")}</span>
              <span className="text-danger" aria-hidden>
                {" "}
                *
              </span>
            </label>
            <Input
              id="register-email"
              type="email"
              autoComplete="email"
              placeholder={t("emailPlaceholder")}
              errorText={
                errors.email ? tAuth(errors.email.message as string) : undefined
              }
              {...register("email")}
              className={inputShell}
              aria-labelledby="register-email-label"
            />
          </div>

          <div className={fieldShell}>
            <label
              htmlFor="register-national-id"
              className={labelClass}
              id="register-national-id-label"
            >
              <span>{t("nationalIdLabel")}</span>
              <span className="text-danger" aria-hidden>
                {" "}
                *
              </span>
            </label>
            <Input
              id="register-national-id"
              inputMode="numeric"
              autoComplete="off"
              maxLength={10}
              placeholder={t("nationalIdPlaceholder")}
              errorText={
                errors.nationalId
                  ? tAuth(errors.nationalId.message as string)
                  : undefined
              }
              {...register("nationalId")}
              className={inputShell}
              aria-labelledby="register-national-id-label"
            />
          </div>

          <div className={fieldShell}>
            <label
              htmlFor="register-password"
              className={labelClass}
              id="register-password-label"
            >
              <span>{t("passwordLabel")}</span>
              <span className="text-danger" aria-hidden>
                {" "}
                *
              </span>
            </label>
            <div className="relative">
              <input
                id="register-password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder={t("passwordPlaceholder")}
                aria-invalid={errors.password ? "true" : undefined}
                aria-labelledby="register-password-label"
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

          <div className={fieldShell}>
            <label
              htmlFor="register-phone"
              className={labelClass}
              id="register-phone-label"
            >
              <span>{t("phoneLabel")}</span>
              <span className="text-danger" aria-hidden>
                {" "}
                *
              </span>
            </label>
            <input type="hidden" {...register("phoneCountry")} />
            <PhoneNumberInput
              id="register-phone"
              countryIso={phoneCountry}
              onCountryChange={(iso) =>
                setValue("phoneCountry", iso, {
                  shouldValidate: true,
                  shouldDirty: true,
                })
              }
              lang={locale}
              invalid={Boolean(errors.phone || errors.phoneCountry)}
              searchPlaceholder={t("phoneCountrySearch")}
              countryTriggerAriaLabel={t("phoneCountryOpen")}
              placeholder={t("phonePlaceholder")}
              aria-invalid={
                errors.phone || errors.phoneCountry ? "true" : undefined
              }
              aria-labelledby="register-phone-label"
              {...register("phone")}
            />
            <p className="text-xs leading-normal text-grey-300">
              {t("phoneSmsHelper")}
            </p>
            {errors.phoneCountry ? (
              <p className="text-xs text-red-500" role="alert">
                {tAuth(errors.phoneCountry.message as string)}
              </p>
            ) : null}
            {errors.phone ? (
              <p className="text-xs text-red-500" role="alert">
                {tAuth(errors.phone.message as string)}
              </p>
            ) : null}
          </div>

          <div className="flex h-[22px] items-center gap-2.5 pt-1">
            <input
              id="register-terms"
              type="checkbox"
              className="size-4 shrink-0 rounded border-grey-200 text-primary-coral-400 accent-[#ff765e] focus:ring-primary-coral-400"
              {...register("termsAccepted")}
            />
            <label
              htmlFor="register-terms"
              className="text-sm leading-relaxed text-[#718096]"
            >
              {t("termsLabel")}{" "}
              <Link
                href="/"
                className="font-medium text-primary-coral-400 underline decoration-solid hover:opacity-90"
              >
                {t("termsLink")}
              </Link>
            </label>
          </div>
          {errors.termsAccepted ? (
            <p className="-mt-2 text-xs text-red-500" role="alert">
              {tAuth(errors.termsAccepted.message as string)}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-6">
          <Button
            type="submit"
            loading={isSubmitting}
            variant="primary"
            backgroundColor="#ff765e"
            className="h-12 w-full rounded-lg border-0 text-base font-medium capitalize text-white hover:opacity-95 focus-visible:ring-primary-coral-400"
          >
            {t("submit")}
          </Button>

          <div className="flex h-[22px] w-full items-center gap-2">
            <div className="h-px flex-1 bg-grey-100" aria-hidden />
            <span className="shrink-0 text-sm text-grey-400">{t("or")}</span>
            <div className="h-px flex-1 bg-grey-100" aria-hidden />
          </div>

          <AuthSocialButtons
            appleLabel={t("apple")}
            googleLabel={t("google")}
            containerClassName="flex w-full gap-3"
            buttonClassName="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-white px-3 py-3 text-[14px] text-grey-500 shadow-[0px_1px_2px_0px_rgba(9,8,7,0.03),0px_1px_3px_0px_rgba(9,8,7,0.05)]"
            labelClassName="text-center"
          />
        </div>

        <p className="flex flex-wrap items-center justify-center gap-2 text-center text-sm">
          <span className="text-grey-500">{t("hasAccount")}</span>
          <Link
            href="/auth/login"
            className="font-medium text-primary-coral-400 underline decoration-solid hover:opacity-90"
          >
            {t("logIn")}
          </Link>
        </p>
      </form>
    </section>
  );
}
