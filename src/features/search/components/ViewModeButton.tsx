export default function ViewModeButton({
  children,
  active,
  "aria-label": ariaLabel,
}: {
  children: React.ReactNode;
  active?: boolean;
  "aria-label"?: string;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className={`flex size-[38px] items-center justify-center rounded-md transition-colors ${
        active
          ? "bg-white text-primary-coral-400 shadow-sm ring-1 ring-black/[0.06]"
          : "text-grey-500 hover:text-grey-800"
      }`}
    >
      {children}
    </button>
  );
}