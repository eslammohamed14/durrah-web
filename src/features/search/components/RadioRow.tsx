export default function RadioRow({
  label,
  checked,
  readOnly,
}: {
  label: string;
  checked?: boolean;
  readOnly?: boolean;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm font-normal leading-[21px] text-grey-800">
      <span className="flex size-6 shrink-0 items-center justify-center">
        <span
          className={`flex size-5 items-center justify-center rounded-full border-2 ${
            checked ? "border-primary-coral-400" : "border-grey-200 bg-white"
          }`}
        >
          {checked ? (
            <span className="size-2.5 rounded-full bg-primary-coral-400" />
          ) : null}
        </span>
      </span>
      <input
        type="radio"
        className="sr-only"
        defaultChecked={checked}
        readOnly={readOnly}
      />
      {label}
    </label>
  );
}
