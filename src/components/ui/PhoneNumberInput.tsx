"use client";

import React, {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import countries, { type LocaleData } from "i18n-iso-countries";
import arLocale from "i18n-iso-countries/langs/ar.json";
import enLocale from "i18n-iso-countries/langs/en.json";
import {
  getCountries,
  getCountryCallingCode,
  type CountryCode,
} from "libphonenumber-js";
import { PhoneNumberCountryDropdown } from "./PhoneNumberCountryDropdown";

let localesRegistered = false;

function ensureLocalesRegistered() {
  if (localesRegistered) return;
  countries.registerLocale(enLocale as LocaleData);
  countries.registerLocale(arLocale as LocaleData);
  localesRegistered = true;
}

function isoToFlagEmoji(iso: string): string {
  const upper = iso.toUpperCase();
  if (upper.length !== 2) return "🏳️";
  return [...upper].map((c) => String.fromCodePoint(127397 + c.charCodeAt(0)))
    .join("");
}

function dialFor(iso: string): string {
  try {
    return getCountryCallingCode(iso.toUpperCase() as CountryCode);
  } catch {
    return "";
  }
}

export type PhoneNumberInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "size"
> & {
  countryIso: string;
  onCountryChange: (iso: string) => void;
  /** `en` or `ar` — drives country name labels in the list. */
  lang?: string;
  /** Visually highlight the composite field as invalid. */
  invalid?: boolean;
  searchPlaceholder?: string;
  countryTriggerAriaLabel?: string;
};

/**
 * Phone field with country calling-code dropdown (anchored under the field) + search + national number input.
 * Pairs with `react-hook-form` by spreading `register("phone")` on this component.
 */
export const PhoneNumberInput = React.forwardRef<
  HTMLInputElement,
  PhoneNumberInputProps
>(
  (
    {
      countryIso,
      onCountryChange,
      lang = "en",
      invalid,
      searchPlaceholder = "Search country…",
      countryTriggerAriaLabel = "Select country code",
      className = "",
      disabled,
      id,
      ...inputProps
    },
    ref,
  ) => {
    ensureLocalesRegistered();
    const listId = useId();
    const searchId = useId();
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const rootRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLInputElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);

    const locale = lang === "ar" ? "ar" : "en";

    const countryRows = useMemo(() => {
      const names = countries.getNames(locale, { select: "official" });
      const rows = getCountries()
        .map((code) => {
          const dial = dialFor(code);
          if (!dial) return null;
          const name = names[code] ?? code;
          return { code, name, dial };
        })
        .filter(Boolean) as { code: string; name: string; dial: string }[];

      rows.sort((a, b) => a.name.localeCompare(b.name, locale));
      const sa = rows.findIndex((r) => r.code === "SA");
      if (sa > 0) {
        const [row] = rows.splice(sa, 1);
        rows.unshift(row);
      }
      return rows;
    }, [locale]);

    const filtered = useMemo(() => {
      const q = query.trim().toLowerCase();
      if (!q) return countryRows;
      return countryRows.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.code.toLowerCase().includes(q) ||
          r.dial.includes(q) ||
          `+${r.dial}`.includes(q),
      );
    }, [countryRows, query]);

    const activeIso = (countryIso || "SA").toUpperCase();
    const dial = dialFor(activeIso) || "966";

    const close = useCallback(() => {
      setOpen(false);
      setQuery("");
    }, []);

    useEffect(() => {
      if (!open) return;
      const t = window.setTimeout(() => searchRef.current?.focus(), 0);
      return () => window.clearTimeout(t);
    }, [open]);

    /** Scroll page / container so the full dropdown is visible below the input. */
    useEffect(() => {
      if (!open) return;
      const id = window.requestAnimationFrame(() => {
        const el = dropdownRef.current;
        if (!el) return;
        el.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "nearest",
        });
      });
      return () => window.cancelAnimationFrame(id);
    }, [open]);

    useEffect(() => {
      if (!open) return;
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          e.preventDefault();
          close();
          triggerRef.current?.focus();
        }
      };
      document.addEventListener("keydown", onKey);
      return () => document.removeEventListener("keydown", onKey);
    }, [open, close]);

    useEffect(() => {
      if (!open) return;
      const onDoc = (e: MouseEvent) => {
        const root = rootRef.current;
        if (root && !root.contains(e.target as Node)) close();
      };
      document.addEventListener("mousedown", onDoc);
      return () => document.removeEventListener("mousedown", onDoc);
    }, [open, close]);

    return (
      <div
        ref={rootRef}
        className={["relative w-full", className].filter(Boolean).join(" ")}
      >
        <div
          dir="ltr"
          className={[
            "flex h-12 w-full min-w-0 overflow-hidden rounded-lg border bg-white",
            invalid ? "border-red-500" : "border-grey-100",
          ].join(" ")}
        >
          <button
            ref={triggerRef}
            type="button"
            disabled={disabled}
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-controls={open ? listId : undefined}
            aria-label={countryTriggerAriaLabel}
            onClick={() => setOpen((v) => !v)}
            className={[
              "flex shrink-0 items-center gap-2 bg-white px-3 text-left",
              "outline-none focus-visible:ring-2 focus-visible:ring-primary-coral-400 focus-visible:ring-offset-0",
              disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
            ].join(" ")}
          >
            <span className="text-lg leading-none" aria-hidden>
              {isoToFlagEmoji(activeIso)}
            </span>
            <span className="shrink-0 text-xs tabular-nums text-grey-500 sm:text-sm">
              +{dial}
            </span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              className={[
                "shrink-0 text-grey-500 transition-transform",
                open ? "rotate-180" : "",
              ].join(" ")}
              aria-hidden
            >
              <path
                d="M6 9l6 6 6-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

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

        {open ? (
          <PhoneNumberCountryDropdown
            ref={dropdownRef}
            listId={listId}
            searchId={searchId}
            searchPlaceholder={searchPlaceholder}
            listAriaLabel={countryTriggerAriaLabel}
            query={query}
            onQueryChange={setQuery}
            searchRef={searchRef}
            filtered={filtered}
            activeIso={activeIso}
            onSelectRow={(code) => {
              onCountryChange(code);
              close();
              triggerRef.current?.focus();
            }}
          />
        ) : null}
      </div>
    );
  },
);

PhoneNumberInput.displayName = "PhoneNumberInput";
