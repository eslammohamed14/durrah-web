"use client";

import { AppleIcon, GoogleIcon } from "@/assets/icons";

interface AuthSocialButtonsProps {
  appleLabel: string;
  googleLabel: string;
  containerClassName?: string;
  buttonClassName?: string;
  labelClassName?: string;
}

export default function AuthSocialButtons({
  appleLabel,
  googleLabel,
  containerClassName,
  buttonClassName,
  labelClassName,
}: AuthSocialButtonsProps) {
  return (
    <div className={containerClassName ?? "flex w-full gap-3"}>
      <button type="button" className={buttonClassName}>
        <span className={labelClassName}>{appleLabel}</span>
        <AppleIcon size={24} />
      </button>
      <button type="button" className={buttonClassName}>
        <span className={labelClassName}>{googleLabel}</span>
        <GoogleIcon size={24} />
      </button>
    </div>
  );
}
