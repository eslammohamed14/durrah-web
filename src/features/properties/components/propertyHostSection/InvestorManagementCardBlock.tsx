"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import images from "@/constant/images";
import type { Property, PropertyHostInvestorManagementCard } from "@/lib/types";
import { HostTrustPill } from "./HostTrustPill";
import { ManagementChipRow } from "./ManagementChipRow";
import {
  HOST_CARD_SHELL_CLASS,
  pick,
} from "@/features/properties/utils/hostSection";

export interface InvestorManagementCardBlockProps {
  card: PropertyHostInvestorManagementCard;
  host: NonNullable<Property["host"]>;
}

export function InvestorManagementCardBlock({
  card,
  host,
}: InvestorManagementCardBlockProps) {
  const t = useTranslations();
  const locale = useLocale();
  const brand = pick(card.brandName, locale) || pick(host.name, locale);
  const badge = pick(card.badgeLabel, locale);
  const description = pick(card.description, locale);
  const operated = pick(host.operatedByLabel, locale);

  const logoSrc = host.durratLogoUrl || images.durrahLogoBlue;

  return (
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
              {brand}
            </h3>
          </div>
          <HostTrustPill>{badge}</HostTrustPill>
        </div>
        <p className="max-w-prose text-[14px] leading-[1.6] text-grey-600">
          {description}
        </p>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-4">
          {card.chips.map((chip) => (
            <ManagementChipRow
              key={chip.id}
              chip={chip}
              label={t(`propertyDetails.${chip.labelKey}`)}
            />
          ))}
        </div>
        {operated ? (
          <p className="text-center text-[12px] italic leading-[1.5] text-grey-500 sm:text-left">
            {operated}
          </p>
        ) : null}
      </div>
    </div>
  );
}
