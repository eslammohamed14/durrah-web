export default function ViewModeButton({
  children,
  active,
  onClick,
  "aria-label": ariaLabel,
}: {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  "aria-label"?: string;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      aria-pressed={active}
      onClick={onClick}
      className={`flex size-[38px] cursor-pointer items-center justify-center rounded-md transition-colors ${
        active
          ? "bg-white text-primary-coral-400 shadow-sm ring-1 ring-black/[0.06]"
          : "text-grey-500 hover:text-grey-800"
      }`}
    >
      {children}
    </button>
  );
}