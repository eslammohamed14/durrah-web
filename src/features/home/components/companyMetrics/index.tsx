"use client";

import type { ComponentType, SVGProps } from "react";
import { useLocale } from "@/lib/contexts/LocaleContext";
import { MetricItem } from "./MetricItem";
import {
  AverageRatingMetricIcon,
  CustomersMetricIcon,
  PropertiesSoldMetricIcon,
  YearsExperienceMetricIcon,
} from "./metricIcons";
import {
  BuildingColoredIcon,
  PeopleIcon,
  StarColoredIcon,
  WorkBagIcon,
} from "@/assets/icons";

export interface CompanyMetricDefinition {
  id: string;
  value: string;
  labelKey: string;
  Icon: React.ReactNode;
}

export const COMPANY_METRICS: CompanyMetricDefinition[] = [
  {
    id: "customers",
    value: "+10M",
    labelKey: "home.customers",
    Icon: <PeopleIcon />,
  },
  {
    id: "yearsExperience",
    value: "+90",
    labelKey: "home.yearsExperience",
    Icon: <WorkBagIcon />,
  },
  {
    id: "propertiesSold",
    value: "1,200",
    labelKey: "home.propertiesSold",
    Icon: <BuildingColoredIcon />,
  },
  {
    id: "averageRating",
    value: "5.0",
    labelKey: "home.averageRating",
    Icon: <StarColoredIcon />,
  },
];

export function CompanyMetricsSection() {
  const { t } = useLocale();

  return (
    <section
      aria-label="Company metrics"
      className="bg-[#FAFAFA] px-4 py-10 sm:px-6 md:py-16 lg:px-16 xl:px-[100px] xl:py-20"
    >
      <div className="mx-auto grid max-w-screen-2xl grid-cols-2 gap-8 sm:gap-10 md:grid-cols-4 md:items-center xl:max-w-[1200px]">
        {COMPANY_METRICS.map(({ id, value, labelKey, Icon }) => (
          <MetricItem key={id} value={value} label={t(labelKey)} Icon={Icon} />
        ))}
      </div>
    </section>
  );
}
