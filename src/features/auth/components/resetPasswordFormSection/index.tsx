"use client";

import Image from "next/image";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { ArrowLeftIcon } from "@/assets/icons";
import images from "@/constant/images";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Link, useRouter } from "@/navigation";
import { useBackToLoginFromPasswordResetFlow } from "../../hooks/useBackToLoginFromPasswordResetFlow";
import {
  forgotPasswordEmailSchema,
  type ForgotPasswordEmailValues,
} from "../../utils/validations";

/** Forgot password / request code — Figma `807:5244` “Forgot Your Password?”. */
export default function ResetPasswordFormSection() {
  const t = useTranslations("auth.forgotPasswordPage");
  const tAuth = useTranslations("auth");
  const router = useRouter();
  const backToLogin = useBackToLoginFromPasswordResetFlow();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordEmailValues>({
    resolver: yupResolver(forgotPasswordEmailSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: ForgotPasswordEmailValues) => {
    await new Promise((r) => setTimeout(r, 400));
    const q = new URLSearchParams({ email: data.email.trim() });
    router.replace(`/auth/verify-email?${q.toString()}`);
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
        <div className="space-y-1">
          <label
            htmlFor="reset-password-email"
            className="block text-sm font-medium leading-normal text-grey-700"
          >
            {t("emailLabel")}
            <span className="text-danger" aria-hidden>
              {" "}
              *
            </span>
          </label>
          <Input
            id="reset-password-email"
            type="email"
            autoComplete="email"
            placeholder={t("emailPlaceholder")}
            errorText={
              errors.email
                ? tAuth(errors.email.message as string)
                : undefined
            }
            {...register("email")}
            className="h-12 rounded-lg border-grey-100 bg-white text-base text-[#101828] placeholder:text-grey-200 focus:border-grey-100 focus:ring-0 focus-visible:outline-none"
          />
        </div>

        <Button
          type="submit"
          loading={isSubmitting}
          variant="primary"
          backgroundColor="#ff765e"
          className="h-12 w-full rounded-lg border-0 text-base font-medium text-white hover:opacity-95 focus-visible:ring-primary-coral-400"
        >
          {t("sendCode")}
        </Button>

        <button
          type="button"
          onClick={backToLogin}
          className="flex h-12 w-full flex-row items-center justify-center gap-2.5 rounded-lg text-base font-medium text-grey-700 hover:bg-grey-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-grey-200 focus-visible:ring-offset-2 rtl:flex-row-reverse"
        >
          <ArrowLeftIcon size={24} className="shrink-0 text-grey-700" />
          <span className="capitalize">{t("backToLogin")}</span>
        </button>
      </form>

      <p className="text-center text-sm leading-relaxed text-grey-500">
        {t("noAccount")}{" "}
        <Link
          href="/auth/register"
          className="font-medium text-durrah-coral underline decoration-solid hover:opacity-90"
        >
          {t("signUp")}
        </Link>
      </p>
    </section>
  );
}
