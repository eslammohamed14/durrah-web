import { ArrowNormalUp } from "@/assets/icons";

export default function FilterSection({
  title,
  children,
  defaultOpen,
  className = "",
  showChevron=true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
  showChevron?:boolean
}) {
  return (
    <details
      open={defaultOpen}
      className={`group border-b border-border-default py-4 first:pt-0 ${className}`}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-2 text-base font-semibold leading-6 text-text-dark [&::-webkit-details-marker]:hidden">
        {title}
        {/* <ChevronUpIcon className="size-[18px] shrink-0 text-grey-600 transition-transform group-open:rotate-180" /> */}
        { showChevron && <ArrowNormalUp className="size-[18px] shrink-0 text-grey-600 transition-transform group-open:rotate-180" />}
      </summary>
      <div className="mt-4 space-y-3">{children}</div>
    </details>
  );
}
