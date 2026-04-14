export interface MetricItemProps {
  value: string;
  label: string;
  Icon: React.ReactNode;
}

export function MetricItem({ value, label, Icon }: MetricItemProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      {Icon}
      <span className="text-[32px] font-semibold leading-[1.5] text-[#2A2F73]">
        {value}
      </span>
      <span className="text-sm font-normal text-[#2A2F73]">{label}</span>
    </div>
  );
}
