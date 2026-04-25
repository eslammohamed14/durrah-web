import { ArrowNormalDown, ArrowNormalUp } from "@/assets/icons";

export default function FilterSection({
  title,
  children,
  defaultOpen,
  className = "",
  showChevron = true,
  collapsible = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
  showChevron?: boolean;
  /** When false, the section is always expanded and the header does not toggle. */
  collapsible?: boolean;
}) {
  const shellClass = `border-b border-border-default py-4 first:pt-0 ${className}`;

  if (!collapsible) {
    return (
      <section className={shellClass}>
        <div className="flex items-center justify-between gap-2 text-base font-semibold leading-6 text-text-dark">
          {title}
        </div>
        <div className="mt-4 space-y-3">{children}</div>
      </section>
    );
  }

  return (
    <details
      open={defaultOpen}
      className={`group ${shellClass}`}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-2 text-base font-semibold leading-6 text-text-dark [&::-webkit-details-marker]:hidden">
        {title}
        {showChevron && (
          // <ArrowNormalUp className="size-[18px] shrink-0 text-grey-600 transition-transform group-open:rotate-180" />
          <ArrowNormalDown
            className="size-[18px] shrink-0 text-grey-600 transition-transform group-open:rotate-180"
          />
        )}
      </summary>
      <div className="mt-4 space-y-3">{children}</div>
    </details>
  );
}
