export interface MetricItemProps {
  value: string;
  label: string;
  Icon: React.ReactNode;
}

export function MetricItem({ value, label, Icon }: MetricItemProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      {Icon}
      <span className="text-[32px] font-semibold leading-[1.5] text-text-dark">
        {value}
      </span>
      <span className="text-sm font-normal text-text-dark">{label}</span>
    </div>
  );
}
