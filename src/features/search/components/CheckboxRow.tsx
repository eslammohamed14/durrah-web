import { TickIcon } from "@/assets/icons/TickIcon";

export default function CheckboxRow({
  label,
  checked,
  readOnly,
}: {
  label: string;
  checked?: boolean;
  readOnly?: boolean;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-sm font-normal leading-[21px] text-grey-800">
      <span
        className={`flex size-[18px] shrink-0 items-center justify-center rounded border ${
          checked
            ? "border-primary-coral-400 bg-primary-coral-400"
            : "border-grey-200 bg-white"
        }`}
      >
        {checked ? <TickIcon className="size-3 text-white" /> : null}
      </span>
      <input
        type="checkbox"
        className="sr-only"
        defaultChecked={checked}
        readOnly={readOnly}
      />
      {label}
    </label>
  );
}
