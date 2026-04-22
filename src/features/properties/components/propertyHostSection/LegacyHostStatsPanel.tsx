import { getTranslations } from "next-intl/server";
import type { PropertyHostOwnerDetails } from "@/lib/types";
import { pick } from "@/features/properties/utils/hostSection";

export interface LegacyHostStatsPanelProps {
  details: PropertyHostOwnerDetails;
  locale: string;
}

export async function LegacyHostStatsPanel({
  details,
  locale,
}: LegacyHostStatsPanelProps) {
  const t = await getTranslations();

  return (
    <dl className="grid gap-4 rounded-xl bg-surface-primary p-5 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-grey-50 sm:p-6">
      {details?.memberSinceYear ? (
        <div className="sm:px-2">
          <dt className="text-[12px] font-medium leading-[1.5] text-grey-500">
            {t("propertyDetails.hostStatHostingSince")}
          </dt>
          <dd className="mt-1 text-[16px] font-semibold leading-[1.5] text-grey-800">
            {details.memberSinceYear}
          </dd>
        </div>
      ) : null}
      {details?.responseRatePercent != null ? (
        <div className="sm:px-2">
          <dt className="text-[12px] font-medium leading-[1.5] text-grey-500">
            {t("propertyDetails.hostStatResponseRate")}
          </dt>
          <dd className="mt-1 text-[16px] font-semibold leading-[1.5] text-grey-800">
            {details.responseRatePercent}%
          </dd>
        </div>
      ) : null}
      {pick(details?.responseTimeLabel, locale) ? (
        <div className="sm:px-2">
          <dt className="text-[12px] font-medium leading-[1.5] text-grey-500">
            {t("propertyDetails.hostStatResponseTime")}
          </dt>
          <dd className="mt-1 text-[16px] font-semibold leading-[1.5] text-grey-800">
            {pick(details?.responseTimeLabel, locale)}
          </dd>
        </div>
      ) : null}
    </dl>
  );
}
