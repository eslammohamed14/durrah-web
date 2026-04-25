import { getTranslations } from "next-intl/server";
import type { PropertyDetails } from "@/features/properties/type/propertyApiTypes";
import { HostTrustPill } from "./HostTrustPill";
import {
  HOST_CARD_SHELL_CLASS,
  HOST_SECTION_STACK_CLASS,
  initials,
  SECTION_TITLE_CLASS,
} from "@/features/properties/utils/hostSection";

export interface PropertyHostSectionProps {
  property: PropertyDetails;
  ownerName?: string;
}

export default async function PropertyHostSection({
  property,
  ownerName,
}: PropertyHostSectionProps) {
  const t = await getTranslations();
  const displayName = ownerName || property.investor_name;
  const messageEnabled = false;

  if (!displayName) return null;

  return (
    <section className={HOST_SECTION_STACK_CLASS}>
      <h2 className={SECTION_TITLE_CLASS}>{t("propertyDetails.aboutHost")}</h2>

      <div className={HOST_CARD_SHELL_CLASS}>
        <div className="flex flex-col gap-4">
          <div className="flex min-h-[44px] flex-wrap items-center justify-between gap-x-3 gap-y-3">
            <div className="flex min-w-0 items-center gap-2.5">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-primary-blue-50 text-lg font-semibold text-primary-blue-400 sm:h-[88px] sm:w-[88px] sm:text-xl">
                {initials(displayName)}
              </div>
              <h3 className="text-[18px] font-semibold leading-tight text-grey-800 sm:text-[20px]">
                {displayName}
              </h3>
            </div>
            {property.managed_by_durra ? (
              <HostTrustPill>
                {t("propertyDetails.hostManagedByDurrat")}
              </HostTrustPill>
            ) : null}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-stretch">
            <button
              type="button"
              className="inline-flex h-12 w-full shrink-0 items-center justify-center rounded-lg bg-primary-coral-400 px-6 text-[16px] font-medium leading-[1.6] text-white transition-colors hover:bg-primary-coral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-coral-400 focus-visible:ring-offset-2 sm:w-auto sm:min-w-[168px]"
            >
              {t("propertyDetails.hostViewProfile")}
            </button>
            <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
              <button
                type="button"
                disabled={!messageEnabled}
                title={
                  !messageEnabled
                    ? t("propertyDetails.hostMessageAfterBookingHint")
                    : undefined
                }
                className={`inline-flex h-12 w-full items-center justify-center rounded-lg px-6 text-[16px] font-medium leading-[1.6] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 sm:w-auto sm:min-w-[168px] ${
                  messageEnabled
                    ? "border border-primary-blue-400 text-primary-blue-400 hover:bg-primary-blue-50 focus-visible:ring-primary-blue-400"
                    : "cursor-not-allowed rounded-lg bg-grey-100 text-grey-500 focus-visible:ring-grey-200"
                }`}
              >
                {t("propertyDetails.hostMessageHost")}
              </button>
              {!messageEnabled ? (
                <span className="text-center text-[12px] leading-[1.45] text-grey-500 sm:max-w-[220px] sm:text-left">
                  {t("propertyDetails.hostMessageAfterBookingHint")}
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
