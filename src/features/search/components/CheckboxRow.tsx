"use client";

import { memo, useId, type ChangeEvent } from "react";
import { TickIcon } from "@/assets/icons/TickIcon";

export type CheckboxRowChangeDetail = {
  value: string;
  checked: boolean;
};

export type CheckboxRowProps = {
  label: string;
  /** Identifier passed to `onCheckedChange`; defaults to `label`. */
  value?: string;
  checked: boolean;
  onCheckedChange?: (detail: CheckboxRowChangeDetail) => void;
  disabled?: boolean;
  className?: string;
};

function CheckboxRowComponent({
  label,
  value: valueProp,
  checked,
  onCheckedChange,
  disabled = false,
  className,
}: CheckboxRowProps) {
  const id = useId();
  const value = valueProp ?? label;

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    if (disabled) return;
    onCheckedChange?.({
      value,
      checked: event.target.checked,
    });
  }

  return (
    <label
      htmlFor={id}
      className={`flex items-center gap-2.5 text-sm font-normal leading-[21px] text-grey-800 ${
        disabled ? "cursor-not-allowed" : "cursor-pointer"
      } ${className ?? ""}`}
    >
      <input
        id={id}
        type="checkbox"
        className="peer sr-only"
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
      />
      <span
        aria-hidden
        className={`flex size-[18px] shrink-0 items-center justify-center rounded border outline-none transition-shadow peer-focus-visible:ring-2 peer-focus-visible:ring-primary-coral-400 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-white ${
          checked
            ? "border-primary-coral-400 bg-primary-coral-400"
            : "border-grey-200 bg-white"
        } ${disabled ? "opacity-60" : ""}`}
      >
        {checked ? <TickIcon className="size-3 text-white" /> : null}
      </span>
      {label}
    </label>
  );
}

const CheckboxRow = memo(CheckboxRowComponent);
CheckboxRow.displayName = "CheckboxRow";

export default CheckboxRow;
