"use client";

import React from "react";

export type PhoneNumberInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "size"
> & {
  countryIso?: string;
  onCountryChange?: (iso: string) => void;
  lang?: string;
  /** Visually highlight the composite field as invalid. */
  invalid?: boolean;
  searchPlaceholder?: string;
  countryTriggerAriaLabel?: string;
};

/**
 * Phone field with a static Saudi prefix (+966).
 * Pairs with `react-hook-form` by spreading `register("phoneNumber")` on this component.
 */
export const PhoneNumberInput = React.forwardRef<
  HTMLInputElement,
  PhoneNumberInputProps
>(
  (
    {
      invalid,
      className = "",
      disabled,
      id,
      ...inputProps
    },
    ref,
  ) => {
    return (
      <div
        className={["relative w-full", className].filter(Boolean).join(" ")}
      >
        <div
          dir="ltr"
          className={[
            "flex h-12 w-full min-w-0 overflow-hidden rounded-lg border bg-white",
            invalid ? "border-red-500" : "border-grey-100",
          ].join(" ")}
        >
          <div
            className={[
              "flex shrink-0 items-center gap-2 bg-white px-3 text-left",
              disabled ? "cursor-not-allowed opacity-60" : "",
            ].join(" ")}
            aria-hidden
          >
            <span className="text-lg leading-none" aria-hidden>
              🇸🇦
            </span>
            <span className="shrink-0 text-xs tabular-nums text-grey-500 sm:text-sm">
              +966
            </span>
          </div>
          <span
            className="my-auto h-6 w-px shrink-0 bg-grey-200"
            aria-hidden
          />

          <input
            ref={ref}
            id={id}
            type="tel"
            inputMode="tel"
            disabled={disabled}
            autoComplete="tel-national"
            className={[
              "min-w-0 flex-1 border-0 bg-transparent px-3 text-base text-[#101828]",
              "placeholder:text-grey-200 outline-none focus:ring-0",
              invalid ? "text-[#101828]" : "",
            ].join(" ")}
            {...inputProps}
          />
        </div>
      </div>
    );
  },
);

PhoneNumberInput.displayName = "PhoneNumberInput";
