"use client";

import Image from "next/image";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Link } from "@/navigation";
import images from "@/constant/images";
import { Button } from "@/components/ui/Button";
import { PhoneNumberInput } from "@/components/ui/PhoneNumberInput";
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
      phoneNumber: "",
    },
  });

  const onSubmit = async () => {
    // Mock submit only for UI state validation.
    await new Promise((resolve) => setTimeout(resolve, 500));
  };

  return (
    <section className="w-full">
      <Link
        href="/"
        replace
        aria-label={t("layout.logoAlt")}
        className="w-fit focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-blue-400"
      >
        <Image
          src={images.durrahLogoBlue}
          alt={t("layout.logoAlt")}
          width={145}
          height={42}
          priority
          className="h-auto w-[145px]"
        />
      </Link>

      <h1 className="mt-6 text-[44px] font-semibold leading-[1.05] tracking-[-0.02em] text-durrah-blue">
        {t("loginPage.title")}
      </h1>
      <p className="mt-2 text-sm text-[#667085]">{t("loginPage.subtitle")}</p>

      <form
        className="mt-7 space-y-4"
        noValidate
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="space-y-1">
          <label htmlFor="login-phone" className="text-sm font-medium text-[#344054]">
            {t("loginPage.phoneLabel")}
          </label>
          <PhoneNumberInput
            id="login-phone"
            autoComplete="tel-national"
            placeholder={t("loginPage.phonePlaceholder")}
            invalid={Boolean(errors.phoneNumber)}
            aria-invalid={errors.phoneNumber ? "true" : undefined}
            {...register("phoneNumber")}
          />
          {errors.phoneNumber ? (
            <p className="text-xs text-red-500" role="alert">
              {t(errors.phoneNumber.message as string)}
            </p>
          ) : null}
        </div>

        <Button
          type="submit"
          loading={isSubmitting}
          backgroundColor="#FF765E"
          className="mt-2 h-11 w-full rounded-lg text-sm font-semibold text-white hover:opacity-95 focus-visible:ring-primary-coral-400"
        >
          {t("signIn")}
        </Button>

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
