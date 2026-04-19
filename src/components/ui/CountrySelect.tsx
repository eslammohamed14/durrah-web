"use client";

import React, { useMemo } from "react";
import countries, { type LocaleData } from "i18n-iso-countries";
import arLocale from "i18n-iso-countries/langs/ar.json";
import enLocale from "i18n-iso-countries/langs/en.json";

let localesRegistered = false;

function ensureLocalesRegistered() {
  if (localesRegistered) return;
  countries.registerLocale(enLocale as LocaleData);
  countries.registerLocale(arLocale as LocaleData);
  localesRegistered = true;
}

export type CountrySelectProps = Omit<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  "children"
> & {
  label?: React.ReactNode;
  errorText?: string;
  /** ISO 639-1 language for country names (e.g. `en`, `ar`). */
  lang?: string;
  placeholder?: string;
};

/**
 * ISO 3166-1 alpha-2 country picker with localized labels (`i18n-iso-countries`).
 * Pairs with `react-hook-form` via `ref` + spread props.
 */
export const CountrySelect = React.forwardRef<
  HTMLSelectElement,
  CountrySelectProps
>(
  (
    {
      label,
      errorText,
      lang = "en",
      placeholder,
      id,
      className = "",
      disabled,
      ...props
    },
    ref,
  ) => {
    ensureLocalesRegistered();

    const selectId =
      id ??
      (typeof label === "string"
        ? label.toLowerCase().replace(/\s+/g, "-")
        : "country-select");

    const errorId = errorText ? `${selectId}-error` : undefined;

    const options = useMemo(() => {
      const locale = lang === "ar" ? "ar" : "en";
      const names = countries.getNames(locale, { select: "official" });
      const entries = Object.entries(names).sort((a, b) =>
        a[1].localeCompare(b[1], locale),
      );
      const saIndex = entries.findIndex(([code]) => code === "SA");
      if (saIndex > 0) {
        const [sa] = entries.splice(saIndex, 1);
        entries.unshift(sa);
      }
      return entries;
    }, [lang]);

    const activeError = Boolean(errorText);

    return (
      <div className="flex flex-col gap-1">
        {label ? (
          <label
            htmlFor={selectId}
            className={[
              "text-sm font-medium",
              disabled ? "text-gray-400" : "text-gray-700",
            ].join(" ")}
          >
            {label}
          </label>
        ) : null}

        <select
          ref={ref}
          id={selectId}
          disabled={disabled}
          aria-invalid={activeError ? "true" : undefined}
          aria-describedby={errorId}
          className={[
            "block h-12 w-full appearance-none rounded-lg border bg-white px-3 py-2 pe-10 text-base text-[#101828]",
            "bg-[length:1rem_1rem] bg-[right_0.75rem_center] bg-no-repeat",
            "focus:outline-none focus:ring-0 focus-visible:outline-none",
            "disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400",
            activeError
              ? "border-red-500 focus:border-red-500"
              : "border-grey-100 focus:border-grey-100",
            className,
          ].join(" ")}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23667085'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
          }}
          {...props}
        >
          {placeholder ? (
            <option value="" disabled>
              {placeholder}
            </option>
          ) : null}
          {options.map(([code, name]) => (
            <option key={code} value={code}>
              {name}
            </option>
          ))}
        </select>

        {errorText ? (
          <p id={errorId} role="alert" className="text-xs text-red-500">
            {errorText}
          </p>
        ) : null}
      </div>
    );
  },
);

CountrySelect.displayName = "CountrySelect";
