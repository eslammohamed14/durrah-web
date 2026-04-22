import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import images from "@/constant/images";
import type { Property } from "@/lib/types";
import { HostTrustPill } from "./HostTrustPill";
import { InvestorManagementCardBlock } from "./InvestorManagementCardBlock";
import { LegacyHostStatsPanel } from "./LegacyHostStatsPanel";
import {
  HOST_CARD_SHELL_CLASS,
  HOST_SECTION_STACK_CLASS,
  initials,
  pick,
  resolveHostType,
  SECTION_TITLE_CLASS,
} from "@/features/properties/utils/hostSection";

export interface PropertyHostSectionProps {
  property: Property;
  ownerName?: string;
}

export default async function PropertyHostSection({
  property,
  ownerName,
}: PropertyHostSectionProps) {
  const t = await getTranslations();
  const locale = await getLocale();
  const host = property.host;
  const hostType = resolveHostType(host);

  if (!host) return null;

  if (hostType === "durrat") {
    const label =
      ownerName ||
      pick(host.name, locale) ||
      t("propertyDetails.hostDurratFallbackName");
    const hostTitle =
      pick(host.title, locale) || t("propertyDetails.officialUnit");
    const hostDescription =
      pick(host.description, locale) ||
      (property.category === "rent"
        ? t("propertyDetails.hostDescription")
        : t("propertyDetails.hostDescriptionAlt"));
    const managedBy =
      pick(host.managedByLabel, locale) ||
      t("propertyDetails.hostManagedByDurrat");
    const operated = pick(host.operatedByLabel, locale);
    const logoSrc = host.durratLogoUrl || images.durrahLogoBlue;

    return (
      <section className={HOST_SECTION_STACK_CLASS}>
        <h2 className={SECTION_TITLE_CLASS}>
          {t("propertyDetails.aboutHost")}
        </h2>
        <div className={HOST_CARD_SHELL_CLASS}>
          <div className="flex flex-col gap-4">
            <div className="flex min-h-[44px] flex-wrap items-center justify-between gap-x-3 gap-y-3">
              <div className="flex min-w-0 items-center gap-2.5">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border border-grey-100 bg-white sm:h-[88px] sm:w-[88px]">
                  <Image
                    src={logoSrc}
                    alt=""
                    fill
                    className="object-contain p-2.5"
                    sizes="88px"
                  />
                </div>
                <h3 className="text-[18px] font-semibold uppercase leading-tight tracking-wide text-grey-800 sm:text-[20px]">
                  {label}
                </h3>
              </div>
              <HostTrustPill>{hostTitle}</HostTrustPill>
            </div>
            <p className="text-[16px] font-semibold leading-[1.5] text-grey-800">
              {managedBy}
            </p>
            <p className="max-w-prose text-[14px] leading-[1.6] text-grey-600">
              {hostDescription}
            </p>
            {operated ? (
              <p className="text-center text-[12px] italic leading-[1.5] text-grey-500 sm:text-left">
                {operated}
              </p>
            ) : null}
          </div>
        </div>
      </section>
    );
  }

  const details = host.ownerDetails;
  const displayName =
    pick(details?.displayName, locale) ||
    ownerName ||
    pick(host.name, locale) ||
    t("propertyDetails.hostDurratFallbackName");
  const bio =
    pick(details?.bio, locale) ||
    pick(host.description, locale) ||
    (property.category === "rent"
      ? t("propertyDetails.hostDescription")
      : t("propertyDetails.hostDescriptionAlt"));

  const messageEnabled = details?.contactHostEnabled === true;
  const showLicensed = details?.showLicensedBadge === true;
  const lineJoined =
    details?.memberSinceYear &&
    t("propertyDetails.hostJoinedYear", { year: details.memberSinceYear });
  const lineSuper =
    details?.isSuperhost === true ? t("propertyDetails.hostSuperhost") : "";
  const metaLine1 = [lineSuper, lineJoined].filter(Boolean).join(" • ");
  const showRatingRow =
    details?.reviewRating != null &&
    details?.reviewCount != null &&
    details?.propertyCount != null;

  const legacyStats =
    Boolean(details?.memberSinceYear) ||
    details?.responseRatePercent != null ||
    Boolean(pick(details?.responseTimeLabel, locale));
  const showNewHostMeta = Boolean(metaLine1) || showRatingRow;
  const showLegacyPanel = legacyStats && !showNewHostMeta;

  return (
    <section className={HOST_SECTION_STACK_CLASS}>
      <h2 className={SECTION_TITLE_CLASS}>{t("propertyDetails.aboutHost")}</h2>

      <div className={HOST_CARD_SHELL_CLASS}>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-0">
            <div className="flex flex-row flex-wrap items-center justify-between gap-0 sm:gap-4">
              <div className="flex min-w-0 flex-1 items-start gap-2.5">
                {details?.avatarUrl ? (
                  <Image
                    src={details.avatarUrl}
                    alt=""
                    width={88}
                    height={88}
                    unoptimized
                    className="h-20 w-20 shrink-0 rounded-full object-cover sm:h-[88px] sm:w-[88px]"
                  />
                ) : (
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-primary-blue-50 text-lg font-semibold text-primary-blue-400 sm:h-[88px] sm:w-[88px] sm:text-xl">
                    {initials(displayName)}
                  </div>
                )}
                <div className="min-w-0 flex-1 space-y-1">
                  <h3 className="text-[22px] font-semibold leading-[1.4] text-grey-800">
                    {displayName}
                  </h3>
                  {metaLine1 ? (
                    <p className="text-[14px] leading-[1.5] text-grey-600">
                      {metaLine1}
                    </p>
                  ) : null}
                  {showRatingRow &&
                  details?.reviewRating != null &&
                  details.reviewCount != null &&
                  details.propertyCount != null ? (
                    <p className="flex flex-wrap items-center gap-1 text-[14px] leading-[1.5] text-grey-600">
                      <svg
                        className="h-4 w-4 shrink-0 text-amber-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden
                      >
                        <path d="M10 1.5l2.6 5.27 5.82.85-4.21 4.1.99 5.8L10 15.9l-5.2 2.73.99-5.8-4.21-4.1 5.82-.85L10 1.5z" />
                      </svg>
                      <span>
                        {t("propertyDetails.hostRatingStats", {
                          rating: details.reviewRating,
                          reviews: details.reviewCount,
                          properties: details.propertyCount,
                        })}
                      </span>
                    </p>
                  ) : null}
                </div>
              </div>
              {showLicensed ? (
                <HostTrustPill>
                  {t("propertyDetails.hostLicensedBadge")}
                </HostTrustPill>
              ) : null}
            </div>
            <div className="flex min-w-0 flex-col gap-2 pl-[calc(5rem+0.625rem)] sm:pl-[calc(88px+0.625rem)]">
              <p className="max-w-prose text-[14px] leading-[1.6] text-grey-600">
                {bio}
              </p>
            </div>
          </div>

          {showLegacyPanel && details ? (
            <LegacyHostStatsPanel details={details} locale={locale} />
          ) : null}

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

      {hostType === "investor" && host.investorManagementCard?.chips?.length ? (
        <InvestorManagementCardBlock
          card={host.investorManagementCard}
          host={host}
        />
      ) : null}
    </section>
  );
}
