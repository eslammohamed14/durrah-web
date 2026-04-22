import {
  HostCheckInIcon,
  HostHeadphoneSupportIcon,
  HostPropertyKeyIcon,
} from "@/assets/icons";
import type {
  PropertyHostInvestorServiceIcon,
  PropertyHostManagementChip,
} from "@/lib/types";

function ChipIcon({ kind }: { kind: PropertyHostInvestorServiceIcon }) {
  const stroke = "#FF765E";
  switch (kind) {
    case "propertyKey":
      return (
        <HostPropertyKeyIcon
          size={20}
          strokeColor={stroke}
          className="shrink-0"
        />
      );
    case "headphoneSupport":
      return (
        <HostHeadphoneSupportIcon
          size={20}
          strokeColor={stroke}
          className="shrink-0"
        />
      );
    case "checkIn":
      return (
        <HostCheckInIcon size={20} strokeColor={stroke} className="shrink-0" />
      );
    default: {
      const _e: never = kind;
      return _e;
    }
  }
}

export interface ManagementChipRowProps {
  chip: PropertyHostManagementChip;
  label: string;
}

export function ManagementChipRow({ chip, label }: ManagementChipRowProps) {
  return (
    <div className="flex h-[42px] min-w-0 w-full items-center gap-2.5 rounded-xl border border-grey-50 bg-primary-coral-50/10 px-3">
      <ChipIcon kind={chip.icon} />
      <span className="min-w-0 flex-1 truncate text-left text-[12px] font-medium leading-[1.4] text-grey-700">
        {label}
      </span>
    </div>
  );
}
